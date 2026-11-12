import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { JSDOM } from 'jsdom';

const directory = 'content/editorial-20261105';
const expected = JSON.parse(readFileSync(`${directory}/expected.json`, 'utf8'));
const snapshot = 'test-results/editorial-20261105/published-before.json';
const original = existsSync(snapshot) ? JSON.parse(readFileSync(snapshot, 'utf8')) : [
  ...expected.map(change => change.before),
  { id: '00000000-0000-4000-8000-000000000006', slug: 'unrelated-published', title: 'Unrelated', excerpt: '', content: '<p>Retain this record.</p>', status: 'published', tags: [], canonical_url: null, updated_at: null, published_at: null },
];
// Exercise the LF form committed by Git, even on a CRLF working checkout.
const sql = readFileSync(`${directory}/apply.sql`, 'utf8').replace(/\r\n/g, '\n');
const normalize = value => value.replace(/\r\n/g, '\n');
const db = new PGlite();
await db.exec(`create table public.blog_posts (id uuid primary key, slug text unique, title text, excerpt text, content text, updated_at timestamptz, status text, published_at timestamptz, tags text[], canonical_url text, blanks_metadata jsonb default '[{"id":"owner","filled":true}]');`);
for (const row of original) await db.query('insert into blog_posts (id,slug,title,excerpt,content,updated_at,status,published_at,tags,canonical_url) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [row.id,row.slug,row.title,row.excerpt,row.content,row.updated_at,row.status,row.published_at,row.tags,row.canonical_url]);
// Include a private draft to prove the batch cannot publish or edit it.
await db.exec("insert into blog_posts(id,slug,title,content,status) values ('00000000-0000-4000-8000-000000000005','private-draft','Unpublished','Owner draft','draft')");
const read = async () => (await db.query('select * from blog_posts order by id')).rows;
const before = await read();
await db.exec(sql);
const after = await read();
for (const row of after) {
  const baseline = before.find(p => p.id === row.id);
  const change = expected.find(p => p.before.id === row.id);
  if (!change) { assert.deepEqual(row, baseline); continue; }
  for (const [key, value] of Object.entries(change.values)) assert.equal(key === 'content' ? normalize(row[key]) : row[key], key === 'content' ? normalize(value) : value);
  for (const key of ['slug','status','published_at','tags','canonical_url','blanks_metadata']) assert.deepEqual(row[key], baseline[key]);
  const fragment = JSDOM.fragment(row.content);
  assert.equal(fragment.querySelectorAll('script,style,iframe,form').length, 0);
  assert.ok(!/\\["']/.test(row.content));
  assert.ok(fragment.querySelectorAll('h2').length > 3);
  assert.ok(!fragment.querySelector('a[href*="/quote"],a[href*="/free-audit"]'), 'Use the existing single external article CTA');
}
// Restore source state; a conflict on the last target must prevent every write.
for (const row of original) await db.query('update blog_posts set title=$2,excerpt=$3,content=$4,updated_at=$5 where id=$1', [row.id,row.title,row.excerpt,row.content,row.updated_at]);
const last = expected.at(-1).before;
await db.query("update blog_posts set content='A newer owner edit' where id=$1", [last.id]);
await assert.rejects(db.exec(sql), /Editorial source changed/);
await db.exec('rollback');
const conflicted = await read();
assert.equal(conflicted.find(p => p.id === expected[0].before.id).content, expected[0].before.content);
assert.equal(conflicted.find(p => p.id === last.id).content, 'A newer owner edit');
await db.close();
console.log(`PASS: actual ${expected.length}-row transaction, exact content, stable URLs/dates/status/tags/canonicals/contribution metadata, untouched records/private draft and complete conflict rollback.`);
