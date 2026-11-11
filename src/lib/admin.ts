import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "celpe_admin";
const digest = (v: string) => createHash("sha256").update(`celpe-admin:${v}`).digest("hex");

export function adminCookieValue(): string | null {
  const t = process.env.ADMIN_TOKEN;
  return t && t.length >= 32 ? digest(t) : null;
}
export function tokenMatches(candidate: string): boolean {
  const expected = adminCookieValue();
  if (!expected) return false;
  const a = Buffer.from(digest(candidate)); const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
export async function isAdmin(): Promise<boolean> {
  const expected = adminCookieValue();
  const got = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!expected || !got || got.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(got), Buffer.from(expected));
}
