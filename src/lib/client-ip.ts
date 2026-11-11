import "server-only";
import { headers } from "next/headers";
import { ipBucket } from "./ip-bucket";

/** IP do cliente: X-Real-IP (o Caddy sobrescreve) ou o último item do X-Forwarded-For. */
export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-real-ip")?.trim() || h.get("x-forwarded-for")?.split(",").at(-1)?.trim() || "local";
}

/** Chave de limite por IP: IPv4 inteiro, IPv6 agrupado por /64 (quem tem um /64 troca de endereço à vontade). */
export async function clientIpKey(): Promise<string> {
  return ipBucket(await clientIp());
}
