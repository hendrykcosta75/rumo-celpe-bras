"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { findTask } from "@/content/exams";
import { DAILY_WRITING_LIMIT, isLang } from "@/i18n/dict";
import { gradeAndSave } from "@/lib/corrections";
import type { Grade } from "@/lib/grading/grader";
import { startOfLocalDay } from "@/lib/dates";
import { release, reserve, quotaKey } from "@/lib/limits";
import { currentStudent, currentUser, endSession } from "@/lib/session";
import { checkEssay } from "@/lib/validation";

export type TaskState = { status: "idle" } | { status: "error"; error: "empty" | "tooShort" | "tooLong" | "limit" | "ai"; text?: string } | { status: "done"; grade: Grade; seconds: number };

export async function submitTask(_: TaskState, form: FormData): Promise<TaskState> {
  const user = await currentStudent();
  if (!user) redirect("/en/login");
  const lang = isLang(String(form.get("lang"))) ? (form.get("lang") as "en" | "es") : user.lang;
  const examId = String(form.get("exam")); const taskId = String(form.get("task"));
  const task = findTask(examId, taskId);
  if (!task) return { status: "error", error: "ai" };
  const text = String(form.get("text") ?? "").slice(0, 8000);
  const err = checkEssay(text, 80, 600);
  if (err) return { status: "error", error: err, text };
  // AC-006: o limite é conferido ANTES de qualquer chamada à IA.
  // Reserva atômica: envios simultâneos não furam o limite. Se a IA falhar, a reserva volta.
  const held = await reserve([{ key: quotaKey(user.id, "exam"), max: DAILY_WRITING_LIMIT, since: startOfLocalDay() }]);
  if (!held) return { status: "error", error: "limit", text };
  try {
    const r = await gradeAndSave({ kind: "exam", task, text, lang, userId: user.id, examId, taskId });
    revalidatePath(`/${lang}/app`);
    return { status: "done", grade: r.grade, seconds: Math.round(r.latencyMs / 100) / 10 };
  } catch {
    await release(held).catch(() => {});
    return { status: "error", error: "ai", text };
  }
}

export async function saveExamDate(form: FormData) {
  const user = await currentStudent();
  if (!user) redirect("/en/login");
  const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).safeParse(form.get("examDate"));
  if (date.success) await db.update(users).set({ examDate: date.data }).where(eq(users.id, user.id));
  revalidatePath(`/${user.lang}/app`);
}

export async function logout() {
  const user = await currentUser();
  await endSession();
  redirect(`/${user?.lang ?? "en"}`);
}
