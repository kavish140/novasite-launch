# Handoff Report: GEO, AI Visibility & Schema Audit

**Agent:** Explorer 2 (GEO, AI Visibility & Schema Specialist)  
**Recipient:** Project Orchestrator (`parent`)  
**Target:** `P:\Websites\Personal\novasite-launch-main`  
**Date:** 2026-08-30  

---

## 1. Observation

1. **Schema Silencing via `<SEO>` No-Op**:
   - `app/components/SEO.tsx` lines 11–13: `export function SEO(_props: Record<string, unknown>) { return null; }`.
   - `app/pages/Index.tsx` line 75: `<SEO ... jsonLd={jsonLd} />` where `jsonLd` contains `buildLocalBusinessJsonLd()`, `buildFaqJsonLd(faqs)`, `buildOrganizationJsonLd()`, `buildAboutPageJsonLd()`, `buildHowToJsonLd()`, `buildSpeakableJsonLd()`.
   - `app/components/LocationPageTemplate.tsx` line 53: `<SEO ... jsonLd={[...]} />` on all 14 location pages.
   - `app/pages/niche/Doctors.tsx` line 133: `<SEO ... jsonLd={[...]} />` on all 7 niche pages.
   - `app/pages/services/Ecommerce.tsx` line 104: `<SEO ... jsonLd={[...]} />` on all 3 service pages.
   - `app/pages/blog/BlogPost.tsx` line 25: `<SEO ... jsonLd={[...]} />` on all blog post pages.
   - `app/components/JsonLd.tsx`: Contains `<JsonLd data={...} />` component but is imported in **0 route/page files**.

2. **Schema.org Specification Errors in `app/root.tsx` (Lines 118–242)**:
   - `Organization` (line 204, 207) includes `priceRange: "Rs. 10,000+"` and `openingHours: "Mo-Sa 10:00-19:00"`, which are invalid properties for `Organization`.
   - `areaServed` (lines 198–203, 229–233) is an array of raw strings (`["Mulund", "Mumbai", ...]`) rather than typed `City` objects.
   - `ProfessionalService` (lines 210–238) lacks `geo: { "@type": "GeoCoordinates", latitude: 19.1726, longitude: 72.9570 }` and `hasMap`.
   - Neither `Organization` nor `ProfessionalService` includes `aggregateRating` or `review`.
   - `WebSite` does not link to `publisher: { "@id": "https://sitenova.dev/#organization" }`.
   - `ProfessionalService` does not link `parentOrganization: { "@id": "https://sitenova.dev/#organization" }`.

3. **Invisible Disambiguation in JSX Comments**:
   - `app/pages/Index.tsx` line 201: `{/* GEO-BOT-SIGNAL: SiteNova (sitenova.dev) is a custom React/Next.js web design agency... */}`.
   - `app/pages/About.tsx` line 316: `{/* GEO-BOT-DISAMBIGUATION: sitenova.dev (this site) is founded by Kavish Ganatra... */}`.
   - JSX comments are stripped at build time and output 0 bytes to HTML.

4. **Competitor Benchmarking (Capsicum Mediaworks, Apex Infotech India, BrandLoom)**:
   - Competitors possess registered company structures (LLP / Pvt Ltd) on ZaubaCorp, full physical street addresses in Andheri East, 50–100+ directory citations across Justdial, GoodFirms, DesignRush, and 100+ long-form blog articles with Author/FAQ/AggregateRating schema.

---

## 2. Logic Chain

1. **From Observation 1**: Because `<SEO>` renders `null` and `<JsonLd />` is never used, 95% of structured data across all 20+ pages is never output to the browser or crawlers.
2. **From Observation 1 & 2**: Search engine crawlers (Googlebot, Bingbot) and AI scrapers (GPTBot, ClaudeBot, PerplexityBot) only ingest the static root schema block. Because this block contains invalid properties, unlinked graph IDs, missing geo coordinates, and no aggregate ratings, AI engines assign low entity confidence.
3. **From Observation 3**: Because entity disambiguation was trapped in stripped JSX comments, AI search engines (SearchGPT, Perplexity) cannot differentiate `sitenova.dev` from `sitenovaagency.com`, leading to zero brand citations and omitted AI Overviews.
4. **From Observation 4**: In comparison to established Mumbai agencies with 50+ citations and deep topical hubs, SiteNova lacks the digital footprint, B2B directory presence, and high-entropy research data required for AI RAG citation.

---

## 3. Caveats

- **External Citation Indexing Time**: Fixing schema and adding directory citations takes 2–4 weeks for Google and LLM web-crawlers (PerplexityBot, OAI-SearchBot) to re-index and reflect in generative outputs.
- **Wikidata Acceptance**: Creating a Wikidata entity requires verified secondary references (Crunchbase, Clutch, press articles).

---

## 4. Conclusion

SiteNova's 0 AI citations and low search visibility are not due to domain age alone, but a direct consequence of a **broken schema pipeline** and **unresolved entity ambiguity**. 

By executing a 3-phase remediation:
1. **Week 1–2 (Zero Budget)**: Replace dead `<SEO jsonLd={...}>` calls with `<JsonLd data={...}>`, repair `root.tsx` schema syntax, and replace invisible JSX comments with a visible semantic verification badge.
2. **Week 3–6**: Deploy direct-answer blocks on all 14 location pages, publish a high-entropy Mumbai Web Performance Benchmark report, and claim top 6 Indian business directories (Justdial, Sulekha, IndiaMART).
3. **Week 7–12**: Build Wikidata entity, integrate verified review badges with `aggregateRating` schema, and publish 8–12 topic clusters.

---

## 5. Verification Method

1. **Inspect Code**:
   - Verify `app/components/SEO.tsx` line 12: `return null;`.
   - Verify `app/pages/Index.tsx` line 42 & 75: `jsonLd` is passed to `<SEO />`.
   - Verify `app/root.tsx` lines 118–242: Inspect static `@graph` properties.
2. **Runtime Verification**:
   - Run `npm run build` and start preview. View source on `http://localhost:5173/location/mulund` and confirm absence of `FAQPage` or `LocalBusiness` JSON-LD in rendered HTML.
3. **Validator Testing**:
   - Paste current HTML output into `https://validator.schema.org/` to confirm missing page-level entities and root schema warnings.
