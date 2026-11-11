import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const g = globalThis as unknown as { sql?: ReturnType<typeof postgres> };
function connection() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não configurada.");
  g.sql ??= postgres(url, { max: 10 });
  return g.sql;
}
export const db = drizzle(connection(), { schema });
