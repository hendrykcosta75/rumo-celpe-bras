import { describe, expect, it } from "vitest";
import { EXAMS, DIAGNOSTIC_TASK, SPEAKING_TOPICS, findTask } from "@/content/exams";
import { legal } from "@/content/legal";
import { DICTS, DAILY_WRITING_LIMIT, REFUND_DAYS } from "@/i18n/dict";
import { buildPlan, weeksUntil } from "@/lib/study-plan";
import { checkEssay, emailSchema } from "@/lib/validation";

const words = (n: number) => Array.from({ length: n }, (_, i) => `palavra${i}`).join(" ");

describe("validação do diagnóstico (AC-002)", () => {
  it("exige 150 a 300 palavras", () => {
    expect(checkEssay("")).toBe("empty");
    expect(checkEssay(words(149))).toBe("tooShort");
    expect(checkEssay(words(150))).toBeNull();
    expect(checkEssay(words(301))).toBe("tooLong");
  });
  it("normaliza e valida o e-mail", () => {
    expect(emailSchema.safeParse(" Ana@Exemplo.COM ").data).toBe("ana@exemplo.com");
    expect(emailSchema.safeParse("ana@").success).toBe(false);
  });
});

describe("conteúdo", () => {
  it("4 simulados com as 4 tarefas no formato (vídeo, áudio, leitura, leitura)", () => {
    expect(EXAMS).toHaveLength(4);
    for (const e of EXAMS) expect(e.tasks.map(t => t.kind)).toEqual(["video", "audio", "reading", "reading"]);
    expect(findTask("s3", "t4")?.genre).toBeTruthy();
    expect(findTask("s9", "t1")).toBeUndefined();
    expect(DIAGNOSTIC_TASK.keyInfo.length).toBeGreaterThan(0);
    expect(SPEAKING_TOPICS.length).toBeGreaterThanOrEqual(4);
  });
  it("EN e ES têm as mesmas chaves e não prometem aprovação", () => {
    const keys = (o: object): string[] => Object.entries(o).flatMap(([k, v]) => (v && typeof v === "object" && !Array.isArray(v) ? keys(v).map(x => `${k}.${x}`) : [k]));
    expect(keys(DICTS.es).sort()).toEqual(keys(DICTS.en).sort());
    const all = JSON.stringify(DICTS).toLowerCase();
    for (const bad of ["guaranteed pass", "guarantee you pass", "aprobación garantizada", "garantizamos que apruebes"]) expect(all).not.toContain(bad);
    // Garantia: sem "sem perguntas", sem devolução ligada a passar, sem taxa de aprovação ou número de aprovados (FAQ e páginas legais).
    const forbidden = /no questions|sin preguntas|if you (do not|don't) pass|si no (apruebas|pasas)|pass rate|tasa de aprobaci|students passed|alumnos aprobados/i;
    const legalText = JSON.stringify((["en", "es"] as const).flatMap(l => [legal(l, "refund"), legal(l, "terms")]));
    expect(all + legalText).not.toMatch(forbidden);
  });
  it("termos citam o limite diário; privacidade cita a transferência internacional; garantia cita os dias", () => {
    for (const lang of ["en", "es"] as const) {
      expect(JSON.stringify(legal(lang, "terms"))).toContain(String(DAILY_WRITING_LIMIT));
      expect(JSON.stringify(legal(lang, "privacy"))).toMatch(/DeepSeek/);
      expect(JSON.stringify(legal(lang, "privacy"))).toMatch(/33/);
      expect(JSON.stringify(legal(lang, "refund"))).toContain(String(REFUND_DAYS));
      const legalAll = JSON.stringify([legal(lang, "refund"), legal(lang, "terms")]).toLowerCase();
      for (const bad of ["no questions asked", "sin preguntas", "if you don't pass", "si no apruebas"]) expect(legalAll).not.toContain(bad);
      expect(legalAll).toMatch(/e-mail/);
      expect(JSON.stringify(legal(lang, "terms"))).toMatch(/Inep/);
    }
  });
});

describe("plano de estudo (REQ-008)", () => {
  it("uma linha por semana, termina com simulado completo", () => {
    const plan = buildPlan("2026-11-10", "2026-12-22", "en");
    expect(weeksUntil("2026-11-10", "2026-12-22")).toBe(6);
    expect(plan).toHaveLength(6);
    expect(plan.at(-1)!.tasks[0]).toMatch(/Full timed test/);
    expect(plan[0]!.from).toBe("2026-11-10");
  });
  it("data no passado não gera plano; limite de 26 semanas", () => {
    expect(buildPlan("2026-11-10", "2026-11-01", "es")).toHaveLength(0);
    expect(buildPlan("2026-11-10", "2028-11-01", "es")).toHaveLength(26);
  });
});
