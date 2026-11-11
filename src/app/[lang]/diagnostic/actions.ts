"use server";

import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { leads, submissions } from "@/db/schema";
import { DIAGNOSTIC_TASK } from "@/content/exams";
import { isLang } from "@/i18n/dict";
import { parseNative } from "@/lib/native-language";
import { clientIpKey } from "@/lib/client-ip";
import { startOfLocalDay } from "@/lib/dates";
import { gradeAndSave } from "@/lib/corrections";
import type { Grade } from "@/lib/grading/grader";
import { DIAG_DAILY_CAP, DIAG_GLOBAL_KEY } from "@/lib/caps";
import { release, reserve } from "@/lib/limits";
import { checkEssay, emailSchema } from "@/lib/validation";

export type DiagState =
  | { status: "idle" }
  | { status: "error"; error: "email" | "empty" | "tooShort" | "tooLong" | "consent" | "used" | "limit" | "ai"; text?: string; email?: string; consent?: boolean; native?: string; nativeOther?: string }
  | { status: "done"; grade: Grade };

export async function submitDiagnostic(_: DiagState, form: FormData): Promise<DiagState> {
  const langRaw = String(form.get("lang") ?? "en");
  const lang = isLang(langRaw) ? langRaw : "en";
  const text = String(form.get("text") ?? "").slice(0, 6000);
  const emailRaw = String(form.get("email") ?? "");
  const keep = { text, email: emailRaw, consent: form.get("consent") === "on", native: String(form.get("native") ?? ""), nativeOther: String(form.get("nativeOther") ?? "") };
  const essayError = checkEssay(text);
  if (essayError) return { status: "error", error: essayError, ...keep };
  const email = emailSchema.safeParse(emailRaw);
  if (!email.success) return { status: "error", error: "email", ...keep };
  if (form.get("consent") !== "on") return { status: "error", error: "consent", ...keep };

  // Reserva ANTES de gravar e da IA (atômica): 3 por IP (/64 no IPv6) em 24 h e teto global do dia, depois 1 por e-mail.
  // Reservar o IP primeiro limita quantos leads um anônimo consegue criar; em "used" a reserva volta.
  const { nativeLanguage, nativeLanguageOther } = parseNative(form.get("native"), form.get("nativeOther"));
  const byIp = await reserve([
    { key: `diag:ip:${await clientIpKey()}`, max: 3, since: new Date(Date.now() - 24 * 3_600_000) },
    { key: DIAG_GLOBAL_KEY, max: DIAG_DAILY_CAP, since: startOfLocalDay() },
  ]);
  if (!byIp) return { status: "error", error: "limit", ...keep };
  let held: string[] | null = byIp;
  try {
    // Lead já existente não é alterado por outra pessoa: a língua materna só é preenchida se ainda estiver vazia.
    const [lead] = await db.insert(leads).values({ email: email.data, lang, nativeLanguage, nativeLanguageOther, consentAt: new Date() })
      .onConflictDoUpdate({
        target: leads.email,
        set: {
          nativeLanguage: sql`coalesce(${leads.nativeLanguage}, excluded.native_language)`,
          nativeLanguageOther: sql`case when ${leads.nativeLanguage} is null then excluded.native_language_other else ${leads.nativeLanguageOther} end`,
        },
      }).returning();
    const [used] = await db.select({ n: sql<number>`count(*)::int` }).from(submissions).where(and(eq(submissions.leadId, lead!.id), eq(submissions.kind, "diagnostic")));
    if ((used?.n ?? 0) > 0) { await release(byIp); return { status: "error", error: "used", ...keep }; }
    const byEmail = await reserve([{ key: `diag:email:${email.data}`, max: 1, since: new Date(0) }]);
    if (!byEmail) { await release(byIp); return { status: "error", error: "used", ...keep }; }
    // Se a IA falhar, só a reserva do e-mail volta (a pessoa pode tentar de novo); a do IP e a do teto
    // global ficam, porque a chamada à IA já foi paga. Assim uma redação que faz a IA falhar não vira gasto sem teto.
    held = byEmail;
    const r = await gradeAndSave({ kind: "diagnostic", task: DIAGNOSTIC_TASK, text, lang, leadId: lead!.id, taskId: DIAGNOSTIC_TASK.id });
    return { status: "done", grade: r.grade };
  } catch {
    await release(held).catch(() => {});
    return { status: "error", error: "ai", ...keep };
  }
}
