"use client";
import { useActionState, useState } from "react";
import { Feedback } from "@/components/feedback";
import { countWords } from "@/lib/grading/grader";
import { t, type Lang } from "@/i18n/dict";
import { submitTask, type TaskState } from "../../../actions";

export function TaskForm({ lang, exam, task }: { lang: Lang; exam: string; task: string }) {
  const d = t(lang);
  const [state, action, pending] = useActionState<TaskState, FormData>(submitTask, { status: "idle" });
  const [text, setText] = useState("");
  if (state.status === "done") return <section aria-live="polite" className="rounded-xl border border-line p-6"><Feedback grade={state.grade} d={d} /><p className="mt-4 text-xs text-ink-3" data-testid="seconds">{state.seconds}s</p></section>;
  const err = state.status === "error" ? state.error : null;
  const msg = err === "limit" ? d.app.limit : err ? d.diag.errors[err] : null;
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="lang" value={lang} /><input type="hidden" name="exam" value={exam} /><input type="hidden" name="task" value={task} />
      <textarea name="text" rows={16} lang="pt-BR" defaultValue={state.status === "error" ? state.text : ""} onChange={e => setText(e.target.value)} className="w-full rounded-xl border border-line p-4 leading-relaxed" aria-label={d.diag.answer} />
      <p className="text-sm text-ink-3">{countWords(text)} words</p>
      {msg && <p role="alert" data-testid="task-error" className="rounded-xl bg-danger-soft p-3 text-sm text-danger">{msg}</p>}
      <button disabled={pending} className="h-12 rounded-lg bg-accent px-5 font-medium text-white transition-colors hover:bg-accent-ink disabled:opacity-60">{pending ? d.diag.grading : d.app.submit}</button>
    </form>
  );
}
