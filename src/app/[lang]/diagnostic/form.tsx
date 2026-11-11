"use client";

import Link from "next/link";
import { startTransition, useActionState, useState } from "react";
import { Feedback } from "@/components/feedback";
import { countWords } from "@/lib/grading/grader";
import { t, type Lang } from "@/i18n/dict";
import { NATIVE_NAMES, NATIVE_OTHER_MAX } from "@/lib/native-language";
import { submitDiagnostic, type DiagState } from "./actions";

export function DiagnosticForm({ lang }: { lang: Lang }) {
  const d = t(lang);
  const [state, action, pending] = useActionState<DiagState, FormData>(submitDiagnostic, { status: "idle" });
  // Depois de um erro, o select volta com a escolha enviada (inclusive no caminho sem JavaScript).
  const [native, setNative] = useState(state.status === "error" ? state.native ?? "" : "");
  const [text, setText] = useState("");
  if (state.status === "done") {
    return (
      <section aria-live="polite" className="rounded-xl border border-line p-6">
        <h2 className="font-display text-3xl">{d.diag.resultTitle}</h2>
        <p className="mt-1 text-sm text-ink-3">{d.diag.single}</p>
        <div className="mt-5"><Feedback grade={state.grade} d={d} /></div>
        <div className="mt-8 rounded-xl bg-accent-soft p-5">
          <h3 className="font-medium">{d.diag.nextTitle}</h3>
          <p className="mt-1 text-ink-2">{d.diag.nextBody}</p>
          <Link href={`/${lang}#pricing`} className="mt-3 inline-block font-medium text-accent-ink underline">{d.hero.ctaBuy}</Link>
        </div>
      </section>
    );
  }
  const err = state.status === "error" ? state.error : null;
  const words = countWords(text);
  // action= garante POST antes do JS carregar; depois de hidratado, o onSubmit evita o reset automático
  // do formulário, e num erro nada do que a pessoa preencheu se perde.
  return (
    <form action={action} onSubmit={e => { e.preventDefault(); const fd = new FormData(e.currentTarget); startTransition(() => action(fd)); }} className="space-y-5" noValidate>
      <input type="hidden" name="lang" value={lang} />
      <label className="block">
        <span className="font-medium">{d.diag.answer}</span>
        <textarea name="text" rows={14} lang="pt-BR" defaultValue={state.status === "error" ? state.text : ""} onChange={e => setText(e.target.value)}
          aria-invalid={err === "empty" || err === "tooShort" || err === "tooLong"} className="mt-2 w-full rounded-xl border border-line p-4 leading-relaxed focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25" />
        <span className={`mt-1 block text-sm ${words > 0 && (words < 150 || words > 300) ? "text-amber-700" : "text-ink-3"}`}>{d.diag.words(words)}</span>
      </label>
      <label className="block">
        <span className="font-medium">{d.diag.email}</span>
        <input name="email" type="email" autoComplete="email" defaultValue={state.status === "error" ? state.email : ""} aria-invalid={err === "email"} className="mt-2 w-full rounded-xl border border-line p-3 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25" />
      </label>
      <label className="block">
        <span className="font-medium">{d.diag.native}</span>
        <select name="native" value={native} onChange={e => setNative(e.target.value)} className="mt-2 block w-full rounded-lg border border-line bg-card p-3 sm:w-64">
          <option value="">—</option>
          {Object.entries(NATIVE_NAMES).map(([v, n]) => <option key={v} value={v} lang={n.lang} dir={n.dir}>{n.label}</option>)}
          <option value="other">{d.diag.nativeOther}</option>
        </select>
      </label>
      {/* Sempre no HTML; o CSS (.native-other em globals.css) mostra ao escolher "Outra", mesmo antes da hidratação. */}
      <label className="native-other">
        <span className="text-sm text-ink-2">{d.diag.nativeOtherLabel}</span>
        <input name="nativeOther" type="text" maxLength={NATIVE_OTHER_MAX} defaultValue={state.status === "error" ? state.nativeOther : ""}
          className="mt-2 block w-full rounded-lg border border-line bg-card p-3 sm:w-64" />
      </label>
      <label className="flex gap-3 text-sm text-ink-2">
        <input type="checkbox" name="consent" defaultChecked={state.status === "error" && !!state.consent} className="mt-1 size-4" />
        <span>{d.diag.consent} <Link href={`/${lang}/privacy`} className="underline">{d.footer.privacy}</Link></span>
      </label>
      {err && <p role="alert" data-testid="diag-error" className="rounded-xl bg-danger-soft p-3 text-sm text-danger">{d.diag.errors[err]}</p>}
      <button type="submit" disabled={pending} className="h-12 rounded-lg bg-accent px-5 font-medium text-white transition-colors hover:bg-accent-ink disabled:opacity-60">{pending ? d.diag.grading : d.diag.submit}</button>
    </form>
  );
}
