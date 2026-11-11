import "server-only";
import nodemailer from "nodemailer";
import { db } from "@/db/client";
import { outbox } from "@/db/schema";

/**
 * Envia e-mail pelo SMTP de SMTP_URL; sem SMTP configurado (preview), a mensagem fica só na caixa de
 * saída do painel do dono. Em ambos os casos ela é registrada em `outbox`.
 */
export async function sendMail(to: string, subject: string, body: string): Promise<void> {
  const url = process.env.SMTP_URL;
  let sent = false; let error: string | null = null;
  if (url) {
    try {
      await nodemailer.createTransport(url).sendMail({ from: process.env.MAIL_FROM ?? "no-reply@entelechy.com.br", to, subject, text: body });
      sent = true;
    } catch (e) { error = e instanceof Error ? e.name : "erro"; }
  }
  // Enviado por SMTP: o registro guarda o corpo sem o token do link mágico (só o hash fica no banco).
  const stored = sent ? body.replace(/token=[A-Za-z0-9_-]+/g, "token=[removido]") : body;
  await db.insert(outbox).values({ to, subject, body: stored, sentViaSmtp: sent, error });
}
