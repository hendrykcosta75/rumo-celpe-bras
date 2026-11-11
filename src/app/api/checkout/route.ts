import { NextResponse } from "next/server";
import { FOUNDER_PRICE_USD, isLang } from "@/i18n/dict";
import { clientIpKey } from "@/lib/client-ip";
import { hit } from "@/lib/limits";
import { HOLD_MINUTES, holdSeat, releaseSeat } from "@/lib/seats";
import { stripe } from "@/lib/stripe";

/** Cria a Checkout Session da oferta de fundador (pagamento único, cartão) se houver vaga. */
export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const raw = String(form?.get("lang") ?? "en");
  const lang = isLang(raw) ? raw : "en";
  const base = process.env.APP_URL!;
  // No máximo 3 checkouts abertos por conexão no tempo de uma reserva (35 min): ninguém segura as vagas sozinho.
  if (!(await hit(`checkout:ip:${await clientIpKey()}`, 3, HOLD_MINUTES / 60))) return NextResponse.redirect(`${base}/${lang}?checkout=busy#pricing`, 303);
  // Vaga reservada antes do checkout: com 1 vaga, só 1 pessoa consegue abrir o pagamento.
  const hold = await holdSeat();
  if (!hold) return NextResponse.redirect(`${base}/${lang}?checkout=soldout#pricing`, 303);
  const session = await stripe().checkout.sessions.create({
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    mode: "payment",
    line_items: [{ quantity: 1, price_data: { currency: "usd", unit_amount: FOUNDER_PRICE_USD * 100, product_data: { name: lang === "es" ? "Rumo · acceso de fundador (de por vida)" : "Rumo · founder access (lifetime)" } } }],
    customer_creation: "always",
    locale: lang,
    metadata: { lang, offer: "founder", hold },
    success_url: `${base}/${lang}?checkout=success`,
    cancel_url: `${base}/${lang}?checkout=cancel#pricing`,
  }).catch(async e => { await releaseSeat(hold); throw e; });
  return NextResponse.redirect(session.url!, 303);
}
