import "server-only";
import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { db } from "@/db/client";
import { submissions } from "@/db/schema";
import { costUsd } from "./grading/cost";
import { AiError, MODEL, chatJson } from "./grading/deepseek";
import { gradeEssay } from "./grading/grade";
import type { FeedbackLang, Grade, TaskContext } from "./grading/grader";
import { buildSpeakingSystem, parseSpeak, type SpeakFeedback } from "./grading/speaking";

const run = promisify(execFile);

export async function gradeAndSave(input: { kind: "diagnostic" | "exam"; task: TaskContext; text: string; lang: FeedbackLang; userId?: string; leadId?: string; examId?: string; taskId?: string }): Promise<{ id: string; grade: Grade; latencyMs: number }> {
  const r = await gradeEssay(input.task, input.text, input.lang);
  const [row] = await db.insert(submissions).values({
    kind: input.kind, userId: input.userId ?? null, leadId: input.leadId ?? null, examId: input.examId ?? null, taskId: input.taskId ?? null,
    text: input.text, score: r.grade.score, feedback: r.grade, model: r.model,
    inputTokens: r.usage.promptTokens, cachedTokens: r.usage.cachedTokens, outputTokens: r.usage.completionTokens, costUsd: r.costUsd, latencyMs: r.latencyMs,
  }).returning({ id: submissions.id });
  return { id: row!.id, grade: r.grade, latencyMs: r.latencyMs };
}

/** Transcreve com faster-whisper local (áudio apagado logo depois) e comenta a fala com a IA. */
export async function speakAndSave(input: { audio: Buffer; format: string; topic: string; lang: FeedbackLang; userId: string; topicId: string }): Promise<{ transcript: string; feedback: SpeakFeedback }> {
  const started = Date.now();
  const dir = await mkdtemp(join(tmpdir(), "celpe-speak-"));
  let transcript = "";
  try {
    const file = join(dir, "audio.bin");
    await writeFile(file, input.audio, { mode: 0o600 });
    const { stdout } = await run(process.env.STT_PYTHON ?? "python3", [process.env.STT_SCRIPT ?? "stt/transcribe.py", file, input.format], { timeout: 150_000, maxBuffer: 1_000_000 });
    transcript = (JSON.parse(stdout.trim().split("\n").pop() ?? "{}") as { text?: string }).text?.trim() ?? "";
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
  if (transcript.split(/\s+/).filter(Boolean).length < 5) throw new AiError("too-short");
  let cost = 0; const usage = { promptTokens: 0, cachedTokens: 0, completionTokens: 0 };
  for (let i = 0; i < 3; i++) {
    const r = await chatJson(buildSpeakingSystem(input.lang), `TEMA: ${input.topic}\n\n<<<FALA>>>\n${transcript.replaceAll("<<<", "‹‹‹")}\n<<<FIM>>>`, { maxTokens: 3000 });
    cost += costUsd(r.usage); usage.promptTokens += r.usage.promptTokens; usage.cachedTokens += r.usage.cachedTokens; usage.completionTokens += r.usage.completionTokens;
    const fb = parseSpeak(r.content);
    if (fb) {
      await db.insert(submissions).values({ kind: "speaking", userId: input.userId, taskId: input.topicId, text: transcript, feedback: fb, model: MODEL, inputTokens: usage.promptTokens, cachedTokens: usage.cachedTokens, outputTokens: usage.completionTokens, costUsd: cost, latencyMs: Date.now() - started });
      return { transcript, feedback: fb };
    }
  }
  throw new AiError("invalid");
}
