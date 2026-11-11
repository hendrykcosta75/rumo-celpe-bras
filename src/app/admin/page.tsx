import { avg, count, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { leads, outbox, purchases, submissions } from "@/db/schema";
import { Footer } from "@/components/footer";
import { isAdmin } from "@/lib/admin";
import { seatsLeft } from "@/lib/seats";
import { DIAG_DAILY_CAP, DIAG_GLOBAL_KEY } from "@/lib/caps";
import { startOfLocalDay } from "@/lib/dates";
import { countSince } from "@/lib/limits";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin", robots: { index: false } };

export default async function Admin({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  if (!(await isAdmin())) {
    return (
      <main className="mx-auto max-w-sm px-5 py-20">
        <h1 className="text-2xl font-medium">Admin</h1>
        <form action="/admin/enter" method="post" className="mt-4 space-y-3">
          <input name="token" type="password" autoComplete="off" aria-label="Token" className="w-full rounded-lg border border-line p-3" />
          <button className="rounded-lg bg-ink px-4 py-2 font-medium text-white">Entrar</button>
          {(await searchParams).e && <p role="alert" className="text-sm text-danger">Token inválido.</p>}
        </form>
      </main>
    );
  }
  const diagToday = await countSince(DIAG_GLOBAL_KEY, startOfLocalDay());
  const natives = await db.select({ lang: leads.nativeLanguage, other: leads.nativeLanguageOther, n: count() }).from(leads).groupBy(leads.nativeLanguage, leads.nativeLanguageOther);
  // Texto livre vem de formulário público: mostra só os grupos mais comuns e soma o resto.
  const nativeSorted = [...natives].sort((a, b) => b.n - a.n);
  const nativeTop = nativeSorted.slice(0, 8);
  const nativeRest = nativeSorted.slice(8).reduce((sum, n) => sum + n.n, 0);
  const [[diag], [lead], [sales], seats, costs, mails] = await Promise.all([
    db.select({ n: count() }).from(submissions).where(eq(submissions.kind, "diagnostic")),
    db.select({ n: count() }).from(leads),
    db.select({ n: count(), cents: sql<number>`coalesce(sum(${purchases.amountCents}),0)::int`, live: sql<number>`count(*) filter (where ${purchases.livemode})::int` }).from(purchases).where(eq(purchases.status, "paid")),
    seatsLeft(),
    db.select({ kind: submissions.kind, n: count(), cost: avg(submissions.costUsd), ms: avg(submissions.latencyMs) }).from(submissions).groupBy(submissions.kind),
    db.select().from(outbox).orderBy(desc(outbox.createdAt)).limit(20),
  ]);
  const card = (label: string, value: string | number) => <div className="rounded-xl border border-line p-4"><p className="text-sm text-ink-3">{label}</p><p className="mt-1 text-2xl font-medium">{value}</p></div>;
  return (
    <>
      <main className="mx-auto max-w-5xl space-y-8 px-5 py-10">
        <h1 className="text-2xl font-medium">Painel do dono</h1>
        <div className="grid gap-3 sm:grid-cols-4">
          {card("Diagnósticos", diag?.n ?? 0)}{card("E-mails captados", lead?.n ?? 0)}
          {card("Vendas (pagas)", `${sales?.n ?? 0} · US$ ${((sales?.cents ?? 0) / 100).toFixed(2)}`)}{card("Vagas restantes", seats)}{card("Diagnósticos hoje / teto", `${diagToday} / ${DIAG_DAILY_CAP}${diagToday >= DIAG_DAILY_CAP ? " · teto atingido" : ""}`)}
        </div>
        <p className="text-xs text-ink-3">Vendas em modo live: {sales?.live ?? 0}. As demais são de teste.</p>
        <section><h2 className="font-medium">Língua materna (diagnósticos)</h2>
          <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-ink-2">
            {nativeTop.length ? nativeTop.map((n, i) => (
              <span key={i}>{n.lang === "other" ? <>outra{n.other ? <> (<bdi>{n.other}</bdi>)</> : null}</> : n.lang ?? "não informada"}: {n.n}</span>
            )) : "—"}
            {nativeRest > 0 && <span>demais: {nativeRest}</span>}
          </p>
        </section>
        <section><h2 className="font-medium">Custo de IA por correção</h2>
          <table className="mt-2 w-full text-sm"><thead className="text-left text-ink-3"><tr><th>Tipo</th><th>Qtd</th><th>Custo médio (US$)</th><th>Tempo médio (s)</th></tr></thead>
            <tbody>{costs.map(c => <tr key={c.kind} className="border-t border-line"><td>{c.kind}</td><td>{c.n}</td><td>{Number(c.cost ?? 0).toFixed(5)}</td><td>{(Number(c.ms ?? 0) / 1000).toFixed(1)}</td></tr>)}</tbody></table>
        </section>
        <section><h2 className="font-medium">Caixa de saída (últimos 20 e-mails)</h2>
          <ul className="mt-2 space-y-3 text-sm">{mails.map(m => <li key={m.id} className="rounded-lg bg-raised p-3"><b>{m.subject}</b> → {m.to} · {m.sentViaSmtp ? "enviado por SMTP" : "não enviado (sem SMTP)"}<pre className="mt-2 whitespace-pre-wrap break-all text-xs text-ink-2">{m.body}</pre></li>)}</ul>
        </section>
      </main>
      <Footer lang="en" />
    </>
  );
}
