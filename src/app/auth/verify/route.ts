import { NextResponse } from "next/server";
import { consumeMagicLink, startSession } from "@/lib/session";

const TOKEN = /^[A-Za-z0-9_-]{30,60}$/;

/**
 * GET só mostra o botão: filtros de e-mail que abrem links (Safe Links etc.) não gastam o token.
 * O token é consumido no POST, que só a pessoa faz ao clicar.
 */
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  if (!TOKEN.test(token)) return NextResponse.redirect(`${process.env.APP_URL}/en/login?invalid=1`, 303);
  const es = (request.headers.get("accept-language") ?? "").toLowerCase().startsWith("es");
  const label = es ? "Entrar en Rumo" : "Sign in to Rumo";
  const html = `<!doctype html><html lang="${es ? "es" : "en"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><meta name="referrer" content="same-origin"><title>${label}</title></head>
<body style="margin:0;font-family:system-ui,sans-serif;background:#f7f4ee;color:#1f1b16;display:grid;place-items:center;min-height:100vh">
<form method="post" action="/auth/verify" style="text-align:center;padding:24px">
<p style="font-size:18px;margin:0 0 16px">${es ? "Toca el botón para entrar." : "Tap the button to sign in."}</p>
<input type="hidden" name="token" value="${token}">
<button style="font-size:16px;padding:12px 24px;border:0;border-radius:10px;background:#1f6f50;color:#fff;cursor:pointer">${label}</button>
</form></body></html>`;
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "referrer-policy": "same-origin" } });
}

/** Só aceita o POST vindo do próprio site (sem isso, outro site poderia logar a vítima na conta de outra pessoa). */
function sameOrigin(request: Request, base: string): boolean {
  const site = request.headers.get("sec-fetch-site");
  if (site) return site === "same-origin";
  const origin = request.headers.get("origin");
  return !!origin && origin === new URL(base).origin;
}

export async function POST(request: Request) {
  const base = process.env.APP_URL!;
  if (!sameOrigin(request, base)) return new Response("forbidden", { status: 403 });
  const form = await request.formData().catch(() => null);
  const user = await consumeMagicLink(String(form?.get("token") ?? ""));
  if (!user) return NextResponse.redirect(`${base}/en/login?invalid=1`, 303);
  await startSession(user.id, user.sessionVersion);
  return NextResponse.redirect(`${base}/${user.lang}/app`, 303);
}
