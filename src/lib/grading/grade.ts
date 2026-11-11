import "server-only";
import { costUsd, type Usage } from "./cost";
import { AiError, MODEL, chatJson } from "./deepseek";
import { buildSystemPrompt, buildUserPrompt, parseGrade, type FeedbackLang, type Grade, type TaskContext } from "./grader";

export interface GradeResult { readonly grade: Grade; readonly usage: Usage; readonly costUsd: number; readonly latencyMs: number; readonly model: string }

/** Corrige uma redação. Até 2 novas tentativas se o JSON vier inválido; custo soma as duas chamadas. */
export async function gradeEssay(task: TaskContext, text: string, lang: FeedbackLang): Promise<GradeResult> {
  const started = Date.now();
  const system = buildSystemPrompt(lang);
  const user = buildUserPrompt(task, text);
  const total: Usage = { promptTokens: 0, cachedTokens: 0, completionTokens: 0 };
  let cost = 0;
  for (let attempt = 0; attempt < 3; attempt++) {
    const r = await chatJson(system, user);
    const acc = { promptTokens: total.promptTokens + r.usage.promptTokens, cachedTokens: total.cachedTokens + r.usage.cachedTokens, completionTokens: total.completionTokens + r.usage.completionTokens };
    Object.assign(total, acc);
    cost += costUsd(r.usage);
    const grade = parseGrade(r.content);
    if (grade) return { grade, usage: total, costUsd: cost, latencyMs: Date.now() - started, model: MODEL };
  }
  throw new AiError("A IA não devolveu uma correção válida.");
}
