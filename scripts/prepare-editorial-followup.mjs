import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { JSDOM } from "jsdom";

// Offline preparation only. The generated queries are executed separately after review.
const directory = "content/editorial-20261020-followup";
const rows = JSON.parse(readFileSync(process.argv[2] || "test-results/content-before-followup-20261020.json", "utf8"));
const replacements = JSON.parse(readFileSync(`${directory}/replacements.json`, "utf8"));
const plans = JSON.parse(readFileSync(`${directory}/section-plans.json`, "utf8"));
const consolidations = JSON.parse(readFileSync(`${directory}/consolidations.json`, "utf8"));
const notes = JSON.parse(readFileSync(`${directory}/editorial-notes.json`, "utf8"));
const factCorrections = JSON.parse(readFileSync(`${directory}/fact-corrections.json`, "utf8"));
for (const [slug, rules] of Object.entries(JSON.parse(readFileSync(`${directory}/additional-fact-corrections.json`, 'utf8')))) factCorrections[slug] = [...(factCorrections[slug] ?? []), ...rules];
const factualNotes = JSON.parse(readFileSync(`${directory}/factual-notes.json`, "utf8"));
const factualIssues = [];
const correctFacts = (slug, html) => {
  const rules = factCorrections[slug];
  if (!rules) return html;
  const fragment = JSDOM.fragment(html);
  for (const [pattern, replacement] of rules) {
    const matches = [...fragment.querySelectorAll('p,li,td')].filter((n) => !n.querySelector('p,li') && new RegExp(pattern, 'i').test(n.textContent));
    if (!matches.length) factualIssues.push(`Fact correction not matched: ${slug}: ${pattern}`);
    for (const node of matches) node.textContent = replacement;
  }
  if (factualNotes[slug]) {
    const note = fragment.ownerDocument.createElement('p'); note.textContent = factualNotes[slug]; fragment.append(note);
  }
  const holder = fragment.ownerDocument.createElement('div'); holder.append(fragment);
  return holder.innerHTML;
};
const hash = (value) => createHash("md5").update(value ?? "").digest("hex");
const literal = (value) => value == null ? "null" : `'${String(value).replaceAll("'", "''")}'`;
const words = (html) => html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
const text = (html) => JSDOM.fragment(html).textContent.replace(/\s+/g, " ").trim();
const current = (slug) => { const row = rows.find((p) => p.slug === slug); if (!row) throw new Error(`Missing ${slug}`); return row; };
const changes = [];
const factualSources = {
  'do-you-need-a-website-if-you-have-whatsapp-business': ['https://business.whatsapp.com/products', 'WhatsApp business products'],
  'google-ai-overviews-mumbai-businesses': ['https://developers.google.com/search/docs/appearance/ai-features', 'Google AI features and websites'],
  'google-business-profile-vs-website-do-you-need-both': ['https://support.google.com/business/answer/7091', 'Google local-ranking guidance'],
  'how-to-get-more-google-reviews-for-your-business': ['https://support.google.com/business/answer/3474122', 'Google review-request guidance'],
  'website-analytics-numbers-to-track': ['https://support.google.com/analytics/answer/12195621', 'GA4 engagement and bounce definitions'],
  'should-your-mumbai-business-list-on-ondc-in-2026': ['https://www.ondc.org/pages/seller-network-participants.html', 'ONDC seller participants'],
  'website-redesign-seo-checklist-mumbai': ['https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes', 'Google site-move guidance'],
};
const withFactualSource = (slug, html) => factualSources[slug] ? `${html}<p>Reference: <a href="${factualSources[slug][0]}">${factualSources[slug][1]}</a>. Check the current provider guidance for the actual implementation.</p>` : html;

for (const [slug, file, title] of replacements) {
  const before = current(slug);
  let content = readFileSync(`${directory}/${file}.html`, "utf8");
  const preservesContributions = slug === 'google-ads-500-daily-budget-mumbai-guide';
  if (preservesContributions) {
    const original = JSDOM.fragment(before.content);
    const markers = before.content.match(/<!--\s*BLANK:[^>]*-->/g) ?? [];
    const placeholders = [...original.querySelectorAll('p')].filter((p)=>/\[Kavish will/.test(p.textContent)).map((p)=>p.outerHTML);
    content += '<h2>Owner evidence required before publication</h2>' + markers.join('\n') + placeholders.join('\n');
  }
  if (words(content) < 900) throw new Error(`${file}: fewer than 900 words`);
  const excerpt = text(content.match(/<p>([\s\S]*?)<\/p>/)?.[1] ?? "").slice(0, 190);
  changes.push({ before, kind: "full rewrite", values: { title, excerpt, content, ...(preservesContributions ? {} : {blanks_metadata: []}) }, words: words(content) });
}

const tokens = (value) => new Set(value.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 3 && !/^(what|when|where|which|with|your|that|this|website|business|need|have|does|from|actually)$/.test(w)));
for (const [slug, title, hook, names, technicalHeading, technicalBody] of plans) {
  const old = current(slug);
  const fragment = JSDOM.fragment(old.content);
  const document = fragment.ownerDocument;
  const element = (tag, value) => { const node = document.createElement(tag); node.textContent = value; return node; };
  for (const node of fragment.querySelectorAll("script, style")) node.remove();
  for (const node of fragment.querySelectorAll("div")) {
    if (/^About the Author:/i.test(node.textContent.trim())) node.remove();
  }
  for (const node of fragment.querySelectorAll("p")) {
    const body = node.textContent.trim();
    if (/^About the Author:/i.test(body) || (node.querySelector('a[href*="free-audit"], a[href*="/quote"]') && /\b(free|audit|quote|sitenova|site nova)\b/i.test(body))) node.remove();
  }
  const headings = [...fragment.querySelectorAll("h2")];
  const faq = headings.find((h) => /^(Frequently Asked Questions|FAQs)$/i.test(h.textContent.trim()));
  const bodyHeadings = headings.filter((h) => h !== faq);
  if (bodyHeadings.length !== names.length) throw new Error(`${slug}: expected ${names.length} substantive headings, found ${bodyHeadings.length}`);
  bodyHeadings.forEach((h, i) => { h.textContent = names[i]; });
  const first = fragment.querySelector("p");
  if (first) first.replaceWith(element("p", hook)); else fragment.prepend(element("p", hook));

  // Remove unverified update/price-specific passages rather than rename their claims.
  const overrides = {
    "do-you-need-a-website-if-you-have-whatsapp-business": { 1: "Messaging products have different capabilities, permissions and commercial terms. Verify the currently selected product through its official documentation before changing a workflow. This article does not establish an October policy deadline or a universal charge. Record what the business actually uses and review changes against that account's terms." },
    "instagram-reach-drop-2026-why-you-need-a-website": { 0: "Compare the business's own available observations over like time windows. Distinguish a change in impressions, profile visits, link clicks and accepted enquiries. This does not establish a specific algorithm mechanism or a platform-wide trend. If attribution or reporting changed, investigate that measurement change before inferring a loss of customer demand." },
    "should-your-mumbai-business-list-on-ondc-in-2026": { 1: "Obtain the selected participant's current commercial terms and compare the full cost components, including the services actually included. Network descriptions do not establish one universal commission, settlement schedule or support commitment. Use a worked order and exception to compare arrangements rather than an assumed industry percentage." },
    "ecommerce-website-cost-mumbai": { 2: "Compare written estimates against the same catalog, checkout, fulfilment and support requirements. Current SiteNova packages are maintained on the pricing page; a complete store quote depends on its agreed workflow. This article's scope comparison is not a live price list for another provider or an unknown project." },
    "landing-page-cost-for-google-meta-ads": { 2: "Identify content preparation, form acceptance/recovery, notification routing, measurement and handover in the estimate. Current SiteNova packages are maintained on the pricing page. The agreed scope determines the final quote; this article does not establish a fixed charge for every campaign destination." },
  }[slug];
  if (overrides) for (const [index, replacement] of Object.entries(overrides)) {
    const heading = bodyHeadings[Number(index)];
    let node = heading.nextSibling;
    while (node && !(node.nodeType === 1 && node.tagName === "H2")) { const next = node.nextSibling; node.remove(); node = next; }
    heading.after(element("p", replacement));
  }

  const technical = element("h2", technicalHeading);
  let faqNodes = [];
  if (faq?.parentNode) {
    let node = faq.nextSibling;
    while (node) { const next = node.nextSibling; faqNodes.push(node); node.remove(); node = next; }
    faq.remove();
  }
  fragment.append(technical, element("p", technicalBody));
  for (const paragraph of (notes[slug] ?? "").split(/\n\n/).filter(Boolean)) fragment.append(element("p", paragraph));
  const groups = [];
  let group = [];
  for (let node of faqNodes) {
    if (node.nodeType === 1 && node.tagName === "P" && /^Q\s*:/i.test(node.textContent.trim())) {
      if (group.length) groups.push(group);
      node = element("h3", node.textContent.trim().replace(/^Q\s*:\s*/i, ""));
      group = [node];
    } else {
      if (node.nodeType === 1 && node.tagName === "P" && /^A\s*:/i.test(node.textContent.trim())) node.innerHTML = node.innerHTML.replace(/^\s*A\s*:\s*/i, "");
      group.push(node);
    }
  }
  if (group.length) groups.push(group);
  for (const group of groups) {
    const question = group.find((n) => n.nodeType === 1 && n.tagName === "H3")?.textContent ?? "";
    // Generic agency price/timeline FAQs repeat across unrelated topics; the scope text remains.
    if (/how much.*(?:website|site).*cost|how long.*(?:build|website)/i.test(question)) continue;
    const query = tokens(question);
    const ranked = [...bodyHeadings, technical].filter((h) => h.parentNode).map((h) => ({ h, score: [...tokens(h.textContent)].filter((w) => query.has(w)).length })).sort((a, b) => b.score - a.score);
    const target = ranked[0]?.score > 0 ? ranked[0].h : technical;
    let anchor = target.nextSibling;
    while (anchor && !(anchor.nodeType === 1 && anchor.tagName === "H2")) anchor = anchor.nextSibling;
    for (const node of group) fragment.insertBefore(node, anchor);
  }
  if (slug === "do-you-need-a-website-if-you-have-whatsapp-business") {
    for (const node of fragment.querySelectorAll("p, li")) {
      const value = node.textContent;
      if (/pricing change happening this October/i.test(value)) node.textContent = "The relevant distinction is which messaging product the business actually uses. Check that product's current permissions, limits and commercial terms through the provider before changing a customer workflow. Do not infer a policy deadline from another product's announcement.";
      else if (/as this October update proves/i.test(value)) node.textContent = "An owned website gives the business a maintained place for service information and a contact route. That does not make it independent from hosting, software or provider requirements; assign responsibility for keeping those dependencies and published facts current.";
      else if (/October 2026|affected by this pricing change/i.test(value)) node.textContent = "This guide does not establish whether a particular account is affected by a pricing change. Verify the selected product and current terms through Meta's official documentation and the business's provider agreement. Record the source and effective date before advising staff or customers that a messaging rule has changed.";
    }
  }
  if (slug === "instagram-reach-drop-2026-why-you-need-a-website") {
    for (const node of fragment.querySelectorAll("p")) {
      if (/Multiple industry benchmarks through 2026/i.test(node.textContent)) node.textContent = "An account's own observations can establish a change in the measures it reports, but this article does not verify an industry-wide 2026 decline or its cause. Compare like reporting periods, note campaign and content changes and state what remains unavailable. A change in non-follower reach needs different interpretation from a broken destination link or an accepted-enquiry failure.";
      if (/2026's algorithm shift is a clear reminder/i.test(node.textContent)) node.textContent = "Give social discovery and the website different, explicit jobs. A social post can introduce approved work, while a stable service or product page explains details and the next action. Keep the destination useful when an old post is shared again. That arrangement can be evaluated through actual enquiries without asserting an unverified algorithm shift or promising that an owned website is unaffected by hosting, software and account dependencies. Review both the public information and the handoff, and preserve the source of any measured comparison so later staff can interpret it accurately.";
    }
  }
  if (slug === "ecommerce-website-cost-mumbai") {
    for (const node of fragment.querySelectorAll("p")) {
      if (/The gap between a .*quote and a .*quote is rarely dishonesty/i.test(node.textContent)) node.textContent = "A price difference is a reason to compare included work, not evidence that one supplier omitted it. Ask each proposal to describe mobile checkout, failed-payment recovery, product publication, access ownership and handover. Test those behaviours against the agreed scope instead of inferring them from a theme or fee. Search visibility is not guaranteed by either implementation. Record unresolved assumptions before choosing a supplier so a later exception can be traced to the original agreement rather than an unsupported claim about what cheap websites always do.";
    }
  }
  const holder = document.createElement("div"); holder.append(fragment);
  const content = withFactualSource(slug, correctFacts(slug, holder.innerHTML));
  if (words(content) < 900) factualIssues.push(`${slug}: restructured content needs substantive depth (${words(content)} words)`);
  if (/<h2[^>]*>\s*(Frequently Asked Questions|FAQs)\s*<\/h2>/i.test(content)) throw new Error(`FAQ structure retained: ${slug}`);
  changes.push({ before: old, kind: "editorial restructuring", values: { title, excerpt: hook.slice(0, 190), content }, words: words(content) });
}
for (const slug of Object.keys(factCorrections).filter((slug) => !changes.some((c) => c.before.slug === slug))) {
  const old = current(slug);
  const content = withFactualSource(slug, correctFacts(slug, old.content));
  const title = slug === 'how-to-choose-web-designer-mumbai' ? 'Choosing a Mumbai Web Developer: Evidence, Scope and Support' : slug === 'website-redesign-seo-checklist-mumbai' ? 'Website Redesign SEO Checks: URL Mapping and Migration Monitoring' : old.title;
  changes.push({ before: old, kind: 'factual correction', values: { title, excerpt: text(content.match(/<p[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? '').slice(0,190), content }, words: words(content) });
}
for (const [slug, path] of Object.entries(consolidations)) {
  const before = current(slug);
  if (path.startsWith("/blog/") && current(path.slice(6)).status !== "published") throw new Error(`Unpublished consolidation target: ${path}`);
  changes.push({ before, kind: "topic consolidation", values: { canonical_url: `https://sitenova.dev${path}` }, words: words(before.content) });
}

const guard = (p) => `id=${literal(p.id)}::uuid and slug=${literal(p.slug)} and title=${literal(p.title)} and status=${literal(p.status)} and md5(content)=${literal(hash(p.content))} and updated_at is not distinct from ${literal(p.updated_at)}::timestamptz and canonical_url is not distinct from ${literal(p.canonical_url)}`;
const statement = ({ before, values }) => `do $repair$ begin\n if not exists(select 1 from public.blog_posts where ${guard(before)} for update) then raise exception 'Archive source changed: ${before.slug}'; end if;\n update public.blog_posts set ${Object.entries(values).map(([key, value]) => `${key}=${key === "blanks_metadata" ? `${literal(JSON.stringify(value))}::jsonb` : literal(value)}`).join(", ")}, updated_at=now() where id=${literal(before.id)}::uuid;\nend $repair$;`;
if (factualIssues.length) throw new Error(factualIssues.join('\n'));
const batches = [];
let batch = [];
let size = 0;
for (const change of changes) {
  const query = statement(change);
  if (size + query.length > 65000 && batch.length) { batches.push(batch); batch = []; size = 0; }
  batch.push(query); size += query.length;
}
if (batch.length) batches.push(batch);
const sqlBatches = batches.map((items, i) => `-- Archive repair batch ${i + 1}. Guarded; preserves status/publication dates.\nbegin;\n${items.join("\n")}\ncommit;\n`);
sqlBatches.forEach((query, i) => writeFileSync(`${directory}/batch-${String(i + 1).padStart(2, "0")}.sql`, query));
writeFileSync(`${directory}/apply.sql`, `-- Complete archive repair. One transaction; stop if any source guard fails.\n-- All UPDATE statements target a stored UUID. Status and published_at are preserved.\nbegin;\n${changes.map(statement).join("\n")}\ncommit;\n`);
writeFileSync(`${directory}/expected.json`, JSON.stringify(changes.map(({ before, kind, values, words }) => ({ id: before.id, slug: before.slug, kind, status: before.status, published_at: before.published_at, old_md5: hash(before.content), words, values })), null, 2) + "\n");
const bySlug = new Map(changes.map((c) => [c.before.slug, c]));
const audit = rows.map((p) => ({ slug: p.slug, status: p.status, action: bySlug.get(p.slug)?.kind ?? (p.canonical_url ? "existing canonical copy retained" : "distinct outline retained"), words: bySlug.get(p.slug)?.words ?? words(p.content) }));
writeFileSync(`${directory}/archive-audit.json`, JSON.stringify(audit, null, 2) + "\n");
const escape = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
const revised = changes.filter((p) => p.kind !== "topic consolidation");
const review = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>SiteNova editorial review</title><style>body{margin:0;background:#0b1020;color:#e8edf8;font:17px/1.75 system-ui,sans-serif}main{max-width:900px;margin:auto;padding:32px 24px}a{color:#7dc4ff}h1,h2,h3{line-height:1.25}header{padding:24px;background:#16223b;border:1px solid #395277;border-radius:16px}nav{padding:24px 0}article{margin:64px 0;padding-top:32px;border-top:1px solid #395277}article h2{margin-top:36px}article h3{font-size:1.1em}small{color:#b8c8e8}code{overflow-wrap:anywhere}li{margin:8px 0}</style><main><header><h1>Blog content review</h1><p>Local editorial reference snapshot. Check README.md for the recorded application status of these ${revised.length} revisions. Existing draft/published states are preserved. No financial or publishing action is available here.</p><p>All 72 rows were audited; ${Object.keys(consolidations).length} overlapping guides are consolidated, with original records retained.</p></header><nav><h2>Revised articles</h2><ol>${revised.map((p) => `<li><a href="#${escape(p.before.slug)}">${escape(p.values.title)}</a> <small>(${p.words} words · ${p.before.status})</small></li>`).join("")}</ol></nav>${revised.map((p) => `<article id="${escape(p.before.slug)}"><h1>${escape(p.values.title)}</h1><small>${escape(p.before.slug)} · ${p.before.status} · ${p.words} words</small>${p.values.content}<p><a href="#">Back to article list</a></p></article>`).join("")}</main></html>`;
writeFileSync(`${directory}/review.html`, review);
console.log(JSON.stringify({ rowsAudited: rows.length, fullRewrites: replacements.length, restructures: plans.length, consolidations: Object.keys(consolidations).length, batches: sqlBatches.length, under900Rewrites: changes.filter((c) => c.kind === "full rewrite" && c.words < 900).length, restructureWordCounts: changes.filter((c) => c.kind === "editorial restructuring").map((c) => ({ slug: c.before.slug, words: c.words })) }, null, 2));
