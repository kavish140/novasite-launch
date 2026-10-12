begin;
create table if not exists public.payment_rate_limits (bucket text primary key, window_start timestamptz not null, requests integer not null);
create index if not exists payment_rate_limits_window on public.payment_rate_limits(window_start);
alter table public.payment_rate_limits enable row level security;
revoke all on public.payment_rate_limits from public,anon,authenticated;
grant select,insert,update,delete on public.payment_rate_limits to service_role;
create or replace function public.consume_payment_limit(p_bucket text) returns boolean
language plpgsql security invoker set search_path='' as $$
declare total integer;
begin
  if length(p_bucket)>200 then raise exception 'invalid_bucket'; end if;
  insert into public.payment_rate_limits(bucket,window_start,requests) values(p_bucket,now(),1)
  on conflict(bucket) do update set
    window_start=case when payment_rate_limits.window_start<=now()-interval '60 seconds' then now() else payment_rate_limits.window_start end,
    requests=case when payment_rate_limits.window_start<=now()-interval '60 seconds' then 1 else payment_rate_limits.requests+1 end
  returning requests into total;
  delete from public.payment_rate_limits where window_start<now()-interval '1 day';
  return total<=30;
end;
$$;
revoke all on function public.consume_payment_limit(text) from public,anon,authenticated;
grant execute on function public.consume_payment_limit(text) to service_role;
commit;
