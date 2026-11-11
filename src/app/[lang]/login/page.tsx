import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { t, type Lang } from "@/i18n/dict";
import { currentUser } from "@/lib/session";
import { LoginForm } from "./form";

export const metadata = { robots: { index: false } };

export default async function LoginPage({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ invalid?: string }> }) {
  const lang = (await params).lang as Lang;
  if (await currentUser()) redirect(`/${lang}/app`);
  const d = t(lang).login;
  return (
    <>
      <Header lang={lang} path="/login" />
      <main className="mx-auto max-w-md px-5 py-14">
        <h1 className="font-display text-4xl">{d.title}</h1>
        <p className="mt-2 text-ink-2">{d.lead}</p>
        {(await searchParams).invalid && <p role="alert" className="mt-4 rounded-xl bg-danger-soft p-3 text-sm text-danger">{d.invalid}</p>}
        <div className="mt-6"><LoginForm lang={lang} /></div>
      </main>
    </>
  );
}
