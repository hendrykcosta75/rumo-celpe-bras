import { SPEAKING_TOPICS } from "@/content/exams";
import { t, type Lang } from "@/i18n/dict";
import { Recorder } from "./recorder";

export default async function SpeakingPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-4xl">{t(lang).app.speaking}</h1>
      <div className="mt-6"><Recorder lang={lang} topics={[...SPEAKING_TOPICS]} /></div>
    </div>
  );
}
