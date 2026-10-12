begin;
-- Sidecar metadata only; existing checkout and settlement functions are unchanged.
create table public.payment_order_operations (
 request_id uuid primary key references public.payment_intents(request_id),
 paid_at timestamptz not null,
 acknowledged_at timestamptz,
 acknowledged_by uuid,
 receipt_id uuid not null default gen_random_uuid() unique
);
alter table public.payment_order_operations enable row level security;
revoke all on public.payment_order_operations from public,anon,authenticated;
grant select,insert,update on public.payment_order_operations to service_role;
create function public.observe_payment_operations() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 if new.status in ('paid','refunded') then
  insert into public.payment_order_operations(request_id,paid_at) values(new.request_id,coalesce(new.verified_at,now())) on conflict(request_id) do nothing;
 end if;
 return new;
end;$$;
revoke all on function public.observe_payment_operations() from public,anon,authenticated;
grant execute on function public.observe_payment_operations() to service_role;
create trigger payment_operations_observer after insert or update of status on public.payment_intents for each row execute function public.observe_payment_operations();
insert into public.payment_order_operations(request_id,paid_at) select request_id,coalesce(verified_at,created_at) from public.payment_intents where status in ('paid','refunded') on conflict do nothing;
create index payment_operations_paid_time on public.payment_order_operations(paid_at desc,request_id);
commit;
