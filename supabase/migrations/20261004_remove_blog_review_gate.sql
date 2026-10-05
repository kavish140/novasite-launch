-- Restore manual blog publishing. Preserve existing posts and private review history.
begin;

drop trigger if exists blog_publication_guard on public.blog_posts;
drop function if exists public.publish_blog_review(uuid, uuid, boolean, text);
drop function if exists public.reserve_blog_review(integer);
drop function if exists public.guard_blog_publication();
alter table public.blog_posts alter column status set default 'published';

-- The review tables and review_version column remain as inactive recovery data.
-- Existing admin authorization and RLS policies are unchanged.
commit;
