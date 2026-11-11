/** Data local de Brasília (AAAA-MM-DD) e início do dia em UTC, para os limites diários. */
export const TZ = "America/Sao_Paulo";
export function localDay(at: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(at);
}
/** Offset de Brasília naquele instante, via Intl (se o horário de verão voltar, continua certo). */
export function tzOffset(at: Date = new Date()): string {
  const name = new Intl.DateTimeFormat("en-US", { timeZone: TZ, timeZoneName: "longOffset" }).formatToParts(at).find(p => p.type === "timeZoneName")?.value ?? "GMT-03:00";
  const m = name.match(/GMT([+-]\d{2}):?(\d{2})?/);
  return m ? `${m[1]}:${m[2] ?? "00"}` : "+00:00";
}
export function startOfLocalDay(at: Date = new Date()): Date {
  return new Date(`${localDay(at)}T00:00:00${tzOffset(at)}`);
}
