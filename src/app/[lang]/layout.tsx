import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { isLang } from "@/i18n/dict";

export const dynamic = "force-dynamic";

export default async function LangLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (<>{children}<Footer lang={lang} /></>);
}
