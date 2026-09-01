# SiteNova 90-Day Step-by-Step Growth & Execution Roadmap
**Target:** `sitenova.dev` (SiteNova)  
**Author:** Project Orchestrator & Specialist Team  
**Date:** 2026-08-30  
**Status:** Approved for Implementation

---

## Roadmap Architecture & Strategic Phases

This 90-day execution roadmap is engineered specifically for a **solo founder / lead developer** to execute systematically. It is organized into 3 distinct operational phases with clear week-by-week actions, impact ratings, effort estimates, and budget allocations:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                SITENOVA 90-DAY EXECUTION TIMELINE                                │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Phase 1: Weeks 1–2  ──> Quick Wins & Revenue Leak Plugs (>= 5 Zero-Budget Fixes)                │
│ Phase 2: Weeks 3–6  ──> Core Web Vitals, Schema Overhaul & Content Differentiation               │
│ Phase 3: Weeks 7–12 ──> Topical Authority, AI Citation Engine & Scaling Inbound Funnels          │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Weeks 1–2 — Quick Wins & Revenue Leak Plugs (Zero Budget)

### Focus: Fix broken tracking, eliminate conversion blockers, re-activate structured data, and stop ad waste.

| Task # | Specific Action Item | Target Code / Asset | Impact | Effort | Cost | Verification Method |
|---|---|---|---|---|---|---|
| **W1.1** | **Fix QuoteWizard Step 2 Blocker on Paid LP**<br>Remove `disabled={requirements.trim().length < 10}` in `WebDesignLP.tsx`. Make requirements optional or add click-time inline error. | `app/pages/lp/WebDesignLP.tsx:357` | **CRITICAL** | 15 mins | ₹0 | Test quote wizard on mobile: proceed to Step 3 without typing in textarea. |
| **W1.2** | **Add Missing Google Ads Conversion Tag to Paid LP**<br>Add `trackGoogleAdsConversion("FLS8CJvM3LscEJy2kd5D")` inside `useEffect` in `LpThankYouQuote.tsx`. | `app/pages/lp/LpThankYouQuote.tsx:20` | **CRITICAL** | 10 mins | ₹0 | Submit LP quote; inspect Google Tag Assistant / Network tab for `AW-18182593308` beacon. |
| **W1.3** | **Re-Activate Schema Across 20+ Pages via `<JsonLd>`**<br>Replace dead `<SEO jsonLd={...} />` calls with `<JsonLd data={...} />` in `Index.tsx`, `LocationPageTemplate.tsx`, `niche/*.tsx`, `services/*.tsx`, and `BlogPost.tsx`. | `app/pages/Index.tsx`<br>`app/components/LocationPageTemplate.tsx`<br>`app/pages/niche/*.tsx` | **CRITICAL** | 2 hours | ₹0 | Run Google Rich Results Test on `/` and `/location/mulund`. Verify `FAQPage`, `Service`, `LocalBusiness`. |
| **W1.4** | **Eliminate Top 5 Dead-Click CSS Affordances**<br>1. Remove `.interactive-card` from hero subtitle badge & preview image.<br>2. Link 6 feature cards in `FeaturesSection.tsx` to `/services/*`.<br>3. Link price chips in `Index.tsx` to `/pricing`.<br>4. Link "5-Star Rated" badge to Google Business reviews. | `app/components/HeroSection.tsx`<br>`app/components/FeaturesSection.tsx`<br>`app/pages/Index.tsx` | **HIGH** | 1.5 hours | ₹0 | Click all hero and feature elements; verify expected navigation or static cursor state. |
| **W1.5** | **Fix Robots.txt RFC 9309 Leak & Add `noindex` to `/thank-you`**<br>1. Consolidate `public/robots.txt` disallows into all specific user-agent blocks.<br>2. Add `Disallow: /admin*`, `/lp/thank-you*`, `/downloads/`.<br>3. Add `noindex: true` in `app/routes/thank-you.tsx`. | `public/robots.txt`<br>`app/routes/thank-you.tsx` | **HIGH** | 30 mins | ₹0 | Check `robots.txt` with Google Search Console tester and inspect `<meta name="robots">` on `/thank-you`. |
| **W1.6** | **Expose Core Service Pages in Navbar Dropdown**<br>Add `/services/ecommerce`, `/services/seo-optimization`, and `/services/web-applications` to the "Services" dropdown in `Navbar.tsx`. | `app/components/Navbar.tsx:14-57` | **HIGH** | 30 mins | ₹0 | Verify desktop and mobile navbar dropdown displays both core services and niche verticals. |
| **W1.7** | **Remove WhatsApp Qualification Modal**<br>Remove `showQualifier` step in `BookCallWidget.tsx`. Make WhatsApp buttons direct links to `buildWhatsAppUrl()`. | `app/components/BookCallWidget.tsx` | **HIGH** | 20 mins | ₹0 | Tap WhatsApp button on mobile; verify direct opening of WhatsApp app without modal friction. |
| **W1.8** | **Convert Invisible JSX Comments to Visible Entity Proof**<br>Replace `{/* GEO-BOT-DISAMBIGUATION */}` with an entity footer badge clarifying Mulund, Mumbai ownership and disassociating from `sitenovaagency.com`. | `app/components/Footer.tsx`<br>`app/pages/About.tsx` | **HIGH** | 30 mins | ₹0 | View page source; verify text is present in static SSR HTML. |

---

## Phase 2: Weeks 3–6 — Core Web Vitals, Schema Overhaul & Content Differentiation

### Focus: Slash INP to < 150ms, enrich the 14 location pages to eliminate doorway risk, and publish foundational E-E-A-T assets.

| Week | Action Item & Deliverables | Target Files | Impact | Effort | Cost | Verification Method |
|---|---|---|---|---|---|---|
| **Week 3** | **INP 310ms Remediation (Phase 1 — Iframe Elimination)**<br>• In `app/lib/portfolio-meta.ts`, change `useIframePreview: false` for all portfolio items.<br>• Display high-resolution WebP thumbnails with an on-demand "Load Live Demo" button.<br>• In `ScrollProgress.tsx`, replace `useSpring` with lightweight CSS width transition.<br>• Throttle `useScroll` transforms in `HeroSection.tsx`. | `app/lib/portfolio-meta.ts`<br>`app/components/PortfolioSection.tsx`<br>`app/components/ScrollProgress.tsx`<br>`app/components/HeroSection.tsx` | **CRITICAL** | 4 hours | ₹0 | Run Chrome DevTools Performance Trace during scrolling; verify INP drops below 150ms. |
| **Week 3** | **3rd-Party Script Optimization**<br>• Move GA4, Google Ads, and Clarity initialization to `requestIdleCallback` or after first user scroll/touch event.<br>• Attach HTTP security headers in `workers/app.ts` (`X-Content-Type-Options`, `X-Frame-Options`, `HSTS`). | `app/root.tsx`<br>`workers/app.ts` | **HIGH** | 2 hours | ₹0 | Verify 0 script execution blocking during 0–3s page load window. |
| **Week 4** | **Location Pages Enrichment (Eliminate Doorway Risk — 5 Core Suburbs)**<br>• Rewrite `/location/mulund`, `/location/thane`, `/location/bandra`, `/location/andheri`, and `/location/powai`.<br>• Expand unique copy from 150w to 450w+.<br>• Add localized commercial landmarks (e.g., LBS Road in Mulund, BKC in Bandra, MIDC in Andheri).<br>• Add custom local FAQs and embed Google Business Map for Mulund. | `app/pages/locations/Mulund.tsx`<br>`Thane.tsx`<br>`Bandra.tsx`<br>`Andheri.tsx`<br>`Powai.tsx`<br>`LocationPageTemplate.tsx` | **HIGH** | 6 hours | ₹0 | Verify unique text ratio exceeds 50% on these 5 key location pages. |
| **Week 4** | **Schema.org Graph Optimization**<br>• Clean `app/root.tsx` schema: remove `priceRange`/`openingHours` from `Organization` and attach to `ProfessionalService`.<br>• Add `geo: { latitude: 19.1726, longitude: 72.9570 }` and `postalCode: "400080"`.<br>• Link `@id` graph references (`WebSite.publisher -> #organization`). | `app/root.tsx`<br>`app/lib/seo.ts` | **HIGH** | 2 hours | ₹0 | Schema.org validator reports 0 errors and a clean interconnected entity graph. |
| **Week 5** | **Location Pages Enrichment (Remaining 9 Suburbs)**<br>• Rewrite `/location/bhandup`, `nahur`, `ghatkopar`, `vikhroli`, `kurla`, `dadar`, `lower-parel`, `mahalakshmi`, `pedder-road`.<br>• Inject unique local sub-market details and cross-link to relevant niche pages. | `app/pages/locations/*.tsx` | **HIGH** | 8 hours | ₹0 | Audit all 14 location routes in Copyleaks / diff checker for >50% uniqueness. |
| **Week 5** | **Claim Top Indian B2B Directory Citations (Free)**<br>• Create and verify complete NAP listings on Justdial (Mulund, Mumbai), Sulekha, IndiaMART, TradeIndia, and GoodFirms.<br>• Add directory URLs to Schema `sameAs` array. | External Directories<br>`app/lib/seo.ts` | **HIGH** | 5 hours | ₹0 | Verify NAP string exact match across all 5 directories. |
| **Week 6** | **Enrich Thin Niche & Service Pages**<br>• Expand `/services/web-applications` (602w -> 1,200w) with React SSR architecture diagrams, security, and Supabase integration.<br>• Expand `/websites-for-restaurants` (563w -> 1,000w) and `/websites-for-startups` (583w -> 1,000w). | `app/pages/services/WebApps.tsx`<br>`app/pages/niche/Restaurants.tsx`<br>`Startups.tsx` | **HIGH** | 6 hours | ₹0 | Review word count and content completeness. |

---

## Phase 3: Weeks 7–12 — Topical Authority, AI Citation Engine & Scaling Inbound Funnels

### Focus: Establish domain authority via topical clusters, capture AI search engine citations, and scale high-intent inbound organic leads.

| Week | Action Item & Deliverables | Target Files / Assets | Impact | Effort | Cost | Verification Method |
|---|---|---|---|---|---|---|
| **Week 7** | **Publish Flagship Primary Research Asset (Information Gain Engine)**<br>• Author & publish: *"2026 Mumbai Small Business Web Performance Report: Core Web Vitals Audit of 250 Local Businesses"*.<br>• Include original data tables on mobile load times, WordPress failure rates on Mumbai 4G networks, and average dev costs.<br>• Format with structured HTML tables for LLM ingestion. | `app/pages/blog/mumbai-web-performance-report-2026.tsx`<br>`public/assets/report/` | **CRITICAL (GEO)** | 8 hours | ₹0 | Query Perplexity / SearchGPT 14 days post-indexing: *"Mumbai small business website performance benchmark"*. |
| **Week 8** | **Roll Out Topical Authority Cluster 1: Web Economics in Mumbai**<br>• Pillar 1: *"How Much Does a Website Cost in Mumbai? (2026 Price Breakdown)"* (`/blog/website-cost-mumbai-2026`).<br>• Cluster 1A: *"Freelancer vs Agency vs DIY in Mumbai: Total Cost of Ownership"*.<br>• Cluster 1B: *"The Hidden Costs of Cheap ₹3,000 WordPress Websites in India"*. | `app/pages/blog/*`<br>Supabase `blog_posts` | **HIGH** | 8 hours | ₹0 | Check indexation in Google Search Console; monitor rankings for `website design cost in mumbai`. |
| **Week 9** | **Roll Out Topical Authority Cluster 2: Modern Web Performance**<br>• Pillar 2: *"Why React & Next.js Outperform WordPress for Local Business Lead Generation"*.<br>• Cluster 2A: *"How PageSpeed 90+ Slashes Google Ads CPC by 30% in India"*.<br>• Cluster 2B: *"Core Web Vitals Optimization Guide: Fixing INP and LCP on Edge Workers"*. | `app/pages/blog/*`<br>Supabase `blog_posts` | **HIGH** | 8 hours | ₹0 | Monitor SERP movement for `react js web development company mumbai`. |
| **Week 10** | **Execute 20 High-Intent Keyword Optimization on Target URLs**<br>• Deploy exact H1, H2, meta descriptions, and localized FAQ markup mapped in Section 3.2 across all 20 target URLs.<br>• Embed interactive cost estimator CTA on `/pricing` and `/website-cost-calculator`. | 20 Target Route Files | **HIGH** | 6 hours | ₹0 | Track keyword rankings in Google Search Console for all 20 mapped target terms. |
| **Week 11** | **E-E-A-T & Case Study ROI Transformation**<br>• Upgrade client portfolio pages (`/portfolio/*`) with verified metrics (e.g., Dr. Dipti Ganatra: *"3.2x increase in online patient enquiries; PageSpeed improved from 38 to 99"*).<br>• Embed official Google Reviews & Clutch badge widgets with `AggregateRating` schema. | `app/pages/portfolio/*`<br>`app/lib/seo.ts` | **HIGH** | 5 hours | ₹0 | Rich snippet stars appear in Google search results. |
| **Week 12** | **Full System Audit & Conversion Optimization Review**<br>• Re-measure INP, LCP, CLS on mobile.<br>• Re-audit dead-click and quick-back metrics.<br>• Review Google Ads cost-per-lead post-conversion pixel activation.<br>• Review AI search engine visibility across Perplexity, SearchGPT, and Google AI Overviews. | Full Site Review | **HIGH** | 4 hours | ₹0 | 90-day progress report showing traffic growth, lead count, and AI citation presence. |

---

## Resource & Cost Summary Matrix

| Phase | Duration | Solo Founder Effort (Hours) | External Tool / Ad Budget | Primary Expected Outcome |
|---|---|---|---|---|
| **Phase 1: Quick Wins** | Weeks 1–2 | ~8–10 hours | **₹0** | Stop paid ad lead leaks, re-activate schema across 20+ pages, eliminate 42% dead clicks. |
| **Phase 2: Core Vitals & Local SEO** | Weeks 3–6 | ~25–30 hours | **₹0** (Free directories) | INP drops < 150ms, 14 location pages protected from doorway penalty, Google Local Pack boost. |
| **Phase 3: Authority & AI Citations** | Weeks 7–12 | ~35–40 hours | **₹0** (Organic) | AI citations on Perplexity/SearchGPT, top 3 rankings for Mulund/Thane web design, 3x organic leads. |
| **Total 90-Day Plan** | **12 Weeks** | **~70–80 hours total (~6h/week)** | **₹0 mandatory spend** | **Complete transformation into Mumbai's top-performing custom web engineering studio.** |
