begin;
create table public.payment_investigations (
 id uuid primary key default gen_random_uuid(),
 identity text not null unique,
 kind text not null check(kind in ('unknown_payment','unattached_order')),
 order_id text, payment_id text, request_id uuid,
 amount bigint check(amount>=0), currency text, provider_status text,
 first_seen_at timestamptz not null default now(), last_seen_at timestamptz not null default now()
);
alter table public.payment_investigations enable row level security;
revoke all on public.payment_investigations from public,anon,authenticated;
grant select,insert,update on public.payment_investigations to service_role;
create function public.record_payment_investigation(p_kind text,p_order text,p_payment text,p_request uuid,p_amount bigint,p_currency text,p_status text,p_event text default null,p_type text default null)
returns boolean language plpgsql security invoker set search_path='' as $$
declare marker text; investigation_identity text;
begin
 if p_kind not in ('unknown_payment','unattached_order') then raise exception 'invalid_investigation'; end if;
 -- Recheck the reservation inside the write to avoid a scan/attachment race.
 if p_kind='unattached_order' and not exists(select 1 from public.payment_intents where request_id=p_request and order_id is null) then return false; end if;
 if p_event is not null then
  insert into public.payment_webhook_events(event_id,event_type,order_id) values(p_event,left(p_type,200),p_order) on conflict(event_id) do nothing returning event_id into marker;
  if marker is null then return false; end if;
 end if;
 investigation_identity=p_kind||':'||coalesce(p_payment,p_order,p_event);
 if investigation_identity is null then raise exception 'missing_reference'; end if;
 insert into public.payment_investigations(identity,kind,order_id,payment_id,request_id,amount,currency,provider_status)
 values(investigation_identity,p_kind,p_order,p_payment,p_request,p_amount,left(p_currency,20),left(p_status,200))
 on conflict(identity) do update set last_seen_at=now(),provider_status=excluded.provider_status;
 return true;
end;$$;
revoke all on function public.record_payment_investigation(text,text,text,uuid,bigint,text,text,text,text) from public,anon,authenticated;
grant execute on function public.record_payment_investigation(text,text,text,uuid,bigint,text,text,text,text) to service_role;
commit;
