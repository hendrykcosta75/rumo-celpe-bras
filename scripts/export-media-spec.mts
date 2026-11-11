import { EXAMS } from "../src/content/exams";
const out = EXAMS.flatMap(e => e.tasks.filter(t => t.kind !== "reading").map(t => ({ id: `${e.id}-${t.id}`, kind: t.kind, title: t.title, text: t.sourceText })));
console.log(JSON.stringify(out));
