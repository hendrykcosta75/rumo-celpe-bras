import { boolean, index, integer, jsonb, pgEnum, pgTable, real, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const langEnum = pgEnum("lang", ["en", "es"]);
export const submissionKindEnum = pgEnum("submission_kind", ["diagnostic", "exam", "speaking"]);
export const purchaseStatusEnum = pgEnum("purchase_status", ["paid", "refunded"]);

const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();

/** E-mails captados no diagnóstico grátis. */
export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** Sempre em minúsculas. */
  email: text("email").notNull().unique(),
  lang: langEnum("lang").notNull(),
  /** Língua materna informada (opcional), para medir o público. */
  nativeLanguage: text("native_language"),
  /** Texto livre quando a língua materna é "other". */
  nativeLanguageOther: text("native_language_other"),
  consentAt: timestamp("consent_at", { withTimezone: true }).notNull(),
  source: text("source").notNull().default("diagnostic"),
  createdAt: createdAt(),
});

/** Alunos com acesso (compradores). */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** Sempre em minúsculas. */
  email: text("email").notNull().unique(),
  lang: langEnum("lang").notNull().default("en"),
  examDate: text("exam_date"),
  sessionVersion: integer("session_version").notNull().default(0),
  createdAt: createdAt(),
});

/** Compras confirmadas pelo webhook do Stripe. Fonte do contador de vagas. */
export const purchases = pgTable("purchases", {
  id: uuid("id").primaryKey().defaultRandom(),
  stripeSessionId: text("stripe_session_id").notNull().unique(),
  paymentIntent: text("payment_intent"),
  email: text("email").notNull(),
  amountCents: integer("amount_cents").notNull(),
  currency: text("currency").notNull(),
  livemode: boolean("livemode").notNull(),
  status: purchaseStatusEnum("status").notNull().default("paid"),
  userId: uuid("user_id").references(() => users.id),
  createdAt: createdAt(),
});

/** Link mágico: só o hash do token fica salvo. */
export const magicLinks = pgTable("magic_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  tokenHash: text("token_hash").notNull().unique(),
  email: text("email").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: createdAt(),
});

/** Cada correção (diagnóstico, simulado ou fala), com custo e latência da IA. */
export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  kind: submissionKindEnum("kind").notNull(),
  userId: uuid("user_id").references(() => users.id),
  leadId: uuid("lead_id").references(() => leads.id),
  examId: text("exam_id"),
  taskId: text("task_id"),
  text: text("text").notNull(),
  score: integer("score"),
  feedback: jsonb("feedback"),
  model: text("model"),
  inputTokens: integer("input_tokens"),
  cachedTokens: integer("cached_tokens"),
  outputTokens: integer("output_tokens"),
  costUsd: real("cost_usd"),
  latencyMs: integer("latency_ms"),
  createdAt: createdAt(),
}, t => [index("submissions_user_idx").on(t.userId, t.createdAt), index("submissions_kind_idx").on(t.kind, t.createdAt)]);

/** E-mails do sistema. Sem SMTP configurado, ficam aqui e aparecem no painel do dono. */
export const outbox = pgTable("outbox", {
  id: uuid("id").primaryKey().defaultRandom(),
  to: text("to").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  sentViaSmtp: boolean("sent_via_smtp").notNull().default(false),
  error: text("error"),
  createdAt: createdAt(),
});

/** Eventos para limites (por IP, por e-mail, por usuário). */
export const rateEvents = pgTable("rate_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull(),
  createdAt: createdAt(),
}, t => [index("rate_events_key_idx").on(t.key, t.createdAt)]);
