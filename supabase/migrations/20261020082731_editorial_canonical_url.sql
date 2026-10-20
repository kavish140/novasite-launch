-- Optional original-publication URL. Existing rows remain self-canonical.
alter table public.blog_posts add column if not exists canonical_url text;
alter table public.blog_posts add constraint blog_posts_canonical_url_https
  check (canonical_url is null or canonical_url ~ '^https://[^[:space:]@?#]+$');
comment on column public.blog_posts.canonical_url is
  'Absolute HTTPS original-publication URL; null means the SiteNova slug is original.';
-- Existing RLS, grants and publication rules are deliberately retained.
