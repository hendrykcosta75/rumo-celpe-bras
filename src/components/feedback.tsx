import type { Grade } from "@/lib/grading/grader";
import type { Dict } from "@/i18n/dict";

export function Feedback({ grade, d }: { grade: Grade; d: Dict }) {
  const f = d.feedback;
  return (
    <div className="space-y-5">
      <div className="flex items-end gap-3">
        <span data-testid="score" className="font-display text-6xl leading-none text-accent-ink tabular-nums">{grade.score}</span>
        <span className="pb-2 text-sm text-ink-3">{d.diag.outOf}</span>
      </div>
      <Block title={f.why} body={grade.rationale} />
      <Block title={f.context} body={grade.context} />
      <Block title={f.genre} body={grade.genre} />
      <Block title={f.language} body={grade.language} />
      <div>
        <h3 className="font-medium">{f.improve}</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-2">{grade.improvements.map(i => <li key={i}>{i}</li>)}</ul>
      </div>
    </div>
  );
}
function Block({ title, body }: { title: string; body: string }) {
  return <div><h3 className="font-medium">{title}</h3><p className="mt-1 whitespace-pre-line text-ink-2">{body}</p></div>;
}
