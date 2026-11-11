/**
 * AC-005: corrige redações reais com nota oficial (Inep, Caderno de Tarefas Comentadas 2019/2)
 * e compara. "Mesma faixa" = |IA − oficial| ≤ 1 (tolerância entre dois avaliadores do exame).
 * Uso: CALIBRATION_SAMPLES=amostras.json DEEPSEEK_API_KEY=… npm run calibrate -- [all|ten] [saida.json]
 * As redações do Inep não ficam no repositório (direitos de terceiros). Monte o JSON a partir do
 * Caderno de Tarefas Comentadas 2019/2: [{ id, task, statement, text, score }]. Padrão: scripts/calibration-samples.json (ignorado pelo git).
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { gradeEssay } from "../src/lib/grading/grade";
import type { TaskContext } from "../src/lib/grading/grader";

interface Sample { id: string; task: number; statement: string; text: string; score: number }
const samplesPath = process.env.CALIBRATION_SAMPLES ?? new URL("./calibration-samples.json", import.meta.url);
if (!existsSync(samplesPath)) { console.error(`Amostras não encontradas: ${samplesPath}. Veja o comentário no topo.`); process.exit(1); }
const samples = JSON.parse(readFileSync(samplesPath, "utf8")) as Sample[];

const TASKS: Record<number, Omit<TaskContext, "statement">> = {
  1: { genre: "matéria para o site da escola", enunciator: "professor(a)", interlocutor: "comunidade escolar e público do site", purpose: "informar sobre a comemoração do Ano Internacional das Línguas Indígenas, a situação dessas línguas no Brasil e as iniciativas para preservá-las", keyInfo: ["2019 Ano Internacional das Línguas Indígenas (ONU/Unesco)", "muitas línguas indígenas ameaçadas no Brasil", "iniciativas de preservação e ensino"] },
  2: { genre: "panfleto", enunciator: "membro de ONG que incentiva a amamentação", interlocutor: "frequentadores de postos de saúde, maternidades e locais públicos", purpose: "explicar as vantagens da amamentação, o que são redes de apoio e sua importância", keyInfo: ["vantagens da amamentação para o bebê e a mãe", "redes de apoio à amamentação", "importância do apoio à mãe"] },
  3: { genre: "e-mail", enunciator: "biólogo(a)", interlocutor: "empresas privadas", purpose: "solicitar apoio financeiro para um projeto semelhante ao de manejo sustentável do pirarucu, destacando os pontos positivos do projeto original e apresentando a proposta", keyInfo: ["manejo sustentável do pirarucu (João Campos-Silva)", "recuperação da população do peixe", "renda e participação das comunidades"] },
  4: { genre: "carta do leitor (seção Cartas do Leitor do jornal Estadão)", enunciator: "leitor(a) do jornal", interlocutor: "leitores do jornal / o autor do artigo", purpose: "defender um ponto de vista sobre as questões levantadas no artigo sobre caixinhas de som na praia", keyInfo: ["caixinhas de som portáteis na praia", "conflito entre lazer e incômodo/barulho", "regras e convivência"] },
};
const TEN = ["celpe-2019-2-t1-n5", "celpe-2019-2-t1-n2", "celpe-2019-2-t1-n0", "celpe-2019-2-t2-n4", "celpe-2019-2-t2-n1", "celpe-2019-2-t3-n5", "celpe-2019-2-t3-n3", "celpe-2019-2-t3-n1", "celpe-2019-2-t4-n4", "celpe-2019-2-t4-n2"];

const mode = process.argv[2] ?? "ten";
const out = process.argv[3] ?? "calibration-result.json";
const chosen = mode === "all" ? samples : samples.filter(s => TEN.includes(s.id));

async function run(s: Sample) {
  const statement = (s.statement.match(/Enunciado:\s*"([^"]+)"/)?.[1]) ?? s.statement;
  try {
    const r = await gradeEssay({ ...TASKS[s.task]!, statement }, s.text, "en");
    return { id: s.id, task: s.task, official: s.score, ai: r.grade.score, diff: r.grade.score - s.score, costUsd: r.costUsd, latencyMs: r.latencyMs, tokens: r.usage, rationale: r.grade.rationale };
  } catch (e) {
    return { id: s.id, task: s.task, official: s.score, ai: null, diff: null, error: (e as Error).message };
  }
}

const results: Awaited<ReturnType<typeof run>>[] = [];
const queue = [...chosen];
await Promise.all(Array.from({ length: 4 }, async () => { for (let s = queue.shift(); s; s = queue.shift()) results.push(await run(s)); }));
results.sort((a, b) => a.id.localeCompare(b.id));
const ok = results.filter(r => r.ai !== null);
const within1 = ok.filter(r => Math.abs(r.diff!) <= 1).length;
const exact = ok.filter(r => r.diff === 0).length;
const summary = {
  n: results.length, graded: ok.length, exact, within1,
  meanAbsError: ok.reduce((a, r) => a + Math.abs(r.diff!), 0) / (ok.length || 1),
  bias: ok.reduce((a, r) => a + r.diff!, 0) / (ok.length || 1),
  avgCostUsd: ok.reduce((a, r) => a + (r.costUsd ?? 0), 0) / (ok.length || 1),
  avgLatencyMs: ok.reduce((a, r) => a + (r.latencyMs ?? 0), 0) / (ok.length || 1),
  maxLatencyMs: Math.max(...ok.map(r => r.latencyMs ?? 0)),
};
writeFileSync(out, JSON.stringify({ summary, results }, null, 1));
console.table(results.map(r => ({ id: r.id, oficial: r.official, ia: r.ai, dif: r.diff, usd: r.costUsd?.toFixed(5), s: ((r.latencyMs ?? 0) / 1000).toFixed(1) })));
console.log(JSON.stringify(summary));
