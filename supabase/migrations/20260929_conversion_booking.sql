-- SiteNova: run this entire file in the Supabase SQL Editor before deploying.
-- Additive migration; preserves existing quotes. It does not change ad accounts.
begin;

create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.site_admins enable row level security;
revoke all on public.site_admins from anon, authenticated;
-- Seed only the existing, confirmed owner's account. No public signup grants admin access.
insert into public.site_admins(user_id)
select id from auth.users where lower(email) = 'kavishganatra5@gmail.com' and email_confirmed_at is not null
on conflict do nothing;

create or replace function public.is_site_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.site_admins where user_id = auth.uid());
$$;
revoke all on function public.is_site_admin() from public;
grant execute on function public.is_site_admin() to authenticated;

create table if not exists public.booking_settings (
  id boolean primary key default true check (id),
  enabled boolean not null default false,
  booking_url text not null default '',
  check (not enabled or booking_url ~ '^https://calendar\.google\.com/calendar/(u/[0-9]+/)?appointments/schedules/[A-Za-z0-9_-]+/?([?][^#]*)?(#.*)?$')
);
insert into public.booking_settings(id) values (true) on conflict do nothing;
alter table public.booking_settings enable row level security;
drop policy if exists booking_settings_read on public.booking_settings;
create policy booking_settings_read on public.booking_settings for select to anon, authenticated using (true);
drop policy if exists booking_settings_admin on public.booking_settings;
create policy booking_settings_admin on public.booking_settings for update to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
grant select on public.booking_settings to anon, authenticated;
grant update on public.booking_settings to authenticated;

create table if not exists public.call_bookings (
  id uuid primary key default gen_random_uuid(),
  calendar_id text not null, event_id text not null, version text not null,
  google_updated_at timestamptz not null,
  attendee_name text not null default '', attendee_email text not null,
  starts_at timestamptz not null, ends_at timestamptz not null,
  status text not null check (status in ('scheduled','cancelled')),
  meet_url text, calendar_url text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(calendar_id,event_id), check (ends_at > starts_at)
);
create index if not exists call_bookings_upcoming_idx on public.call_bookings(status,starts_at);
create index if not exists call_bookings_email_idx on public.call_bookings(lower(attendee_email));

create table if not exists public.calendar_sync_state (
  calendar_id text primary key, last_success_at timestamptz not null
);
create table if not exists public.calendar_sync_nonces (
  nonce text primary key, created_at timestamptz not null default now()
);
create index if not exists calendar_sync_nonces_created_idx on public.calendar_sync_nonces(created_at);
create table if not exists public.lead_notifications (
  id uuid primary key default gen_random_uuid(),
  dedupe_key text not null unique,
  kind text not null check (kind in ('quote','booking_created','booking_changed','booking_cancelled')),
  booking_id uuid references public.call_bookings(id),
  payload jsonb not null,
  attempts integer not null default 0, last_error text,
  created_at timestamptz not null default now(), sent_at timestamptz
);
create index if not exists lead_notifications_pending_idx on public.lead_notifications(created_at) where sent_at is null;

alter table public.call_bookings enable row level security;
alter table public.calendar_sync_state enable row level security;
alter table public.calendar_sync_nonces enable row level security;
alter table public.lead_notifications enable row level security;
revoke all on public.call_bookings, public.calendar_sync_state, public.calendar_sync_nonces, public.lead_notifications from anon, authenticated;
grant select on public.call_bookings, public.calendar_sync_state to authenticated;
grant select (id,kind,booking_id,attempts,last_error,created_at,sent_at) on public.lead_notifications to authenticated;
drop policy if exists calls_admin_read on public.call_bookings;
create policy calls_admin_read on public.call_bookings for select to authenticated using(public.is_site_admin());
drop policy if exists sync_admin_read on public.calendar_sync_state;
create policy sync_admin_read on public.calendar_sync_state for select to authenticated using(public.is_site_admin());
drop policy if exists notifications_admin_read on public.lead_notifications;
create policy notifications_admin_read on public.lead_notifications for select to authenticated using(public.is_site_admin());
grant all on public.site_admins, public.booking_settings, public.call_bookings, public.calendar_sync_state, public.calendar_sync_nonces, public.lead_notifications to service_role;

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(), name text not null, email text not null,
  status text not null default 'new', created_at timestamptz not null default now()
);
alter table public.quote_requests
  add column if not exists mobile text,
  add column if not exists phone text,
  add column if not exists business_name text,
  add column if not exists project_type text,
  add column if not exists requirements text,
  add column if not exists budget text,
  add column if not exists timeline text,
  add column if not exists source text,
  add column if not exists package_name text,
  add column if not exists attribution jsonb not null default '{}',
  add column if not exists submission_id uuid,
  add column if not exists submission_hash text;
update public.quote_requests set mobile = phone where mobile is null and phone is not null;
create unique index if not exists quote_submission_id_idx on public.quote_requests(submission_id);
alter table public.quote_requests enable row level security;
-- Quote forms now use the validated server endpoint. Leave existing authenticated policies intact.
revoke insert, update, delete, select on public.quote_requests from anon;
grant all on public.quote_requests to service_role;
grant select,update,delete on public.quote_requests to authenticated;
drop policy if exists quotes_owner_access on public.quote_requests;
create policy quotes_owner_access on public.quote_requests for all to authenticated using(public.is_site_admin()) with check(public.is_site_admin());

create or replace function public.accept_website_quote(p_quote jsonb) returns uuid
language plpgsql security invoker set search_path = '' as $$
declare v_id uuid := (p_quote->>'submissionId')::uuid; v_hash text;
  v_existing public.quote_requests;
begin
  v_hash := encode(sha256(convert_to((p_quote - 'submissionId')::text,'UTF8')),'hex');
  perform pg_advisory_xact_lock(hashtextextended(v_id::text,0));
  select * into v_existing from public.quote_requests where submission_id = v_id;
  if found then
    if v_existing.submission_hash <> v_hash then raise exception 'submission_conflict'; end if;
    return v_id;
  end if;
  insert into public.quote_requests(id,submission_id,submission_hash,name,email,mobile,phone,business_name,project_type,requirements,budget,timeline,source,package_name,attribution)
  values(v_id,v_id,v_hash,p_quote->>'name',p_quote->>'email',p_quote->>'phone',p_quote->>'phone',p_quote->>'businessName',p_quote->>'projectType',p_quote->>'requirements',p_quote->>'budget',p_quote->>'timeline',p_quote->>'source',p_quote->>'packageName',coalesce(p_quote->'attribution','{}'));
  insert into public.lead_notifications(dedupe_key,kind,payload)
  values('quote:'||v_id,'quote',p_quote - 'submissionId' - 'attribution');
  return v_id;
end;
$$;

create or replace function public.consume_calendar_nonce(p_nonce text) returns boolean
language plpgsql security invoker set search_path = '' as $$
begin
  delete from public.calendar_sync_nonces where created_at < now() - interval '10 minutes';
  insert into public.calendar_sync_nonces(nonce) values(p_nonce) on conflict do nothing;
  return found;
end;
$$;

create or replace function public.sync_call_bookings(p_calendar_id text,p_events jsonb) returns void
language plpgsql security invoker set search_path = '' as $$
declare e jsonb; old public.call_bookings; saved public.call_bookings; change_kind text;
begin
  for e in select value from jsonb_array_elements(p_events) loop
    perform pg_advisory_xact_lock(hashtextextended(p_calendar_id||':'||(e->>'event_id'),0));
    select * into old from public.call_bookings where calendar_id=p_calendar_id and event_id=e->>'event_id';
    if old.id is null and e->>'status'='cancelled' then continue; end if;
    if old.id is not null and old.google_updated_at > (e->>'google_updated_at')::timestamptz then continue; end if;
    if old.id is not null and old.version=e->>'version' then continue; end if;
    insert into public.call_bookings(calendar_id,event_id,version,google_updated_at,attendee_name,attendee_email,starts_at,ends_at,status,meet_url,calendar_url)
    values(p_calendar_id,e->>'event_id',e->>'version',(e->>'google_updated_at')::timestamptz,
      coalesce(e->>'attendee_name',old.attendee_name,''),coalesce(e->>'attendee_email',old.attendee_email),
      coalesce((e->>'starts_at')::timestamptz,old.starts_at),coalesce((e->>'ends_at')::timestamptz,old.ends_at),e->>'status',
      case when e ? 'meet_url' then e->>'meet_url' else old.meet_url end,
      coalesce(e->>'calendar_url',old.calendar_url))
    on conflict(calendar_id,event_id) do update set version=excluded.version,google_updated_at=excluded.google_updated_at,
      attendee_name=excluded.attendee_name,attendee_email=excluded.attendee_email,starts_at=excluded.starts_at,ends_at=excluded.ends_at,
      status=excluded.status,meet_url=excluded.meet_url,calendar_url=excluded.calendar_url,updated_at=now()
    returning * into saved;
    change_kind := null;
    if old.id is null then change_kind := 'booking_created';
    elsif old.status is distinct from saved.status and saved.status='cancelled' then change_kind := 'booking_cancelled';
    elsif row(old.starts_at,old.ends_at,old.status,old.meet_url,old.attendee_email) is distinct from row(saved.starts_at,saved.ends_at,saved.status,saved.meet_url,saved.attendee_email) then change_kind := 'booking_changed'; end if;
    if change_kind is not null then
      insert into public.lead_notifications(dedupe_key,kind,booking_id,payload)
      values('booking:'||saved.id||':'||saved.version,change_kind,saved.id,to_jsonb(saved)) on conflict(dedupe_key) do nothing;
    end if;
  end loop;
end;
$$;

create or replace function public.ack_lead_notification(p_id uuid,p_delivered boolean,p_error text) returns void
language sql security invoker set search_path = '' as $$
  update public.lead_notifications set attempts=attempts+1,
    sent_at=case when p_delivered then now() else null end,
    last_error=case when p_delivered then null else left(p_error,500) end
  where id=p_id and sent_at is null;
$$;
revoke all on function public.accept_website_quote(jsonb), public.consume_calendar_nonce(text), public.sync_call_bookings(text,jsonb), public.ack_lead_notification(uuid,boolean,text) from public, anon, authenticated;
grant execute on function public.accept_website_quote(jsonb), public.consume_calendar_nonce(text), public.sync_call_bookings(text,jsonb), public.ack_lead_notification(uuid,boolean,text) to service_role;
commit;

-- Must return the owner's UUID before enabling booking:
select user_id from public.site_admins;
