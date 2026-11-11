import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Source } from "@/components/source";
import { DIAGNOSTIC_TASK } from "@/content/exams";
import { t, type Lang } from "@/i18n/dict";
import { DiagnosticForm } from "./form";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang as Lang;
  return { title: t(lang).diag.title, alternates: { languages: { en: "/en/diagnostic", es: "/es/diagnostic" } }, robots: process.env.ALLOW_INDEXING === "1" ? undefined : { index: false } };
}

export default async function DiagnosticPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const d = t(lang);
  return (
    <>
      <Header lang={lang} path="/diagnostic" />
      <main className="mx-auto max-w-3xl px-5 py-10">
        <h1 className="font-display text-4xl">{d.diag.title}</h1>
        <p className="mt-3 text-ink-2">{d.diag.lead}</p>
        <h2 className="mt-8 text-sm font-medium text-ink-3">{d.diag.source}</h2>
        <div className="mt-2"><Source task={DIAGNOSTIC_TASK} d={d} /></div>
        <h2 className="mt-8 text-sm font-medium text-ink-3">{d.diag.task}</h2>
        <p className="mt-2 rounded-xl border-l-4 border-accent bg-accent-soft p-4 text-ink-2" lang="pt-BR">{DIAGNOSTIC_TASK.statement}</p>
        <div className="mt-8"><DiagnosticForm lang={lang} /></div>
      </main>
    </>
  );
}
