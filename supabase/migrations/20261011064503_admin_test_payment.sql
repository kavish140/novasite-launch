-- Extend the server-only ledger with an explicitly marked, fixed ₹1 admin test.
begin;
alter table public.payment_intents drop constraint if exists payment_intents_package_check;
alter table public.payment_intents drop constraint if exists payment_intents_check;
alter table public.payment_intents add constraint payment_intents_package_check check (package in ('starter','business','test'));
alter table public.payment_intents add constraint payment_intents_check check (
  (package='starter' and amount=500000) or (package='business' and amount=750000) or
  (package='test' and amount=100 and coalesce(jsonb_typeof(customer->'admin_id')='string' and length(customer->>'admin_id')>0,false))
);
commit;
