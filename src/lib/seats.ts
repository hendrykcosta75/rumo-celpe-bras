import "server-only";
import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { purchases, rateEvents } from "@/db/schema";
import { FOUNDER_SEATS } from "@/i18n/dict";

export const SEAT_HOLD_KEY = "seat:hold";
/** A sessão do Stripe expira em 30 min; a reserva dura um pouco mais para cobrir o webhook. */
export const HOLD_MINUTES = 35;
const holdSince = () => new Date(Date.now() - HOLD_MINUTES * 60_000);

/** Vagas restantes = 200 − compras pagas − checkouts abertos (reservas dos últimos 35 min). */
export async function seatsLeft(): Promise<number> {
  const [[p], [h]] = await Promise.all([
    db.select({ n: sql<number>`count(*)::int` }).from(purchases).where(eq(purchases.status, "paid")),
    db.select({ n: sql<number>`count(*)::int` }).from(rateEvents).where(and(eq(rateEvents.key, SEAT_HOLD_KEY), gte(rateEvents.createdAt, holdSince()))),
  ]);
  return Math.max(0, FOUNDER_SEATS - (p?.n ?? 0) - (h?.n ?? 0));
}

/** Reserva uma vaga de forma atômica (trava global). Devolve o id da reserva ou null se esgotou. */
export async function holdSeat(): Promise<string | null> {
  return db.transaction(async tx => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${SEAT_HOLD_KEY}))`);
    const [[p], [h]] = await Promise.all([
      tx.select({ n: sql<number>`count(*)::int` }).from(purchases).where(eq(purchases.status, "paid")),
      tx.select({ n: sql<number>`count(*)::int` }).from(rateEvents).where(and(eq(rateEvents.key, SEAT_HOLD_KEY), gte(rateEvents.createdAt, holdSince()))),
    ]);
    if ((p?.n ?? 0) + (h?.n ?? 0) >= FOUNDER_SEATS) return null;
    const [row] = await tx.insert(rateEvents).values({ key: SEAT_HOLD_KEY }).returning({ id: rateEvents.id });
    return row!.id;
  });
}

export async function releaseSeat(holdId: string | undefined | null) {
  if (holdId && /^[0-9a-f-]{36}$/.test(holdId)) await db.delete(rateEvents).where(and(eq(rateEvents.id, holdId), eq(rateEvents.key, SEAT_HOLD_KEY)));
}
