begin;
create extension if not exists pg_net with schema extensions;
-- Generate the scheduler credential inside PostgreSQL. It is never returned.
do $$
declare token text; secret_id uuid;
begin
 token=encode(extensions.gen_random_bytes(32),'hex');
 select vault.create_secret(token,'sitenova_payment_scheduler','Payment reconciliation scheduler only') into secret_id;
 insert into public.payment_scheduler_auth(singleton,token_hash) values(true,encode(sha256(convert_to(token,'UTF8')),'hex'));
end;$$;

create function public.enqueue_payment_reconciliation() returns uuid language plpgsql security invoker set search_path='' as $$
declare run uuid; http_id bigint;
begin
 perform pg_advisory_xact_lock(hashtextextended('sitenova-payment-reconciliation',0));
 -- Database watchdog also runs when the Edge Function is unavailable.
 update public.payment_reconciliation_runs set state='failed',alert=true,error='Scheduled function did not complete within 15 minutes.',finished_at=now()
 where state in ('queued','running') and started_at<now()-interval '15 minutes';
 if exists(select 1 from public.payment_reconciliation_runs where source='cron' and state in ('queued','running')) then return null; end if;
 insert into public.payment_reconciliation_runs default values returning id into run;
 insert into public.payment_reconciliation_log(run_id,request_id,order_id,old_state,new_state,error,alert)
 select run,request_id,order_id,reconciliation_state,reconciliation_state,'Order unresolved for over 24 hours.',true
 from public.payment_intents where status='pending' and created_at<now()-interval '24 hours';
 begin
   select net.http_post(
     url:='https://bklmtwblsoitafynpikc.supabase.co/functions/v1/razorpay-reconcile',
     headers:=jsonb_build_object('Content-Type','application/json','x-payment-scheduler-token',(select decrypted_secret from vault.decrypted_secrets where name='sitenova_payment_scheduler')),
     body:=jsonb_build_object('runId',run),timeout_milliseconds:=150000
   ) into http_id;
   update public.payment_reconciliation_runs set http_request_id=http_id where id=run;
 exception when others then
   update public.payment_reconciliation_runs set state='failed',alert=true,error='Unable to dispatch scheduled reconciliation.',finished_at=now() where id=run;
 end;
 return run;
end;$$;
-- Only the database scheduler/operator may enqueue; no browser or service RPC.
revoke all on function public.enqueue_payment_reconciliation() from public,anon,authenticated,service_role;
select cron.schedule('sitenova-payment-reconciliation','*/10 * * * *','select public.enqueue_payment_reconciliation();');
commit;
