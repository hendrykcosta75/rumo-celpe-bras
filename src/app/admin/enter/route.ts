import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminCookieValue, tokenMatches } from "@/lib/admin";
import { clientIpKey } from "@/lib/client-ip";
import { hit } from "@/lib/limits";

/** POST com o token do dono → cookie httpOnly. Token no corpo, não na URL (não vai para logs). */
export async function POST(request: Request) {
  const base = process.env.APP_URL!;
  if (!(await hit(`admin:ip:${await clientIpKey()}`, 10, 1))) return NextResponse.redirect(`${base}/admin?e=1`, 303);
  const form = await request.formData().catch(() => null);
  if (!tokenMatches(String(form?.get("token") ?? ""))) return NextResponse.redirect(`${base}/admin?e=1`, 303);
  const res = NextResponse.redirect(`${base}/admin`, 303);
  res.cookies.set(ADMIN_COOKIE, adminCookieValue()!, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/admin", maxAge: 60 * 60 * 24 * 7 });
  return res;
}
