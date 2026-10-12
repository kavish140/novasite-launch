begin;
alter table public.payment_intents add column reconciliation_state text not null default 'pending'
  check (reconciliation_state in ('pending','needs_reconciliation','failed','expired','settled'));
alter table public.payment_intents add column last_checked_at timestamptz;
create index payment_intents_reconciliation_due on public.payment_intents(created_at,request_id) where status='pending';
create table public.payment_reconciliation_runs (
 id uuid primary key default gen_random_uuid(), source text not null default 'cron' check(source in ('cron','admin','retry')),
 state text not null default 'queued' check(state in ('queued','running','completed','failed')),
 started_at timestamptz not null default now(), finished_at timestamptz,
 checked integer not null default 0, errors integer not null default 0,
 alert boolean not null default false, error text, http_request_id bigint
);
create table public.payment_reconciliation_log (
 id uuid primary key default gen_random_uuid(), run_id uuid not null references public.payment_reconciliation_runs(id),
 request_id uuid not null references public.payment_intents(request_id), order_id text,
 old_state text not null, new_state text not null, error text, alert boolean not null default false,
 created_at timestamptz not null default now()
);
create index payment_reconciliation_log_order_history on public.payment_reconciliation_log(request_id,created_at desc);
create table public.payment_scheduler_auth(singleton boolean primary key default true check(singleton),token_hash text not null);
alter table public.payment_reconciliation_runs enable row level security;
alter table public.payment_reconciliation_log enable row level security;
alter table public.payment_scheduler_auth enable row level security;
revoke all on public.payment_reconciliation_runs,public.payment_reconciliation_log,public.payment_scheduler_auth from public,anon,authenticated;
grant select,insert,update on public.payment_reconciliation_runs to service_role;
grant select,insert on public.payment_reconciliation_log to service_role;
grant select on public.payment_scheduler_auth to service_role;

create function public.verify_payment_scheduler(p_token text) returns boolean language sql security invoker set search_path='' as $$
 select coalesce((select token_hash=encode(sha256(convert_to(p_token,'UTF8')),'hex') from public.payment_scheduler_auth where singleton),false);
$$;
create function public.claim_payment_reconciliation_run(p_run uuid) returns boolean language plpgsql security invoker set search_path='' as $$
begin
 update public.payment_reconciliation_runs set state='running' where id=p_run and state='queued';
 return found;
end;$$;
create function public.record_payment_reconciliation(p_run uuid,p_request uuid,p_payment text,p_status text,p_refunded integer,p_error text)
returns text language plpgsql security invoker set search_path='' as $$
declare r public.payment_intents; previous text; resulting text; flagged boolean;
begin
 if not exists(select 1 from public.payment_reconciliation_runs where id=p_run and state='running') then raise exception 'invalid_reconciliation_run'; end if;
 select * into r from public.payment_intents where request_id=p_request for update;
 if not found then raise exception 'payment_record_missing'; end if;
 previous=case when r.status='pending' then r.reconciliation_state else r.status end;
 if p_status in ('paid','refunded') then
   perform public.record_package_payment(r.order_id,p_payment,p_status,p_refunded);
 elsif p_status is distinct from 'pending' then raise exception 'invalid_reconciliation_status';
 end if;
 select * into r from public.payment_intents where request_id=p_request;
 resulting=case when r.status='pending' then 'needs_reconciliation' else r.status end;
 flagged=p_error is not null or (r.status='pending' and r.created_at<now()-interval '24 hours');
 update public.payment_intents set last_checked_at=now(),reconciliation_state=case when status='pending' then 'needs_reconciliation' else 'settled' end where request_id=p_request;
 insert into public.payment_reconciliation_log(run_id,request_id,order_id,old_state,new_state,error,alert)
 values(p_run,p_request,r.order_id,previous,resulting,p_error,flagged);
 return resulting;
end;$$;
revoke all on function public.verify_payment_scheduler(text),public.claim_payment_reconciliation_run(uuid),public.record_payment_reconciliation(uuid,uuid,text,text,integer,text) from public,anon,authenticated;
grant execute on function public.verify_payment_scheduler(text),public.claim_payment_reconciliation_run(uuid),public.record_payment_reconciliation(uuid,uuid,text,text,integer,text) to service_role;
commit;
