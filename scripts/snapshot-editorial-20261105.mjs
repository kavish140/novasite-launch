import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

// Read public published articles only. Never use or print server credentials.
const environment = Object.fromEntries(readFileSync('.env', 'utf8').split(/\r?\n/).filter(line => /^\w+=/.test(line)).map(line => {
  const index = line.indexOf('=');
  return [line.slice(0, index), line.slice(index + 1).trim().replace(/^['"]|['"]$/g, '')];
}));
const { VITE_SUPABASE_URL: origin, VITE_SUPABASE_ANON_KEY: key } = environment;
if (!origin || !key) throw Error('Missing public blog connection settings');
const rows = [];
for (let offset = 0; ; offset += 500) {
  const url = new URL('/rest/v1/blog_posts', origin);
  url.search = new URLSearchParams({ select: 'id,title,slug,excerpt,content,updated_at,status,published_at,tags,canonical_url', status: 'eq.published', order: 'published_at.desc,id.asc', offset: String(offset), limit: '500' });
  const response = await fetch(url, { headers: { apikey: key }, signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw Error(`Public archive read failed: ${response.status}`);
  const page = await response.json();
  if (!Array.isArray(page)) throw Error('Unexpected archive response');
  rows.push(...page);
  if (page.length < 500) break;
}
const directory = 'test-results/editorial-20261105';
mkdirSync(directory, { recursive: true });
writeFileSync(`${directory}/published-before.json`, JSON.stringify(rows, null, 2));
console.log(`Saved ${rows.length} published records to the ignored audit directory. This snapshot must not overwrite the pre-application backup after release.`);
