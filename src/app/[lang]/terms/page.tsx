import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { legal } from "@/content/legal";
import type { Lang } from "@/i18n/dict";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  return { title: legal((await params).lang as Lang, "terms").title };
}
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  return <LegalPage lang={(await params).lang as Lang} doc="terms" />;
}
