import type { Dict } from "@/i18n/dict";

/** Momento do hero: um trecho de redação corrigida, com anotações de margem e a nota estimada. Exemplo ilustrativo. */
export function SampleCard({ d }: { d: Dict }) {
  const s = d.sample;
  const scores = [4, 4, 3];
  return (
    <figure aria-label={s.label} className="rounded-2xl border border-line bg-card p-5 sm:p-6">
      <figcaption className="flex items-center justify-between gap-3 text-sm text-ink-3">
        <span>{s.task}</span><span className="shrink-0 tabular-nums">{s.words}</span>
      </figcaption>
      <div className="mt-4 grid gap-x-5 gap-y-3 sm:grid-cols-[1fr_9.5rem]">
        <p lang="pt-BR" className="font-display text-[17px] leading-8 text-ink [background-image:repeating-linear-gradient(transparent_0_31px,rgb(31_27_22/0.08)_31px_32px)]">
          Prezados senhores, <span className="margin-mark">escrevo para pedir o apoio de sua empresa</span> a um projeto de manejo sustentável do pirarucu na minha cidade. <span className="margin-mark">Gostaria de apresentar</span> os resultados que inspiraram a proposta: as comunidades <span className="margin-mark">apoia</span> a pesca e a renda aumentou.
        </p>
        <ul className="space-y-3 text-sm text-accent-ink sm:border-l sm:border-line sm:pl-4">
          <li>{s.note1}</li><li>{s.note2}</li><li>{s.note3}</li>
        </ul>
      </div>
      <div className="mt-5 flex items-end justify-between gap-4 border-t border-line pt-4">
        <dl className="grid gap-1.5 text-sm">
          {s.axes.map((a, i) => (
            <div key={a} className="flex items-center gap-3"><dt className="w-32 text-ink-2 sm:w-36">{a}</dt>
              <dd className="flex gap-1"><span className="sr-only">{scores[i]}/5</span>{[1, 2, 3, 4, 5].map(n => <span key={n} aria-hidden="true" className={`h-1.5 w-5 rounded-full ${n <= scores[i]! ? "bg-accent" : "bg-raised"}`} />)}</dd></div>
          ))}
        </dl>
        <div className="text-right"><p className="text-xs text-ink-3">{s.score}</p><p className="font-display text-5xl leading-none text-ink tabular-nums">4<span className="text-2xl text-ink-3">/5</span></p></div>
      </div>
    </figure>
  );
}
