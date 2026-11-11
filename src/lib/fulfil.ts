import "server-only";
import { and, eq } from "drizzle-orm";
import type Stripe from "stripe";
import { db } from "@/db/client";
import { outbox, purchases, users } from "@/db/schema";
import { isLang } from "@/i18n/dict";
import { sendMail } from "./mail";
import { releaseSeat } from "./seats";
import { createMagicLink } from "./session";

/** Libera o acesso de uma sessão paga (idempotente por session_id) e envia o link de acesso. */
export async function fulfilCheckout(s: Stripe.Checkout.Session): Promise<"granted" | "duplicate" | "unpaid"> {
  if (s.payment_status !== "paid") return "unpaid";
  const email = (s.customer_details?.email ?? s.customer_email ?? "").trim().toLowerCase();
  if (!email) return "unpaid";
  const lang = isLang(String(s.metadata?.lang)) ? (s.metadata!.lang as "en" | "es") : "en";
  const granted = await db.transaction(async tx => {
    const [user] = await tx.insert(users).values({ email, lang }).onConflictDoUpdate({ target: users.email, set: { lang } }).returning();
    const [p] = await tx.insert(purchases).values({
      stripeSessionId: s.id, paymentIntent: typeof s.payment_intent === "string" ? s.payment_intent : s.payment_intent?.id ?? null,
      email, amountCents: s.amount_total ?? 0, currency: s.currency ?? "usd", livemode: s.livemode, userId: user!.id,
    }).onConflictDoNothing({ target: purchases.stripeSessionId }).returning({ id: purchases.id });
    return !!p;
  });
  // A compra paga já conta a vaga; a reserva do checkout sai.
  await releaseSeat(s.metadata?.hold);
  const subject = lang === "es" ? "Tu acceso a Rumo" : "Your Rumo access";
  if (!granted) {
    // Reenvio do Stripe depois de falha no e-mail: manda o link se ainda não saiu.
    const [sent] = await db.select({ id: outbox.id }).from(outbox).where(and(eq(outbox.to, email), eq(outbox.subject, subject))).limit(1);
    if (sent) return "duplicate";
  }
  const link = await createMagicLink(email);
  const body = lang === "es"
    ? `¡Bienvenido a Rumo!\n\nTu acceso de fundador está activo. Entra con este enlace (vence en 30 minutos; después puedes pedir otro en la página de acceso):\n\n${link}\n\nRecuerda: las notas son estimaciones y Rumo no tiene vínculo con el Inep.`
    : `Welcome to Rumo!\n\nYour founder access is active. Sign in with this link (it expires in 30 minutes; you can ask for a new one on the login page):\n\n${link}\n\nRemember: scores are estimates and Rumo is not affiliated with Inep.`;
  await sendMail(email, subject, body);
  return granted ? "granted" : "duplicate";
}

export async function markRefunded(paymentIntent: string) {
  await db.update(purchases).set({ status: "refunded" }).where(eq(purchases.paymentIntent, paymentIntent));
}
