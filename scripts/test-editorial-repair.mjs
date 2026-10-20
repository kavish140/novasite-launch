import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";

// Isolated PostgreSQL only. Never reads credentials or connects to Supabase.
const posts = JSON.parse(readFileSync(process.argv[2] || "test-results/content-before-20261020.json", "utf8"));
const manifest = JSON.parse(readFileSync("content/editorial-20261020/manifest.json", "utf8"));
const sql = readFileSync("content/editorial-20261020/apply.sql", "utf8");
const migration = readFileSync("supabase/migrations/20261020082731_editorial_canonical_url.sql", "utf8");
const db = new PGlite();
await db.exec(`create table public.blog_posts (id uuid primary key, slug text unique, title text, excerpt text, content text, tags text[], status text, published_at timestamptz, updated_at timestamptz, blanks_metadata jsonb);
  alter table public.blog_posts enable row level security;
  create role anon; grant usage on schema public to anon; grant select on public.blog_posts to anon;
  create policy published_only on public.blog_posts for select to anon using (status = 'published');`);
for (const p of posts) await db.query("insert into blog_posts (id,slug,title,excerpt,content,tags,status,published_at,updated_at,blanks_metadata) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,'[]')", [p.id,p.slug,p.title,p.excerpt,p.content,p.tags,p.status,p.published_at,p.updated_at]);
await db.exec(migration);
const read = async (id) => (await db.query("select * from blog_posts where id=$1", [id])).rows[0];
const before = new Map();
for (const p of posts) before.set(p.id, await read(p.id));
await db.exec(sql);
const headings = [];
for (const item of manifest) {
  const p = await read(item.id);
  assert.equal(p.status, before.get(item.id).status);
  assert.deepEqual(p.published_at, before.get(item.id).published_at);
  assert.equal(p.title, item.title);
  assert.ok(p.content.replace(/<[^>]*>/g," ").split(/\s+/).filter(Boolean).length >= 900);
  assert.ok(!p.content.includes("<!-- BLANK:"));
  headings.push(...[...p.content.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)].map((match) => match[1]));
}
assert.equal(new Set(headings).size, headings.length, "No repeated H2 outline headings across replacement articles");
const duplicate = posts.find((p) => p.slug === "openai-agent-medicare-breach-disclosure-delay");
assert.equal((await read(duplicate.id)).canonical_url, "https://sitenova.dev/blog/openai-agent-medicare-portal-breach");
await assert.rejects(db.query("update blog_posts set canonical_url='javascript:alert(1)' where id=$1", [duplicate.id]), /canonical_url_https/);
const touched = new Set([...manifest.map((p) => p.id), duplicate.id]);
for (const p of posts.filter((p) => !touched.has(p.id))) assert.deepEqual(await read(p.id), before.get(p.id));
await db.exec("set role anon");
assert.equal((await db.query("select count(*)::int as n from blog_posts where status <> 'published'")).rows[0].n, 0);
await db.exec("reset role");
assert.equal((await db.query("select relrowsecurity from pg_class where oid='public.blog_posts'::regclass")).rows[0].relrowsecurity, true);

// Restore the fixture, then make a concurrent edit near the end of the batch.
for (const p of posts) await db.query("update blog_posts set title=$2,excerpt=$3,content=$4,tags=$5,status=$6,published_at=$7,updated_at=$8,canonical_url=null where id=$1", [p.id,p.title,p.excerpt,p.content,p.tags,p.status,p.published_at,p.updated_at]);
const edited = manifest.at(-1);
await db.query("update blog_posts set content='A newer human edit' where id=$1", [edited.id]);
await assert.rejects(db.exec(sql), /Editorial source changed/);
await db.exec("rollback");
assert.equal((await read(manifest[0].id)).content, before.get(manifest[0].id).content, "Earlier updates rolled back after conflict");
assert.equal((await read(edited.id)).content, "A newer human edit");
await db.close();
console.log("PASS: guarded SQL, 8 unique 900+ word articles, draft/date preservation, canonical repair, untouched rows, RLS and atomic conflict rollback.");
