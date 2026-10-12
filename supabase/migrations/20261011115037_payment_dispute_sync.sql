begin;
-- Minimal current provider snapshots; evidence/customer details are never persisted.
create table public.payment_dispute_snapshots (
 id text primary key,
 event_id text not null references public.payment_webhook_events(event_id),
 dispute jsonb not null check(jsonb_typeof(dispute)='object'),
 observed_at timestamptz not null
);
alter table public.payment_dispute_snapshots enable row level security;
revoke all on public.payment_dispute_snapshots from public,anon,authenticated;
grant select,insert,update on public.payment_dispute_snapshots to service_role;
commit;
