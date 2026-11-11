"use client";
import { useRef, useState } from "react";
import { t, type Lang } from "@/i18n/dict";

type Fb = { transcript: string; feedback: { summary: string; strengths: string[]; improvements: string[]; betterPhrases: { said: string; better: string }[] } };

export function Recorder({ lang, topics }: { lang: Lang; topics: { id: string; title: string; prompt: string }[] }) {
  const d = t(lang);
  const [topic, setTopic] = useState(topics[0]!.id);
  const [state, setState] = useState<"idle" | "rec" | "ready" | "sending">("idle");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [result, setResult] = useState<Fb | null>(null);
  const [error, setError] = useState<string | null>(null);
  const rec = useRef<MediaRecorder | null>(null);
  const timer = useRef<number | null>(null);
  const current = topics.find(x => x.id === topic)!;

  async function start() {
    setError(null); setResult(null);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => null);
    if (!stream) { setError("mic"); return; }
    const chunks: Blob[] = [];
    const r = new MediaRecorder(stream);
    r.ondataavailable = e => chunks.push(e.data);
    r.onstop = () => { stream.getTracks().forEach(t => t.stop()); setBlob(new Blob(chunks, { type: r.mimeType })); setState("ready"); };
    r.start(); rec.current = r; setState("rec");
    timer.current = window.setTimeout(() => r.state === "recording" && r.stop(), 180_000);
  }
  function stop() { if (timer.current) clearTimeout(timer.current); rec.current?.stop(); }
  async function send() {
    if (!blob) return;
    setState("sending");
    const fd = new FormData(); fd.append("audio", blob, "audio.webm"); fd.append("topic", topic); fd.append("lang", lang);
    const res = await fetch("/api/speaking", { method: "POST", body: fd });
    const data = await res.json().catch(() => ({ error: "ai" }));
    if (res.ok) setResult(data); else setError(data.error ?? "ai");
    setState("idle");
  }
  const errText = error === "limit" ? d.app.speakLimit : error === "busy" ? d.app.speakBusy : error === "mic" ? "Microphone not available." : error ? d.diag.errors.ai : null;
  return (
    <div className="space-y-5">
      <select value={topic} onChange={e => setTopic(e.target.value)} className="rounded-lg border border-line p-2" aria-label="Topic">
        {topics.map(x => <option key={x.id} value={x.id}>{x.title}</option>)}
      </select>
      <p className="rounded-xl border-l-4 border-accent bg-accent-soft p-4" lang="pt-BR">{current.prompt}</p>
      <div className="flex flex-wrap items-center gap-3">
        {state !== "rec" ? <button onClick={start} disabled={state === "sending"} className="h-12 rounded-lg bg-accent px-5 font-medium text-white transition-colors hover:bg-accent-ink disabled:opacity-60">{d.app.record}</button>
          : <button onClick={stop} className="rounded-xl bg-danger px-5 py-3 font-medium text-white">{d.app.stop}</button>}
        {state === "ready" && <><audio controls src={blob ? URL.createObjectURL(blob) : undefined} /><button onClick={send} className="rounded-xl border border-line px-5 py-3 font-medium">{d.app.send}</button></>}
        {state === "rec" && <span className="text-sm text-danger">{d.app.recording}</span>}
        {state === "sending" && <span className="text-sm text-ink-2">{d.diag.grading}</span>}
      </div>
      <p className="text-xs text-ink-3">{d.app.max}</p>
      {errText && <p role="alert" className="rounded-xl bg-danger-soft p-3 text-sm text-danger">{errText}</p>}
      {result && (
        <section aria-live="polite" className="space-y-4 rounded-xl border border-line p-6">
          <div><h3 className="font-medium">{d.app.yourSpeech}</h3><p className="mt-1 italic text-ink-2" lang="pt-BR">{result.transcript}</p></div>
          <div><h3 className="font-medium">{d.app.speakFeedback}</h3><p className="mt-1 text-ink-2">{result.feedback.summary}</p></div>
          <ul className="list-disc pl-5 text-ink-2">{result.feedback.strengths.map(x => <li key={x}>{x}</li>)}</ul>
          <div><h3 className="font-medium">{d.feedback.improve}</h3><ul className="mt-1 list-disc pl-5 text-ink-2">{result.feedback.improvements.map(x => <li key={x}>{x}</li>)}</ul></div>
          {result.feedback.betterPhrases.length > 0 && <ul className="space-y-1 text-sm">{result.feedback.betterPhrases.map(p => <li key={p.said}><s className="text-ink-3">{p.said}</s> → <b>{p.better}</b></li>)}</ul>}
        </section>
      )}
    </div>
  );
}
