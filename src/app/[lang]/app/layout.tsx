import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { t, type Lang } from "@/i18n/dict";
import { currentStudent, currentUser } from "@/lib/session";
import { logout } from "./actions";

export const metadata = { robots: { index: false } };

export default async function AppLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const user = await currentUser();
  if (!user) redirect(`/${lang}/login`);
  if (!(await currentStudent())) redirect(`/${lang}?access=ended`);
  const d = t(lang).app;
  return (
    <>
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link href={`/${lang}/app`} className="flex items-center gap-2 text-[17px] font-medium"><span aria-hidden="true" className="h-4 w-1 rounded-full bg-accent" />Rumo</Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href={`/${lang}/app/speaking`} className="text-ink-2 hover:text-ink">{d.speaking}</Link>
            <form action={logout}><button className="text-ink-2 hover:text-ink">{d.logout}</button></form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-10">{children}</main>
    </>
  );
}
