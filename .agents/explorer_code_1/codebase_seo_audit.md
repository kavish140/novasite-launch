# Codebase Architecture & SEO Constraints Audit Report

**Audit Target**: SiteNova (sitenova.dev)
**Auditor**: Explorer 2 (Codebase Architecture & SEO Constraints Inspector)
**Date**: 2026-09-02
**Working Directory**: P:\Websites\Personal\novasite-launch-main\.agents\explorer_code_1

---

## Executive Summary

This report delivers a comprehensive technical audit of SiteNova's codebase architecture, server-side rendering (SSR) pipeline, metadata generation, structured data (Schema.org / JSON-LD), routing, and heading/content hierarchy.

SiteNova operates on **React Router v7 (RR7)** with **edge SSR on Cloudflare Workers**, bundled via **Vite 6** and styled with **Tailwind CSS**. The site already has solid foundational SSR and edge routing, but deep inspection revealed critical technical and semantic gaps across metadata, schemas, heading hierarchies, and content depth that explain the high-impression / low-click performance observed in Google Search Console (GSC).

---

## 1. Architecture & Framework Review

### 1.1 Tech Stack Specification
- **Framework**: React Router v7 (@react-router/dev, @react-router/fs-routes, eact-router) with SSR.
- **Runtime**: Cloudflare Workers Edge SSR (workers/app.ts using createRequestHandler).
- **Build System**: Vite 6.x with @cloudflare/vite-plugin and @react-router/dev/vite.
- **Styling & UI**: Tailwind CSS 3.x, shadcn/ui (Radix primitives), Lucide React icons, Framer Motion 12 (LazyMotion with domAnimation).
- **Database Client Architecture**:
  - Client-side: Singleton supabase in pp/lib/supabaseClient.ts (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).
  - Server-side: Per-request createServerClient(context) in pp/lib/supabaseClient.ts reading from Cloudflare Worker secrets (context.cloudflare.env.SUPABASE_URL).

### 1.2 Routing Configuration (pp/routes.ts & pp/routes/)
- Routing is defined via @react-router/fs-routes with latRoutes() satisfies RouteConfig.
- Route files in pp/routes/*.tsx serve as lightweight entry points that re-export components from pp/pages/ and export meta(), links(), or loader() functions.
- Total active routes: 52 route files covering core marketing pages, 14 location pages, 7 niche pages, 5 service pages, portfolio case studies, blog routes, and 3 paid ad landing pages (/lp/*).

### 1.3 Metadata Generation (pp/lib/meta.ts & Route meta() Pattern)
- **Single Source of Truth**: uildMeta() in pp/lib/meta.ts generates metadata compliant with React Router v7's MetaDescriptor[].
- **Exact Return Format**:
  `	s
  export function meta() {
    return buildMeta({
      title: ...,
      description: ...,
      canonicalPath: /...,
      keywords: [...],
      type: website | article,
      image: ...,
      robots: index, follow,
    });
  }
  `
- **Descriptors Generated**:
  - { title }
  - { name: description, content: description }
  - { name: robots, content: noindex ? noindex, nofollow : (robots || index, follow) }
  - { name: author, content: author || Kavish Ganatra }
  - { property: og:type, content: type }
  - { property: og:url, content: canonicalUrl }
  - { property: og:title, content: title }
  - { property: og:description, content: description }
  - { property: og:image, content: ogImage }
  - { property: og:image:width, content: 1200 }
  - { property: og:image:height, content: 630 }
  - { property: og:site_name, content: SiteNova }
  - { property: og:locale, content: en_IN }
  - { name: twitter:card, content: summary_large_image }
  - { name: twitter:url, content: canonicalUrl }
  - { name: twitter:title, content: title }
  - { name: twitter:description, content: description }
  - { name: twitter:image, content: ogImage }
  - { name: twitter:site, content: @kavish140 }
  - { name: twitter:creator, content: @kavish140 }
  - { name: keywords, content: keywords.join(, ) }
  - { tagName: link, rel: canonical, href: canonicalUrl }
- **Location Meta Helper**: pp/lib/locationMeta.ts provides uildLocationMeta({ locationName, keywords }) which calls uildMeta().

### 1.4 Critical Architectural Findings & Code Hygiene
1. **Legacy <SEO> Component**: pp/components/SEO.tsx is an empty no-op returning 
ull. However, it is still imported and rendered in 15+ page components (Index.tsx, WebsiteCostCalculator.tsx, LocationPageTemplate.tsx, niche pages, etc.). While non-breaking, it represents dead code.
2. **Global Hreflang Issue in oot.tsx (Lines 54–55)**:
   - oot.tsx renders static hreflang tags:
     `html
     <link rel=alternate href=https://sitenova.dev/ hrefLang=en-IN />
     <link rel=alternate href=https://sitenova.dev/ hrefLang=x-default />
     `
   - On subpages (e.g. /location/bandra, /website-cost-calculator), this causes a self-referential hreflang mismatch because the hreflang points to https://sitenova.dev/ instead of the canonical URL of the subpage.

---

## 2. Structured Data / Schema Audit

### 2.1 Schema Infrastructure
- Structured data is injected into HTML using the <JsonLd data={...} /> component (pp/components/JsonLd.tsx).
- JsonLd renders <script type=application/ld+json> with JSON.stringify(data).replace(/</g, \\u003c) to prevent SSR XSS / HTML parser escaping bugs.

### 2.2 Existing Schema Implementations
- pp/lib/seo.ts exports builders:
  - uildLocalBusinessJsonLd(): WebSite + ProfessionalService graph.
  - uildOrganizationJsonLd(): Detailed Organization graph with ounder, sameAs (Clutch, Crunchbase, TechBehemoths, GBP), ddress, contactPoint, knowsAbout, reaServed.
  - uildAboutPageJsonLd(): AboutPage schema with mentions.
  - uildServiceJsonLd(service): Generic Service schema.
  - uildHowToJsonLd(): HowTo 4-step process schema.
  - uildFaqJsonLd(faqs): FAQPage schema.
  - uildSpeakableJsonLd(cssSelectors): WebPage + SpeakableSpecification.
- pp/lib/locationMeta.ts exports:
  - uildLocationJsonLd(locationName): ProfessionalService/LocalBusiness + FAQPage.
- oot.tsx (Lines 117–242): Injects site-wide WebSite, Organization, and ProfessionalService.

### 2.3 Comprehensive Schema Gaps & Optimization Matrix

| Page / Route | Current Schemas | Missing / Incomplete Schemas | Technical Recommendation |
|---|---|---|---|
| **Homepage** (/) | WebSite, Organization, ProfessionalService, FAQPage, AboutPage, HowTo, Speakable | Duplication with oot.tsx site-wide schema | Streamline page-level schema to avoid duplicate Organization and ProfessionalService nodes. |
| **Website Cost Calculator** (/website-cost-calculator) | FAQPage, HowTo, BreadcrumbList | **WebApplication / SoftwareApplication Schema** | Add WebApplication schema with pplicationCategory: BusinessApplication, operatingSystem: Web, offers: { price: 0 }. |
| **Location Pages** (/location/*) | ProfessionalService/LocalBusiness, FAQPage, BreadcrumbList | Specific neighborhood coordinates, granular serviceType, accurate priceRange | Upgrade priceRange to ₹10,000 - ₹50,000+, add micro-location coordinates in geoCoordinates. |
| **Niche Pages** (Doctors, Lawyers, Finance, Real Estate, Consultants, Restaurants, Startups) | Service, BreadcrumbList, FAQPage | Offer pricing schema, SpeakableSpecification | Add offers: { @type: Offer, price: 10000, priceCurrency: INR } and speakable selectors to boost AI search citing. |
| **Core Service Pages** (/services/ecommerce, seo-optimization, web-applications) | Service, BreadcrumbList | **FAQPage Schema, Offer Schema** | Both Ecommerce, SEO Speed, and Web Apps have FAQs in UI/copy or user intent, but **0 FAQPage schema** is injected! Inject uildFaqJsonLd() and offers. |
| **Process Page** (/our-process) | HowTo | BreadcrumbList | Add BreadcrumbList schema linking Home → Our Process. |
| **Why Us Page** (/why-us) | Organization | BreadcrumbList, Review / AggregateRating | Add BreadcrumbList and structured client review schemas. |

---

## 3. Server-Side Rendering & Edge Routing Audit

### 3.1 Edge Worker Handler (workers/app.ts)
- **Trailing Slash Normalization**:
  `	s
  const url = new URL(request.url);
  if (url.pathname !== / && url.pathname.endsWith(/)) {
    url.pathname = url.pathname.slice(0, -1);
    return Response.redirect(url.toString(), 301);
  }
  `
  - **Verdict**: Correctly executes a **301 permanent redirect** from /path/ to /path.
  - In earlier GSC data, both /location/bhandup/ and /location/bhandup, /location/thane/ and /location/thane accumulated impressions. The 301 redirect in workers/app.ts enforces consolidation to clean URLs.
- **SSR Rendering**: Uses React Router server build handler to render complete HTML documents at the edge, ensuring search engines receive fully populated DOM nodes without client-side hydration delays.

### 3.2 Robots.txt (public/robots.txt)
- Disallows administrative and non-indexable routes: /admin, /admin/, /thank-you, /lp/thank-you-quote, /lp/thank-you-audit.
- **Generative Engine Optimization (GEO)**: Explicitly allows 14+ AI / LLM crawler user-agents (Google-Extended, GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Bytespider, Applebot-Extended, etc.).
- References Sitemap: https://sitenova.dev/sitemap.xml.

### 3.3 Dynamic Sitemap (pp/routes/sitemap[.]xml.tsx)
- Server-side route handler that generates standard XML sitemap for search crawlers.
- Reads live published blog posts from Supabase using createServerClient(context).
- Defines static lastmod map with realistic historical dates to preserve lastmod signal integrity for Googlebot.
- Cache-Control header: public, max-age=3600.

---

## 4. Content & Heading Hierarchy Inspection (GSC Target Pages)

### 4.1 Target Opportunity 1: Website Cost Calculator (/website-cost-calculator)
- **GSC Metrics**: 62 impressions, 0 clicks, position 84.87.
- **Queries in GSC**: website cost calculator (pos 92.58), website price calculator (pos 93.82), website design cost in mumbai (pos 34.33), website cost calculator mumbai (pos 34.4), ree website cost calculator (pos 94).
- **Current Tags**:
  - Title: Website Cost Calculator India 2026 | How Much Does a Website Cost in Mumbai? (72 chars)
  - Meta Description: Use our free website cost calculator to estimate how much a website costs in India in 2026. Prices from ₹10,000 for Mumbai small businesses. Instant estimate, no commitment.
  - H1: Website Cost Calculator India 2026
- **Heading Hierarchy Flaws**:
  - H2s: Step 1 — Choose your website type, Step 2 — Add optional features, Step 3 — Choose your timeline, Website Cost FAQs — India 2026, Ready to get started?.
  - *Diagnosis*: The H2s are purely procedural UI labels without semantic keywords. Googlebot reads H2s to understand topic coverage.
- **Content Deficiency**:
  - The pricing calculations live entirely in client React state (PAGE_TIERS, ADD_ONS). The static SSR HTML contains very little explanatory text, price comparison tables, or Mumbai vs India cost breakdowns.

### 4.2 Target Opportunity 2: High-Impression Location Pages

#### A. Bandra (/location/bandra)
- **GSC Metrics**: 74 impressions, 0 clicks, avg position 30.68.
- **Target Queries**: website design in bandra (pos 19.2), website design company near bandra west, mumbai (pos 28), seo freelancer near bandra west, mumbai (pos 75), top rated website design companies near bandra west, mumbai (pos 52.5).
- **Current Headings (LocationPageTemplate.tsx)**:
  - H1: Premium Web Development & SEO in Bandra
  - H2: Dominating Local Search Results (Lacks location keyword!)
  - H2: Common Questions About Web Design in Bandra
  - H3: Service Suburbs (Generic label)
- **Root Cause & Fix**:
  - Search queries are website designer in Bandra / website design Bandra.
  - H1 should be updated to: Website Designer in Bandra, Mumbai — Custom Web Design & Local SEO.
  - H2 should be: Local SEO & Web Design Services for Bandra Businesses.
  - H3 should be: Neighborhoods & Commercial Areas We Serve in Bandra.

#### B. Thane (/location/thane)
- **GSC Metrics**: 80 combined impressions, 1 click, avg position ~43.7.
- **Target Queries**: website designer in thane (pos 88.8), web design company in hiranandani estate thane (pos 16), web design company in ghodbunder road thane (pos 12), web designers thane (pos 42), web development in thane (pos 57), website designing in thane (pos 86), website design company in thane (pos 97.5).
- **Current Headings**:
  - H1: Premium Web Development & SEO in Thane
  - H2: Dominating Local Search Results
- **Root Cause & Fix**:
  - Upgrade H1 to: Website Designer & Web Development Company in Thane, Mumbai.
  - Mention and heading-target high-impression micro-hubs: Hiranandani Estate, Ghodbunder Road, Wagle Estate, Majiwada.

#### C. Mulund (/location/mulund)
- **GSC Metrics**: 37 impressions, avg position 35.3.
- **Top Query**: website developer in mulund (24 impressions, pos 18.21 — close to page 1!).
- **Current Headings**:
  - H1: Premium Web Development & SEO in Mulund
- **Fix**: Optimize H1: Website Designer & Developer in Mulund, Mumbai.

#### D. Bhandup (/location/bhandup)
- **GSC Metrics**: 100 combined impressions, 3 clicks.
- **Top Queries**: website designer bhandup (pos 18), website design company in bhandup (pos 42.46).
- **Fix**: Align H1: Website Design Company & Web Developer in Bhandup, Mumbai.

#### E. Powai (/location/powai)
- **GSC Metrics**: 43 impressions, pos 34.37.
- **Top Queries**: design companies in powai (pos 44.33), website development company in powai (pos 33.5).
- **Fix**: Target tech/SaaS keywords in H1 & H2 for Powai.

### 4.3 Target Opportunity 3: High-Potential Niche Pages

| Page | GSC Data | Current H1 Tag | Flaw / Root Cause | Proposed Optimized H1 Tag |
|---|---|---|---|---|
| **Restaurants** (/websites-for-restaurants) | 31 imp, pos 19.81 | Turn Hungry Searchers Into Happy Diners. | Pure marketing slogan with **0 target keywords** in H1! | Restaurant Website Design in Mumbai — Digital Menus, Table Reservations & Local SEO |
| **Startups** (/websites-for-startups) | 35 imp, 2 clicks, pos 9.06 | Launch Faster. Scale Better. Impress Investors. | Marketing slogan without explicit product keywords | Custom React & Next.js Website Development for Startups in Mumbai |
| **Doctors** (/websites-for-doctors) | 2 imp, pos 6.5 | Your Patients Are Searching Online. Can They Find You? | Question format without primary keyword | Doctor & Clinic Website Design in Mumbai — Patient Bookings & Local SEO |
| **Lawyers** (/websites-for-lawyers) | 19 imp, 2 clicks, pos 7.11 | Your Clients Search Online Before Hiring. Are You Visible? | Question format without primary keyword | Law Firm & Advocate Website Design in Mumbai — Practice Pages & SEO |
| **Finance** (/websites-for-finance) | 10 imp, pos 4.0 | Your Clients Google You Before They Call. What Do They Find? | Question format without primary keyword | Websites for CA Firms & Financial Advisors in Mumbai |
| **Real Estate** (/websites-for-real-estate) | 13 imp, 2 clicks, pos 25.31 | Property Websites That Generate Leads 24/7 | Good intent, missing Mumbai regional anchor | Real Estate Website Design in Mumbai — Property Listings & Lead Generation |
| **Consultants** (/websites-for-consultants) | 25 imp, 2 clicks, pos 5.68 | Your Next Client Is Searching Online. Will They Find You? | Question format without primary keyword | Websites for Business Consultants & Advisors in Mumbai |

### 4.4 Target Opportunity 4: Service Pages & Homepage
- **Homepage (/)**:
  - Current Title: Website Designer in Mulund, Mumbai | From ₹10,000 | SiteNova
  - Current H1: Best Website Designer in Mulund, Mumbai & Nearby Areas SiteNova
  - Observation: GSC shows strong broad Mumbai query impressions (web development, usiness webdesign, website design, website designer). The title and H1 over-index on Mulund at the expense of Mumbai.
  - Refinement: Website Designer in Mumbai & Mulund | Fast, SEO-Ready Sites from ₹10,000 | SiteNova.
- **E-Commerce Service (/services/ecommerce)**:
  - GSC: 21 impressions, pos 52.33. Queries: online store development mumbai (pos 96), ecommerce website design mumbai (pos 81.67).
  - Title: E-commerce Website Design in Mumbai | Online Store from ₹18,000 | SiteNova
  - Needs FAQ schema, pricing breakdown table, and keyword H2s.
- **Web Applications (/services/web-applications)**:
  - GSC: 12 impressions, avg pos 2.75! High potential to capture clicks with structured FAQs and technical keyword expansions.

---

## 5. Technical Implementation Blueprint & Constraints

To ensure 100% technical viability in the upcoming implementation phase, all future code changes must adhere to the following architecture rules:

### 5.1 Rules for Meta Tag Updates
1. **File Location**: Update export function meta() inside pp/routes/<route-name>.tsx.
2. **Helper Usage**: Always use uildMeta() from @/lib/meta or uildLocationMeta() from @/lib/locationMeta.
3. **Canonical URLs**: Must never contain trailing slashes (e.g. /services/ecommerce, /location/bandra).
4. **Length Targets**:
   - <title>: 50–60 characters (max 65) with primary keyword in the first 35 characters.
   - <meta name=description>: 145–160 characters with strong call to action and value proposition.

### 5.2 Rules for Structured Data Updates
1. **Helper Functions**: Add new schema generators to pp/lib/seo.ts (e.g., uildWebApplicationJsonLd(), uildNicheServiceJsonLd()).
2. **Page Injection**: Render via <JsonLd data={[ ... ]} /> component inside the page component in pp/pages/.
3. **No DOM Manipulation**: Never call legacy setPageSeo(), document.head.appendChild(), or mutate head tags in useEffect.

### 5.3 Rules for Heading Hierarchy Updates
1. **One Single <h1> per Page**: The main hero section of every page must contain exactly one <h1> containing primary keyword + target entity / location.
2. **Semantic <h2> and <h3> Hierarchy**:
   - Use <h2> for core content pillars, features, pricing, process, and FAQs.
   - Use <h3> only for sub-features or item titles inside <h2> sections.
   - Avoid generic procedural titles like Step 1 — Choose type as standalone H2s; use keyword-rich headings like Step 1: Choose Your Website Type & Complexity.

### 5.4 Rules for Server-Side Safety & Cloudflare Workers
1. **Loader Environment**: In route loaders, only access Supabase via createServerClient(context) using Worker secrets. Never use client singletons.
2. **No Browser Globals at Root Level**: Do not call window, document, or localStorage during SSR render cycles unless wrapped in ClientOnly or useEffect.

---

## Conclusion

The SiteNova codebase is architecturally modern, lightning-fast on Cloudflare Workers edge SSR, and ready for high-impact SEO execution. The disconnect between impressions and clicks is directly attributed to:
1. Slogan-style <h1> and procedural <h2> headings on high-impression opportunity pages.
2. Missing WebApplication schema on the Calculator and missing FAQPage schemas on Service pages.
3. Metadata that over-indexed on narrow sub-locations or missed high-CTR title snippets.
4. Minor technical cleanups (global hreflang in oot.tsx, legacy <SEO> calls).

The technical implementation plan can now be constructed with total confidence in full alignment with React Router v7 and Cloudflare Workers SSR.
