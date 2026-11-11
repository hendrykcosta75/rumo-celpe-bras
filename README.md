# Rumo — AI-powered Celpe-Bras prep

A full-stack web app that helps candidates prepare for **Celpe-Bras**, the Brazilian Portuguese proficiency exam. Students write answers to original practice tasks in the real exam format and get an **estimated 0–5 score** on Inep's public grading scale, with feedback in English or Spanish in about a minute.

> Independent study tool. Not affiliated with Inep, the Brazilian Ministry of Education or the Celpe-Bras exam. Scores are estimates, not official results.

## Features

- **Sales page in English and Spanish** with a founder offer, FAQ, refund, privacy and terms pages.
- **Free diagnostic**: one essay graded by AI in exchange for an e-mail.
- **Stripe Checkout** with a limited seat counter and a signed webhook that grants access and sends a magic login link.
- **Student area**: 4 original written mock exams (video/audio prompts), a speaking drill by audio upload, a study plan and daily grading limits.
- **AI grading**: an LLM prompt built on the official holistic 0–5 parameters plus the expected answer for each task; cost per grading is computed from API `usage` and stored per submission.
- **Speech-to-text** for the speaking drill with local [faster-whisper](https://github.com/SYSTRAN/faster-whisper).
- **Owner dashboard** (`/admin`): leads, diagnostics, sales, remaining seats and the e-mail outbox.
- **Privacy by design**: no third-party trackers, rate limits stored in the database, retention job that purges old leads and events.

## Stack

Next.js 16 (App Router) · React · TypeScript · Tailwind CSS 4 · Drizzle ORM + PostgreSQL · DeepSeek API (grading) · faster-whisper (transcription) · Stripe · Vitest · GitHub Actions CI.

## Project layout

```
src/app/          routes: [lang] pages, /admin, /api (checkout, Stripe webhook, speaking)
src/lib/grading/  rubric, prompt, LLM client, cost calculation
src/content/      original mock exams and legal texts
src/db/           Drizzle schema
drizzle/          SQL migrations
scripts/          migrate, purge, calibration, media generation
stt/              faster-whisper transcription script
tests/            Vitest suites
```

## Running locally

Requirements: Node.js 22, PostgreSQL, `ffmpeg`, Python 3 (for transcription).

```bash
cp .env.example .env.local      # fill in the values
npm ci
npm run db:migrate
npm run dev                     # or: npm run build && npm start -- -p 3920
```

Transcription: `python -m venv venv && venv/bin/pip install -r stt/requirements.txt`, then point `STT_PYTHON` to the venv's python.

Without `SMTP_URL`, outgoing e-mails (magic links, results) are stored in the `/admin` outbox instead of being sent. Use Stripe **test** keys for development.

Checks (the same ones CI runs):

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

## Grading calibration

`npm run calibrate` grades real answers with official scores and reports how many land within one point of the official score (the tolerance allowed between two human graders). The sample essays come from Inep's *Caderno de Tarefas Comentadas* and are **not included** in this repository; build the JSON yourself (format documented in `scripts/calibrate.mts`) and pass it with `CALIBRATION_SAMPLES=path.json`.

## Operations notes

- The concurrent-transcription lock (`src/app/api/speaking/route.ts`) is in memory and assumes a single Next.js process; daily limits live in the database.
- Run `npm run db:purge` once a day (e.g. a systemd timer) to apply the retention policy.

## License

Code is released under the [MIT License](LICENSE).

Not covered by the MIT License:
- The Celpe-Bras grading parameters quoted in `src/lib/grading/rubric.ts` belong to Inep (*Documento Base do Exame Celpe-Bras*, 2020) and are quoted with attribution.
- Audio in `public/media` was synthesized with [Piper](https://github.com/rhasspy/piper) voices `pt_BR-faber-medium` and `pt_BR-jeff-medium`; check each voice's model card for its terms.
- "Celpe-Bras" and "Inep" are names of the Brazilian government's exam and institute, used only to describe compatibility.
