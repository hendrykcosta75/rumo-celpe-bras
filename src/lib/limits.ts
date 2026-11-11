import "server-only";
import { and, eq, gte, inArray, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { rateEvents } from "@/db/schema";
import { startOfLocalDay } from "./dates";

export type Rule = { key: string; max: number; since: Date };

/**
 * Reserva atômica: trava cada chave (advisory lock da transação), confere todas e só então grava
 * um evento por chave. Pedidos simultâneos esperam a trava, então nenhum limite fura.
 * Devolve os ids das reservas (para `release` se a IA falhar) ou null se algum limite estourou.
 */
export async function reserve(rules: Rule[]): Promise<string[] | null> {
  const ordered = [...rules].sort((a, b) => a.key.localeCompare(b.key));
  return db.transaction(async tx => {
    for (const r of ordered) await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${r.key}))`);
    for (const r of ordered) {
      const [c] = await tx.select({ n: sql<number>`count(*)::int` }).from(rateEvents).where(and(eq(rateEvents.key, r.key), gte(rateEvents.createdAt, r.since)));
      if ((c?.n ?? 0) >= r.max) return null;
    }
    const rows = await tx.insert(rateEvents).values(ordered.map(r => ({ key: r.key }))).returning({ id: rateEvents.id });
    return rows.map(r => r.id);
  });
}

/** Devolve reservas (correção que falhou não gasta o limite). */
export async function release(ids: string[] | null | undefined) {
  if (ids?.length) await db.delete(rateEvents).where(inArray(rateEvents.id, ids));
}

export async function countSince(key: string, since: Date): Promise<number> {
  const [r] = await db.select({ n: sql<number>`count(*)::int` }).from(rateEvents).where(and(eq(rateEvents.key, key), gte(rateEvents.createdAt, since)));
  return r?.n ?? 0;
}

export const quotaKey = (userId: string, kind: "exam" | "speaking") => `use:${kind}:${userId}`;

/** Correções do aluno hoje (fuso de Brasília), por tipo: conta as reservas, que nascem antes da IA. */
export function usedToday(userId: string, kind: "exam" | "speaking"): Promise<number> {
  return countSince(quotaKey(userId, kind), startOfLocalDay());
}

/** Conta um evento e diz se ainda está no limite (janela em horas). Atômico. */
export async function hit(key: string, max: number, windowHours: number): Promise<boolean> {
  return (await reserve([{ key, max, since: new Date(Date.now() - windowHours * 3_600_000) }])) !== null;
}
