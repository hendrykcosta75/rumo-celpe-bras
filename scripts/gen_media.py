"""Gera o áudio (T2) e o 'vídeo' (T1: slides narrados) dos simulados, com vozes Piper pt-BR e ffmpeg.
Uso: python gen_media.py spec.json voices_dir out_dir"""
import json, re, subprocess, sys, tempfile, textwrap, wave
from pathlib import Path
from piper import PiperVoice

spec = json.load(open(sys.argv[1])); vdir = Path(sys.argv[2]); out = Path(sys.argv[3])
voices = [PiperVoice.load(str(vdir / "pt_BR-faber-medium.onnx")), PiperVoice.load(str(vdir / "pt_BR-jeff-medium.onnx"))]
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_B = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

def synth(text: str, voice: PiperVoice, path: Path):
    with wave.open(str(path), "wb") as w:
        voice.synthesize_wav(text, w)

def turns(text: str):
    """Divide 'Nome: fala' em turnos; sem rótulos, é um narrador só."""
    parts = re.split(r"(?:^|\s)([A-ZÁÉÍÓÚÂÊÔÃÕ][a-záéíóúâêôãõç]+):\s", text)
    if len(parts) < 3: return [("narrador", text)]
    return [(parts[i], parts[i + 1].strip()) for i in range(1, len(parts) - 1, 2)]

def duration(path: Path) -> float:
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)], capture_output=True, text=True, check=True)
    return float(r.stdout.strip())

for item in spec:
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp); speakers = {}; wavs = []
        for i, (who, said) in enumerate(turns(item["text"])):
            v = speakers.setdefault(who, len(speakers) % 2)
            p = tmp / f"{i:02d}.wav"; synth(said, voices[v], p); wavs.append(p)
            sil = tmp / f"{i:02d}s.wav"
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=22050:cl=mono", "-t", "0.45", str(sil)], check=True); wavs.append(sil)
        lst = tmp / "list.txt"; lst.write_text("".join(f"file '{w}'\n" for w in wavs))
        mp3 = out / f"{item['id']}.mp3"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-ac", "1", "-b:a", "64k", str(mp3)], check=True)
        if item["kind"] == "video":
            total = duration(mp3)
            sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", item["text"]) if s.strip()]
            groups = [" ".join(sentences[i:i + 2]) for i in range(0, len(sentences), 2)]
            per = total / len(groups); imgs = []
            for j, g in enumerate(groups):
                # Só o título e o andamento: o conteúdo é para ouvir, não ler (como no vídeo da prova).
                body = tmp / f"b{j}.txt"; body.write_text(f"Reportagem  ·  parte {j + 1} de {len(groups)}")
                title = tmp / f"t{j}.txt"; title.write_text(item["title"])
                png = tmp / f"s{j}.png"
                vf = (f"drawtext=fontfile={FONT_B}:textfile={title}:fontcolor=0x1d3a2f:fontsize=64:x=80:y=(h/2)-90,"
                      f"drawtext=fontfile={FONT}:textfile={body}:fontcolor=0x5b6b63:fontsize=30:x=80:y=(h/2)+20")
                subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "color=c=0xf4efe4:s=1280x720", "-frames:v", "1", "-vf", vf, str(png)], check=True)
                imgs.append((png, per))
            vl = tmp / "v.txt"; vl.write_text("".join(f"file '{p}'\nduration {d:.3f}\n" for p, d in imgs) + f"file '{imgs[-1][0]}'\n")
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(vl), "-i", str(mp3), "-c:v", "libx264", "-tune", "stillimage", "-pix_fmt", "yuv420p", "-r", "10", "-c:a", "aac", "-b:a", "64k", "-shortest", "-movflags", "+faststart", str(out / f"{item['id']}.mp4")], check=True)
            mp3.unlink()
        print(item["id"], "ok")
