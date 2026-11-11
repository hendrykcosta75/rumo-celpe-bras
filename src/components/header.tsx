import Link from "next/link";
import { t, type Lang } from "@/i18n/dict";

export function Header({ lang, path = "" }: { lang: Lang; path?: string }) {
  const d = t(lang).nav;
  const other = lang === "en" ? "es" : "en";
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
        <Link href={`/${lang}`} className="flex items-center gap-2 text-[17px] font-medium"><span aria-hidden="true" className="h-4 w-1 rounded-full bg-accent" />Rumo</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href={`/${lang}/diagnostic`} className="hidden text-ink-2 hover:text-ink sm:inline">{d.diagnostic}</Link>
          <Link href={`/${lang}/login`} className="text-ink-2 hover:text-ink">{d.login}</Link>
          <Link href={`/${other}${path}`} hrefLang={other} className="rounded-lg border border-line px-3 py-1.5 text-ink-2 transition-colors hover:bg-raised">{d.lang}</Link>
        </nav>
      </div>
    </header>
  );
}
