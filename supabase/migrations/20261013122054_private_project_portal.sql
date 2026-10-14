begin;
create table public.client_projects (
 id uuid primary key default gen_random_uuid(), advance_request uuid not null unique references public.payment_intents(request_id),
 share_id uuid not null default gen_random_uuid(), link_enabled boolean not null default true,
 title text not null check(length(title) between 2 and 120),
 stage text not null default 'queued' check(stage in ('queued','discovery','design','development','review','ready','launched','on_hold')),
 customer_update text not null default '' check(length(customer_update)<=1200),
 total_amount integer check(total_amount between 100 and 100000000), balance_enabled boolean not null default false,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.project_balance_payments (
 id uuid primary key default gen_random_uuid(), project_id uuid not null references public.client_projects(id),
 review_required boolean not null default false, active boolean not null default true, retry_parent uuid unique references public.project_balance_payments(id),
 amount integer not null check(amount between 100 and 100000000), key_id text not null,
 order_id text unique, payment_id text unique,
 status text not null default 'reserved' check(status in ('reserved','pending','needs_reconciliation','failed','expired','paid','refunded')),
 refunded_amount integer not null default 0 check(refunded_amount>=0 and refunded_amount<=amount),
 created_at timestamptz not null default now(), paid_at timestamptz, last_checked_at timestamptz, acknowledged_at timestamptz
);
create unique index project_one_active_balance on public.project_balance_payments(project_id) where active;
create table public.project_payment_history (
 id uuid primary key default gen_random_uuid(), project_id uuid not null references public.client_projects(id),
 balance_id uuid not null references public.project_balance_payments(id), order_id text not null,
 source text not null check(source in ('customer','webhook','cron','admin')), old_state text not null, new_state text not null,
 error text, created_at timestamptz not null default now()
);
create index project_recent on public.client_projects(updated_at desc,id);
create index project_balance_project_recent on public.project_balance_payments(project_id,created_at,id);
create index project_history_balance on public.project_payment_history(balance_id);
create index project_history_recent on public.project_payment_history(project_id,created_at desc);
alter table public.client_projects enable row level security;
alter table public.project_balance_payments enable row level security;
alter table public.project_payment_history enable row level security;
revoke all on public.client_projects,public.project_balance_payments,public.project_payment_history from public,anon,authenticated;
revoke delete on public.client_projects,public.project_balance_payments,public.project_payment_history from service_role;
grant select,insert,update on public.client_projects,public.project_balance_payments,public.project_payment_history to service_role;

create function public.save_client_project(p_request uuid,p_title text,p_stage text,p_update text,p_total integer,p_enabled boolean,p_link boolean,p_rotate boolean default false,p_existing uuid default null,p_version timestamptz default null)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare advance public.payment_intents; project public.client_projects;
begin
 select * into advance from public.payment_intents where request_id=p_request for update;
 if not found or advance.status not in ('paid','refunded') then raise exception 'verified_advance_required'; end if;
 if p_total is not null and p_total<advance.amount then raise exception 'total_below_advance'; end if;
 select * into project from public.client_projects where advance_request=p_request for update;
 if found and p_existing is null then raise exception 'project_already_exists'; end if;
 if p_existing is not null and (project.id is distinct from p_existing or project.updated_at is distinct from p_version) then raise exception 'project_changed_reload'; end if;
 if found and p_total is distinct from project.total_amount and exists(select 1 from public.project_balance_payments where project_id=project.id) then raise exception 'balance_amount_locked'; end if;
 insert into public.client_projects(advance_request,title,stage,customer_update,total_amount,balance_enabled,link_enabled)
 values(p_request,p_title,p_stage,p_update,p_total,p_enabled,p_link)
 on conflict(advance_request) do update set title=p_title,stage=p_stage,customer_update=p_update,total_amount=p_total,
 balance_enabled=p_enabled,link_enabled=p_link,share_id=case when p_rotate then gen_random_uuid() else client_projects.share_id end,updated_at=now()
 returning * into project;
 return to_jsonb(project);
end;$$;
create function public.reserve_project_balance(p_project uuid,p_key text,p_share uuid,p_total integer,p_retry uuid default null) returns jsonb language plpgsql security invoker set search_path='' as $$
declare project public.client_projects; advance public.payment_intents; balance public.project_balance_payments; created boolean=false; due integer; prior public.project_balance_payments;
begin
 select * into project from public.client_projects where id=p_project for update;
 if found and (project.share_id is distinct from p_share or project.total_amount is distinct from p_total) then raise exception 'project_changed_reload'; end if;
 if not found or not project.link_enabled or not project.balance_enabled or project.total_amount is null then raise exception 'balance_not_released'; end if;
 select * into advance from public.payment_intents where request_id=project.advance_request;
 if advance.status<>'paid' or advance.refunded_amount>0 or advance.key_id is distinct from p_key then raise exception 'advance_needs_review'; end if;
 due=project.total_amount-advance.amount;
 if due<100 then raise exception 'no_balance_due'; end if;
 select * into balance from public.project_balance_payments where project_id=p_project and active;
 if p_retry is not null then
  select * into prior from public.project_balance_payments where id=p_retry and project_id=p_project for update;
  if not found then raise exception 'balance_conflict'; end if;
  -- One successor per declined attempt. Repeated clicks return that same successor.
  if not prior.active then
   select * into balance from public.project_balance_payments where retry_parent=p_retry;
   if not found or not balance.active then raise exception 'balance_conflict'; end if;
   return jsonb_build_object('created',false,'record',to_jsonb(balance));
  end if;
  if prior.status not in ('failed','expired') or prior.payment_id is not null or prior.last_checked_at is null or prior.last_checked_at<clock_timestamp()-interval '1 minute'
   or exists(select 1 from public.project_balance_payments where project_id=p_project and status not in ('failed','expired') and id<>p_retry)
   or (select count(*) from public.project_balance_payments where project_id=p_project)>=10 then raise exception 'balance_not_authorized'; end if;
  update public.project_balance_payments set active=false where id=p_retry;
  insert into public.project_balance_payments(project_id,amount,key_id,retry_parent) values(p_project,due,p_key,p_retry) returning * into balance; created=true;
 elsif balance.id is null then
  insert into public.project_balance_payments(project_id,amount,key_id) values(p_project,due,p_key) returning * into balance; created=true;
 end if;
 if balance.amount<>due or balance.key_id is distinct from p_key then raise exception 'balance_conflict'; end if;
 return jsonb_build_object('created',created,'record',to_jsonb(balance));
end;$$;
create function public.authorize_project_balance(p_project uuid,p_share uuid,p_key text,p_balance uuid default null) returns boolean language plpgsql security invoker set search_path='' as $$
declare project public.client_projects; advance public.payment_intents; balance public.project_balance_payments;
begin
 -- Use the same advance-before-project lock order as project edits.
 select * into advance from public.payment_intents where request_id=(select advance_request from public.client_projects where id=p_project) for update;
 select * into project from public.client_projects where id=p_project for update;
 if not found or not project.link_enabled or not project.balance_enabled or project.share_id is distinct from p_share then raise exception 'project_changed_reload'; end if;
 select * into balance from public.project_balance_payments where project_id=p_project and active for update;
 if not found or balance.id is distinct from p_balance or balance.review_required or balance.order_id is null or balance.status<>'pending' or balance.payment_id is not null or balance.key_id is distinct from p_key or balance.created_at<=now()-interval '24 hours'
 or exists(select 1 from public.project_balance_payments where project_id=p_project and not active and status not in ('failed','expired'))
 or advance.status<>'paid' or advance.refunded_amount>0 or advance.key_id is distinct from p_key or project.total_amount is null or balance.amount<>project.total_amount-advance.amount then raise exception 'balance_not_authorized'; end if;
 return true;
end;$$;
create function public.due_project_balances(p_checkpoint timestamptz) returns setof public.project_balance_payments language sql security invoker set search_path='' as $$
 select * from public.project_balance_payments
 where order_id is not null and (last_checked_at is null or last_checked_at<p_checkpoint)
 and (((status in ('pending','needs_reconciliation') or (status in ('failed','expired') and created_at>=now()-interval '30 days')) and created_at<now()-interval '15 minutes') or (status in ('paid','refunded') and paid_at>=now()-interval '30 days'))
 order by last_checked_at asc nulls first,id limit 50;
$$;
create function public.project_reconciliation_clock() returns timestamptz language sql security invoker set search_path='' as $$ select clock_timestamp(); $$;
create index project_balance_check_age on public.project_balance_payments(last_checked_at,id);
create function public.record_project_balance(p_order text,p_payment text,p_status text,p_refunded integer,p_source text,p_event text default null,p_error text default null)
returns boolean language plpgsql security invoker set search_path='' as $$
declare balance public.project_balance_payments; old text;
begin
 perform 1 from public.client_projects where id=(select project_id from public.project_balance_payments where order_id=p_order) for update;
 select * into balance from public.project_balance_payments where order_id=p_order for update;
 if not found then raise exception 'unknown_balance_order'; end if;
 if p_status is null or p_refunded is null or p_status not in ('pending','needs_reconciliation','failed','expired','paid','refunded') or p_refunded<0 or p_refunded>balance.amount then raise exception 'invalid_balance_state'; end if;
 if p_status in ('paid','refunded') and p_payment is null then raise exception 'payment_required'; end if;
 if balance.payment_id is not null and p_payment is not null and balance.payment_id<>p_payment then raise exception 'conflicting_payment'; end if;
 if p_event is not null then
  insert into public.payment_webhook_events(event_id,order_id) values(p_event,p_order) on conflict(event_id) do nothing;
  if not found then return false; end if;
 end if;
 old=balance.status;
 update public.project_balance_payments set
 status=case when status='refunded' or p_status='refunded' then 'refunded' when status='paid' then 'paid' else p_status end,
 review_required=(p_error is not null or p_status='needs_reconciliation' or (active and p_status in ('failed','expired') and (select count(*) from public.project_balance_payments b where b.project_id=balance.project_id)>=10)),payment_id=coalesce(payment_id,p_payment),refunded_amount=greatest(refunded_amount,p_refunded),
 paid_at=case when p_status in ('paid','refunded') then coalesce(paid_at,now()) else paid_at end,last_checked_at=now()
 where id=balance.id returning * into balance;
 insert into public.project_payment_history(project_id,balance_id,order_id,source,old_state,new_state,error) values(balance.project_id,balance.id,p_order,p_source,old,balance.status,p_error);
 return true;
end;$$;
revoke all on function public.save_client_project(uuid,text,text,text,integer,boolean,boolean,boolean,uuid,timestamptz),public.reserve_project_balance(uuid,text,uuid,integer,uuid),public.authorize_project_balance(uuid,uuid,text,uuid),public.due_project_balances(timestamptz),public.project_reconciliation_clock(),public.record_project_balance(text,text,text,integer,text,text,text) from public,anon,authenticated;
grant execute on function public.save_client_project(uuid,text,text,text,integer,boolean,boolean,boolean,uuid,timestamptz),public.reserve_project_balance(uuid,text,uuid,integer,uuid),public.authorize_project_balance(uuid,uuid,text,uuid),public.due_project_balances(timestamptz),public.project_reconciliation_clock(),public.record_project_balance(text,text,text,integer,text,text,text) to service_role;
commit;
