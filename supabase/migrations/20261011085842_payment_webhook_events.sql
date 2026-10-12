begin;
create table public.payment_webhook_events (
  id uuid primary key default gen_random_uuid(),
  event_id text not null constraint payment_webhook_events_event_id_key unique,
  order_id text,
  processed_at timestamptz not null default now(),
  check (length(event_id) between 1 and 200)
);
alter table public.payment_webhook_events enable row level security;
revoke all on public.payment_webhook_events from public, anon, authenticated;
grant select, insert on public.payment_webhook_events to service_role;

-- The event marker and settlement commit together. A failure rolls both back.
create function public.complete_payment_webhook(p_event text,p_order text,p_payment text,p_status text,p_refunded integer)
returns boolean language plpgsql security invoker set search_path='' as $$
declare inserted text;
begin
  insert into public.payment_webhook_events(event_id,order_id) values(p_event,p_order)
  on conflict(event_id) do nothing returning event_id into inserted;
  if inserted is null then return false; end if;
  if p_status is not null then
    perform public.record_package_payment(p_order,p_payment,p_status,p_refunded);
  end if;
  return true;
end;
$$;
revoke all on function public.complete_payment_webhook(text,text,text,text,integer) from public,anon,authenticated;
grant execute on function public.complete_payment_webhook(text,text,text,text,integer) to service_role;
commit;
