/** IPv4 (e IPv4 mapeado em IPv6) fica inteiro; IPv6 vira o prefixo /64. */
export function ipBucket(ip: string): string {
  const v = ip.trim().toLowerCase().replace(/^\[|\]$/g, "").split("%")[0]!;
  if (!v.includes(":")) return v;
  const mapped = v.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return mapped[1]!;
  const [head, tail] = v.split("::");
  const h = head ? head.split(":") : [];
  const t = tail !== undefined ? (tail ? tail.split(":") : []) : [];
  const groups = tail !== undefined ? [...h, ...Array(Math.max(0, 8 - h.length - t.length)).fill("0"), ...t] : h;
  return groups.slice(0, 4).map(g => (parseInt(g || "0", 16) || 0).toString(16)).join(":") + "::/64";
}
