import type { Lang } from "@/i18n/dict";

/** Formulário simples (sem JS): o servidor cria a Checkout Session e redireciona ao Stripe. */
export function BuyButton({ lang, label, disabled, className = "" }: { lang: Lang; label: string; disabled?: boolean; className?: string }) {
  return (
    <form action="/api/checkout" method="post" className="contents">
      <input type="hidden" name="lang" value={lang} />
      <button type="submit" disabled={disabled} className={`h-12 rounded-lg bg-accent px-5 text-[15px] font-medium text-white transition-colors hover:bg-accent-ink disabled:cursor-not-allowed disabled:opacity-50 ${className}`}>
        {label}
      </button>
    </form>
  );
}
