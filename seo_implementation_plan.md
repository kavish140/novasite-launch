# Technical SEO Implementation Plan (Developer-Ready)
**Target Project**: SiteNova (`https://sitenova.dev`)  
**Framework**: React Router v7 (SSR on Cloudflare Workers)  
**Author**: Worker 1 (SEO Strategist & Technical Architect)  
**Date**: September 2, 2026  
**Status**: Ready for Code Implementation (Step-by-Step Blueprint)  

---

## 1. Technical Architecture & Compatibility Constraints

### 1.1 React Router v7 Routing & Metadata Architecture
- All routing in SiteNova is configured using **React Router v7 file-system routing** (`@react-router/fs-routes` in `app/routes.ts`).
- Every route file in `app/routes/*.tsx` acts as a lightweight entry point that re-exports its corresponding page component from `app/pages/` and exports a server-rendered `meta()` function returning `MetaDescriptor[]`.
- **Single Source of Truth for Meta Tags**: All metadata must be constructed via `buildMeta()` (`app/lib/meta.ts`) or `buildLocationMeta()` (`app/lib/locationMeta.ts`).
- **Forbidden Patterns**:
  - Do NOT use client-side DOM mutation libraries (e.g. `react-helmet-async`, `setPageSeo()`, or `document.head.appendChild`).
  - Do NOT render the legacy `<SEO>` component in page components.
  - Do NOT hardcode non-canonical trailing-slash paths in `canonicalPath` parameters.

### 1.2 Cloudflare Workers Edge SSR & Secret Handling
- **Edge Entry**: `workers/app.ts` handles all incoming edge requests, executes 301 trailing-slash normalizations, and delegates SSR to React Router’s server build handler.
- **Supabase Client Architecture**:
  - In route loaders (`loader()`), only use `createServerClient(context)` which accesses Cloudflare Worker secrets (`context.cloudflare.env.SUPABASE_URL`).
  - Client-side components use the singleton `supabase` client from `app/lib/supabaseClient.ts`.
- **Zero SSR Mismatches**: Browser-only globals (`window`, `localStorage`, `document`) must never be called during SSR render cycles; they must remain enclosed in `useEffect()` or wrapped with `<ClientOnly>`.

### 1.3 Strict Compliance with `AGENTS.md`
- Contact info must always match `app/lib/constants.ts` (Phone: `+91 9326060621`, Email: `kavishganatra5@gmail.com`, Founder: `Kavish Ganatra`, Location: `Mulund, Mumbai, 400080`).
- Schema.org data must consistently state that **SiteNova (`sitenova.dev`) is NOT affiliated with `sitenovaagency.com`**.
- Pricing references must accurately reflect published agency tiers (Websites from ₹10,000, E-Commerce from ₹18,000, Web Apps from ₹30,000, SEO Audits from ₹8,000).

---

## 2. Step-by-Step Codebase Modifications

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                          CODEBASE MODIFICATION ROADMAP                            │
├─────────┬───────────────────────────────────┬─────────────────────────────────────┤
│ Step 1  │ Edge SSR & Canonical Standards    │ workers/app.ts, root.tsx, sitemap   │
│ Step 2  │ Structured Data Engine Upgrades   │ app/lib/seo.ts, locationMeta.ts     │
│ Step 3  │ Route Meta Descriptors Overhaul   │ app/routes/*.tsx (18+ routes)       │
│ Step 4  │ Heading & Content Hierarchy       │ app/pages/*.tsx & components/       │
│ Step 5  │ Legacy Cleanup & Deprecations     │ Remove <SEO> imports & invocations  │
└─────────┴───────────────────────────────────┴─────────────────────────────────────┘
```

---

### Step 1: Edge SSR & Canonical Consolidation

#### 1.1 `workers/app.ts`: Verify 301 Trailing-Slash Redirects
Ensure `workers/app.ts` normalizes all incoming requests to clean non-trailing slash URLs before executing the SSR handler.

```ts
// workers/app.ts
import { createRequestHandler } from "react-router";

const requestHandler = createRequestHandler(
  // @ts-expect-error — virtual module provided by @react-router/dev at build time
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Normalize trailing slashes to prevent duplicate URL indexation in GSC
    if (url.pathname !== "/" && url.pathname.endsWith("/")) {
      url.pathname = url.pathname.slice(0, -1);
      return Response.redirect(url.toString(), 301);
    }
    
    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler<Env>;
```

---

#### 1.2 `app/root.tsx`: Fix Global Hardcoded Hreflang Tags
- **Problem**: Lines 54–55 of `app/root.tsx` hardcode `<link rel="alternate" href="https://sitenova.dev/" hrefLang="en-IN" />` on all routes, creating a self-referential hreflang mismatch on subpages (e.g. `/location/bandra`, `/website-cost-calculator`).
- **Fix**: Remove static root-level hreflang tags from `root.tsx`. Self-referential canonicals are already accurately emitted per-route by `buildMeta()`.

```diff
--- a/app/root.tsx
+++ b/app/root.tsx
@@ -51,10 +51,6 @@
         <link rel="icon" href="/favicon.ico" sizes="any" />
         <link rel="manifest" href="/site.webmanifest" />
 
-        {/* Hreflang */}
-        <link rel="alternate" href="https://sitenova.dev/" hrefLang="en-IN" />
-        <link rel="alternate" href="https://sitenova.dev/" hrefLang="x-default" />
-
         {/* Hero image preload — static URL known at build time */}
         <link rel="preload" as="image" href="/hero-bg.webp" fetchPriority="high" />
```

---

#### 1.3 `app/routes/sitemap[.]xml.tsx`: Validate Clean Canonical Sitemap Generation
Ensure the dynamic sitemap includes all active routes, accurate last-modified timestamps, and non-trailing slash URLs.

```ts
// app/routes/sitemap[.]xml.tsx
import type { Route } from "./+types/sitemap[.]xml";
import { createServerClient } from "@/lib/supabaseClient";

export async function loader({ context }: Route.LoaderArgs) {
  const siteUrl = "https://sitenova.dev";

  const staticPaths = [
    "/",
    "/pricing",
    "/contact-us",
    "/quote",
    "/about",
    "/our-process",
    "/why-us",
    "/free-audit",
    "/website-cost-calculator",
    "/blog",
    "/services/ecommerce",
    "/services/web-applications",
    "/services/seo-optimization",
    "/services/google-ads",
    "/services/meta-ads",
    "/ads-contact",
    "/location/thane",
    "/location/powai",
    "/location/andheri",
    "/location/bhandup",
    "/location/nahur",
    "/location/ghatkopar",
    "/location/vikhroli",
    "/location/kurla",
    "/location/dadar",
    "/location/lower-parel",
    "/location/mahalakshmi",
    "/location/pedder-road",
    "/location/mulund",
    "/location/bandra",
    "/websites-for-doctors",
    "/websites-for-finance",
    "/websites-for-real-estate",
    "/websites-for-consultants",
    "/websites-for-lawyers",
    "/websites-for-startups",
    "/websites-for-restaurants",
    "/portfolio/dr-dipti-ganatra",
    "/portfolio/jupiter-fast-finance",
    "/portfolio/corporate-zone",
  ];

  let blogEntries: { slug: string; published_at: string }[] = [];
  try {
    const supabase = createServerClient(context);
    const { data } = await supabase
      .from("blog_posts")
      .select("slug, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (data) blogEntries = data;
  } catch {
    // Fallback if database is unreachable
  }

  const lastModified: Record<string, string> = {
    "/": "2026-09-02",
    "/website-cost-calculator": "2026-09-02",
    "/location/bandra": "2026-09-02",
    "/location/mulund": "2026-09-02",
    "/location/thane": "2026-09-02",
    "/location/powai": "2026-09-02",
    "/location/bhandup": "2026-09-02",
    "/websites-for-restaurants": "2026-09-02",
    "/websites-for-startups": "2026-09-02",
    "/pricing": "2026-08-15",
    "/contact-us": "2026-08-01",
    "/quote": "2026-08-01",
    "/about": "2026-08-01",
    "/our-process": "2026-08-01",
    "/why-us": "2026-08-01",
    "/free-audit": "2026-08-01",
    "/blog": "2026-09-02",
    "/services/ecommerce": "2026-09-02",
    "/services/web-applications": "2026-09-02",
    "/services/seo-optimization": "2026-09-02",
    "/services/google-ads": "2026-08-31",
    "/services/meta-ads": "2026-08-31",
    "/ads-contact": "2026-09-01",
  };
  const defaultLastMod = "2026-08-01";

  const priorities: Record<string, string> = {
    "/": "1.0",
    "/website-cost-calculator": "0.95",
    "/location/bandra": "0.9",
    "/location/mulund": "0.9",
    "/location/thane": "0.9",
    "/location/powai": "0.9",
    "/location/bhandup": "0.9",
    "/websites-for-restaurants": "0.9",
    "/websites-for-startups": "0.9",
    "/services/ecommerce": "0.9",
    "/services/web-applications": "0.9",
    "/services/seo-optimization": "0.9",
    "/services/google-ads": "0.9",
    "/services/meta-ads": "0.9",
  };

  const urls = [
    ...staticPaths.map(
      (path) => `
  <url>
    <loc>${siteUrl}${path}</loc>
    <lastmod>${lastModified[path] ?? defaultLastMod}</lastmod>
    <changefreq>${path === "/" ? "daily" : "weekly"}</changefreq>
    <priority>${priorities[path] ?? "0.8"}</priority>
  </url>`
    ),
    ...blogEntries.map(
      (post) => `
  <url>
    <loc>${siteUrl}/blog/${post.slug}</loc>
    <lastmod>${post.published_at?.split("T")[0] || defaultLastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    ),
  ].join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
```

---

### Step 2: Structured Data Engine Upgrades (`app/lib/seo.ts` & `app/lib/locationMeta.ts`)

#### 2.1 Upgrades in `app/lib/seo.ts`
Add `buildWebApplicationJsonLd()` and `buildNicheServiceJsonLd()`, and export them for use across page components.

```ts
// Additions to app/lib/seo.ts

/**
 * Builds WebApplication / SoftwareApplication schema for the interactive cost calculator.
 * Tells Googlebot this URL is a free utility tool, activating rich interactive search snippets.
 */
export const buildWebApplicationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": `${SITE_URL}/website-cost-calculator#webapp`,
  name: "Website Cost Calculator India 2026",
  url: `${SITE_URL}/website-cost-calculator`,
  applicationCategory: "BusinessApplication",
  operatingSystem: "All Web Browsers",
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  description:
    "Free interactive website cost calculator for businesses in Mumbai and India. Estimate transparent website development prices from ₹10,000 with real-time add-on calculations.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    seller: {
      "@type": "Organization",
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
  },
  featureList: [
    "Instant Website Cost Estimation",
    "Landing Page vs Multi-page Business Website Pricing",
    "E-commerce & Custom Web App Cost Breakdown",
    "Add-on Features Pricing (SEO, Speed, CMS, Payment Gateway)",
    "Turnaround Timeline Estimator",
  ],
  creator: {
    "@type": "Organization",
    name: SITE_NAME,
    url: `${SITE_URL}/`,
  },
});

/**
 * Builds specialized Service JSON-LD for Niche industry pages with transparent pricing offers.
 */
export const buildNicheServiceJsonLd = ({
  name,
  description,
  url,
  price = "10000",
  serviceType,
}: {
  name: string;
  description: string;
  url: string;
  price?: string;
  serviceType: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType,
  name,
  description,
  url,
  provider: {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
  },
  areaServed: {
    "@type": "City",
    name: "Mumbai",
    containedInPlace: {
      "@type": "State",
      name: "Maharashtra",
      containedInPlace: {
        "@type": "Country",
        name: "India",
      },
    },
  },
  offers: {
    "@type": "Offer",
    price,
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    seller: {
      "@type": "Organization",
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
  },
});
```

---

#### 2.2 Upgrades in `app/lib/locationMeta.ts`: Granular Suburb Coordinates & LocalBusiness Schema
Upgrade `buildLocationJsonLd()` to support suburb-specific geographic coordinates, realistic price ranges, and customized FAQ schemas.

```ts
// app/lib/locationMeta.ts
import { buildMeta, SITE_URL } from "./meta";

export const LOCATION_COORDINATES: Record<string, { lat: number; lng: number; postalCode?: string }> = {
  Bandra: { lat: 19.0596, lng: 72.8295, postalCode: "400050" },
  Thane: { lat: 19.2183, lng: 72.9781, postalCode: "400601" },
  Powai: { lat: 19.1176, lng: 72.9060, postalCode: "400076" },
  Mulund: { lat: 19.1726, lng: 72.9570, postalCode: "400080" },
  Bhandup: { lat: 19.1439, lng: 72.9360, postalCode: "400078" },
  Nahur: { lat: 19.1550, lng: 72.9460, postalCode: "400080" },
  Ghatkopar: { lat: 19.0860, lng: 72.9080, postalCode: "400077" },
  Vikhroli: { lat: 19.1110, lng: 72.9280, postalCode: "400079" },
  Kurla: { lat: 19.0700, lng: 72.8800, postalCode: "400070" },
  Dadar: { lat: 19.0178, lng: 72.8478, postalCode: "400014" },
  "Lower Parel": { lat: 18.9950, lng: 72.8300, postalCode: "400013" },
  Mahalakshmi: { lat: 18.9830, lng: 72.8230, postalCode: "400034" },
  "Pedder Road": { lat: 18.9710, lng: 72.8090, postalCode: "400026" },
  Andheri: { lat: 19.1197, lng: 72.8464, postalCode: "400053" },
};

interface LocationMetaOptions {
  locationName: string;
  keywords?: string[];
  customTitle?: string;
  customDescription?: string;
}

export function buildLocationMeta({
  locationName,
  keywords = [],
  customTitle,
  customDescription,
}: LocationMetaOptions) {
  const slug = locationName.toLowerCase().replace(/\s+/g, "-");

  return buildMeta({
    title:
      customTitle ||
      `Website Designer in ${locationName}, Mumbai | 7-Day Fast Delivery | SiteNova`,
    description:
      customDescription ||
      `Looking for a website designer in ${locationName}? SiteNova builds fast, SEO-ready websites for ${locationName} businesses. Delivered in 7–14 days, from ₹10,000. Free audit included.`,
    canonicalPath: `/location/${slug}`,
    keywords: [
      `website designer in ${locationName}`,
      `web design ${locationName} Mumbai`,
      `website design company ${locationName}`,
      `web development ${locationName}`,
      `local SEO ${locationName}`,
      ...keywords,
    ],
  });
}

export function buildLocationJsonLd(locationName: string) {
  const coords = LOCATION_COORDINATES[locationName] || { lat: 19.1726, lng: 72.9570, postalCode: "400080" };
  const slug = locationName.toLowerCase().replace(/\s+/g, "-");

  return [
    {
      "@context": "https://schema.org",
      "@type": ["ProfessionalService", "LocalBusiness"],
      "@id": `${SITE_URL}/location/${slug}#business`,
      name: `SiteNova - Web Design in ${locationName}`,
      url: `${SITE_URL}/location/${slug}`,
      sameAs: [
        "https://share.google/Y6mq6VLzTQj9zN4kr",
        "https://www.clutch.co/profile/sitenova",
        "https://techbehemoths.com/company/sitenova",
      ],
      telephone: "+91-9326060621",
      email: "kavishganatra5@gmail.com",
      priceRange: "₹10,000 – ₹50,000+",
      currenciesAccepted: "INR",
      paymentAccepted: "Bank Transfer, Razorpay, UPI, Cash",
      address: {
        "@type": "PostalAddress",
        addressLocality: locationName,
        addressRegion: "Maharashtra",
        postalCode: coords.postalCode,
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: coords.lat,
        longitude: coords.lng,
      },
      hasMap: "https://share.google/Y6mq6VLzTQj9zN4kr",
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "09:00",
          closes: "21:00",
        },
      ],
      areaServed: {
        "@type": "City",
        name: locationName,
      },
      serviceType: "Website Design and Custom Web Development",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `How much does a website cost in ${locationName}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `SiteNova offers professional website design starting from ₹10,000 for single-page sites and ₹15,000 for multi-page business websites in ${locationName}. E-commerce stores start from ₹18,000.`,
          },
        },
        {
          "@type": "Question",
          name: `How fast can you build a website for a business in ${locationName}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `Standard business websites are delivered within 7–14 working days. Express delivery (3–5 days) is available for time-sensitive launches.`,
          },
        },
        {
          "@type": "Question",
          name: `Do you provide Local SEO for ${locationName} businesses?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `Yes. Every website includes on-page SEO, Google Business Profile optimization, Schema.org local business markup, and mobile speed tuning to help you rank in ${locationName} search results.`,
          },
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: `Web Design ${locationName}`, item: `${SITE_URL}/location/${slug}` },
      ],
    },
  ];
}
```

---

### Step 3: Route Meta Descriptors Overhaul (`app/routes/*.tsx`)

Provide the exact, complete `meta()` implementations for all high-priority and key commercial routes:

#### 3.1 Homepage (`app/routes/_index.tsx`): Re-positioned to Mumbai Agency
```ts
// app/routes/_index.tsx
import { buildMeta } from "@/lib/meta";
import dashboardPreview from "@/assets/dashboard-preview.webp";
export { default } from "@/pages/Index";

export function links() {
  return [
    {
      rel: "preload",
      as: "image",
      href: dashboardPreview,
      fetchpriority: "high",
    } as const,
  ];
}

export function meta() {
  return buildMeta({
    title: "Web Design & Development Agency in Mumbai | Fast, SEO Sites | SiteNova",
    description:
      "SiteNova is Mumbai's premier web design & development agency. We build lightning-fast, custom React websites for local businesses, doctors & CA firms from ₹10,000. 90+ PageSpeed guarantee.",
    canonicalPath: "/",
    keywords: [
      "website design company Mumbai",
      "web design agency Mumbai",
      "custom web development Mumbai",
      "website designer in Mumbai",
      "business web design Mumbai",
      "React website developer Mumbai",
      "affordable web design Mumbai",
      "local SEO services Mumbai",
    ],
  });
}
```

---

#### 3.2 Mulund Location (`app/routes/location.mulund.tsx`): Hyper-Local Domination
```ts
// app/routes/location.mulund.tsx
import { buildLocationMeta } from "@/lib/locationMeta";

export function meta() {
  return buildLocationMeta({
    locationName: "Mulund",
    customTitle: "Website Designer in Mulund, Mumbai | 7-Day Fast Delivery | SiteNova",
    customDescription:
      "SiteNova is Mulund's local web design agency. Fast, SEO-ready websites for Mulund West & East businesses delivered in 7–14 days. Transparent pricing from ₹10,000. Call today!",
    keywords: [
      "website developer in mulund",
      "website designer in Mulund",
      "web design Mulund West",
      "web design Mulund East",
      "best website designer in Mulund",
      "Mulund web development company",
      "local SEO Mulund Mumbai",
    ],
  });
}

export { default } from "@/pages/locations/Mulund";
```

---

#### 3.3 Bandra Location (`app/routes/location.bandra.tsx`): High-Value Commercial Suburb
```ts
// app/routes/location.bandra.tsx
import { buildLocationMeta } from "@/lib/locationMeta";

export function meta() {
  return buildLocationMeta({
    locationName: "Bandra",
    customTitle: "Website Designer in Bandra, Mumbai | Custom Web Design | SiteNova",
    customDescription:
      "Looking for a website designer in Bandra? SiteNova builds high-converting, modern React websites for Bandra West cafes, boutiques, startups & BKC firms from ₹10,000.",
    keywords: [
      "website design in bandra",
      "website design company near bandra west, mumbai",
      "website designer in Bandra",
      "web design Bandra West",
      "startup website design Bandra",
      "seo freelancer near bandra west, mumbai",
      "top rated website design companies near bandra west, mumbai",
    ],
  });
}

export { default } from "@/pages/locations/Bandra";
```

---

#### 3.4 Thane Location (`app/routes/location.thane.tsx`): Industrial & Residential Tech Corridor
```ts
// app/routes/location.thane.tsx
import { buildLocationMeta } from "@/lib/locationMeta";

export function meta() {
  return buildLocationMeta({
    locationName: "Thane",
    customTitle: "Website Designer in Thane | Web Development Company | SiteNova",
    customDescription:
      "Top-rated website design company in Thane. High-performance websites for businesses in Hiranandani Estate, Ghodbunder Road & Wagle Estate. Prices from ₹10,000.",
    keywords: [
      "website designer in thane",
      "web design company in hiranandani estate thane",
      "web design company in ghodbunder road thane",
      "web designers thane",
      "web development in thane",
      "website designing in thane",
      "website design company in thane",
    ],
  });
}

export { default } from "@/pages/locations/Thane";
```

---

#### 3.5 Powai Location (`app/routes/location.powai.tsx`): Tech Startup & Corporate Hub
```ts
// app/routes/location.powai.tsx
import { buildLocationMeta } from "@/lib/locationMeta";

export function meta() {
  return buildLocationMeta({
    locationName: "Powai",
    customTitle: "Website Design & Development in Powai, Mumbai | SiteNova",
    customDescription:
      "Custom React & Next.js web development for tech startups and enterprises in Powai & Hiranandani Gardens. Fast, secure, scalable digital products from ₹15,000.",
    keywords: [
      "website development company in powai",
      "design companies in powai",
      "website development powai mumbai",
      "web designer Powai",
      "startup web development Powai",
      "Hiranandani Powai web design",
    ],
  });
}

export { default } from "@/pages/locations/Powai";
```

---

#### 3.6 Bhandup Location (`app/routes/location.bhandup.tsx`): Adjacent Commercial Hub
```ts
// app/routes/location.bhandup.tsx
import { buildLocationMeta } from "@/lib/locationMeta";

export function meta() {
  return buildLocationMeta({
    locationName: "Bhandup",
    customTitle: "Website Designer in Bhandup, Mumbai | Fast Web Design | SiteNova",
    customDescription:
      "SiteNova builds fast, SEO-optimized websites for businesses in Bhandup West & East (LBS Marg). 7-day turnaround, 90+ PageSpeed score, prices starting from ₹10,000.",
    keywords: [
      "website designer bhandup",
      "website design company in bhandup",
      "web design development agencies in bhandup",
      "ui ux agencies in bhandup",
      "Bhandup website developer",
      "affordable web design Bhandup",
    ],
  });
}

export { default } from "@/pages/locations/Bhandup";
```

---

#### 3.7 Website Cost Calculator (`app/routes/website-cost-calculator.tsx`): High-Volume Tool
```ts
// app/routes/website-cost-calculator.tsx
import { buildMeta } from "@/lib/meta";
export { default } from "@/pages/WebsiteCostCalculator";

export function meta() {
  return buildMeta({
    title: "Website Cost Calculator India 2026 | Instant Price Estimator | SiteNova",
    description:
      "Calculate exact website development costs in India & Mumbai for 2026. Instant interactive estimate for landing pages, business websites & e-commerce. Transparent pricing from ₹10,000.",
    canonicalPath: "/website-cost-calculator",
    keywords: [
      "website cost calculator",
      "website price calculator",
      "website cost calculator India",
      "website cost calculator mumbai",
      "website design cost in mumbai",
      "how much does a website cost in India 2026",
      "free website cost calculator",
      "website price estimator India",
    ],
  });
}
```

---

#### 3.8 Restaurants Niche Page (`app/routes/websites-for-restaurants.tsx`): Hospitality Vertical
```ts
// app/routes/websites-for-restaurants.tsx
import { buildMeta } from "@/lib/meta";
export { default } from "@/pages/niche/Restaurants";

export function meta() {
  return buildMeta({
    title: "Restaurant Website Design in Mumbai | Digital Menus & SEO | SiteNova",
    description:
      "Boost table bookings & direct orders. SiteNova builds mouth-watering websites for Mumbai restaurants, cafes & cloud kitchens with QR digital menus & local SEO. From ₹10,000.",
    canonicalPath: "/websites-for-restaurants",
    keywords: [
      "restaurant website design",
      "restaurants websites",
      "restaurant web development Mumbai",
      "cafe website design Mumbai",
      "food business website developer",
      "digital menu website Mumbai",
    ],
  });
}
```

---

#### 3.9 Additional Niche Routes (`app/routes/websites-for-*.tsx`)
```ts
// app/routes/websites-for-startups.tsx
export function meta() {
  return buildMeta({
    title: "Website Development for Startups in Mumbai | React & Next.js | SiteNova",
    description: "Launch faster with custom React & Next.js websites built for Mumbai startups. 90+ PageSpeed, investor-ready UI, and conversion funnel architecture. From ₹20,000.",
    canonicalPath: "/websites-for-startups",
    keywords: ["startup website development Mumbai", "React developer for startups", "SaaS landing page design", "Next.js startup agency Mumbai"],
  });
}

// app/routes/websites-for-lawyers.tsx
export function meta() {
  return buildMeta({
    title: "Law Firm & Advocate Website Design in Mumbai | Bar Council Compliant | SiteNova",
    description: "Professional, Bar Council-compliant websites for advocates, law firms & legal consultants in Mumbai. Practice area pages, case consultation forms & local SEO. From ₹15,000.",
    canonicalPath: "/websites-for-lawyers",
    keywords: ["law firm website design Mumbai", "lawyer website developer", "advocate website Mumbai", "legal website design India"],
  });
}

// app/routes/websites-for-finance.tsx
export function meta() {
  return buildMeta({
    title: "Websites for CA Firms & Financial Advisors in Mumbai | SiteNova",
    description: "Build trust with high-converting websites for Chartered Accountants, tax consultants & wealth advisors in Mumbai. Secure, professional & SEO-optimized. From ₹15,000.",
    canonicalPath: "/websites-for-finance",
    keywords: ["CA firm website design Mumbai", "financial advisor website", "accounting website design", "tax consultant web developer Mumbai"],
  });
}

// app/routes/websites-for-doctors.tsx
export function meta() {
  return buildMeta({
    title: "Doctor & Clinic Website Design in Mumbai | Patient Booking & SEO | SiteNova",
    description: "Custom medical websites for doctors, clinics & dentists in Mumbai. Features online appointment booking, clinic location maps & local Google search optimization. From ₹15,000.",
    canonicalPath: "/websites-for-doctors",
    keywords: ["doctor website design Mumbai", "clinic website developer", "hospital web design Mumbai", "dentist website Mumbai"],
  });
}

// app/routes/websites-for-real-estate.tsx
export function meta() {
  return buildMeta({
    title: "Real Estate Website Design in Mumbai | Property Lead Generation | SiteNova",
    description: "High-converting property landing pages and real estate websites in Mumbai. Interactive floor plans, WhatsApp lead capture & Google Ads landing page architecture.",
    canonicalPath: "/websites-for-real-estate",
    keywords: ["real estate website design Mumbai", "property landing page developer", "real estate lead generation website", "builder website Mumbai"],
  });
}

// app/routes/websites-for-consultants.tsx
export function meta() {
  return buildMeta({
    title: "Websites for Business Consultants & Coaches in Mumbai | SiteNova",
    description: "Establish authority with custom portfolio and booking websites for management consultants, corporate coaches & advisory firms in Mumbai. From ₹15,000.",
    canonicalPath: "/websites-for-consultants",
    keywords: ["consultant website design Mumbai", "executive coach website", "business consulting web development", "professional portfolio website Mumbai"],
  });
}
```

---

#### 3.10 Service Routes (`app/routes/services.*.tsx`)
```ts
// app/routes/services.ecommerce.tsx
export function meta() {
  return buildMeta({
    title: "E-Commerce Website Development in Mumbai | Razorpay Stores from ₹18,000 | SiteNova",
    description: "Launch your online store in 14 days. Custom e-commerce websites with Razorpay/Stripe checkout, mobile optimization, inventory manager & SEO. From ₹18,000.",
    canonicalPath: "/services/ecommerce",
    keywords: ["ecommerce website design mumbai", "online store development mumbai", "Razorpay store developer Mumbai", "custom ecommerce agency Mumbai"],
  });
}

// app/routes/services.seo-optimization.tsx
export function meta() {
  return buildMeta({
    title: "SEO & Speed Optimization Services in Mumbai | Core Web Vitals | SiteNova",
    description: "Fix slow load times and climb Google rankings. SiteNova optimizes Core Web Vitals, boosts PageSpeed to 90+, and deploys local SEO systems in Mumbai. From ₹8,000.",
    canonicalPath: "/services/seo-optimization",
    keywords: ["SEO services Mumbai", "PageSpeed optimization Mumbai", "Core Web Vitals specialist", "local SEO agency Mumbai", "website speed audit"],
  });
}

// app/routes/services.web-applications.tsx
export function meta() {
  return buildMeta({
    title: "Custom Web Application Development in Mumbai | React & Next.js | SiteNova",
    description: "Bespoke SaaS applications, internal dashboards, and customer portals built with React, Next.js & Supabase. Scalable architecture from ₹30,000.",
    canonicalPath: "/services/web-applications",
    keywords: ["custom web applications Mumbai", "React web app developer Mumbai", "Nextjs web development", "SaaS portal development Mumbai"],
  });
}
```

---

### Step 4: Heading & Content Hierarchy Refactoring (`app/pages/*.tsx`)

#### 4.1 `app/pages/WebsiteCostCalculator.tsx`: Inject `WebApplication` Schema, Semantic H2s & Static Comparison Table
```diff
--- a/app/pages/WebsiteCostCalculator.tsx
+++ b/app/pages/WebsiteCostCalculator.tsx
@@ -134,6 +134,7 @@
       <JsonLd data={[
+          buildWebApplicationJsonLd(),
           {
             "@context": "https://schema.org",
             "@type": "FAQPage",
```

##### Heading & Content Upgrades in `WebsiteCostCalculator.tsx`:
- Change `<h1>`:
  ```tsx
  <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-6xl max-w-4xl mx-auto">
    Website Cost Calculator <span className="gradient-text">India 2026</span>
  </h1>
  ```
- Change Step `<h2>` tags from procedural labels to semantic headings:
  - Step 1: `<h2 className="text-lg font-bold text-foreground mb-1">Step 1: Choose Your Website Type & Architecture</h2>`
  - Step 2: `<h2 className="text-lg font-bold text-foreground mb-1">Step 2: Add Optional Performance & SEO Features</h2>`
  - Step 3: `<h2 className="text-lg font-bold text-foreground mb-1">Step 3: Select Project Timeline & Delivery Speed</h2>`
- Add a comprehensive static price breakdown table section below the calculator UI for search engine crawlers:
  ```tsx
  {/* Static SEO Pricing Breakdown Table (Indexed by Googlebot in initial SSR HTML) */}
  <section className="py-16 bg-card/30 border-t border-border/40">
    <div className="mx-auto max-w-7xl px-6">
      <div className="max-w-3xl mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-foreground">
          Average Website Development Cost in Mumbai & India (2026 Breakdown)
        </h2>
        <p className="mt-3 text-muted-foreground">
          Transparent pricing benchmarks for Indian businesses, startups, and professionals.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card/60">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border/60 bg-muted/30 text-xs uppercase font-semibold text-muted-foreground">
            <tr>
              <th className="px-6 py-4">Website Type</th>
              <th className="px-6 py-4">Ideal For</th>
              <th className="px-6 py-4">Timeline</th>
              <th className="px-6 py-4">SiteNova Fixed Price</th>
              <th className="px-6 py-4">Market Average</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 text-foreground">
            <tr>
              <td className="px-6 py-4 font-semibold">Single-Page Landing Page</td>
              <td className="px-6 py-4 text-muted-foreground">Paid Google/Meta Ads, Product Launches</td>
              <td className="px-6 py-4">3–5 Days</td>
              <td className="px-6 py-4 font-bold text-primary">₹10,000</td>
              <td className="px-6 py-4 text-muted-foreground">₹15,000 – ₹25,000</td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-semibold">Multi-Page Business Website</td>
              <td className="px-6 py-4 text-muted-foreground">Doctors, CA Firms, Lawyers, Consultants</td>
              <td className="px-6 py-4">7–14 Days</td>
              <td className="px-6 py-4 font-bold text-primary">₹15,000</td>
              <td className="px-6 py-4 text-muted-foreground">₹25,000 – ₹50,000</td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-semibold">E-Commerce Store (Razorpay)</td>
              <td className="px-6 py-4 text-muted-foreground">Retailers, D2C Brands, Restaurants</td>
              <td className="px-6 py-4">14–21 Days</td>
              <td className="px-6 py-4 font-bold text-primary">₹18,000</td>
              <td className="px-6 py-4 text-muted-foreground">₹40,000 – ₹80,000</td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-semibold">Custom Web Application / SaaS</td>
              <td className="px-6 py-4 text-muted-foreground">Startups, Portals, Booking Dashboards</td>
              <td className="px-6 py-4">21–30 Days</td>
              <td className="px-6 py-4 font-bold text-primary">₹30,000+</td>
              <td className="px-6 py-4 text-muted-foreground">₹75,000 – ₹1,50,000+</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
  ```

---

#### 4.2 `app/components/LocationPageTemplate.tsx`: Update Headings to Commercial Keywords
```diff
--- a/app/components/LocationPageTemplate.tsx
+++ b/app/components/LocationPageTemplate.tsx
@@ -165,3 +165,3 @@
-          <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-6xl max-w-4xl mx-auto">
-            Premium Web Development & SEO in <span className="gradient-text">{locationName}</span>
-          </h1>
+          <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-6xl max-w-4xl mx-auto">
+            Website Designer in <span className="gradient-text">{locationName}, Mumbai</span>
+          </h1>
```

And update the Local SEO section heading:
```diff
- <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
-   Dominating Local Search Results
- </h2>
+ <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
+   Local Web Design & SEO Services in {locationName}
+ </h2>
```

---

#### 4.3 Niche Pages (`app/pages/niche/*.tsx`): Replace Marketing Slogans with High-Intent Commercial `<h1>` Tags

| Page Component | File Path | Current Slogan `<h1>` | New Keyword-Optimized `<h1>` |
|---|---|---|---|
| **Restaurants** | `app/pages/niche/Restaurants.tsx:202` | `Turn Hungry Searchers Into Happy Diners.` | `Restaurant Website Design in Mumbai — Digital Menus & Table Bookings` |
| **Startups** | `app/pages/niche/Startups.tsx:202` | `Launch Faster. Scale Better. Impress Investors.` | `Custom Web Development for Startups in Mumbai — React & Next.js` |
| **Doctors** | `app/pages/niche/Doctors.tsx:226` | `Your Patients Are Searching Online. Can They Find You?` | `Doctor & Clinic Website Design in Mumbai — Online Appointments & SEO` |
| **Lawyers** | `app/pages/niche/Lawyers.tsx:232` | `Your Clients Search Online Before Hiring. Are You Visible?` | `Law Firm & Advocate Website Design in Mumbai — Bar Council Compliant` |
| **Finance** | `app/pages/niche/Finance.tsx:215` | `Your Clients Google You Before They Call. What Do They Find?` | `Websites for CA Firms & Financial Advisors in Mumbai` |
| **Real Estate** | `app/pages/niche/RealEstate.tsx:208` | `Property Websites That Generate Leads 24/7` | `Real Estate Website Design in Mumbai — Property Listings & Leads` |
| **Consultants** | `app/pages/niche/Consultants.tsx:226` | `Your Next Client Is Searching Online. Will They Find You?` | `Websites for Business Consultants & Advisory Firms in Mumbai` |

---

### Step 5: Removal of Legacy Deprecated Components

- In `app/pages/Index.tsx`, `WebsiteCostCalculator.tsx`, `LocationPageTemplate.tsx`, and all niche pages:
  - Remove `import SEO from "@/components/SEO";`
  - Remove `<SEO ... />` JSX elements.
  - Rely exclusively on route-level `export function meta()` which provides 100% server-side rendered meta tags.

---

## 3. Verification & Deployment Testing Checklist

Execute the following independent testing protocol to verify 100% correctness of all SEO modifications:

```bash
# 1. Typecheck: Verify zero TypeScript type errors across all route meta() and schemas
npm run typecheck

# 2. Production Build: Validate Vite compilation and Cloudflare Workers SSR bundle
npm run build

# 3. Local Cloudflare Workers Simulation
npx wrangler dev
```

### 3.1 Edge 301 Redirect & Header Verification via cURL
Run local HTTP checks to confirm trailing-slash redirects and canonical tags:
```bash
# Test 1: Verify 301 Permanent Redirect on Trailing Slash
curl -I http://localhost:8787/location/bandra/
# Expected Output:
# HTTP/1.1 301 Moved Permanently
# Location: http://localhost:8787/location/bandra

# Test 2: Verify HTML contains clean Canonical Link and Title in Initial Server-Rendered HTML
curl -s http://localhost:8787/website-cost-calculator | grep -i '<link rel="canonical"'
# Expected Output:
# <link rel="canonical" href="https://sitenova.dev/website-cost-calculator">

# Test 3: Verify WebApplication JSON-LD is present in raw SSR response
curl -s http://localhost:8787/website-cost-calculator | grep -i '"@type":"WebApplication"'
```

### 3.2 Google Rich Results Test Validation
1. Open the [Google Rich Results Test](https://search.google.com/test/rich-results).
2. Test `/website-cost-calculator`: Confirm `WebApplication`, `FAQPage`, `HowTo`, and `BreadcrumbList` are recognized with 0 errors.
3. Test `/services/ecommerce`: Confirm `Service` and `FAQPage` are valid.
4. Test `/location/bandra`: Confirm `LocalBusiness` / `ProfessionalService` has valid `geoCoordinates` and `priceRange`.

---
*End of Technical SEO Implementation Plan (`seo_implementation_plan.md`).*
