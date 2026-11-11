import { describe, expect, it } from "vitest";
import { NATIVE_OTHER_MAX, parseNative } from "@/lib/native-language";

describe("parseNative (língua materna opcional)", () => {
  it("aceita as opções da lista", () => {
    for (const code of ["es", "en", "ht", "fr", "ar"])
      expect(parseNative(code, "ignorado")).toEqual({ nativeLanguage: code, nativeLanguageOther: null });
  });
  it("vazio ou fora da lista vira null e não trava", () => {
    expect(parseNative("", "")).toEqual({ nativeLanguage: null, nativeLanguageOther: null });
    expect(parseNative(null, undefined)).toEqual({ nativeLanguage: null, nativeLanguageOther: null });
    expect(parseNative("de", "x")).toEqual({ nativeLanguage: null, nativeLanguageOther: null });
    expect(parseNative("<script>", "x")).toEqual({ nativeLanguage: null, nativeLanguageOther: null });
  });
  it("outra guarda o texto livre limpo e curto", () => {
    expect(parseNative("other", "  Wolof \n\t ")).toEqual({ nativeLanguage: "other", nativeLanguageOther: "Wolof" });
    expect(parseNative("other", "")).toEqual({ nativeLanguage: "other", nativeLanguageOther: null });
    expect(parseNative("other", "a\u0000b")).toEqual({ nativeLanguage: "other", nativeLanguageOther: "a b" });
    expect(parseNative("other", "x".repeat(200)).nativeLanguageOther).toHaveLength(NATIVE_OTHER_MAX);
    // controles C1, bidi e largura zero não passam; NFKC normaliza formas de largura total
    expect(parseNative("other", "Wo\u202Elof\u2066\u200B\u0085!").nativeLanguageOther).toBe("Wo lof !");
    expect(parseNative("other", "\uFF37olof").nativeLanguageOther).toBe("Wolof");
  });
});
