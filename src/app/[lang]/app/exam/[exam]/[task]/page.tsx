import Link from "next/link";
import { notFound } from "next/navigation";
import { Source } from "@/components/source";
import { EXAMS } from "@/content/exams";
import { t, type Lang } from "@/i18n/dict";
import { TaskForm } from "./form";

export default async function TaskPage({ params }: { params: Promise<{ lang: string; exam: string; task: string }> }) {
  const { lang: l, exam: examId, task: taskId } = await params;
  const lang = l as Lang;
  const exam = EXAMS.find(e => e.id === examId);
  const idx = exam?.tasks.findIndex(x => x.id === taskId) ?? -1;
  if (!exam || idx < 0) notFound();
  const task = exam.tasks[idx]!;
  const d = t(lang);
  const label = task.kind === "video" ? d.app.video : task.kind === "audio" ? d.app.audio : d.app.reading;
  return (
    <div className="max-w-3xl space-y-6">
      <Link href={`/${lang}/app`} className="text-sm text-accent-ink">← {d.app.back}</Link>
      <h1 className="font-display text-3xl">{exam.title} · {d.app.task} {idx + 1}: {task.title}</h1>
      <h2 className="text-sm font-medium text-ink-3">{label}</h2>
      <Source task={task} mediaId={task.kind === "reading" ? undefined : `${exam.id}-${task.id}`} d={d} />
      <h2 className="text-sm font-medium text-ink-3">{d.diag.task}</h2>
      <p className="rounded-xl border-l-4 border-accent bg-accent-soft p-4" lang="pt-BR">{task.statement}</p>
      <TaskForm lang={lang} exam={exam.id} task={task.id} />
    </div>
  );
}
