import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { JSDOM } from 'jsdom';

// Offline, deterministic preparation; no network calls or credentials.
const directory = 'content/editorial-20261105';
const rows = JSON.parse(readFileSync('test-results/editorial-20261105/published-before.json', 'utf8'));
const definitions = [
  ['why-your-website-dropped-google-inp-metric-2026', 'inp.html', 'Diagnosing Slow Website Interactions: INP, Evidence and Retesting', 'Investigate slow menus, filters and forms with field observations and browser traces, without mistaking INP thresholds for automatic ranking penalties.'],
  ['ai-agents-upi-payments-why-offline-businesses-need-ecommerce', 'agentic-commerce.html', 'AI Shopping and UPI: What Merchants Need to Verify Before Integrating', 'Separate payment announcements, supported authorisation and verified order settlement before investing in an AI shopping integration.'],
  ['replace-pdf-catalogue-with-searchable-product-catalog', 'catalogue.html', 'From PDF to Enquiry Catalogue: Product Records and Quote Baskets', 'Compare printable specifications, searchable catalogues and checkout using Corporatezone’s documented enquiry architecture and a practical acceptance checklist.'],
  ['pagespeed-score-95-mumbai-case-study', null, 'A Repeatable Website Performance Investigation: From Trace to Retest', null],
  ['what-a-website-project-looks-like-start-to-finish', 'project-handoffs.html', 'Website Project Checkpoints: Customer Tasks, Testing and Handover', 'Review a website project through concrete scope, content, interaction, launch and ownership checkpoints, with documented SiteNova project examples.'],
  ['what-happens-if-you-forget-to-renew-your-domain', 'domain-recovery.html', 'Domain and Hosting Renewal: Ownership, Expiry and Recovery', 'Identify registration, DNS, hosting and email failures separately, then follow the actual provider’s recovery terms and verify the restored service.'],
];
const targeted = JSON.parse(readFileSync(`${directory}/targeted-corrections.json`, 'utf8'));
for (const slug of Object.keys(targeted)) {
  const before = rows.find(row => row.slug === slug);
  if (!before) throw Error(`Missing source: ${slug}`);
  definitions.push([slug, null, before.title, before.excerpt]);
}
const md5 = value => createHash('md5').update(value ?? '').digest('hex');
const literal = value => value == null ? 'null' : `'${String(value).replaceAll("'", "''")}'`;
const expected = definitions.map(([slug, file, title, excerpt]) => {
  const before = rows.find(row => row.slug === slug);
  if (!before || before.status !== 'published') throw Error(`Missing published source: ${slug}`);
  let content = file ? readFileSync(`${directory}/${file}`, 'utf8').trim() : before.content;
  if (slug === 'pagespeed-score-95-mumbai-case-study') content += '\n' + readFileSync(`${directory}/image-example.html`, 'utf8').trim();
  if (targeted[slug]) {
    const original = JSDOM.fragment(content);
    for (const [prefix, replacement] of targeted[slug]) {
      const matches = [...original.querySelectorAll('p')].filter(p => p.textContent.startsWith(prefix));
      if (matches.length !== 1) throw Error(`Ambiguous correction: ${slug}: ${prefix}`);
      matches[0].textContent = replacement;
    }
    const container = original.ownerDocument.createElement('div'); container.append(original);
    content = container.innerHTML;
  }
  const fragment = JSDOM.fragment(content);
  const words = fragment.textContent.trim().split(/\s+/).length;
  if (fragment.querySelector('script,style,iframe,form') || /\\["']/.test(content)) throw Error(`Invalid editorial HTML: ${slug}`);
  for (const anchor of fragment.querySelectorAll('a[href]')) if (!/^(https:\/\/|\/(?!\/))/.test(anchor.getAttribute('href'))) throw Error(`Unexpected link: ${slug}`);
  return { before, values: { title, excerpt: excerpt ?? before.excerpt, content }, words };
});
// Lock and check every source before any write. A changed source aborts the whole file.
let sql = '-- SiteNova editorial corrections, 5 November 2026. One transaction; all source guards must pass.\n-- Content only: no schema, RLS, publication state, URL, price, payment or ad-placement changes.\nbegin;\nset local lock_timeout = \'5s\';\nset local statement_timeout = \'60s\';\n';
sql += 'do $repair$ begin\n';
for (const { before: row } of expected) {
  sql += `  if not exists (select 1 from public.blog_posts where id=${literal(row.id)}::uuid and slug=${literal(row.slug)} and title=${literal(row.title)} and excerpt is not distinct from ${literal(row.excerpt)} and md5(content)=${literal(md5(row.content))} and status='published' and updated_at is not distinct from ${literal(row.updated_at)}::timestamptz and published_at is not distinct from ${literal(row.published_at)}::timestamptz and canonical_url is not distinct from ${literal(row.canonical_url)} for update) then raise exception 'Editorial source changed: ${row.slug}'; end if;\n`;
}
for (const { before: row, values } of expected) {
  sql += `  update public.blog_posts set title=${literal(values.title)}, excerpt=${literal(values.excerpt)}, content=${literal(values.content)}, updated_at=now() where id=${literal(row.id)}::uuid and slug=${literal(row.slug)} and status='published';\n  if not found then raise exception 'Editorial target missing: ${row.slug}'; end if;\n`;
}
sql += 'end $repair$;\ncommit;\n';
writeFileSync(`${directory}/apply.sql`, sql);
writeFileSync(`${directory}/expected.json`, JSON.stringify(expected, null, 2));
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
mkdirSync(directory, { recursive: true });
writeFileSync(`${directory}/review.html`, `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex,nofollow"><title>SiteNova editorial corrections — local review</title><style>body{max-width:850px;margin:2rem auto;padding:0 1rem;font:17px/1.65 system-ui;color:#172033;overflow-wrap:anywhere}article{border-top:2px solid #bcc8d5;margin-top:3rem}table{border-collapse:collapse;display:block;max-width:100%;overflow:auto}td,th{border:1px solid #bcc8d5;padding:.6rem}pre{overflow:auto;max-width:100%;background:#eef2f6;padding:1rem}a{color:#124fa7}</style><h1>Prepared editorial corrections</h1><p>Local review only. This file does not apply database changes or enable advertising. Original publication dates and URLs are preserved.</p><nav>${expected.map(p=>`<p><a href="#${p.before.slug}">${escape(p.values.title)}</a></p>`).join('')}</nav>${expected.map(p=>`<article id="${p.before.slug}"><h1>${escape(p.values.title)}</h1><p>${p.words} words · Existing URL: /blog/${p.before.slug}</p><p>${escape(p.values.excerpt)}</p>${p.values.content}</article>`).join('')}</html>`);
console.log(JSON.stringify(expected.map(p=>({slug:p.before.slug,words:p.words})),null,2));
