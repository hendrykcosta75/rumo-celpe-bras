/**
 * Preço oficial do deepseek-flash (api-docs.deepseek.com, consultado em 10/11/2026), US$ por 1M tokens.
 * Pico: 01–04h e 06–10h UTC, de segunda a sexta; no pico o preço dobra.
 */
export const PRICE_OFF_PEAK = { cacheHit: 0.003, cacheMiss: 0.15, output: 0.6 } as const;

export function isPeak(at: Date): boolean {
  const day = at.getUTCDay();
  if (day === 0 || day === 6) return false;
  const h = at.getUTCHours();
  return (h >= 1 && h < 4) || (h >= 6 && h < 10);
}

export interface Usage { readonly promptTokens: number; readonly cachedTokens: number; readonly completionTokens: number }

/** Custo em US$; reasoning tokens fazem parte de completion_tokens e são cobrados como saída. */
export function costUsd(u: Usage, at: Date = new Date()): number {
  const k = isPeak(at) ? 2 : 1;
  const miss = Math.max(0, u.promptTokens - u.cachedTokens);
  return k * (u.cachedTokens * PRICE_OFF_PEAK.cacheHit + miss * PRICE_OFF_PEAK.cacheMiss + u.completionTokens * PRICE_OFF_PEAK.output) / 1_000_000;
}
