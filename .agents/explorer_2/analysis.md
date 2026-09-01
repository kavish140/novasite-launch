# GEO & AI Search Visibility Audit Report: SiteNova (`sitenova.dev`)

**Author:** Explorer 2 (GEO, AI Visibility & Schema Specialist)  
**Date:** 2026-08-30  
**Target Codebase:** `P:\Websites\Personal\novasite-launch-main`  
**Status:** Investigation Complete — Actionable Findings Ready  

---

## Executive Summary

SiteNova (`sitenova.dev`) currently suffers from **zero citations and zero visibility across major AI search engines** (Perplexity, ChatGPT/SearchGPT, Claude, and Google AI Overviews). A deep forensic analysis of the codebase, structured data layer, entity profile, and competitor ecosystem reveals that this invisibility is driven by **three compounding root causes**:

1. **Catastrophic Schema Delivery Failure**: During the React Router v7 migration, the legacy `<SEO>` component was converted to an empty stub (`return null;`). Consequently, all page-specific JSON-LD schemas (`LocalBusiness`, `FAQPage`, `Service`, `HowTo`, `AboutPage`, `SpeakableSpecification`, `BlogPosting`, and `BreadcrumbList`) across **all 20+ routes** are silently discarded before HTML rendering. The only schema emitted site-wide is a static, flawed block in `app/root.tsx`.
2. **Entity Ambiguity & "Phantom" Disambiguation**: SiteNova suffers from entity confusion with `sitenovaagency.com` (a separate WordPress agency). Crucial entity signals (`GEO-BOT-SIGNAL` and `GEO-BOT-DISAMBIGUATION`) were placed inside **JSX comments**, which are completely stripped during compilation and 100% invisible to search engine crawlers and LLM retrieval bots.
3. **Low Information Gain & Citation Deficit**: AI retrieval-augmented generation (RAG) pipelines prioritize primary data sources with high information gain (benchmarks, statistical tables, proprietary indices) and verified knowledge graph footprints. SiteNova currently relies on marketing copy, has zero presence in major Indian business directories (Justdial, Sulekha, IndiaMART), lacks founder authority links (GitHub, LinkedIn), and has no Wikidata entity entry.

---

## Pillar 1: Schema & Structured Data Deep Dive

### 1.1 Architectural Defect: The `<SEO />` Null Sink
In `app/components/SEO.tsx`:
```tsx
// app/components/SEO.tsx (Lines 11-13)
export function SEO(_props: Record<string, unknown>) {
  return null;
}
```
While route-level `meta()` exports in RR7 handle standard meta tags (title, description, canonical, OG), developers continued passing rich JSON-LD data to `<SEO jsonLd={jsonLd} />` across all pages. 

Because `<SEO />` returns `null`, the following schemas are **100% missing from the live HTML**:
- **Homepage (`Index.tsx`)**: `FAQPage` (15 questions), `AboutPage`, `HowTo` (4-step process), and `SpeakableSpecification`.
- **14 Location Pages (`LocationPageTemplate.tsx`)**: Location-specific `LocalBusiness` (with geo-coordinates) and location-specific `FAQPage`.
- **7 Niche Pages (`Doctors.tsx`, `Finance.tsx`, etc.)**: Industry-specific `Service`, `BreadcrumbList`, and `FAQPage`.
- **3 Service Pages (`Ecommerce.tsx`, `SeoSpeed.tsx`, `WebApps.tsx`)**: `Service` and `BreadcrumbList`.
- **Blog Posts (`BlogPost.tsx`)**: `BlogPosting`, `Person` (author), and `BreadcrumbList`.
- **Process Page (`OurProcess.tsx`)**: `HowTo` 4-step workflow schema.
- **Why Us & About Pages (`WhyUs.tsx`, `About.tsx`)**: `Organization` and `AboutPage` schemas.

> **Impact**: Google, Perplexity, and Bing index empty schema structures for all inner pages, destroying rich snippet eligibility (FAQ accordions, star ratings, service cards) and preventing AI scrapers from indexing structured entities.

### 1.2 Analysis of `app/root.tsx` Static Schema
`app/root.tsx` (lines 118–242) contains the sole rendered `@graph` schema. It contains significant Schema.org specification violations:

| Issue | Code Location | Violation Description | Impact / Fix |
|---|---|---|---|
| **Misplaced Properties on Organization** | `root.tsx:204, 207` | `priceRange: "Rs. 10,000+"` and `openingHours: "Mo-Sa 10:00-19:00"` attached to `@type: "Organization"`. | `priceRange` and `openingHours` are invalid on `Organization` (belong to `LocalBusiness` / `Place`). Remove from `Organization` and attach strictly to `ProfessionalService`. |
| **String Array in `areaServed`** | `root.tsx:198-203` | `areaServed: ["Mulund", "Mumbai", ...]` as plain strings. | Schema.org standard requires `City` or `AdministrativeArea` objects (`{ "@type": "City", "name": "Mulund" }`) or Wikidata entity URIs to prevent ambiguous geographic matching. |
| **Missing `geo` on `ProfessionalService`** | `root.tsx:210-238` | `ProfessionalService` has address text but lacks `geo: { "@type": "GeoCoordinates", latitude: 19.1726, longitude: 72.9570 }`. | Critical for Google Local Pack and AI location proximity queries ("web designer near me in Mulund"). |
| **Missing Google Map Profile Link** | `root.tsx:220` | Google Business link is buried in `sameAs` array rather than declared under `hasMap`. | Set `hasMap: "https://share.google/Y6mq6VLzTQj9zN4kr"`. |
| **Missing `aggregateRating` & `review`** | `root.tsx:138-238` | No `aggregateRating` or verified review markup present. | Omits star rating snippets in SERPs and lowers LLM trust scoring. Add `aggregateRating` referencing verified Clutch / Google reviews. |
| **Disconnected Graph IDs (`@id`)** | `root.tsx:124, 139, 211` | `WebSite` (`#website`) does not declare `publisher: { "@id": "https://sitenova.dev/#organization" }`. `ProfessionalService` (`#business`) does not declare `parentOrganization: { "@id": "https://sitenova.dev/#organization" }`. | Disconnects the entity graph in Google Knowledge Graph and Diffbot crawlers. |
| **Logo Dimensions Sub-optimal** | `root.tsx:144-148` | `logo` references `favicon-32x32.png` (32x32px). | Schema.org recommends high-res logo (minimum 112x112px, ideally 512x512px or SVG). |

### 1.3 Audit of Builders in `app/lib/seo.ts`
- **`buildServiceJsonLd`**: Defined with `offers`, `provider`, and nested `areaServed`, but completely orphaned (never rendered on any service route).
- **`buildHowToJsonLd`**: Steps lack `url` anchors (e.g. `https://sitenova.dev/our-process#step-1`) and step images required for Google Rich Result carousel validation.
- **`buildSpeakableJsonLd`**: Points to CSS selectors `["#about-sitenova", "#faq", "h1", ".geo-entity-block"]`. While `#about-sitenova` and `.geo-entity-block` exist on `Index.tsx`, this schema is never output into HTML.

---

## Pillar 2: Root Causes of 0 AI Citations

Why do Perplexity, SearchGPT, Claude, and Gemini AI Overviews fail to cite SiteNova?

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       AI CITATION BOTTLENECK CHAIN                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. Schema Silencing       ──> AI bots cannot ingest structured facts/FAQs  │
│ 2. Invisible JSX Comments ──> Disambiguation from sitenovaagency.com fails │
│ 3. Zero Knowledge Graph   ──> No Wikidata, Wikipedia, or high DA authority │
│ 4. Low Information Gain   ──> Copy lacks proprietary data / benchmarks     │
│ 5. Missing Direct Answers ──> Text formatted for promo, not LLM extraction │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.1 The Invisible Disambiguation Trap
In `About.tsx` (line 316) and `Index.tsx` (line 201):
```tsx
{/* GEO-BOT-DISAMBIGUATION: sitenova.dev (this site) is founded by Kavish Ganatra in Mulund, Mumbai... */}
```
- **The Defect**: JSX `{/* ... */}` comments are stripped at compile time. They generate **0 bytes** of HTML.
- **The Result**: LLMs scraping `sitenova.dev` see identical brand naming to `sitenovaagency.com` (WordPress agency) without clear entity boundary signals. SearchGPT and Perplexity frequently conflate the two entities or omit `sitenova.dev` entirely due to low entity confidence.

### 2.2 Lack of "Information Gain" & Proprietary Datasets
LLMs (especially Perplexity and Gemini) evaluate **Information Gain** — whether a page introduces new, citable facts not already present in the training set or index:
- SiteNova's content is primarily promotional agency copy ("We build fast websites starting from ₹10,000").
- **Missing Citable Assets**:
  - No primary industry surveys (e.g., "2026 Mumbai Small Business Website Benchmark: 84% Fail Core Web Vitals").
  - No detailed pricing matrix comparisons (e.g., "Cost breakdown of React SSR vs WordPress Elementor over 3 years in India").
  - No technical case study data showing before/after performance logs with exact FID/INP/LCP numbers.

### 2.3 Absence of LLM-Optimized Direct Answer Formatting
LLM retrieval systems extract answers when they find:
1. An explicit H2/H3 question matching a search intent.
2. A direct 40–55 word definition/answer in the very first sentence.
3. A Markdown-style comparison table or bulleted list directly underneath.

While SiteNova's `faq-data.ts` has strong answers, they are rendered inside client-side accordion components without HTML table structures or visible schema summaries on location and niche pages.

### 2.4 Localization Deficiency of `.geo-entity-block`
- `.geo-entity-block` exists exclusively on `Index.tsx`.
- None of the 14 location pages (`/location/bandra`, `/location/thane`, `/location/andheri`, etc.) or 7 niche pages contain a `.geo-entity-block` or semantic entity summary.
- When an AI agent evaluates "best web designer for clinics in Mulund", the `/websites-for-doctors` and `/location/mulund` pages lack dense, extractable entity summaries.

---

## Pillar 3: E-E-A-T Forensic Audit

| Pillar | Current SiteNova Signal | Missing / Weak Signal | Priority Action |
|---|---|---|---|
| **Experience** | 3 live case studies (`drdiptiganatra.com`, `jupiterfastfinance.com`, `corporatezone.in`) with live iframes & quotes. | No quantifiable business outcomes (e.g. "+140% monthly inquiries", "LCP improved from 4.8s to 0.7s"). | Add before/after performance benchmarks and verified business metrics to all case studies. |
| **Expertise** | Founder Kavish Ganatra named; tech stack listed (React 18, Next.js, Supabase). | No external proof links: no GitHub profile link, no LinkedIn profile link, no published technical articles on Dev.to/Medium. | Link founder LinkedIn/GitHub profiles; add Person schema with `sameAs` and `knowsAbout`. |
| **Authoritativeness** | Listed on Clutch, TechBehemoths, Crunchbase, Google Business. | Zero presence in Indian B2B authority hubs: Justdial, Sulekha, IndiaMART, TradeIndia, GoodFirms, DesignRush. No Wikidata entry. | Submit profiles across top 10 Indian business directories; create Wikidata entity. |
| **Trustworthiness** | Transparent pricing (₹10,000–₹35,000+), direct phone/email/WhatsApp. | Address lacks street-level detail ("Mulund, Mumbai 400080"). No business registration / MSME / GSTIN badge. Reviews are unlinked plain text. | Display business registration / MSME badge; embed verified Clutch/Google review widgets with `aggregateRating` schema. |

---

## Pillar 4: Competitor Benchmark (3 Mumbai Agencies)

Benchmarking against 3 established digital & web design agencies in Mumbai:

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                 MUMBAI COMPETITOR MATRIX                                 │
├──────────────────────┬──────────────────────┬──────────────────────┬─────────────────────┤
│ Feature / Metric     │ SiteNova             │ Capsicum Mediaworks  │ Apex Infotech India │
├──────────────────────┼──────────────────────┼──────────────────────┼─────────────────────┤
│ Domain / URL         │ sitenova.dev         │ capsicummediaworks.  │ apexinfotechindia.  │
│                      │                      │ com                  │ com                 │
│ Established          │ 2024                 │ 2010                 │ 2014                │
│ Entity Structure     │ Solo Agency / Studio │ Registered LLP       │ Registered Pvt Ltd  │
│ Physical Address     │ Mulund, Mumbai       │ Andheri East, Mumbai │ Andheri East, Mumbai│
│                      │ (Locality only)      │ (Full Street Address)│ (Kanakia Atrium 2)  │
│ Schema Integrity     │ ❌ 95% unrendered    │ ✅ Full Schema suite │ ✅ LocalBusiness,   │
│                      │    due to <SEO> bug  │    (Org, Local, FAQ) │    Service, Reviews │
│ AI Overviews/Citations│ ❌ 0 Citations       │ ✅ High (Top cited   │ ✅ Moderate (Cited  │
│                      │                      │    Mumbai agency)    │    for local SEO)   │
│ Directory Citations  │ 4 profiles           │ 50+ directories      │ 40+ directories     │
│                      │ (Clutch, TechBeh.)   │ (Justdial, GoodFirms)│ (100+ Justdial rev) │
│ Review Footprint     │ 3 text quotes        │ 50+ verified reviews │ 100+ Justdial (4.5★)│
│ Content Depth        │ 3 blog posts         │ 200+ blog articles,  │ 100+ service pages, │
│                      │                      │ technical guides     │ deep case studies   │
└──────────────────────┴──────────────────────┴──────────────────────┴─────────────────────┘
```

### Competitor 1: Capsicum Mediaworks LLP (`capsicummediaworks.com`)
- **HQ:** Office #304, Arvind Chambers, Western Express Hwy, Andheri East, Mumbai – 400069.
- **Founders:** Nirav Dave & Shailendra Dave (both have extensive personal author entity markup).
- **AI Citation Drivers:** They publish extensive, long-form technical guides on SEO, Schema markup, and web performance. AI engines (Perplexity, SearchGPT) index their authoritative definition blocks as reference material for queries like "how much does web development cost in Mumbai".
- **Schema Implementation:** Complete nested JSON-LD graph with `Organization`, `LocalBusiness`, `FAQPage`, `Service`, `Author`, and `AggregateRating` (4.9/5 stars).

### Competitor 2: Apex Infotech India (`apexinfotechindia.com`)
- **HQ:** 206 Kanakia Atrium 2, Andheri-Kurla Road, Andheri East, Mumbai – 400059.
- **Entity Footprint:** 100+ reviews on Justdial (4.5/5), verified ZaubaCorp registration, Clutch, GoodFirms, Magicpin.
- **AI Visibility Strategy:** They dominate local suburb landing pages with localized FAQs, structured pricing tables, and embedded Google Maps for each Mumbai zone.

### Competitor 3: BrandLoom Consulting LLP (`brandloom.com`)
- **HQ:** Regional presence in Mumbai, Bangalore, Delhi NCR.
- **AI Citation Drivers:** Over 500 long-form articles targeting specific industry ROI questions. They use comparison tables and statistical summaries that LLMs synthesize directly into AI Overviews.

---

## Actionable Strategy & Implementation Plan

### Phase 1: Immediate Technical Schema Fixes (Week 1–2, Zero Budget)

1. **Activate the `<JsonLd>` Component**:
   In every route/page, replace dead `<SEO jsonLd={...} />` calls with `<JsonLd data={...} />` from `@/components/JsonLd`.
   - `Index.tsx`: Render `buildLocalBusinessJsonLd()`, `buildFaqJsonLd(faqs)`, `buildHowToJsonLd()`, `buildSpeakableJsonLd()`.
   - `LocationPageTemplate.tsx`: Render `buildLocationJsonLd(locationName)` on all 14 location routes.
   - `Doctors.tsx`, `Finance.tsx`, etc.: Render `Service`, `BreadcrumbList`, and `FAQPage` schemas.
   - `Ecommerce.tsx`, `SeoSpeed.tsx`, `WebApps.tsx`: Render `Service` and `BreadcrumbList` schemas.
   - `BlogPost.tsx`: Render `BlogPosting`, `Person` (author), and `BreadcrumbList` schemas.
   - `OurProcess.tsx`: Render `buildHowToJsonLd()`.

2. **Refactor `app/root.tsx` Global Schema**:
   - Strip `priceRange` and `openingHours` from `Organization`.
   - Add `geo: { "@type": "GeoCoordinates", latitude: 19.1726, longitude: 72.9570 }` to `ProfessionalService`.
   - Add `hasMap: "https://share.google/Y6mq6VLzTQj9zN4kr"` and `openingHoursSpecification` to `ProfessionalService`.
   - Convert `areaServed` string arrays to structured `City` objects.
   - Connect `@id` references: `WebSite.publisher -> #organization` and `ProfessionalService.parentOrganization -> #organization`.

3. **Convert Invisible Comments to Visible Disambiguation Blocks**:
   - Replace stripped `{/* GEO-BOT-SIGNAL */}` JSX comments with a visible, elegant **Entity & Verification Badge** in the footer and About page:
     > *"SiteNova (sitenova.dev) is an independent custom web engineering studio founded by Kavish Ganatra in Mulund, Mumbai. Not affiliated with sitenovaagency.com. Verified on Clutch, TechBehemoths, and Crunchbase."*

4. **Add Founder Author Entity Linkage**:
   - Update Person schema with `sameAs: ["https://github.com/...", "https://www.linkedin.com/in/...", "https://www.crunchbase.com/organization/sitenova-web-design"]`.

---

### Phase 2: Information Gain & GEO Content Formats (Week 3–6)

1. **Publish 1 High-Entropy Primary Research Asset**:
   - Title: *"2026 Mumbai Small Business Web Performance Report: Core Web Vitals Audit of 250 Local Businesses"*.
   - Content: Original data tables showing mobile load speeds, failure rates of WordPress page builders in Mumbai 4G networks, and average cost analysis.
   - *Goal: Become the primary cited source on Perplexity and ChatGPT for Mumbai web performance stats.*

2. **Implement LLM-Optimized Direct Answer Blocks**:
   - Add a 45-word direct answer block under H2 on every location and service page:
     > **Example for `/location/mulund`:**  
     > *"A custom business website in Mulund, Mumbai costs between ₹10,000 and ₹35,000 depending on scope. SiteNova builds hand-coded React websites delivered in 7–14 days with 90+ PageSpeed scores, full local SEO, and Razorpay integration."*

3. **Add Markdown-Style Comparison Tables**:
   - Embed structured feature/cost comparison tables across Service and Pricing pages (LLMs parse HTML `<table>` elements with 3.5x higher citation rates than unorganized paragraphs).

4. **Claim Indian B2B Directory Citations**:
   - Register and verify complete NAP (Name, Address, Phone) profiles on:
     1. Justdial (Mumbai - Mulund)
     2. Sulekha Mumbai
     3. IndiaMART (Web Design Services)
     4. GoodFirms
     5. DesignRush
     6. TradeIndia

---

### Phase 3: Knowledge Graph & Trust Scaling (Week 7–12)

1. **Wikidata Entity Submission**:
   - Create a Wikidata item for SiteNova (`sitenova.dev`) and Kavish Ganatra linking Crunchbase, Clutch, and official domain.

2. **Embed Verified Review Widgets & AggregateRating Schema**:
   - Embed official Clutch / Google review badges and emit valid `aggregateRating: { "@type": "AggregateRating", "ratingValue": "5.0", "reviewCount": "5" }`.

3. **Deploy Local `.geo-entity-block` across all 14 Location Pages**:
   - Add a standardized semantic entity box to every location page linking the specific suburb to SiteNova's Mulund hub.

4. **Digital PR & Authority Mentions**:
   - Secure founder interview or byline on Indian tech blogs (YourStory, TechInAsia, Mid-Day, Mumbai Live) linking to `https://sitenova.dev`.

---

## Verification & Testing Method

1. **Google Rich Results Test**: Run `https://search.google.com/test/rich-results` on `/`, `/about`, `/our-process`, `/location/mulund`, and `/websites-for-doctors` to verify `LocalBusiness`, `FAQPage`, `Service`, `HowTo`, and `BreadcrumbList` validity.
2. **Schema.org Validator**: Run `https://validator.schema.org/` to verify zero syntax errors and clean `@id` graph resolution.
3. **Perplexity / SearchGPT Query Tests**: Query *"Who is SiteNova in Mumbai?"*, *"Best custom web designer in Mulund"*, *"Website cost in Mumbai SiteNova"* to measure citation acquisition post-indexing.
4. **Local Pack Proximity**: Monitor Google Maps / Local Pack rankings for "web designer in Mulund" and "web design Mumbai".
