import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, isNull, sql } from "drizzle-orm";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { cache } from "react";
import { db } from "@/db/client";
import { magicLinks, purchases, users } from "@/db/schema";

export const SESSION_COOKIE = "celpe_session";
const TTL = 60 * 60 * 24 * 30;
const LINK_MINUTES = 30;
const hashToken = (t: string) => createHash("sha256").update(t).digest("hex");
const key = () => {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET ausente ou curto.");
  return new TextEncoder().encode(s);
};

/** Cria um link mágico (só o hash fica no banco). */
export async function createMagicLink(email: string): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  await db.insert(magicLinks).values({ tokenHash: hashToken(token), email: email.toLowerCase(), expiresAt: new Date(Date.now() + LINK_MINUTES * 60_000) });
  return `${process.env.APP_URL}/auth/verify?token=${token}`;
}

/** Consome o link (uso único) e devolve o usuário, se existir. */
export async function consumeMagicLink(token: string) {
  if (!/^[A-Za-z0-9_-]{30,60}$/.test(token)) return null;
  const [link] = await db.update(magicLinks).set({ usedAt: new Date() })
    .where(and(eq(magicLinks.tokenHash, hashToken(token)), isNull(magicLinks.usedAt), gt(magicLinks.expiresAt, new Date()))).returning();
  if (!link) return null;
  const [user] = await db.select().from(users).where(eq(users.email, link.email)).limit(1);
  return user ?? null;
}

export async function startSession(userId: string, version: number) {
  const jwt = await new SignJWT({ ver: version }).setProtectedHeader({ alg: "HS256" }).setSubject(userId).setIssuedAt().setExpirationTime(`${TTL}s`).sign(key());
  (await cookies()).set(SESSION_COOKIE, jwt, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: TTL });
}

export const currentUser = cache(async () => {
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const { payload } = await jwtVerify(raw, key(), { algorithms: ["HS256"] });
    if (typeof payload.sub !== "string") return null;
    const [u] = await db.select().from(users).where(eq(users.id, payload.sub)).limit(1);
    return u && u.sessionVersion === (payload.ver ?? 0) ? u : null;
  } catch { return null; }
});

/** Aluno com compra paga (reembolso tira o acesso, como dizem os termos). */
export const currentStudent = cache(async () => {
  const u = await currentUser();
  if (!u) return null;
  const [p] = await db.select({ id: purchases.id }).from(purchases).where(and(eq(purchases.userId, u.id), eq(purchases.status, "paid"))).limit(1);
  return p ? u : null;
});

export async function endSession() {
  const u = await currentUser();
  if (u) await db.update(users).set({ sessionVersion: sql`${users.sessionVersion} + 1` }).where(and(eq(users.id, u.id), eq(users.sessionVersion, u.sessionVersion)));
  (await cookies()).delete(SESSION_COOKIE);
}
