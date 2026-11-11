/** Formato do áudio pelos bytes iniciais, numa lista fechada. Outra coisa (ffconcat, playlist…) é recusada. */
export function audioFormat(b: Uint8Array): "matroska" | "mov" | "ogg" | "wav" | null {
  if (b.length < 12) return null;
  if (b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3) return "matroska"; // webm/mkv (Chrome, Firefox)
  const ascii = (i: number, n: number) => String.fromCharCode(...b.subarray(i, i + n));
  if (ascii(4, 4) === "ftyp") return "mov"; // mp4/m4a (Safari)
  if (ascii(0, 4) === "OggS") return "ogg";
  if (ascii(0, 4) === "RIFF" && ascii(8, 4) === "WAVE") return "wav";
  return null;
}
