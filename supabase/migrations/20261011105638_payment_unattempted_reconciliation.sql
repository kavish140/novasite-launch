begin;
-- Only the server's fresh provider fetch may report 'unattempted'.
-- Persist it as pending; retain all settlement/retry/access safeguards.
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
 elsif p_status not in ('pending','failed','expired','unattempted') or p_status is null then raise exception 'invalid_reconciliation_status';
 end if;
 select * into r from public.payment_intents where request_id=p_request;
 resulting=case when r.status<>'pending' then r.status
   when p_status in ('failed','expired') and p_error is null then p_status
   when p_status='unattempted' and p_error is null then 'pending'
   else 'needs_reconciliation' end;
 flagged=p_error is not null or (resulting in ('pending','needs_reconciliation') and r.created_at<now()-interval '24 hours');
 update public.payment_intents set last_checked_at=now(),reconciliation_state=case when status='pending' then resulting else 'settled' end where request_id=p_request;
 insert into public.payment_reconciliation_log(run_id,request_id,order_id,old_state,new_state,error,alert)
 values(p_run,p_request,r.order_id,previous,resulting,p_error,flagged);
 return resulting;
end;$$;
revoke all on function public.record_payment_reconciliation(uuid,uuid,text,text,integer,text) from public,anon,authenticated;
grant execute on function public.record_payment_reconciliation(uuid,uuid,text,text,integer,text) to service_role;
commit;
