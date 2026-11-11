import { describe, expect, it } from "vitest";
import { audioFormat } from "@/lib/audio-format";
import { startOfLocalDay, tzOffset } from "@/lib/dates";
import { ipBucket } from "@/lib/ip-bucket";

describe("ipBucket", () => {
  it("IPv4 fica inteiro", () => expect(ipBucket("203.0.113.7")).toBe("203.0.113.7"));
  it("IPv4 mapeado vira IPv4", () => expect(ipBucket("::ffff:203.0.113.7")).toBe("203.0.113.7"));
  it("IPv6 do mesmo /64 cai na mesma chave", () => {
    expect(ipBucket("2001:db8:1:2:aaaa::1")).toBe("2001:db8:1:2::/64");
    expect(ipBucket("2001:0db8:0001:0002:ffff:ffff:ffff:ffff")).toBe("2001:db8:1:2::/64");
    expect(ipBucket("2001:db8::1")).toBe("2001:db8:0:0::/64");
  });
});

describe("audioFormat", () => {
  const pad = (b: number[]) => new Uint8Array([...b, ...Array(16).fill(0)]);
  const ascii = (s: string) => [...s].map(c => c.charCodeAt(0));
  it("aceita webm, mp4, ogg e wav", () => {
    expect(audioFormat(pad([0x1a, 0x45, 0xdf, 0xa3]))).toBe("matroska");
    expect(audioFormat(pad([0, 0, 0, 0x20, ...ascii("ftypM4A ")]))).toBe("mov");
    expect(audioFormat(pad(ascii("OggS")))).toBe("ogg");
    expect(audioFormat(pad([...ascii("RIFF"), 0, 0, 0, 0, ...ascii("WAVE")]))).toBe("wav");
  });
  it("recusa ffconcat e playlist", () => {
    expect(audioFormat(pad(ascii("ffconcat version 1.0\nfile /etc/passwd")))).toBeNull();
    expect(audioFormat(pad(ascii("#EXTM3U\n")))).toBeNull();
  });
});

describe("fuso de Brasília", () => {
  it("offset via Intl", () => expect(tzOffset(new Date("2026-11-10T12:00:00Z"))).toBe("-03:00"));
  it("início do dia local", () => expect(startOfLocalDay(new Date("2026-11-11T02:00:00Z")).toISOString()).toBe("2026-11-10T03:00:00.000Z"));
});
