-- Append-only package pricing; existing orders keep immutable paise snapshots.
begin;
create table public.payment_package_prices (
 id uuid primary key default gen_random_uuid(),
 starter_price integer not null check(starter_price between 100 and 100000000),
 starter_advance integer not null check(starter_advance between 100 and starter_price),
 business_price integer not null check(business_price between 100 and 100000000),
 business_advance integer not null check(business_advance between 100 and business_price),
 changed_by uuid,
 created_at timestamptz not null default now()
);
create table public.payment_price_current (
 singleton boolean primary key default true check(singleton),
 version uuid not null references public.payment_package_prices(id)
);
alter table public.payment_package_prices enable row level security;
alter table public.payment_price_current enable row level security;
revoke all on public.payment_package_prices,public.payment_price_current from public,anon,authenticated,service_role;
grant select,insert on public.payment_package_prices to service_role;
grant select,update on public.payment_price_current to service_role;
with initial as (insert into public.payment_package_prices(id,starter_price,starter_advance,business_price,business_advance)
 values('00000000-0000-4000-8000-000000000000',1000000,500000,1500000,750000) returning id)
insert into public.payment_price_current(version) select id from initial;

alter table public.payment_intents add column pricing_version uuid references public.payment_package_prices(id);
update public.payment_intents set pricing_version=(select version from public.payment_price_current) where package<>'test';
create index payment_intents_pricing_version_idx on public.payment_intents(pricing_version) where pricing_version is not null;
alter table public.payment_intents drop constraint if exists payment_intents_amount_check;
alter table public.payment_intents drop constraint if exists payment_intents_check;
alter table public.payment_intents add constraint payment_intents_priced_amount check(
 (package in ('starter','business') and amount between 100 and 100000000 and pricing_version is not null) or
 (package='test' and amount=100 and pricing_version is null and coalesce(jsonb_typeof(customer->'admin_id')='string' and length(customer->>'admin_id')>0,false))
);

create function public.enforce_payment_price_snapshot() returns trigger
language plpgsql security invoker set search_path='' as $$
declare prices public.payment_package_prices; parent public.payment_intents; current_version uuid;
begin
 if tg_op='UPDATE' then
  if new.package is distinct from old.package or new.amount is distinct from old.amount or new.pricing_version is distinct from old.pricing_version
   then raise exception 'payment_price_immutable'; end if;
  return new;
 end if;
 if new.package='test' then return new; end if;
 if new.retry_parent is not null then
  select * into parent from public.payment_intents where request_id=new.retry_parent;
  if not found or parent.package<>new.package or parent.amount<>new.amount then raise exception 'retry_price_mismatch'; end if;
  new.pricing_version:=parent.pricing_version;
 else
  -- Read the current version in the reservation transaction. A stale Edge read fails
  -- before any Razorpay POST instead of reserving an unadvertised amount.
  select version into current_version from public.payment_price_current where singleton for share;
  if coalesce(new.pricing_version,'00000000-0000-4000-8000-000000000000'::uuid)<>current_version then raise exception 'package_price_changed'; end if;
  new.pricing_version:=current_version;
 end if;
 select * into prices from public.payment_package_prices where id=new.pricing_version;
 if not found or new.amount<>(case new.package when 'starter' then prices.starter_advance when 'business' then prices.business_advance else null end)
  then raise exception 'package_price_changed'; end if;
 return new;
end;$$;
create trigger payment_price_snapshot before insert or update on public.payment_intents
for each row execute function public.enforce_payment_price_snapshot();
revoke all on function public.enforce_payment_price_snapshot() from public,anon,authenticated;
grant execute on function public.enforce_payment_price_snapshot() to service_role;

create function public.save_payment_package_prices(p_admin uuid,p_version uuid,p_prices jsonb) returns public.payment_package_prices
language plpgsql security invoker set search_path='' as $$
declare current_version uuid; saved public.payment_package_prices;
begin
 if p_admin is null or not exists(select 1 from public.site_admins where user_id=p_admin) then raise exception 'admin_required'; end if;
 select version into current_version from public.payment_price_current where singleton for update;
 if p_version is null or p_version<>current_version then raise exception 'pricing_changed_reload'; end if;
 if jsonb_typeof(p_prices)<>'object' or (select count(*) from jsonb_object_keys(p_prices))<>2
 or not(p_prices ? 'starter' and p_prices ? 'business') then raise exception 'invalid_package_prices'; end if;
 if jsonb_typeof(p_prices->'starter')<>'object' or jsonb_typeof(p_prices->'business')<>'object'
 or (select count(*) from jsonb_object_keys(p_prices->'starter'))<>2 or (select count(*) from jsonb_object_keys(p_prices->'business'))<>2
 or not(p_prices->'starter' ? 'startingPrice' and p_prices->'starter' ? 'advance' and p_prices->'business' ? 'startingPrice' and p_prices->'business' ? 'advance')
 then raise exception 'invalid_package_prices'; end if;
 if jsonb_typeof(p_prices->'starter'->'startingPrice')<>'number' or jsonb_typeof(p_prices->'starter'->'advance')<>'number'
 or jsonb_typeof(p_prices->'business'->'startingPrice')<>'number' or jsonb_typeof(p_prices->'business'->'advance')<>'number'
 then raise exception 'invalid_package_prices'; end if;
 insert into public.payment_package_prices(starter_price,starter_advance,business_price,business_advance,changed_by)
 values((p_prices->'starter'->>'startingPrice')::integer,(p_prices->'starter'->>'advance')::integer,
 (p_prices->'business'->>'startingPrice')::integer,(p_prices->'business'->>'advance')::integer,p_admin) returning * into saved;
 update public.payment_price_current set version=saved.id where singleton;
 return saved;
end;$$;
revoke all on function public.save_payment_package_prices(uuid,uuid,jsonb) from public,anon,authenticated;
grant execute on function public.save_payment_package_prices(uuid,uuid,jsonb) to service_role;
commit;
