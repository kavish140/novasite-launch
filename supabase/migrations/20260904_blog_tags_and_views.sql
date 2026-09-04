-- Migration: Add tags to blog_posts + create blog_post_views table
-- Run this in your Supabase SQL editor or via the CLI.

-- 1. Add tags array column to blog_posts
ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- 2. Create the per-visit view tracking table
CREATE TABLE IF NOT EXISTS blog_post_views (
  id        bigserial PRIMARY KEY,
  slug      text NOT NULL,
  viewed_at timestamptz DEFAULT now() NOT NULL
);

-- Fast aggregation index
CREATE INDEX IF NOT EXISTS idx_blog_post_views_slug ON blog_post_views (slug);

-- Allow anonymous inserts (needed for SSR loader which uses the anon key)
ALTER TABLE blog_post_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_anon_insert" ON blog_post_views
  FOR INSERT TO anon WITH CHECK (true);

-- Allow authenticated reads (admin dashboard analytics, if needed later)
CREATE POLICY "allow_authed_select" ON blog_post_views
  FOR SELECT TO authenticated USING (true);
