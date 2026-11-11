import Link from "next/link";
import { and, eq, max } from "drizzle-orm";
import { db } from "@/db/client";
import { submissions } from "@/db/schema";
import { EXAMS } from "@/content/exams";
import { t, type Lang } from "@/i18n/dict";
import { localDay } from "@/lib/dates";
import { levelFromAverage } from "@/lib/grading/rubric";
import { usedToday } from "@/lib/limits";
import { redirect } from "next/navigation";
import { currentStudent } from "@/lib/session";
import { buildPlan, weeksUntil } from "@/lib/study-plan";
import { saveExamDate } from "./actions";

export default async function AppHome({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const user = await currentStudent();
  if (!user) redirect(`/${lang}/login`);
  const d = t(lang);
  const [w, s, best] = await Promise.all([
    usedToday(user.id, "exam"), usedToday(user.id, "speaking"),
    db.select({ examId: submissions.examId, taskId: submissions.taskId, best: max(submissions.score) }).from(submissions)
      .where(and(eq(submissions.userId, user.id), eq(submissions.kind, "exam"))).groupBy(submissions.examId, submissions.taskId),
  ]);
  const score = (e: string, k: string) => best.find(b => b.examId === e && b.taskId === k)?.best ?? null;
  const today = localDay();
  const plan = user.examDate ? buildPlan(today, user.examDate, lang) : [];
  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-display text-4xl">{d.app.title}</h1>
        <p data-testid="usage" className="mt-2 text-sm text-ink-2">{d.app.usage(w, s)}</p>
      </div>
      <section>
        <h2 className="text-xl font-medium">{d.app.exams}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {EXAMS.map(exam => {
            const scores = exam.tasks.map(tk => score(exam.id, tk.id));
            const complete = scores.every(x => x !== null);
            const avg = complete ? scores.reduce((a, b) => a! + b!, 0)! / scores.length : null;
            return (
              <div key={exam.id} className="rounded-xl border border-line p-5">
                <h3 className="font-medium">{exam.title}</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {exam.tasks.map((tk, i) => (
                    <li key={tk.id} className="flex items-center justify-between gap-3">
                      <span className="text-ink-2">{d.app.task} {i + 1} · {tk.title}</span>
                      <Link href={`/${lang}/app/exam/${exam.id}/${tk.id}`} className="shrink-0 font-medium text-accent-ink">{scores[i] !== null ? `${scores[i]}/5` : d.app.start}</Link>
                    </li>
                  ))}
                </ul>
                {avg !== null && <p className="mt-3 border-t border-line pt-3 text-sm">{d.app.avg}: <b>{avg.toFixed(2)}</b> · {d.app.level}: <b>{d.levels[levelFromAverage(avg)]}</b></p>}
              </div>
            );
          })}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-medium">{d.app.plan}</h2>
        <form action={saveExamDate} className="mt-3 flex flex-wrap items-end gap-3">
          <label className="text-sm"><span className="block font-medium">{d.app.examDate}</span>
            <input type="date" name="examDate" min={today} defaultValue={user.examDate ?? ""} required className="mt-1 rounded-lg border border-line p-2" /></label>
          <button className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white">{d.app.savePlan}</button>
        </form>
        {user.examDate ? (
          <div className="mt-5">
            <p className="text-sm text-ink-2">{d.app.weeks(weeksUntil(today, user.examDate))}</p>
            <ol className="mt-3 space-y-2">
              {plan.map(p => <li key={p.week} className="rounded-xl bg-raised p-3 text-sm"><b>#{p.week}</b> · {p.from} · {p.focus}<br /><span className="text-ink-2">{p.tasks.join(" · ")}</span></li>)}
            </ol>
          </div>
        ) : <p className="mt-3 text-sm text-ink-2">{d.app.noDate}</p>}
      </section>
    </div>
  );
}
