-- Preserve public submissions; expose existing inquiries only to the verified owner.
begin;
alter table public.ads_inquiries enable row level security;
revoke all on public.ads_inquiries from public,anon,authenticated;
grant insert(name,phone,business_name,platform,monthly_budget,industry,goals,status) on public.ads_inquiries to anon,authenticated;
grant select,update,delete on public.ads_inquiries to authenticated;
grant all on public.ads_inquiries to service_role;
drop policy if exists ads_public_submit on public.ads_inquiries;
create policy ads_public_submit on public.ads_inquiries for insert to anon,authenticated
with check (status='new' and length(name) between 1 and 100 and length(phone) between 10 and 30 and length(business_name) between 1 and 200 and platform in ('google_ads','meta_ads','both') and length(monthly_budget) between 1 and 100 and length(industry)<=200 and length(goals) between 1 and 500);
drop policy if exists ads_owner_read on public.ads_inquiries;
create policy ads_owner_read on public.ads_inquiries for select to authenticated using ((select public.is_site_admin()));
drop policy if exists ads_owner_update on public.ads_inquiries;
create policy ads_owner_update on public.ads_inquiries for update to authenticated using ((select public.is_site_admin())) with check ((select public.is_site_admin()));
drop policy if exists ads_owner_delete on public.ads_inquiries;
create policy ads_owner_delete on public.ads_inquiries for delete to authenticated using ((select public.is_site_admin()));
commit;
