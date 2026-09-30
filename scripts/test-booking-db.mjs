// Local, isolated PostgreSQL verification. Install @electric-sql/pglite with --no-save first.
import { PGlite } from "@electric-sql/pglite";
import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";

const db = new PGlite();
const admin = "00000000-0000-4000-8000-000000000001";
await db.exec(`
  create role anon; create role authenticated; create role service_role bypassrls;
  create schema auth;
  create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);
  create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
  insert into auth.users values('${admin}','kavishganatra5@gmail.com',now());
  create table public.quote_requests(id uuid primary key default gen_random_uuid(),name text not null,email text not null,phone text,status text default 'new',created_at timestamptz default now());
  insert into public.quote_requests(name,email,phone) values('Existing lead','old@example.test','9999999999');
`);
const migration = await readFile("supabase/migrations/20260929_conversion_booking.sql", "utf8");
await db.exec(migration);
await db.exec(migration);
assert.equal((await db.query("select mobile from quote_requests where email='old@example.test'")).rows[0].mobile, "9999999999");

const quote = { submissionId: "00000000-0000-4000-8000-000000000002", name: "Buyer", email: "buyer@example.test", phone: "9999999999", businessName: "Business", projectType: "Business Website", requirements: "", budget: "Rs. 15,000 - 30,000", timeline: "Normal (2-4 weeks)", source: "website", attribution: {} };
await db.exec("set role service_role");
const saveQuote = q => db.query("select accept_website_quote($1::jsonb)", [JSON.stringify(q)]);
await saveQuote(quote); await saveQuote(quote);
assert.equal((await db.query("select count(*)::int as n from quote_requests where submission_id is not null")).rows[0].n, 1);
assert.equal((await db.query("select count(*)::int as n from lead_notifications where kind='quote'")).rows[0].n, 1);
await assert.rejects(saveQuote({ ...quote, name: "Changed payload" }), /submission_conflict/);

const event = { event_id: "event-1", version: "v1", google_updated_at: "2026-09-29T08:00:00Z", status: "scheduled", attendee_name: "Buyer", attendee_email: "buyer@example.test", starts_at: "2026-10-01T10:00:00+05:30", ends_at: "2026-10-01T10:15:00+05:30", meet_url: null };
const sync = e => db.query("select sync_call_bookings($1,$2::jsonb)", ["owner@example.test", JSON.stringify([e])]);
await sync(event); await sync(event);
assert.equal((await db.query("select count(*)::int as n from call_bookings")).rows[0].n, 1);
assert.equal((await db.query("select count(*)::int as n from lead_notifications where booking_id is not null")).rows[0].n, 1);
await sync({ ...event, version: "v2", google_updated_at: "2026-09-29T08:01:00Z", meet_url: "https://meet.google.com/abc-defg-hij" });
await sync({ ...event, version: "v3", google_updated_at: "2026-09-29T08:02:00Z", starts_at: "2026-10-02T10:00:00+05:30", ends_at: "2026-10-02T10:15:00+05:30" });
await sync({ event_id: "event-1", version: "v4", google_updated_at: "2026-09-29T08:03:00Z", status: "cancelled" });
await sync(event); // A stale retry must not resurrect a cancelled call.
assert.equal((await db.query("select status from call_bookings")).rows[0].status, "cancelled");
assert.equal((await db.query("select count(*)::int as n from lead_notifications where booking_id is not null")).rows[0].n, 4);
await sync({ event_id: "unknown", version: "v1", google_updated_at: "2026-09-29T08:04:00Z", status: "cancelled" });
assert.equal((await db.query("select count(*)::int as n from call_bookings")).rows[0].n, 1);

const notice = (await db.query("select id from lead_notifications limit 1")).rows[0].id;
await db.query("select ack_lead_notification($1,false,'temporary error')", [notice]);
assert.equal((await db.query("select attempts from lead_notifications where id=$1", [notice])).rows[0].attempts, 1);
await db.query("select ack_lead_notification($1,true,null)", [notice]);
await db.query("select ack_lead_notification($1,false,'late retry')", [notice]);
assert.ok((await db.query("select sent_at from lead_notifications where id=$1", [notice])).rows[0].sent_at);
assert.equal((await db.query("select consume_calendar_nonce('test-nonce') as ok")).rows[0].ok, true);
assert.equal((await db.query("select consume_calendar_nonce('test-nonce') as ok")).rows[0].ok, false);

await db.exec("reset role; set role anon");
await assert.rejects(db.query("select * from call_bookings"), /permission denied/);
await assert.rejects(db.query("select * from lead_notifications"), /permission denied/);
await assert.rejects(db.query("select accept_website_quote('{}')"), /permission denied/);
assert.equal((await db.query("select enabled from booking_settings")).rows[0].enabled, false);
await db.exec("reset role; set role authenticated");
assert.equal((await db.query("select * from call_bookings")).rows.length, 0);
assert.equal((await db.query("update booking_settings set enabled=false returning id")).rows.length, 0);
await db.query("select set_config('request.jwt.claim.sub',$1,false)", [admin]);
assert.equal((await db.query("select * from call_bookings")).rows.length, 1);
await assert.rejects(db.query("select payload from lead_notifications"), /permission denied/);
await assert.rejects(db.query("delete from call_bookings"), /permission denied/);
await db.query("update booking_settings set enabled=true,booking_url='https://calendar.google.com/calendar/appointments/schedules/test123'");
console.log("PASS: migration rerun, legacy backfill, quote idempotency/conflicts, booking deduplication/rescheduling/cancellation, stale events, notification retries, replay protection and RLS.");
await db.close();
