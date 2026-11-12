import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

// Public GETs only. Never submit forms, invoke tools or exercise payment flows.
const directory = 'test-results/editorial-20261105';
mkdirSync(directory, { recursive: true });
const clean = value => value.replace(/\s+/g, ' ').trim();
const fetchPage = async url => {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(20000), redirect: 'manual' });
    const html = await response.text();
    const document = new JSDOM(html, { url }).window.document;
    const main = document.querySelector('article .prose, article, main') || document.body;
    const paragraphs = [...main.querySelectorAll('p')].map(p => clean(p.textContent)).filter(Boolean);
    const links = [...main.querySelectorAll('a[href]')].map(a => ({ label: clean(a.textContent), url: a.href }));
    return { url, status: response.status, location: response.headers.get('location'), title: document.title,
      canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
      robots: document.querySelector('meta[name="robots"]')?.content ?? null,
      headings: [...main.querySelectorAll('h2,h3')].map(h => clean(h.textContent)),
      text: clean(main.textContent), paragraphs, links, images: [...main.querySelectorAll('img')].map(i => ({ src: i.src, alt: i.alt })),
      inputs: [...main.querySelectorAll('input,select,button')].map(n => ({ tag: n.tagName, type: n.type, label: clean(n.textContent || n.getAttribute('aria-label') || n.getAttribute('placeholder') || '') })) };
  } catch (error) { return { url, error: error.message }; }
};
const batch = async urls => {
  const result = [];
  for (let offset = 0; offset < urls.length; offset += 4) {
    result.push(...await Promise.all(urls.slice(offset, offset + 4).map(fetchPage)));
    console.log(`Read ${Math.min(offset + 4, urls.length)}/${urls.length}`);
  }
  return result;
};
const rootRows = JSON.parse(readFileSync(`${directory}/published-before.json`, 'utf8'));
const routeSource = readFileSync('app/lib/blog-content.ts', 'utf8');
const retired = new Set([...routeSource.matchAll(/^  "([^"]+)": "\//gm)].map(m => m[1]));
const originalRows = rootRows.filter(row => !retired.has(row.slug) && (!row.canonical_url || row.canonical_url === `https://sitenova.dev/blog/${row.slug}`));
const root = process.argv.includes('--subdomains-only')
  ? JSON.parse(readFileSync(`${directory}/live-audit.json`, 'utf8')).root.pages
  : await batch(originalRows.map(row => `https://sitenova.dev/blog/${row.slug}`));
const subdomains = {};
for (const origin of ['https://tools.sitenova.dev', 'https://ai-insights.sitenova.dev']) {
  const home = await fetchPage(origin + '/');
  const sitemap = await fetch(origin + '/sitemap.xml', { signal: AbortSignal.timeout(20000) });
  const xml = await sitemap.text();
  const sitemapUrls = [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map(m => m[1].replaceAll('&amp;', '&'));
  const homeUrls = (home.links ?? []).map(l => l.url);
  // Cap the AI publication sample explicitly; tool routes are all crawled if present in the sitemap.
  const urls = [...new Set([...homeUrls, ...sitemapUrls])].filter(url => url.startsWith(origin + '/') && !/\.(xml|pdf)(?:$|\?)/.test(url) && !/[?#]/.test(url) && !/\/(?:auth|login|admin|subscribe)(?:\/|$)/.test(new URL(url).pathname));
  const limit = origin.includes('ai-insights') ? 30 : 80;
  subdomains[origin] = { home, sitemapStatus: sitemap.status, sitemapUrls, totalDiscovered: urls.length, sampleLimit: limit, pages: await batch(urls.filter(url => url !== origin + '/').slice(0, limit)) };
}
const repeated = new Map();
for (const page of root) for (const paragraph of page.paragraphs ?? []) {
  if (paragraph.split(/\s+/).length < 45) continue;
  const urls = repeated.get(paragraph) ?? new Set(); urls.add(page.url); repeated.set(paragraph, urls);
}
const repeatedParagraphs = [...repeated.entries()].filter(([, urls]) => urls.size > 1).map(([text, urls]) => ({ text, urls: [...urls] }));
const report = { checkedAt: new Date().toISOString(), root: { originalCount: originalRows.length, pages: root, repeatedParagraphs }, subdomains };
writeFileSync(`${directory}/live-audit.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ rootOriginals: originalRows.length, failures: root.filter(p => p.status !== 200), repeatedParagraphs: repeatedParagraphs.length,
  subdomains: Object.fromEntries(Object.entries(subdomains).map(([origin, site]) => [origin, { discovered: site.totalDiscovered, checked: site.pages.length, failures: site.pages.filter(p => p.status !== 200).map(p => ({url:p.url,status:p.status,error:p.error})) }])) }, null, 2));
