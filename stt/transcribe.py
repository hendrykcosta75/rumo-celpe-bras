"""Transcreve um áudio em português (stdout = JSON). Uso: python transcribe.py <arquivo> <formato>
O formato vem de uma lista fechada (conferido pelos bytes iniciais no app); o ffmpeg só lê arquivo local.
O ffmpeg decodifica para PCM 16 kHz mono; o modelo recebe o array (sem depender do PyAV)."""
import json, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel

MAX_SECONDS = 180
path = sys.argv[1]
FORMATS = {"matroska", "mov", "ogg", "wav"}
fmt = sys.argv[2] if len(sys.argv) > 2 else ""
if fmt not in FORMATS:
    sys.exit("formato não permitido")
pcm = subprocess.run(
    ["ffmpeg", "-nostdin", "-v", "error", "-protocol_whitelist", "file", "-f", fmt, "-i", path, "-t", str(MAX_SECONDS), "-f", "s16le", "-ac", "1", "-ar", "16000", "-"],
    capture_output=True, check=True, timeout=60,
).stdout
audio = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768.0
model = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=2)
segments, info = model.transcribe(audio, language="pt", vad_filter=True)
text = " ".join(s.text.strip() for s in segments).strip()
print(json.dumps({"text": text, "seconds": round(len(audio) / 16000, 1)}, ensure_ascii=False))
