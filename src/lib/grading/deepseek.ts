import "server-only";
import type { Usage } from "./cost";

export const MODEL = "deepseek-flash";

export class AiError extends Error {}

/** Chamada à API do DeepSeek (só no servidor). Devolve o texto e o uso de tokens. */
export async function chatJson(system: string, user: string, opts: { maxTokens?: number; timeoutMs?: number } = {}): Promise<{ content: string; usage: Usage }> {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) throw new AiError("DEEPSEEK_API_KEY não configurada.");
  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "system", content: system }, { role: "user", content: user }],
      response_format: { type: "json_object" },
      max_tokens: opts.maxTokens ?? 4000,
      temperature: 0.2,
    }),
    signal: AbortSignal.timeout(opts.timeoutMs ?? 100_000),
    redirect: "error",
  });
  if (!res.ok) throw new AiError(`DeepSeek respondeu HTTP ${res.status}.`);
  const data = await res.json() as { choices?: { message?: { content?: string } }[]; usage?: { prompt_tokens?: number; completion_tokens?: number; prompt_cache_hit_tokens?: number } };
  const content = data.choices?.[0]?.message?.content ?? "";
  const u = data.usage ?? {};
  return { content, usage: { promptTokens: u.prompt_tokens ?? 0, cachedTokens: u.prompt_cache_hit_tokens ?? 0, completionTokens: u.completion_tokens ?? 0 } };
}
