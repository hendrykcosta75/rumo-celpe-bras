import type Stripe from "stripe";
import { fulfilCheckout, markRefunded } from "@/lib/fulfil";
import { releaseSeat } from "@/lib/seats";
import { stripe } from "@/lib/stripe";

/** Webhook do Stripe com assinatura verificada. Libera acesso só com pagamento confirmado. */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = request.headers.get("stripe-signature");
  if (!secret || !sig) return new Response("missing signature", { status: 400 });
  const body = await request.text();
  if (body.length > 1_000_000) return new Response("too large", { status: 413 });
  let event: Stripe.Event;
  try { event = stripe().webhooks.constructEvent(body, sig, secret); } catch { return new Response("bad signature", { status: 400 }); }
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
      await fulfilCheckout(event.data.object as Stripe.Checkout.Session);
      break;
    case "checkout.session.expired":
      await releaseSeat((event.data.object as Stripe.Checkout.Session).metadata?.hold);
      break;
    case "charge.refunded": {
      const pi = (event.data.object as Stripe.Charge).payment_intent;
      if (typeof pi === "string") await markRefunded(pi);
      break;
    }
  }
  return Response.json({ received: true });
}
