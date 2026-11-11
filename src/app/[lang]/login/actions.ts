"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { clientIpKey } from "@/lib/client-ip";
import { hit } from "@/lib/limits";
import { sendMail } from "@/lib/mail";
import { createMagicLink } from "@/lib/session";
import { emailSchema } from "@/lib/validation";

/** Sempre a mesma resposta (não revela se o e-mail tem acesso). */
export async function requestLink(_: unknown, form: FormData): Promise<{ sent: true }> {
  const email = emailSchema.safeParse(form.get("email"));
  if (!email.success) return { sent: true };
  if (!(await hit(`login:ip:${await clientIpKey()}`, 10, 1)) || !(await hit(`login:email:${email.data}`, 5, 1))) return { sent: true };
  const [user] = await db.select().from(users).where(eq(users.email, email.data)).limit(1);
  if (user) {
    const link = await createMagicLink(email.data);
    await sendMail(email.data, user.lang === "es" ? "Tu enlace de acceso a Rumo" : "Your Rumo sign-in link", `${user.lang === "es" ? "Entra con este enlace (vence en 30 minutos):" : "Sign in with this link (expires in 30 minutes):"}\n\n${link}`);
  }
  return { sent: true };
}
