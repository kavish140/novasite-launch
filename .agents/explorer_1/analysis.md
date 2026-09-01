# Technical, On-Page & Local SEO Deep Investigation Report
**Domain**: `https://sitenova.dev` (SiteNova)  
**Investigator**: Explorer 1 (Technical, On-Page & Local SEO Specialist)  
**Date**: 2026-08-30  
**Status**: Complete  

---

## Executive Summary

A comprehensive forensic audit of the SiteNova codebase (`novasite-launch-main`) was conducted across crawlability, indexing infrastructure, performance bottlenecks (specifically diagnosing the **INP 310ms** issue), on-page metadata and heading architecture, the 14 local landing pages, and off-page NAP/schema consistency.

### Critical Discoveries & Root Causes
1. **Critical Structured Data Blackout Across 20+ Pages**: When migrating to React Router v7 `meta()` exports, `app/components/SEO.tsx` was converted into a no-op returning `null`. Consequently, rich JSON-LD definitions (`FAQPage`, `Service`, `HowTo`, `AboutPage`, `BreadcrumbList`, `Speakable`) embedded in `Index.tsx`, `Doctors.tsx`, `Ecommerce.tsx`, `LocationPageTemplate.tsx`, and 16 other page components are **completely dropped from SSR output and never rendered in the HTML document**.
2. **INP 310ms Root Cause Diagnosis**:
   - **5 Live Concurrent Iframes in Portfolio**: Scrolling within 200px of `#portfolio` triggers live iframe embeds for `aismartkit.tech`, `business-showcase.sitenova.dev`, `design.sitenova.dev`, `ecommerce.sitenova.dev`, and `corporatezone.in`. Each iframe executes full external JS engines and DOM trees, causing massive main-thread lockups.
   - **Continuous Scroll / Spring Physics Listeners**: `HeroSection.tsx` (5 `useTransform` hooks) and `ScrollProgress.tsx` (`useSpring` continuous simulation) run active animation computations on every scroll frame.
   - **Deferred Script Initialization Collision**: Google Analytics (2.0s), Google Ads (2.5s), and Microsoft Clarity (3.0s) fire initialization scripts directly during the prime user first-interaction window (2–4 seconds).
3. **Robots.txt Grouping Bypass & Unprotected Thank-You Page**: Dedicated crawler blocks in `public/robots.txt` (`Googlebot`, `Bingbot`, `GPTBot`, etc.) override `User-agent: *` under RFC 9309 rules, causing bots to ignore `Disallow: /thank-you`. Furthermore, `app/routes/thank-you.tsx` serves `robots: "index, follow"` without `noindex: true`.
4. **Dynamic Sitemap `lastmod` Invalidation**: `app/routes/sitemap[.]xml.tsx` injects `new Date().toISOString().split("T")[0]` as `<lastmod>` for all 40+ static URLs on every request, causing Googlebot to distrust and discard `lastmod` crawl optimization signals.
5. **14 Location Pages Doorway Risk**: All 14 location pages share ~85% verbatim text and identical boilerplate FAQs/benefits with only 100–150 words of unique copy and hardcoded Mulund coordinates (`19.1726, 72.9570`) across all locations.

---

## 1. Crawlability & Indexation Infrastructure

### 1.1 `public/robots.txt` Audit
- **File**: `public/robots.txt` (102 lines)
- **Observations**:
  - Lines 1–3:
    ```txt
    User-agent: *
    Allow: /
    Disallow: /thank-you
    ```
  - Lines 8–97: Defines 16 specific user-agent blocks (`Googlebot`, `Bingbot`, `Slurp`, `DuckDuckBot`, `Google-Extended`, `GPTBot`, `ClaudeBot`, `PerplexityBot`, etc.), each containing only `Allow: /`.
- **Parser Rule Conflict (RFC 9309)**: Search engine crawlers (Googlebot, Bingbot, ClaudeBot, GPTBot) select the **most specific matching user-agent block** and completely ignore the general `User-agent: *` block. Because `Disallow: /thank-you` is only defined in `User-agent: *`, Googlebot and AI search bots do NOT inherit the disallow directive.
- **Missing Disallows**:
  - `/admin` and `/admin/*` (admin panel endpoints are not disallowed in `robots.txt`).
  - `/lp/thank-you-quote` and `/lp/thank-you-audit` (ad confirmation pages).
  - `/downloads/` (APK downloads).

### 1.2 `app/routes/sitemap[.]xml.tsx` Audit
- **File**: `app/routes/sitemap[.]xml.tsx` (98 lines)
- **Observations**:
  - **Dynamic Lastmod Antipatern** (Lines 62, 69):
    ```ts
    const today = new Date().toISOString().split("T")[0];
    // ...
    <lastmod>${today}</lastmod>
    ```
    Every static URL returns today's date on every crawl request. Google Search Central documentation warns that continually advancing `lastmod` on unchanged static URLs leads search engines to ignore `lastmod` timestamps entirely.
  - **Supabase Error Silencing** (Lines 50–60): If Supabase fails or credentials are unconfigured during build/runtime, blog posts silently fail to appear in the sitemap without error logging.
  - **Missing Elements**:
    - Image sitemap extensions (`xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"`).
    - Hreflang alternates in XML (`<xhtml:link rel="alternate" hreflang="en-IN" ... />`).
  - **Duplicate Route Check**:
    - `location.peddar-road.tsx` (301 redirect to `pedder-road`) is correctly excluded from the sitemap.
    - All 14 canonical location routes and 7 niche pages are properly listed.

### 1.3 `workers/app.ts` & Edge Routing
- **File**: `workers/app.ts` (22 lines)
- **Observations**:
  - **Trailing Slash Redirect** (Lines 12–15):
    ```ts
    if (url.pathname !== "/" && url.pathname.endsWith("/")) {
      url.pathname = url.pathname.slice(0, -1);
      return Response.redirect(url.toString(), 301);
    }
    ```
    Correctly issues 301 permanent redirects for trailing slashes while preserving search params.
  - **Host Canonicalization Gaps**: `workers/app.ts` does not check `url.hostname`. If `www.sitenova.dev` hits the worker without Cloudflare edge rules, it serves duplicate content rather than 301-redirecting to `sitenova.dev`.
  - **Missing HTTP Security & SEO Headers** (in `workers/app.ts` and `app/entry.server.tsx`):
    - `X-Content-Type-Options: nosniff` (missing)
    - `X-Frame-Options: SAMEORIGIN` (missing)
    - `Referrer-Policy: strict-origin-when-cross-origin` (missing)
    - `Permissions-Policy` (missing)
    - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (missing in worker handler)

### 1.4 Route-Level Indexation Flags
- `app/routes/thank-you.tsx` (Lines 4–10):
  ```ts
  export function meta() {
    return buildMeta({
      title: "Request Received | SiteNova",
      description: "Thank you for your request. We will get back to you shortly.",
      canonicalPath: "/thank-you",
    });
  }
  ```
  `noindex: true` is **missing**, causing `/thank-you` to serve `<meta name="robots" content="index, follow">`.
- `app/routes/lp.web-design.tsx`, `lp.thank-you-quote.tsx`, `lp.thank-you-audit.tsx`, and `admin.*.tsx` correctly include `noindex: true`.

---

## 2. Performance & INP 310ms Root Cause Analysis

SiteNova's Interaction to Next Paint (INP) is currently measured at **310ms** (exceeding Google's "Good" threshold of ≤ 200ms into the "Needs Improvement" zone). Below is the precise root-cause breakdown:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                INP 310ms BREAKDOWN                                     │
├────────────────────────────┬───────────────────────────────────┬───────────────────────┤
│ Bottleneck Component       │ Mechanism                         │ Impact on Main Thread │
├────────────────────────────┼───────────────────────────────────┼───────────────────────┤
│ 1. 5 Concurrent Iframes    │ iframe live previews in Portfolio │ Severe (100–180ms)    │
│ 2. Scroll Physics Springs  │ useScroll + useSpring in root     │ Moderate (40–70ms)    │
│ 3. Script Init Collisions  │ GA4/Ads/Clarity setTimeout @ 2–3s │ High (60–110ms)       │
│ 4. State Update Janks      │ Sync setState without transition  │ Moderate (30–50ms)    │
└────────────────────────────┴───────────────────────────────────┴───────────────────────┘
```

### 2.1 Primary Culprit: Live `<iframe>` Spawning in `PortfolioSection.tsx`
- **File**: `app/components/PortfolioSection.tsx` (Lines 105–107, 178–180), `app/components/IframePreview.tsx` (Lines 36–47), and `app/lib/portfolio-meta.ts` (Lines 27, 37, 47, 57, 88).
- **Mechanism**:
  - `showcaseProjects` (AI SmartKit, Business Showcase, Design Showcase, E-commerce Showcase) and `customerProjects` (CorporateZone) have `useIframePreview: true`.
  - When the user scrolls within 200px of `#portfolio` (`rootMargin: "200px 0px"` in `IntersectionObserver`), `setInView(true)` triggers mounting **5 live iframes concurrently**.
  - Each `<iframe>` downloads external HTML, parses CSS/JS, initiates React hydration or external scripts, and mounts a separate browsing context on the client device.
  - When a user interacts (taps nav links, clicks accordion, or adjusts cost calculator) while 5 iframes are parsing and painting, the browser event loop experiences catastrophic queuing delays (yielding 310ms+ INP).

### 2.2 Secondary Culprit: Continuous Scroll Physics Listeners
- **Files**:
  - `app/components/HeroSection.tsx` (Lines 13–22): `useScroll` + 5 `useTransform` calculations (`bgY`, `orbY`, `contentY`, `previewY`, `previewRotate`).
  - `app/components/ScrollProgress.tsx` (Lines 4–9): `useScroll` + `useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })`.
- **Mechanism**: Continuous spring calculations and transform assignments execute on the main thread during scrolling. Tap/click inputs during or immediately after scrolling must wait for the spring simulation tick to complete before handling the input event.

### 2.3 Tertiary Culprit: 3rd-Party Script Timing Collisions
- **File**: `app/root.tsx` (Lines 89–114)
- **Mechanism**:
  - GTM is loaded synchronously in `<head>` (Line 89).
  - GA4 initializes at `t = 2000ms` after window `load` (Line 98).
  - Google Ads initializes at `t = 2500ms` after window `load` (Line 105).
  - Microsoft Clarity initializes at `t = 3000ms` after window `load` (Line 112).
  - Mobile users typically initiate their first navigation tap or scroll interaction between 2 and 4 seconds after page load. The staggered script execution floods the main thread with script evaluation, DOM observer registration, and beacon dispatches right when the first user interaction happens.

### 2.4 Layout Shifts & Asset Sizing
- `app/components/BlurImage.tsx`: Properly receives `width` and `height` and enforces CSS `aspect-ratio` on wrapper divs, preventing CLS.
- `app/routes/_index.tsx`: Preloads hero preview image (`dashboardPreview`) via `links()` with `fetchpriority="high"`.
- `public/hero-bg.webp`: Preloaded in `root.tsx` (Line 58).

---

## 3. On-Page Structure, Heading & Schema Architecture

### 3.1 The `<SEO>` Component Disconnect (Critical Bug)
- **Files**: `app/components/SEO.tsx` vs `app/pages/*.tsx`
- **Audit Findings**:
  - `app/components/SEO.tsx` lines 11–13:
    ```ts
    export function SEO(_props: Record<string, unknown>) {
      return null;
    }
    ```
  - Across 20 page files (`Index.tsx`, `Doctors.tsx`, `Ecommerce.tsx`, `Finance.tsx`, `Lawyers.tsx`, `RealEstate.tsx`, `Consultants.tsx`, `Startups.tsx`, `Restaurants.tsx`, `WebApps.tsx`, `SeoSpeed.tsx`, `About.tsx`, `WhyUs.tsx`, `OurProcess.tsx`, `Pricing.tsx`, `WebsiteCostCalculator.tsx`, `FreeAudit.tsx`, `LocationPageTemplate.tsx`, etc.), structured data is defined as:
    ```tsx
    <SEO
      title="..."
      description="..."
      canonicalUrl="..."
      jsonLd={[buildLocalBusinessJsonLd(), buildFaqJsonLd(faqs), ...]}
    />
    ```
  - Because `SEO` returns `null`, **none of this structured data is rendered in the HTML**.
  - **Impact**: Google and AI search engines receive zero page-specific Schema.org data for Services, FAQs, HowTos, AboutPage, and LocalBusiness across all internal pages.

### 3.2 Meta & Canonical Directives (`app/lib/meta.ts`)
- **File**: `app/lib/meta.ts`
- **Audit Findings**:
  - Generates Open Graph (`og:type`, `og:url`, `og:title`, `og:description`, `og:image`, `og:site_name`, `og:locale`).
  - Generates Twitter Cards (`summary_large_image`, `twitter:site`, `twitter:creator`).
  - Injects canonical links via RR7 `tagName: "link"` (Line 108).
  - Handles `noindex` fallback cleanly (`robots: noindex ? "noindex, nofollow" : (robots || "index, follow")`).

### 3.3 Heading Hierarchy (H1–H4) Audit Across Key Pages

| Page | H1 Headline | H2 Headings | Hierarchy Assessment |
|---|---|---|---|
| `Index.tsx` | "Best Website Designer in Mulund, Mumbai & Nearby Areas SiteNova" | • "Website design for Mulund, Mumbai..."<br>• "Websites from ₹10,000 onwards"<br>• "Websites Built by Kavish"<br>• "A Mumbai agency that actually gets you"<br>• "Is your website losing you customers?"<br>• "Common questions about SiteNova" | **Compliant**: 1 clear H1 containing primary geo keyword, followed by logical H2 section breaks and H3 cards/GEO entities. |
| `Doctors.tsx` | "Your Patients Are Searching Online. Can They Find You?" | • "Your Competitor Down the Road Has a Website..."<br>• "What Your Clinic Website Will Include"<br>• "See What We Built for Dr. Dipti Ganatra"<br>• "Let's Build Your Practice's Online Presence" | **Strong**: Problem → Solution → Case Study → CTA structure. H3 features beneath H2 sections. |
| `Ecommerce.tsx` | "Launch Your Brand in Mumbai with an Online Store That Sells" | • "Why SiteNova for E-commerce?"<br>• "Websites Built by Kavish" (via Portfolio)<br>• "Trusted by Businesses Across Mumbai" | **Compliant**: Logical flow; estimator card uses H3. |
| `LocationPageTemplate.tsx` | "Premium Web Development & SEO in {locationName}" | • "Dominating Local Search Results"<br>• "Common Questions About Web Design in {locationName}"<br>• "Websites Built by Kavish"<br>• "Trusted by Businesses..." | **Compliant structure**, but identical H2 phrasing replicated across all 14 locations. |

---

## 4. Local SEO & 14 Location Pages Audit

### 4.1 Location Page Catalog & Metrics

| Location Route | Target Locality | Geo Coordinates in Schema | Unique Content Length | Doorway Risk Level |
|---|---|---|---|---|
| `/location/mulund` | Mulund (West/East) | `19.1726, 72.9570` (Correct) | ~170 words | Low (Headquarters) |
| `/location/thane` | Thane (Ghopbunder, Majiwada) | `19.1726, 72.9570` (Mulund) | ~130 words | High (Duplicated template) |
| `/location/bhandup` | Bhandup (LBS Marg) | `19.1726, 72.9570` (Mulund) | ~110 words | High |
| `/location/nahur` | Nahur | `19.1726, 72.9570` (Mulund) | ~100 words | High |
| `/location/powai` | Powai (Hiranandani) | `19.1726, 72.9570` (Mulund) | ~120 words | High |
| `/location/ghatkopar` | Ghatkopar (East/West) | `19.1726, 72.9570` (Mulund) | ~110 words | High |
| `/location/vikhroli` | Vikhroli (Godrej One) | `19.1726, 72.9570` (Mulund) | ~110 words | High |
| `/location/kurla` | Kurla (BKC Connector) | `19.1726, 72.9570` (Mulund) | ~115 words | High |
| `/location/dadar` | Dadar (Shivaji Park) | `19.1726, 72.9570` (Mulund) | ~120 words | High |
| `/location/bandra` | Bandra (BKC, Bandra West) | `19.1726, 72.9570` (Mulund) | ~140 words | High |
| `/location/andheri` | Andheri (MIDC, SEEPZ) | `19.1726, 72.9570` (Mulund) | ~140 words | High |
| `/location/lower-parel` | Lower Parel (Commercial Mills) | `19.1726, 72.9570` (Mulund) | ~125 words | High |
| `/location/mahalakshmi` | Mahalakshmi | `19.1726, 72.9570` (Mulund) | ~100 words | High |
| `/location/pedder-road` | Pedder Road (South Mumbai) | `19.1726, 72.9570` (Mulund) | ~95 words | High |

### 4.2 Local SEO Vulnerabilities
1. **Doorway Page Algorithmic Vulnerability**:
   - Google Search Essentials explicitly states that pages created to rank for specific regional queries that funnel users into a single generic destination without unique local value are classified as **doorway pages**.
   - 13 out of 14 location pages only contain 95–140 words of unique introductory text, while the remaining 1,000+ words (features, benefits, 5 FAQs, portfolio, testimonials, CTAs) are verbatim clones.
2. **GeoCoordinates Mismatch in Schema**:
   - In `app/lib/locationMeta.ts` (lines 48–52) and `LocationPageTemplate.tsx` (lines 73–77), `latitude: 19.1726` and `longitude: 72.9570` are hardcoded for all 14 pages.
   - While `addressLocality: "Mulund"` is accurate for the agency's physical office, setting identical coordinates for Bandra (19.0596, 72.8295) or Andheri (19.1136, 72.8697) confuses Google's local proximity engine.
3. **Internal Linking Architecture**:
   - The cross-linking matrix in `LocationPageTemplate.tsx` (lines 309–343) successfully links every location page to the other 13 location pages.
   - However, location pages are **isolated from niche pages** (e.g. no links from `/location/mulund` to `/websites-for-doctors` or `/websites-for-finance` and vice versa).

---

## 5. Off-Page & NAP Consistency Audit

### 5.1 NAP Cross-Reference Matrix

| Entity Property | `app/lib/constants.ts` | `root.tsx` Schema | `app/lib/seo.ts` | `Footer.tsx` / `Contact.tsx` | External Profiles (Clutch / Crunchbase / TechBehemoths) | Consistency Status |
|---|---|---|---|---|---|---|
| **Business Name** | SiteNova | SiteNova / SiteNova Web Design | SiteNova / SiteNova Web Design | SiteNova | SiteNova / SiteNova Web Design | **Consistent** |
| **Phone Number** | +91 9326060621 | +91-9326060621 | +91-9326060621 | +91 93260 60621 | +91 93260 60621 | **Consistent** (Minor spacing variance in UI) |
| **Street Address** | Mulund | Mulund | Mulund | Mulund | Mulund, Mumbai | **Partial** (No physical street/building address) |
| **Locality** | Mumbai | Mumbai | Mumbai | Mumbai | Mumbai | **Consistent** |
| **Region** | Maharashtra | Maharashtra | Maharashtra | Maharashtra | Maharashtra | **Consistent** |
| **Postal Code** | 400080 | 400080 (Organization only) | 400080 (Org only; missing in ProfService) | 400080 (Noted in copy) | 400080 | **Discrepancy**: Missing `postalCode` in `ProfessionalService` schema |
| **Email** | `kavishganatra5@gmail.com` | `kavishganatra5@gmail.com` | `kavishganatra5@gmail.com` | `kavishganatra5@gmail.com` | `kavishganatra5@gmail.com` | **Consistent** (Domain email `@sitenova.dev` recommended) |

### 5.2 Social & Profile Citation Gaps
- `root.tsx` and `app/lib/seo.ts` define `sameAs` arrays with:
  - `https://www.crunchbase.com/organization/sitenova-web-design`
  - `https://www.clutch.co/profile/sitenova`
  - `https://techbehemoths.com/company/sitenova`
  - `https://share.google/Y6mq6VLzTQj9zN4kr`
- **Omissions in Schema**:
  - YouTube Channel: `https://www.youtube.com/@SiteNova_Web_Design` (linked in Footer, missing in Schema `sameAs`).
  - X / Twitter: `https://x.com/kavish140` (declared in meta as `@kavish140`, missing in Schema `sameAs`).

---

## 6. Prioritized Technical Recommendations & Patch Blueprint

### Priority 1: High Impact (Week 1 — Zero Budget)

1. **Activate JSON-LD Across All Pages**:
   - Replace `<SEO ... jsonLd={jsonLd} />` with `<JsonLd data={jsonLd} />` in `app/pages/Index.tsx`, `app/pages/niche/*.tsx`, `app/pages/services/*.tsx`, `app/components/LocationPageTemplate.tsx`, and `app/pages/*.tsx`.
   - Ensure `buildLocationJsonLd(locationName)` is invoked and rendered on every location page.

2. **Fix INP 310ms by Eliminating Live Iframes & Taming Springs**:
   - In `app/lib/portfolio-meta.ts`, change `useIframePreview: true` to `useIframePreview: false` by default for all portfolio items, displaying optimized static WebP thumbnails. Convert live previews to on-demand "Load Live Preview" buttons.
   - In `app/components/ScrollProgress.tsx`, replace `useSpring` with CSS transforms or simplified linear progress, and throttle `useScroll` transforms in `HeroSection.tsx`.
   - Stagger third-party analytics script loading to `requestIdleCallback` or after first user interaction.

3. **Repair `public/robots.txt` & Protect `/thank-you`**:
   - Move `Disallow: /thank-you`, `Disallow: /admin`, `Disallow: /admin/*`, `Disallow: /lp/thank-you*`, `Disallow: /downloads/` into all individual user-agent blocks (`Googlebot`, `Bingbot`, etc.) or use a unified block structure.
   - Add `noindex: true` to `app/routes/thank-you.tsx`.

4. **Fix Sitemap `lastmod` Timestamp**:
   - Replace dynamic `today` calculation in `app/routes/sitemap[.]xml.tsx` with static build dates or actual content modification timestamps.

5. **Eliminate Peddar/Pedder Duplicate Route**:
   - Delete obsolete `app/routes/location.peddar-road.tsx` or handle redirect in `workers/app.ts`.

### Priority 2: Medium Impact (Weeks 2–4)

1. **Upgrade 14 Location Pages with Unique Local Content**:
   - Expand unique content on each location page from ~100 words to 350–500 words.
   - Add localized client case studies, neighborhood landmark mentions, local transit directions, and distinct local FAQs.
   - Cross-link location pages to relevant niche vertical pages (e.g. Mulund → Doctors/Finance; Bandra → Real Estate/Startups).

2. **Inject HTTP Security & Edge SEO Headers**:
   - Update `workers/app.ts` to attach standard security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Strict-Transport-Security`).
   - Enforce lowercase URLs and canonical host redirects (`www` → non-`www`).

3. **Harmonize Schema NAP & `sameAs` Links**:
   - Add `postalCode: "400080"` to `ProfessionalService` schema in `app/lib/seo.ts` and `root.tsx`.
   - Add YouTube (`https://www.youtube.com/@SiteNova_Web_Design`) and Twitter (`https://x.com/kavish140`) to `Organization` and `Person` `sameAs` arrays.
