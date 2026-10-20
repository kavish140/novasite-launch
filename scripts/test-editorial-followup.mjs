import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { JSDOM } from "jsdom";

const directory = "content/editorial-20261020-followup";
const original = JSON.parse(readFileSync("test-results/content-before-followup-20261020.json", "utf8"));
const expected = JSON.parse(readFileSync(`${directory}/expected.json`, "utf8"));
const files = readdirSync(directory).filter((name) => /^batch-\d+\.sql$/.test(name)).sort();
const db = new PGlite();
await db.exec(`create table blog_posts(id uuid primary key,slug text unique,title text,excerpt text,content text,tags text[],status text,published_at timestamptz,updated_at timestamptz,canonical_url text,blanks_metadata jsonb);
 alter table blog_posts enable row level security;
 create role anon; grant usage on schema public to anon; grant select on blog_posts to anon;
 create policy public_posts on blog_posts for select to anon using(status='published');`);
for (const p of original) await db.query("insert into blog_posts values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)", [p.id,p.slug,p.title,p.excerpt,p.content,p.tags,p.status,p.published_at,p.updated_at,p.canonical_url,JSON.stringify(p.blanks_metadata)]);
const read = async (id) => (await db.query("select * from blog_posts where id=$1", [id])).rows[0];
const before = new Map();
for (const p of original) before.set(p.id, await read(p.id));
const completeSql = readFileSync(`${directory}/apply.sql`, "utf8");
await db.exec(completeSql);
for (const p of expected) {
  const actual = await read(p.id);
  assert.equal(actual.status, before.get(p.id).status);
  assert.deepEqual(actual.published_at, before.get(p.id).published_at);
  assert.deepEqual(actual.tags, before.get(p.id).tags);
  for (const [key, value] of Object.entries(p.values)) assert.deepEqual(actual[key], value);
  if (p.kind !== "topic consolidation") {
    if (p.kind !== 'factual correction' || before.get(p.id).content.replace(/<[^>]*>/g,' ').split(/\s+/).filter(Boolean).length >= 900) assert.ok(p.words >= 900);
    const fragment = JSDOM.fragment(actual.content);
    assert.equal(fragment.querySelectorAll("script,style").length, 0);
    assert.ok(![...fragment.querySelectorAll("h2")].some((h) => /^(Frequently Asked Questions|FAQs)$/i.test(h.textContent.trim())));
    if (p.kind === "editorial restructuring" || p.slug === 'google-ads-500-daily-budget-mumbai-guide') {
      const priorMarkers = (before.get(p.id).content.match(/<!--\s*BLANK:[^>]*-->/g) ?? []).sort();
      const revisedMarkers = (actual.content.match(/<!--\s*BLANK:[^>]*-->/g) ?? []).sort();
      assert.deepEqual(revisedMarkers, priorMarkers, `Human-contribution markers retained: ${p.slug}`);
      assert.deepEqual(actual.blanks_metadata, before.get(p.id).blanks_metadata);
    }
  }
}
const changed = new Set(expected.map((p) => p.id));
for (const p of original.filter((p) => !changed.has(p.id))) assert.deepEqual(await read(p.id), before.get(p.id));
await db.exec("set role anon");
assert.equal((await db.query("select count(*)::int as n from blog_posts where status<>'published'")).rows[0].n,0);
await db.exec("reset role");

// A conflicting edit near the end must roll back the entire user-facing SQL file.
for (const p of original) await db.query("update blog_posts set title=$2,excerpt=$3,content=$4,updated_at=$5,canonical_url=$6,blanks_metadata=$7 where id=$1", [p.id,p.title,p.excerpt,p.content,p.updated_at,p.canonical_url,JSON.stringify(p.blanks_metadata)]);
const conflict = expected.at(-1);
await db.query("update blog_posts set content='A newer owner edit' where id=$1", [conflict.id]);
await assert.rejects(db.exec(completeSql),/Archive source changed/);
await db.exec("rollback");
assert.equal((await read(expected[0].id)).content,before.get(expected[0].id).content);
assert.equal((await read(conflict.id)).content,"A newer owner edit");
await db.close();
console.log(`PASS: ${expected.length} guarded changes in one complete transaction (${files.length} connector-sized artifacts); ${expected.filter(p=>p.kind!=='topic consolidation').length} content revisions; states/dates/tags, contribution markers, untouched rows, RLS and full-file conflict rollback retained.`);
