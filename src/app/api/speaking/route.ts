import { SPEAKING_TOPICS } from "@/content/exams";
import { DAILY_SPEAKING_LIMIT, isLang } from "@/i18n/dict";
import { speakAndSave } from "@/lib/corrections";
import { startOfLocalDay } from "@/lib/dates";
import { release, reserve, quotaKey } from "@/lib/limits";
import { currentStudent } from "@/lib/session";
import { audioFormat } from "@/lib/audio-format";

const busy = new Set<string>();
const MAX_BYTES = 6 * 1024 * 1024;

export async function POST(request: Request) {
  const user = await currentStudent();
  if (!user) return Response.json({ error: "auth" }, { status: 401 });
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BYTES + 10_000) return Response.json({ error: "size" }, { status: 413 });
  const form = await request.formData().catch(() => null);
  const file = form?.get("audio");
  const topic = SPEAKING_TOPICS.find(x => x.id === form?.get("topic"));
  const lang = isLang(String(form?.get("lang"))) ? (form!.get("lang") as "en" | "es") : user.lang;
  if (!(file instanceof File) || !topic || file.size === 0 || file.size > MAX_BYTES) return Response.json({ error: "input" }, { status: 400 });
  // Limite antes da transcrição e da IA (AC-006).
  const audio = Buffer.from(await file.arrayBuffer());
  const format = audioFormat(audio);
  if (!format) return Response.json({ error: "input" }, { status: 400 });
  // Uma transcrição por vez por aluno (e no máximo 2 no servidor): o whisper usa CPU.
  // has + add sem await no meio: duas gravações juntas não passam as duas.
  if (busy.has(user.id) || busy.size >= 2) return Response.json({ error: "busy" }, { status: 429 });
  busy.add(user.id);
  let held: string[] | null = null;
  try {
    held = await reserve([{ key: quotaKey(user.id, "speaking"), max: DAILY_SPEAKING_LIMIT, since: startOfLocalDay() }]);
    if (!held) return Response.json({ error: "limit" }, { status: 429 });
    const r = await speakAndSave({ audio, format, topic: topic.prompt, lang, userId: user.id, topicId: topic.id });
    return Response.json(r);
  } catch (e) {
    await release(held).catch(() => {});
    return Response.json({ error: e instanceof Error && e.message === "too-short" ? "short" : "ai" }, { status: 422 });
  } finally {
    busy.delete(user.id);
  }
}
