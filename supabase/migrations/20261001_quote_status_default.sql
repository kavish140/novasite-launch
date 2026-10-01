-- The production quote_requests table predates the conversion migration.
-- CREATE TABLE IF NOT EXISTS left its legacy quote_pending default in place.
begin;

alter table public.quote_requests alter column status set default 'new';
update public.quote_requests set status = 'new' where status = 'quote_pending';

commit;
