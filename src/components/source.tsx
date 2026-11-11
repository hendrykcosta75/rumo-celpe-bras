import type { ExamTask } from "@/content/exams";
import type { Dict } from "@/i18n/dict";

/** Texto-base da tarefa: vídeo, áudio (com transcrição recolhível) ou leitura. */
export function Source({ task, mediaId, d }: { task: ExamTask; mediaId?: string; d: Dict }) {
  if (task.kind === "reading" || !mediaId) {
    return <article className="whitespace-pre-line rounded-xl bg-raised p-5 leading-relaxed text-ink-2" lang="pt-BR">{task.sourceText}</article>;
  }
  return (
    <div className="space-y-3">
      {task.kind === "video"
        ? <video controls preload="metadata" width={1280} height={720} style={{ width: "100%", height: "auto" }} className="block aspect-video max-w-full rounded-xl bg-ink" src={`/media/${mediaId}.mp4`} />
        : <audio controls preload="metadata" className="w-full" src={`/media/${mediaId}.mp3`} />}
      <details className="rounded-xl bg-raised p-4 text-sm">
        <summary className="cursor-pointer font-medium">{d.app.transcript}</summary>
        <p className="mt-2 whitespace-pre-line text-ink-2" lang="pt-BR">{task.sourceText}</p>
      </details>
    </div>
  );
}
