import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { BuyButton } from "@/components/buy-button";
import { Header } from "@/components/header";
import { SampleCard } from "@/components/sample-card";
import { t, isLang, type Lang } from "@/i18n/dict";
import { seatsLeft } from "@/lib/seats";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const d = t(isLang(lang) ? lang : "en");
  return {
    title: d.meta.title, description: d.meta.description,
    alternates: { canonical: `/${lang}`, languages: { en: "/en", es: "/es" } },
    robots: process.env.ALLOW_INDEXING === "1" ? undefined : { index: false, follow: false },
    openGraph: { title: d.meta.title, description: d.meta.description, locale: lang === "es" ? "es_LA" : "en_US" },
  };
}

export default async function Landing({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ checkout?: string }> }) {
  const raw = (await params).lang;
  if (!isLang(raw)) notFound(); // layout e página rodam em paralelo: a página também confere
  const lang: Lang = raw;
  const { checkout } = await searchParams;
  const d = t(lang);
  const left = await seatsLeft();
  const soldOut = left === 0;
  const banner = checkout === "success" ? d.checkout.success : checkout === "cancel" ? d.checkout.cancel : checkout === "soldout" ? d.checkout.soldOut : checkout === "busy" ? d.checkout.busy : null;
  return (
    <>
      <Header lang={lang} />
      {banner && <p role="status" className="border-b border-line bg-accent-soft px-5 py-3 text-center text-sm text-ink">{banner}</p>}
      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-8 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14 [&>*]:min-w-0">
          <div>
            <p className="text-sm text-accent-ink">{d.hero.eyebrow}</p>
            <h1 className="mt-3 font-display text-[40px] font-normal leading-[1.05] tracking-[-0.02em] sm:text-[60px]">{d.hero.title}</h1>
            <p className="mt-4 max-w-xl text-[17px] leading-7 text-ink-2 sm:text-lg">{d.hero.lead}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <BuyButton lang={lang} label={soldOut ? d.pricing.soldOut : d.hero.ctaBuy} disabled={soldOut} />
              <Link href={`/${lang}/diagnostic`} className="flex h-12 items-center rounded-lg border border-line bg-card px-5 text-[15px] font-medium text-ink transition-colors hover:bg-raised">{d.hero.ctaFree}</Link>
            </div>
            <ul className="mt-4 space-y-1 text-sm text-ink-2">
              <li data-testid="seats" className="tabular-nums text-accent-ink">{soldOut ? d.seats.soldOut : d.seats.left(left)}</li>
              <li>{d.hero.priceNote} · {d.hero.guarantee}</li>
            </ul>
          </div>
          <SampleCard d={d} />
        </section>

        <section className="border-y border-line bg-card py-16">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="max-w-2xl font-display text-3xl leading-tight sm:text-4xl">{d.problem.title}</h2>
            <p className="mt-4 max-w-2xl text-[17px] leading-7 text-ink-2">{d.problem.body}</p>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-[1fr_1.4fr]">
          <h2 className="font-display text-3xl sm:text-4xl">{d.how.title}</h2>
          <ol className="space-y-8">
            {d.how.steps.map((s, i) => (
              <li key={s.t} className="grid grid-cols-[2rem_1fr] gap-3">
                <span className="font-display text-2xl leading-7 text-accent tabular-nums">{i + 1}</span>
                <div><h3 className="text-lg font-medium">{s.t}</h3><p className="mt-1 leading-7 text-ink-2">{s.d}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <section id="pricing" className="border-y border-line bg-card py-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl">{d.includes.title}</h2>
              <ul className="mt-6 space-y-3">
                {d.includes.items.map(i => <li key={i} className="flex gap-3 leading-7 text-ink-2"><Check aria-hidden="true" strokeWidth={1.5} className="mt-1 size-[18px] shrink-0 text-accent" />{i}</li>)}
              </ul>
            </div>
            <div className="rounded-2xl border border-line bg-paper p-6 sm:p-8">
              <h3 className="text-lg font-medium">{d.pricing.title}</h3>
              <p className="mt-1 text-sm text-ink-2">{d.pricing.sub}</p>
              <p className="mt-6 flex items-baseline gap-3"><span className="font-display text-6xl leading-none tabular-nums">{d.pricing.price}</span><span className="text-ink-3 line-through tabular-nums">{d.pricing.was}</span></p>
              <p className="mt-1 text-sm text-ink-3">{d.pricing.period}</p>
              <BuyButton lang={lang} label={soldOut ? d.pricing.soldOut : d.pricing.cta} disabled={soldOut} className="mt-6 w-full" />
              <p className="mt-3 text-center text-sm text-ink-3">{d.pricing.secure} · {d.hero.guarantee}</p>
              <p className="mt-1 text-center text-sm tabular-nums text-accent-ink">{soldOut ? d.seats.soldOut : d.seats.left(left)}</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="font-display text-3xl sm:text-4xl">{d.proof.title}</h2>
          <p className="mt-4 max-w-2xl text-[17px] leading-7 text-ink-2">{d.proof.body}</p>
        </section>

        <section id="faq" className="mx-auto max-w-6xl px-5 pb-8">
          <h2 className="font-display text-3xl sm:text-4xl">{d.faq.title}</h2>
          <div className="mt-6 max-w-3xl divide-y divide-line border-y border-line">
            {d.faq.items.map(f => (
              <details key={f.q} className="py-4">
                <summary className="cursor-pointer font-medium">{f.q}</summary>
                <p className="mt-2 leading-7 text-ink-2">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="font-display text-3xl sm:text-4xl">{d.finalCta.title}</h2>
          <p className="mt-3 text-ink-2">{d.finalCta.body}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <BuyButton lang={lang} label={soldOut ? d.pricing.soldOut : d.hero.ctaBuy} disabled={soldOut} />
            <Link href={`/${lang}/diagnostic`} className="flex h-12 items-center rounded-lg border border-line bg-card px-5 text-[15px] font-medium transition-colors hover:bg-raised">{d.hero.ctaFree}</Link>
          </div>
        </section>
      </main>
    </>
  );
}
