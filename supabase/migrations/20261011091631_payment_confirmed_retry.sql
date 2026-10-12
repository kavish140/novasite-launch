begin;
alter table public.payment_intents add column retry_parent uuid unique references public.payment_intents(request_id);
alter table public.payment_intents add column retry_reserved_at timestamptz;
create or replace function public.record_payment_reconciliation(p_run uuid,p_request uuid,p_payment text,p_status text,p_refunded integer,p_error text)
returns text language plpgsql security invoker set search_path='' as $$
declare r public.payment_intents; previous text; resulting text; flagged boolean;
begin
 if not exists(select 1 from public.payment_reconciliation_runs where id=p_run and state='running') then raise exception 'invalid_reconciliation_run'; end if;
 select * into r from public.payment_intents where request_id=p_request for update;
 if not found then raise exception 'payment_record_missing'; end if;
 previous=case when r.status='pending' then r.reconciliation_state else r.status end;
 if p_status in ('paid','refunded') then
   perform public.record_package_payment(r.order_id,p_payment,p_status,p_refunded);
 elsif p_status not in ('pending','failed','expired') or p_status is null then raise exception 'invalid_reconciliation_status';
 end if;
 select * into r from public.payment_intents where request_id=p_request;
 resulting=case when r.status<>'pending' then r.status when p_status in ('failed','expired') and p_error is null then p_status else 'needs_reconciliation' end;
 flagged=p_error is not null or (resulting='needs_reconciliation' and r.created_at<now()-interval '24 hours');
 update public.payment_intents set last_checked_at=now(),reconciliation_state=case when status='pending' then resulting else 'settled' end where request_id=p_request;
 insert into public.payment_reconciliation_log(run_id,request_id,order_id,old_state,new_state,error,alert)
 values(p_run,p_request,r.order_id,previous,resulting,p_error,flagged);
 return resulting;
end;$$;
create function public.reserve_payment_retry(p_parent uuid,p_record jsonb) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare parent public.payment_intents; child public.payment_intents;
begin
 select * into parent from public.payment_intents where request_id=p_parent for update;
 if not found or parent.status<>'pending' or parent.reconciliation_state not in ('failed','expired')
 or parent.last_checked_at is null or parent.last_checked_at<now()-interval '1 minute' then raise exception 'retry_not_verified'; end if;
 if parent.package='test' then raise exception 'invalid_retry_channel'; end if;
 select * into child from public.payment_intents where retry_parent=p_parent;
 if found then
   if child.request_id<>(p_record->>'request_id')::uuid or child.payload_hash<>p_record->>'payload_hash' then raise exception 'retry_already_reserved'; end if;
   return jsonb_build_object('created',false,'record',to_jsonb(child));
 end if;
 if p_record->>'package'<>parent.package or (p_record->>'amount')::integer<>parent.amount
 or p_record->>'key_id'<>parent.key_id or p_record->'customer'<>parent.customer then raise exception 'retry_details_mismatch'; end if;
 insert into public.payment_intents(request_id,payload_hash,dedupe_hash,package,amount,key_id,customer,terms_version,retry_parent)
 values((p_record->>'request_id')::uuid,p_record->>'payload_hash',p_record->>'dedupe_hash',parent.package,parent.amount,parent.key_id,parent.customer,parent.terms_version,p_parent)
 returning * into child;
 update public.payment_intents set retry_reserved_at=now() where request_id=p_parent;
 return jsonb_build_object('created',true,'record',to_jsonb(child));
end;$$;
revoke all on function public.reserve_payment_retry(uuid,jsonb) from public,anon,authenticated;
grant execute on function public.reserve_payment_retry(uuid,jsonb) to service_role;
commit;
