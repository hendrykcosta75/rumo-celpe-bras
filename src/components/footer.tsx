import Link from "next/link";
import { operator } from "@/content/legal";
import { t, type Lang } from "@/i18n/dict";

/** Rodapé presente em todas as páginas (AC-007): termos, privacidade, garantia e aviso de não afiliação. */
export function Footer({ lang }: { lang: Lang }) {
  const d = t(lang).footer;
  return (
    <footer className="mt-20 border-t border-line bg-raised">
      <div className="mx-auto max-w-5xl px-5 py-10 text-sm text-ink-2">
        <p data-testid="disclaimer" className="max-w-3xl">{d.disclaimer}</p>
        <nav aria-label="Legal" className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
          <Link href={`/${lang}/terms`} className="hover:text-ink">{d.terms}</Link>
          <Link href={`/${lang}/privacy`} className="hover:text-ink">{d.privacy}</Link>
          <Link href={`/${lang}/refund`} className="hover:text-ink">{d.refund}</Link>
          {process.env.CONTACT_EMAIL ? <a href={`mailto:${process.env.CONTACT_EMAIL}`} className="hover:text-ink">{d.contact}</a> : <span>{d.contact}: {operator().contact}</span>}
        </nav>
        <p className="mt-5 text-xs text-ink-3">© 2026 Rumo</p>
      </div>
    </footer>
  );
}
