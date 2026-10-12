begin;
create table public.payment_dispute_acknowledgements (
 dispute_id text primary key,
 event_id text not null references public.payment_webhook_events(event_id),
 acknowledged_at timestamptz not null default now(), acknowledged_by uuid not null
);
alter table public.payment_dispute_acknowledgements enable row level security;
revoke all on public.payment_dispute_acknowledgements from public,anon,authenticated;
grant select,insert,update on public.payment_dispute_acknowledgements to service_role;
commit;
