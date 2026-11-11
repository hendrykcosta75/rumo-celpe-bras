"use client";
import { useActionState } from "react";
import { t, type Lang } from "@/i18n/dict";
import { requestLink } from "./actions";

export function LoginForm({ lang }: { lang: Lang }) {
  const d = t(lang).login;
  const [state, action, pending] = useActionState(requestLink, null);
  if (state?.sent) return <p role="status" className="rounded-xl bg-accent-soft p-4 text-ink">{d.sent}</p>;
  return (
    <form action={action} className="space-y-4">
      <label className="block"><span className="font-medium">{d.email}</span>
        <input name="email" type="email" required autoComplete="email" className="mt-2 w-full rounded-xl border border-line p-3" /></label>
      <button disabled={pending} className="h-12 rounded-lg bg-accent px-5 font-medium text-white transition-colors hover:bg-accent-ink disabled:opacity-60">{d.submit}</button>
    </form>
  );
}
