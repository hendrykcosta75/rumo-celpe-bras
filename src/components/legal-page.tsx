import { Header } from "@/components/header";
import { legal, type LegalDoc } from "@/content/legal";
import type { Lang } from "@/i18n/dict";

export function LegalPage({ lang, doc }: { lang: Lang; doc: LegalDoc }) {
  const d = legal(lang, doc);
  return (
    <>
      <Header lang={lang} path={`/${doc}`} />
      <main className="mx-auto max-w-3xl px-5 py-10">
        <h1 className="font-display text-4xl">{d.title}</h1>
        <p className="mt-2 text-sm text-ink-3">v1.0 · 2026-11-10</p>
        {d.sections.map(s => (
          <section key={s.h} className="mt-8">
            <h2 className="text-lg font-medium">{s.h}</h2>
            {s.p.map(p => <p key={p} className="mt-2 text-ink-2">{p}</p>)}
          </section>
        ))}
      </main>
    </>
  );
}
