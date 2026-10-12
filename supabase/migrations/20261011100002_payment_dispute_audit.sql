begin;
-- Additive, record-only metadata. Existing settlement RPCs are unchanged.
alter table public.payment_webhook_events add column event_type text;
alter table public.payment_webhook_events add column dispute jsonb;
create index payment_webhook_dispute_events on public.payment_webhook_events(processed_at,id) where dispute is not null;
create function public.record_payment_dispute_event(p_event text,p_type text,p_order text,p_dispute jsonb)
returns boolean language plpgsql security invoker set search_path='' as $$
declare inserted text;
begin
 if p_type not like 'payment.dispute.%' or jsonb_typeof(p_dispute) is distinct from 'object' or octet_length(p_dispute::text)>8000 then raise exception 'invalid_dispute_event'; end if;
 insert into public.payment_webhook_events(event_id,event_type,order_id,dispute)
 values(p_event,p_type,p_order,p_dispute) on conflict(event_id) do nothing returning event_id into inserted;
 return inserted is not null;
end;$$;
revoke all on function public.record_payment_dispute_event(text,text,text,jsonb) from public,anon,authenticated;
grant execute on function public.record_payment_dispute_event(text,text,text,jsonb) to service_role;
commit;
