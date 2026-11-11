/** Língua materna (campo opcional do diagnóstico). Nunca trava o envio: valor fora da lista vira vazio. */
export const NATIVE_CODES = ["es", "en", "ht", "fr", "ar", "other"] as const;
export type NativeCode = (typeof NATIVE_CODES)[number];

/** Nome de cada língua na própria língua (igual em EN e ES); "other" vem do dicionário da página. */
export const NATIVE_NAMES: Record<Exclude<NativeCode, "other">, { label: string; lang: string; dir?: "rtl" }> = {
  es: { label: "Español", lang: "es" },
  en: { label: "English", lang: "en" },
  ht: { label: "Kreyòl ayisyen", lang: "ht" },
  fr: { label: "Français", lang: "fr" },
  ar: { label: "العربية", lang: "ar", dir: "rtl" },
};

export const NATIVE_OTHER_MAX = 60;

export function parseNative(codeRaw: unknown, otherRaw: unknown): { nativeLanguage: NativeCode | null; nativeLanguageOther: string | null } {
  const code = String(codeRaw ?? "");
  const nativeLanguage = (NATIVE_CODES as readonly string[]).includes(code) ? (code as NativeCode) : null;
  if (nativeLanguage !== "other") return { nativeLanguage, nativeLanguageOther: null };
  // NFKC e sem controles nem formatação (C0/C1, bidi, largura zero): o texto aparece no /admin sem embaralhar.
  const other = String(otherRaw ?? "").normalize("NFKC").replace(/[\p{Cc}\p{Cf}]/gu, " ").replace(/\s+/g, " ").trim().slice(0, NATIVE_OTHER_MAX);
  return { nativeLanguage, nativeLanguageOther: other || null };
}
