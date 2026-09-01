# Original User Request

## 2026-08-30T14:10:44Z

SiteNova (sitenova.dev) is a Mumbai-based custom web design & development agency founded in 2024. Despite being live for ~6 months, the site has received near-zero organic leads. The task is to perform a comprehensive growth audit across SEO, GEO (AI visibility), content, local presence, and conversion — and produce a prioritised, actionable roadmap the solo founder can execute step by step.

Working directory: ~/teamwork_projects/sitenova_growth_audit
Integrity mode: benchmark

---

## Business Context

- **Business**: SiteNova — custom web design, e-commerce, web apps, SEO audits
- **URL**: https://sitenova.dev
- **Location**: Mulund, Mumbai, Maharashtra, India
- **Target market**: Local Mumbai-area businesses (Mulund, Thane, Bhandup, Andheri, etc.) + India-wide
- **Pricing**: Starts from ₹10,000; Business sites ₹15,000; E-commerce ₹18,000; Apps ₹30,000
- **Founder**: Solo founder, Kavish Ganatra
- **Launch date**: ~February 2026 (6 months ago)

## Analytics Snapshot (Aug 2–29, 2026 — GA4 + Clarity)

### Traffic
- Active users (28d): 105 | New users: 98 | Avg engagement: 52s
- Organic (google/organic): only **19 first-touch users**, **22 sessions** in 28 days
- Paid (ads.google.com): 26 sessions
- Direct / (none): 80 sessions — site is surviving on dark traffic + paid ads
- Top organic landing pages by views: /location/mulund (highest), /free-audit, blog posts

### Acquisition breakdown (first user source)
direct/(none): 78 | google/organic: 19 | google/cpc: 8 | referrals: minimal

### City breakdown
Mumbai: 20 | Glenview (US): 11 | Council Bluffs (US): 5 | New York: 3 — significant non-India traffic suggests keyword misalignment

### UX signals (Microsoft Clarity, last 3 days)
- Dead clicks: **42.86%** (CTAs or buttons not working as expected)
- Quick backs: **42.86%** (pages not matching search intent)
- Scroll depth: 73.44% avg (content IS being read)
- Pages/session: 7.86 | Active time: 4.0 min (engaged visitors)
- Top pages by visits: /lp/web-design (40), /lp/thank-you-audit (13), /lp/thank-you-quote (12), / (5), /free-audit (5), /quote (2)

### Core Web Vitals (Clarity Performance)
- Performance score: 85/100
- LCP: 2s ✅ | INP: 310ms ⚠️ (needs improvement) | CLS: 0 ✅

### GEO / AI Visibility (Clarity AI Visibility tab)
- **Citations: 0** across all tracked AI systems (Microsoft Copilot + partners)
- Share of Authority: no data
- AI referral traffic: <1%
- Grounding queries: no data
- Cited pages: none

---

## Requirements

### R1. Full SEO Audit — Technical, On-Page, and Off-Page

Audit sitenova.dev against current Google ranking factors for the target market (Mumbai-based SMBs searching for web design services in Hindi/English). Identify the specific gaps that explain why only 19 organic users arrived in 28 days despite the site having 35+ pages. Cover:
- Technical SEO: crawlability, indexation status, sitemap health, canonical tags, hreflang, internal linking structure, page speed (especially INP 310ms issue), mobile usability
- On-page SEO: title tag and meta description quality, keyword targeting (are pages targeting terms with actual search volume?), heading hierarchy, content depth vs. competitors
- Off-page / authority: domain authority, backlink profile, citation consistency across directories (Clutch, TechBehemoths, Crunchbase, Google Business), NAP consistency
- Local SEO: Google Business Profile completeness, local citation coverage, geo-targeted content gaps across the 14 location pages

### R2. GEO Audit — AI Citation and Generative Engine Visibility

The site currently has 0 AI citations (confirmed via Clarity AI Visibility). Audit why SiteNova is not being cited by AI tools (ChatGPT, Gemini, Perplexity, Copilot) for relevant queries like best web designer in Mumbai or website design agency Mulund. Cover:
- Speakable Schema and other structured data completeness (the site uses geo-entity-block CSS class and has JSON-LD builders in pp/lib/seo.ts)
- E-E-A-T signals: author bio, founder credentials, business verification signals, first-hand experience content
- Content formats AI tools prefer to cite: FAQs, how-tos, comparison content, specific statistics
- Whether the current GEO content blocks on the homepage are sufficient or need expansion
- What competitor agencies in Mumbai are doing that makes them AI-visible

### R3. Content Strategy Audit

The site has a blog, 7 niche pages, 14 location pages, and 4 service pages. Despite this, content is barely driving traffic. Audit:
- Which existing pages have the highest ranking potential and what's holding them back
- Keyword gaps: what terms do Mumbai-area businesses actually search for when looking for a web designer? (Identify 15–25 specific target keywords with realistic ranking probability)
- Blog content quality and topical authority gaps — is there a content cluster strategy? Is the blog covering topics that establish topical authority?
- Whether the current page structure (niche + location + service) is being leveraged correctly or creating thin/duplicate content issues

### R4. Conversion Audit

When visitors DO arrive, 42.86% dead-click and 42.86% quick-back. Audit:
- Which CTAs are failing (dead clicks suggest links/buttons not behaving as expected)
- Quick-back pattern: are the pages matching the intent of visitors who land on them?
- The paid LP (/lp/web-design) gets 40 visits but conversions land on thank-you pages — assess funnel health
- Recommendations to improve lead capture rate from existing traffic before scaling

### R5. Prioritised 90-Day Roadmap

Synthesise findings into a week-by-week action plan the solo founder can realistically execute. Group actions by:
- **Week 1–2**: Quick wins (no-code changes, zero cost) — fixes with highest impact:effort ratio
- **Week 3–6**: Medium effort (content creation, directory submissions, schema improvements)
- **Week 7–12**: Sustained effort (link building, new content, local outreach)

Each action must include: expected impact (High/Med/Low), effort estimate (hours), and whether it's free or paid.

---

## Verification Plan

The output is a strategy report. An independent reviewer should verify it against this rubric:

### Completeness
- [ ] All 5 requirement areas (SEO technical, GEO, content, conversion, roadmap) are covered
- [ ] At least 15 specific target keywords are identified with search volume estimates or difficulty ratings
- [ ] At least 10 specific actionable fixes are listed in the roadmap
- [ ] GEO section explains the 0-citation problem with specific, fixable root causes

### Specificity
- [ ] All recommendations are specific to sitenova.dev — not generic SEO advice
- [ ] The INP 310ms issue has a specific diagnosis and fix suggestion
- [ ] The dead-click and quick-back patterns have specific page-level diagnoses
- [ ] Competitor comparison includes at least 3 real Mumbai web design agencies that outrank SiteNova

### Actionability
- [ ] Every recommendation includes at least one concrete next action
- [ ] The 90-day roadmap is week-by-week and realistic for a solo founder
- [ ] At least 5 quick wins (Week 1–2) require zero budget

### Quality
- [ ] Report does not contradict what is already working (e.g., good LCP, deep scroll engagement)
- [ ] GEO recommendations are specific to how modern LLMs (GPT-4, Gemini, Copilot) ground answers
- [ ] Report acknowledges the codebase structure (React Router v7, SSR, JSON-LD builders in pp/lib/seo.ts) when suggesting schema improvements

---

## Codebase Reference

The repository is at p:\Websites\Personal\novasite-launch-main. Key files relevant to this audit:
- pp/lib/seo.ts — JSON-LD structured data builders
- pp/lib/meta.ts — uildMeta() for all page meta tags
- pp/lib/constants.ts — contact info constants
- pp/index.css — includes .geo-entity-block CSS class for GEO content targeting
- AGENTS.md — full project documentation (read this first)
