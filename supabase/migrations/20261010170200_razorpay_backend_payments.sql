-- Server-only payment ledger. No customer/browser role can read or mutate it.
begin;
create table if not exists public.payment_intents (
  request_id uuid primary key,
  payload_hash text not null,
  dedupe_hash text not null unique,
  package text not null check (package in ('starter','business')),
  amount integer not null check ((package='starter' and amount=500000) or (package='business' and amount=750000)),
  key_id text not null,
  customer jsonb not null,
  terms_version text not null,
  order_id text unique,
  payment_id text unique,
  status text not null default 'pending' check (status in ('pending','paid','refunded')),
  refunded_amount integer not null default 0 check (refunded_amount >= 0 and refunded_amount <= amount),
  created_at timestamptz not null default now(),
  verified_at timestamptz
);
alter table public.payment_intents enable row level security;
revoke all on public.payment_intents from public, anon, authenticated;
grant select, insert, update on public.payment_intents to service_role;

create or replace function public.record_package_payment(p_order text,p_payment text,p_status text,p_refunded integer)
returns void language plpgsql security invoker set search_path = '' as $$
begin
  if p_status not in ('paid','refunded') then raise exception 'invalid_payment_status'; end if;
  update public.payment_intents set
    payment_id=p_payment,
    status=case when status='refunded' or p_status='refunded' then 'refunded' else 'paid' end,
    refunded_amount=greatest(refunded_amount,p_refunded), verified_at=now()
  where order_id=p_order and (payment_id is null or payment_id=p_payment);
  if not found then raise exception 'payment_record_missing_or_conflicting'; end if;
end;
$$;
revoke all on function public.record_package_payment(text,text,text,integer) from public,anon,authenticated;
grant execute on function public.record_package_payment(text,text,text,integer) to service_role;
commit;
