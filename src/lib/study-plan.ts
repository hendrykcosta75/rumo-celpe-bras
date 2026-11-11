/** Plano semanal até a prova (REQ-008). Puro: recebe hoje e a data da prova. */
export interface PlanWeek { readonly week: number; readonly from: string; readonly focus: string; readonly tasks: readonly string[] }

const addDays = (d: string, n: number) => { const x = new Date(`${d}T00:00:00Z`); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };

export function weeksUntil(today: string, exam: string): number {
  const days = Math.round((Date.parse(`${exam}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000);
  return Math.max(0, Math.ceil(days / 7));
}

/** Ciclo: simulados 1→4, com foco alternado; as 2 últimas semanas são revisão e prova completa cronometrada. */
export function buildPlan(today: string, exam: string, lang: "en" | "es"): PlanWeek[] {
  const n = Math.min(weeksUntil(today, exam), 26);
  const L = lang === "en"
    ? { genre: "Genres: e-mail, reader's letter, flyer, blog post", inter: "Who writes to whom: enunciator, reader, purpose", info: "Using the source: retell with your own words", lang: "Connectors and register (formal vs. informal)", review: "Review: redo your 2 lowest-scored tasks", full: "Full timed test: 4 tasks in 3 hours", speak: "Speaking: 2 recordings", test: (i: number) => `Practice test ${i}: tasks 1–4` }
    : { genre: "Géneros: e-mail, carta de lector, folleto, post de blog", inter: "Quién escribe a quién: enunciador, lector, propósito", info: "Usar la fuente: reformular con tus palabras", lang: "Conectores y registro (formal vs. informal)", review: "Repaso: rehaz tus 2 tareas con menor nota", full: "Simulado completo cronometrado: 4 tareas en 3 horas", speak: "Oral: 2 grabaciones", test: (i: number) => `Simulado ${i}: tareas 1 a 4` };
  const foci = [L.inter, L.genre, L.info, L.lang];
  return Array.from({ length: n }, (_, i) => {
    const last = n - i;
    const tasks = last === 1 ? [L.full, L.speak] : last === 2 && n > 2 ? [L.review, L.speak] : [L.test((i % 4) + 1), L.speak];
    return { week: i + 1, from: addDays(today, i * 7), focus: last <= 2 && n > 2 ? L.review : foci[i % 4]!, tasks };
  });
}
