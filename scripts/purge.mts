// Retenção (política de privacidade): apaga leads que só fizeram o diagnóstico há mais de 12 meses
// (e a redação deles) e eventos de limite antigos. Rodar 1x por dia: `npm run db:purge`.
import postgres from "postgres";
const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL não configurada.");
const sql = postgres(url, { max: 1 });
const old = await sql`
  with gone as (
    select l.id from leads l
    where l.created_at < now() - interval '12 months'
      and not exists (select 1 from users u where u.email = l.email)
      and not exists (select 1 from submissions s where s.lead_id = l.id and s.created_at >= now() - interval '12 months')
  ), subs as (delete from submissions s using gone where s.lead_id = gone.id returning 1)
  delete from leads l using gone where l.id = gone.id returning 1`;
const ev = await sql`delete from rate_events where (key like 'diag:email:%' and created_at < now() - interval '12 months')
  or (key not like 'diag:email:%' and created_at < now() - interval '3 days') returning 1`;
await sql.end();
console.log(`Retenção: ${old.length} leads e ${ev.length} eventos apagados.`);
