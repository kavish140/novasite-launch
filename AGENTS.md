# AGENTS.md — SiteNova Project Knowledge Base

> **⚠️ MANDATORY FOR ALL AI AGENTS**
> You are working on the **SiteNova** website. Before making **any** change, read this file in full.
> After completing **any** change, update the relevant section(s) below to keep this document accurate.
> This file is the single source of truth for every AI assistant working on this codebase.

---

## Table of Contents
1. [Business Overview](#1-business-overview)
2. [Tech Stack & Architecture](#2-tech-stack--architecture)
3. [Project Structure](#3-project-structure)
4. [Routing System](#4-routing-system)
5. [Pages Catalog](#5-pages-catalog)
6. [Components Catalog](#6-components-catalog)
7. [Design System](#7-design-system)
8. [Library Modules (app/lib)](#8-library-modules-applib)
9. [Data & Backend (Supabase)](#9-data--backend-supabase)
10. [Deployment & Infrastructure](#10-deployment--infrastructure)
11. [Analytics & Tracking](#11-analytics--tracking)
12. [SEO Architecture](#12-seo-architecture)
13. [Environment Variables](#13-environment-variables)
14. [Development Commands](#14-development-commands)
15. [Critical Rules & Conventions](#15-critical-rules--conventions)
16. [Changelog](#16-changelog)

---

## 1. Business Overview

| Field | Value |
|---|---|
| **Business Name** | SiteNova |
| **Domain** | https://sitenova.dev |
| **Type** | Custom web design & development agency |
| **Founded** | 2024 |
| **Founder** | Kavish Ganatra |
| **Location** | Mulund, Mumbai, Maharashtra, India (PIN: 400080) |
| **Phone** | +91 9326060621 |
| **Email** | kavishganatra5@gmail.com |
| **WhatsApp** | wa.me/919326060621 |
| **YouTube** | https://www.youtube.com/@SiteNova_Web_Design |
| **Twitter** | @kavish140 |
| **Hours** | Mon–Sat 10:00–19:00 |
| **Pricing** | Starts from ₹10,000 |

### Third-Party Profiles
- Clutch: https://www.clutch.co/profile/sitenova
- TechBehemoths: https://techbehemoths.com/company/sitenova
- Crunchbase: https://www.crunchbase.com/organization/sitenova-web-design
- Google Business: https://share.google/Y6mq6VLzTQj9zN4kr

### Important Disambiguation
> **SiteNova (sitenova.dev)** is NOT affiliated with `sitenovaagency.com` — that is a completely separate, unrelated business. Always clarify this in Schema.org data and GEO content blocks.

### Services Offered
- Business Websites (from ₹15,000)
- E-Commerce Stores (Razorpay + Stripe integration)
- Custom Web Applications / Dashboards (from ₹30,000)
- SEO & Speed Audits / Core Web Vitals (from ₹8,000)
- Niche websites: Doctors, Lawyers, Finance/CA, Real Estate, Consultants, Startups, Restaurants

### Geo Service Areas
Mulund, Mumbai, Bhandup, Nahur, Thane, Ghatkopar, Powai, Vikhroli, Kurla, Dadar, Andheri, Lower Parel, Mahalakshmi, Pedder Road, Central Mumbai

---

## 2. Tech Stack & Architecture

### Core
| Layer | Technology |
|---|---|
| Framework | React Router v7 (RR7) — SSR via Cloudflare Workers |
| Language | TypeScript 5.x |
| Build Tool | Vite 6.x |
| Styling | Tailwind CSS 3.x + shadcn/ui component library |
| UI Components | Radix UI (via shadcn/ui), Lucide React icons |
| Animations | Framer Motion 12 (LazyMotion `domAnimation` features) |
| State / Forms | React Hook Form + Zod validation |
| Server-side Data | TanStack Query v5 |
| Database Client | Supabase JS v2 |
| Error Monitoring | Sentry (`@sentry/react`) |

### Hosting / Infrastructure
- **Runtime**: Cloudflare Workers (edge SSR)
- **Static Assets**: Cloudflare Assets (served from `./dist/client`)
- **Worker Config**: `wrangler.jsonc` (name: `novasite-launch`, compat date: 2026-08-01)
- **Worker Entry**: `workers/app.ts` — handles trailing-slash redirect + React Router SSR

### Key Architecture Decision: Dual Supabase Clients
- **Client-side** (`supabase` export from `app/lib/supabaseClient.ts`): singleton, uses `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` build-time env vars. Safe because one browser = one user.
- **Server-side** (`createServerClient(context)` from same file): per-request factory, reads `SUPABASE_URL` / `SUPABASE_ANON_KEY` from **Cloudflare Worker secrets** (set via `wrangler secret put`). NEVER use the client-side singleton in route loaders — it would leak data between users.

---

## 3. Project Structure

```
novasite-launch-main/
├── app/
│   ├── assets/              # Static image assets (.webp) for portfolio, etc.
│   ├── components/          # Shared UI components (see §6)
│   │   └── ui/              # shadcn/ui primitives
│   ├── hooks/               # Custom React hooks
│   │   ├── use-mobile.ts    # Breakpoint hook
│   │   └── use-toast.ts     # Toast state hook
│   ├── lib/                 # Utility libraries (see §8)
│   ├── pages/               # Full-page React components (see §5)
│   │   ├── admin/           # Protected admin pages
│   │   ├── blog/            # Blog listing + post pages
│   │   ├── locations/       # Location-specific pages (thin wrappers)
│   │   ├── niche/           # Industry-specific niche pages
│   │   └── services/        # Service-specific pages
│   ├── routes/              # RR7 route files (entry points, re-export pages)
│   ├── routes.ts            # RR7 route manifest (auto-generated from FS routes)
│   ├── root.tsx             # App shell: <html>, global providers, analytics scripts
│   ├── entry.client.tsx     # Client-side hydration entry
│   ├── entry.server.tsx     # Server-side rendering entry
│   └── index.css            # Global CSS + Tailwind layers + design tokens
├── workers/
│   ├── app.ts               # Cloudflare Worker fetch handler (SSR + redirects)
│   └── deploy.ts            # Deployment helper (if used)
├── public/                  # Static public files (favicon, manifest, images)
├── e2e/                     # Playwright end-to-end tests
├── scripts/                 # Build/utility scripts
├── dist/                    # Build output (gitignored)
├── wrangler.jsonc           # Cloudflare Workers config
├── vite.config.ts           # Vite config (includes @cloudflare/vite-plugin)
├── tailwind.config.ts       # Tailwind design tokens
├── package.json             # Dependencies + npm scripts
├── .env                     # Local dev environment variables (NOT committed)
└── AGENTS.md                # ← THIS FILE
```

---

## 4. Routing System

The project uses **React Router v7 file-system routing** (`@react-router/fs-routes`). Route files live in `app/routes/` and are thin wrappers that import full page components from `app/pages/`.

### Route → Page Map

| Route File | URL Pattern | Page Component |
|---|---|---|
| `_index.tsx` | `/` | `pages/Index.tsx` |
| `about.tsx` | `/about` | `pages/About.tsx` |
| `contact-us.tsx` | `/contact-us` | `pages/Contact.tsx` |
| `free-audit.tsx` | `/free-audit` | `pages/FreeAudit.tsx` |
| `our-process.tsx` | `/our-process` | `pages/OurProcess.tsx` |
| `pricing.tsx` | `/pricing` | `pages/Pricing.tsx` |
| `quote.tsx` | `/quote` | `pages/Quote.tsx` |
| `thank-you.tsx` | `/thank-you` | `pages/ThankYou.tsx` |
| `website-cost-calculator.tsx` | `/website-cost-calculator` | `pages/WebsiteCostCalculator.tsx` |
| `why-us.tsx` | `/why-us` | `pages/WhyUs.tsx` |
| `blog._index.tsx` | `/blog` | `pages/blog/BlogIndex.tsx` |
| `blog.$slug.tsx` | `/blog/:slug` | `pages/blog/BlogPost.tsx` |
| `admin._index.tsx` | `/admin` | `pages/admin/AdminLogin.tsx` |
| `admin.dashboard.tsx` | `/admin/dashboard` | `pages/admin/AdminDashboard.tsx` |
| `admin.blog.new.tsx` | `/admin/blog/new` | `pages/admin/AdminBlogEditor.tsx` |
| `admin.blog.$id.tsx` | `/admin/blog/:id` | `pages/admin/AdminBlogEditor.tsx` |
| `services.ecommerce.tsx` | `/services/ecommerce` | `pages/services/Ecommerce.tsx` |
| `services.seo-optimization.tsx` | `/services/seo-optimization` | `pages/services/SeoSpeed.tsx` |
| `services.web-applications.tsx` | `/services/web-applications` | `pages/services/WebApps.tsx` |
| `websites-for-doctors.tsx` | `/websites-for-doctors` | `pages/niche/Doctors.tsx` |
| `websites-for-finance.tsx` | `/websites-for-finance` | `pages/niche/Finance.tsx` |
| `websites-for-lawyers.tsx` | `/websites-for-lawyers` | `pages/niche/Lawyers.tsx` |
| `websites-for-real-estate.tsx` | `/websites-for-real-estate` | `pages/niche/RealEstate.tsx` |
| `websites-for-consultants.tsx` | `/websites-for-consultants` | `pages/niche/Consultants.tsx` |
| `websites-for-startups.tsx` | `/websites-for-startups` | `pages/niche/Startups.tsx` |
| `websites-for-restaurants.tsx` | `/websites-for-restaurants` | `pages/niche/Restaurants.tsx` |
| `location.mulund.tsx` | `/location/mulund` | `pages/locations/Mulund.tsx` |
| `location.thane.tsx` | `/location/thane` | `pages/locations/Thane.tsx` |
| `location.bhandup.tsx` | `/location/bhandup` | `pages/locations/Bhandup.tsx` |
| `location.nahur.tsx` | `/location/nahur` | `pages/locations/Nahur.tsx` |
| `location.bandra.tsx` | `/location/bandra` | `pages/locations/Bandra.tsx` |
| `location.andheri.tsx` | `/location/andheri` | `pages/locations/Andheri.tsx` |
| `location.ghatkopar.tsx` | `/location/ghatkopar` | `pages/locations/Ghatkopar.tsx` |
| `location.vikhroli.tsx` | `/location/vikhroli` | `pages/locations/Vikhroli.tsx` |
| `location.kurla.tsx` | `/location/kurla` | `pages/locations/Kurla.tsx` |
| `location.dadar.tsx` | `/location/dadar` | `pages/locations/Dadar.tsx` |
| `location.lower-parel.tsx` | `/location/lower-parel` | `pages/locations/LowerParel.tsx` |
| `location.mahalakshmi.tsx` | `/location/mahalakshmi` | `pages/locations/Mahalakshmi.tsx` |
| `location.pedder-road.tsx` | `/location/pedder-road` | `pages/locations/PedderRoad.tsx` |
| `location.powai.tsx` | `/location/powai` | `pages/locations/Powai.tsx` |
| `sitemap[.]xml.tsx` | `/sitemap.xml` | (inline handler — Worker-first) |
| `$.tsx` | `*` (catch-all) | `pages/NotFound.tsx` |

### RR7 SEO Pattern
Each route file exports:
```ts
export function meta() { return buildMeta({ title, description, canonicalPath }); }
```
This injects `<title>`, meta tags, Open Graph, Twitter Card, canonical link, robots — all server-rendered. **Do NOT use the legacy `<SEO>` component or `setPageSeo()` for new pages.**

---

## 5. Pages Catalog

### Core Pages
| Page | File | Description |
|---|---|---|
| Homepage | `pages/Index.tsx` | Hero, features, service areas grid, pricing callout, portfolio, free audit CTA, how it works, testimonials, FAQ, geo-entity block, footer |
| About | `pages/About.tsx` | Company story, founder bio, values, team section |
| Contact | `pages/Contact.tsx` | Contact form + WhatsApp / phone links |
| Free Audit | `pages/FreeAudit.tsx` | Lead capture form — saves to Supabase `audit_requests` table |
| Our Process | `pages/OurProcess.tsx` | 4-step process: Discovery → Design → Development → Launch |
| Pricing | `pages/Pricing.tsx` | Pricing tiers and breakdown |
| Quote | `pages/Quote.tsx` | Multi-step quote form — saves to Supabase; triggers `/thank-you` redirect + Google Ads pixel |
| Thank You | `pages/ThankYou.tsx` | Post-quote confirmation page; Google Ads conversion fires here |
| Website Cost Calculator | `pages/WebsiteCostCalculator.tsx` | Interactive calculator with dynamic pricing |
| Why Us | `pages/WhyUs.tsx` | Differentiators, trust signals |
| Not Found | `pages/NotFound.tsx` | 404 page |

### Blog Pages
| Page | File | Description |
|---|---|---|
| Blog Index | `pages/blog/BlogIndex.tsx` | Lists all blog posts fetched from Supabase |
| Blog Post | `pages/blog/BlogPost.tsx` | Individual post, fetched by slug from Supabase |

### Admin Pages (Protected — `/admin/*`)
| Page | File | Description |
|---|---|---|
| Admin Login | `pages/admin/AdminLogin.tsx` | Password gate (Supabase Auth) |
| Admin Dashboard | `pages/admin/AdminDashboard.tsx` | Shows `audit_requests` leads table + analytics chart + blog post list. Supports status toggle (pending/completed), CSV export, search/filter, delete. |
| Admin Blog Editor | `pages/admin/AdminBlogEditor.tsx` | Rich text blog post create/edit, saves to Supabase `blog_posts` table |

> **Admin guard**: `components/ProtectedRoute.tsx` wraps `/admin/dashboard` and blog editor. The exit intent popup is suppressed on all `/admin/*` routes.

### Service Pages
| Page | URL | Description |
|---|---|---|
| `pages/services/Ecommerce.tsx` | `/services/ecommerce` | E-commerce store service |
| `pages/services/SeoSpeed.tsx` | `/services/seo-optimization` | SEO & Core Web Vitals service |
| `pages/services/WebApps.tsx` | `/services/web-applications` | Custom web apps service |

### Niche Pages (7 total)
All live in `pages/niche/`. Each is a full, detailed page targeting a specific industry vertical:
- `Doctors.tsx` → `/websites-for-doctors`
- `Finance.tsx` → `/websites-for-finance`
- `Lawyers.tsx` → `/websites-for-lawyers`
- `RealEstate.tsx` → `/websites-for-real-estate`
- `Consultants.tsx` → `/websites-for-consultants`
- `Startups.tsx` → `/websites-for-startups`
- `Restaurants.tsx` → `/websites-for-restaurants`

### Location Pages (14 total)
All live in `pages/locations/`. They are thin wrappers around `components/LocationPageTemplate.tsx`, passing location-specific data:
Mulund, Thane, Bhandup, Nahur, Bandra, Andheri, Ghatkopar, Vikhroli, Kurla, Dadar, LowerParel, Mahalakshmi, PedderRoad, Powai

---

## 6. Components Catalog

### Layout / Global
| Component | File | Role |
|---|---|---|
| `Navbar` | `components/Navbar.tsx` | Fixed top nav. Scroll-to-section links (Features, Portfolio, How It Works, Testimonials), Services dropdown (niche links), Blog, Pricing, Cost Calculator, Free Audit, dark/light toggle, "Get a Quote" CTA button. |
| `Footer` | `components/Footer.tsx` | Links to all services, locations, company pages. Contact links (phone, WhatsApp, email, YouTube). Android app download button. |
| `PageTransition` | `components/PageTransition.tsx` | Wraps pages in a Framer Motion fade-in transition. |
| `ScrollProgress` | `components/ScrollProgress.tsx` | Thin progress bar at top of viewport. Lazy-loaded. |
| `CustomCursor` | `components/CustomCursor.tsx` | Custom cursor effect (desktop only). |

### Lead Generation / Conversion
| Component | File | Role |
|---|---|---|
| `ExitIntentPopup` | `components/ExitIntentPopup.tsx` | Appears on desktop mouse-leave-viewport, or after 45s on mobile. Collects name + email + WhatsApp + industry. Saves to Supabase `audit_requests`. Session-gated via `sessionStorage`. Hidden on `/admin/*`. |
| `BookCallWidget` | `components/BookCallWidget.tsx` | Floating "Book a Call" button. Lazy-loaded. |
| `MobileAuditBar` | `components/MobileAuditBar.tsx` | Fixed bottom bar on mobile. Links to `/free-audit`. Lazy-loaded. |

### Section Components (used on Homepage & other pages)
| Component | Role |
|---|---|
| `HeroSection` | Main hero with headline, CTA buttons |
| `FeaturesSection` | Key differentiators grid |
| `TechMarquee` | Scrolling marquee of tech logos |
| `PortfolioSection` | Portfolio grid with showcase + customer projects. Customer cards link to internal `/portfolio/*` case study pages. Showcase cards link directly to external sites. |
| `LocalAgencySection` | "Local Agency Advantage" trust pillar section — 4 pillars: same city, direct dev access, Hindi/Marathi/Gujarati/Kutchi, fixed pricing. Includes WhatsApp CTA. Inserted on homepage between PortfolioSection and Free Audit CTA. |
| `HowItWorksSection` | 4-step process visual |
| `TestimonialsSection` | Client testimonials |
| `FaqSection` | FAQ accordion (uses `lib/faq-data.ts`) |
| `CtaSection` | Bottom call-to-action banner |
| `BlogCTA` | CTA block for blog pages |
| `RelatedPosts` | Related blog post cards |

### Utility Components
| Component | Role |
|---|---|
| `SEO` | **Legacy** — still referenced in `Index.tsx`. For new pages use `buildMeta()` in route files instead. |
| `JsonLd` | Injects a JSON-LD `<script>` tag inline |
| `BlurImage` | Image with blur-up loading effect |
| `IframePreview` | Shared component that renders a live iframe thumbnail with loading/error states. Extracted from `PortfolioSection`. Used in both `PortfolioSection` and `PortfolioPageTemplate`. Props: `src`, `title`. |
| `PortfolioPageTemplate` | Shared full-page layout for all client portfolio case study pages. Accepts `client`, `project`, `backSlug` props. Renders: hero + live iframe, stats bar, optional testimonial, features grid, tech stack pills, dual CTA. See `app/pages/portfolio/` for usage. |
| `ClientOnly` | Renders children only after client hydration (prevents SSR mismatches) |
| `ErrorBoundary` | Top-level error boundary with fallback UI |
| `ProtectedRoute` | Auth gate for admin pages |
| `ThemeProvider` | next-themes wrapper (`storageKey: "novasite-theme"`, default: `"dark"`, no system preference) |

### UI Primitives (`components/ui/`)
Full shadcn/ui library: Accordion, AlertDialog, Avatar, Badge, Button, Card, Carousel, Checkbox, Command, Dialog, Drawer (vaul), DropdownMenu, Form, Input, Label, Popover, Progress, RadioGroup, ScrollArea, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner, Switch, Table, Tabs, Textarea, Toast, Toggle, Tooltip, etc.

---

## 7. Design System

### Fonts
- **Headings**: `Space Grotesk` (weights 400, 600, 700) — `font-heading` class
- **Body**: `Inter` (weights 400, 500, 600) — `font-body` class
- Loaded via Google Fonts with `<link rel="preload">` + async media swap for performance

### Color Tokens (CSS custom properties)
The theme uses HSL CSS variables toggled by `.dark` class on `<html>`.

**Dark mode** (default):
- Background: `hsl(225 25% 5%)` — very dark navy
- Primary: `hsl(210 100% 56%)` — bright blue
- Accent: `hsl(175 80% 48%)` — cyan/teal
- Card: `hsl(225 20% 8%)`

**Light mode**:
- Background: `hsl(210 40% 98%)`
- Primary: `hsl(222.2 47.4% 11.2%)` — dark navy
- Accent: `hsl(210 40% 96.1%)`

### Custom CSS Classes (defined in `index.css`)
| Class | Description |
|---|---|
| `.gradient-text` | Transparent text filled with `--gradient-primary` (blue → teal) |
| `.gradient-border` | Pseudo-element gradient border using `--gradient-primary` |
| `.glass-card` | `bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl` — frosted glass style |
| `.section-padding` | Standard section padding: `px-6 md:px-8 lg:px-16 py-24 md:py-32` |
| `.glow-effect` | Full box-shadow glow via `--shadow-glow` CSS var |
| `.glow-effect-sm` | Smaller glow via `--shadow-glow-sm` CSS var |
| `.grid-bg` | Subtle grid background pattern (60px grid, `border/0.3` color) |
| `.interactive-card` | Hover lift: `translateY(-4px)` + `shadow-glow-sm` — use on clickable cards |
| `.link-minimal` | Underline-on-hover link with `scale-x-0 → scale-x-100` transition |
| `.hover-glow` | Adds `shadow-glow-sm` on hover only |
| `.button-shimmer` | Shimmer sweep pseudo-element on hover — used on primary CTAs |
| `.btn-quote-pulse` | Radial pulse animation on the "Get a Quote" button via `btn-quote-pulse-anim` keyframe |
| `.animated-gradient` | `background-size: 200% 200%` — pair with JS or a transition for moving gradients |
| `.geo-entity-block` | Semantic wrapper for GEO content sections (used for AI crawler speakable targeting) |

### Tailwind Custom Animations
`fade-up`, `fade-in-up`, `fade-in`, `float`, `shimmer`, `pulse-glow`, `marquee`

### Theme Switching
- Toggle stored in `localStorage` key `"novasite-theme"`
- Flash-prevention inline script runs before React hydrates (in `root.tsx`)
- Managed via `next-themes` `ThemeProvider`

---

## 8. Library Modules (`app/lib`)

| File | Purpose |
|---|---|
| `constants.ts` | **Single source of truth** for all contact info. `PHONE_NUMBER`, `PHONE_INTL`, `PHONE_TEL_LINK`, `EMAIL`, `EMAIL_COMPOSE_LINK`, `WHATSAPP_URL`, `buildWhatsAppUrl()`, `SITE_NAME`, `SITE_URL`, `SITE_OWNER`. **Always import from here — never hardcode contact data.** |
| `meta.ts` | `buildMeta()` — generates `MetaDescriptor[]` for RR7 `meta()` exports. Handles title, description, canonical, OG, Twitter Card, keywords, article-specific tags. Also exports `SITE_NAME`, `SITE_URL`, `DEFAULT_OG_IMAGE`, `TWITTER_HANDLE`. |
| `seo.ts` | JSON-LD structured data builders: `buildLocalBusinessJsonLd()`, `buildOrganizationJsonLd()`, `buildFaqJsonLd()`, `buildServiceJsonLd()`, `buildHowToJsonLd()`, `buildAboutPageJsonLd()`, `buildSpeakableJsonLd()`. Used via `<JsonLd>` component. `setPageSeo()` is a no-op legacy stub. |
| `locationMeta.ts` | `buildLocationMeta()` + `buildLocationJsonLd()` — factory functions for location page meta and JSON-LD. Keeps all 14 location pages consistent. |
| `analytics.ts` | GA4 event tracking. ID: `G-EBZGS65QQH`. Typed `ConversionEvent` union. Functions: `trackEvent()`, `trackPageView()`, `trackGoogleAdsConversion()`, `trackWhatsAppClick()`, `trackPhoneClick()`, `trackBookCallClick()`, `trackQuoteSubmit()`, `trackAuditSubmit()`, `trackExitPopupSubmit()`, `trackNichePageView()`. Google Ads tag: `AW-18182593308`. |
| `faq-data.ts` | Exports `faqs` array used by `FaqSection` and FAQ JSON-LD builder. |
| `portfolio-meta.ts` | Exports `showcaseProjects` and `customerProjects` arrays. Portfolio projects: AI SmartKit, Business Showcase, Design Showcase, E-commerce Showcase (all SiteNova sub-domains), plus Dr. Dipti Ganatra and Jupiter Fast Finance (real clients). |
| `supabaseClient.ts` | Dual client exports (see §2 Architecture). |
| `seoRoutes.js` | **Legacy** — build-time SEO route injection. No longer used (replaced by RR7 `meta()` exports). Do not modify unless you know what you're doing. |
| `utils.ts` | `cn()` utility (clsx + tailwind-merge). |

---

## 9. Data & Backend (Supabase)

**Project URL**: `https://bklmtwblsoitafynpikc.supabase.co`

### Database Tables

#### `audit_requests`
Stores leads from: Free Audit form, Exit Intent Popup, and Contact form submissions.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `name` | text | Lead's full name |
| `email` | text | Lead's email address |
| `mobile` | text | 10-digit Indian mobile number |
| `website_url` | text | Their website URL or "Exit popup lead — Industry: X" |
| `status` | text | `'pending'` or `'completed'` |
| `created_at` | timestamptz | Auto-set |

#### `blog_posts`
Managed via Admin Dashboard. Fetched by `BlogIndex.tsx` and `BlogPost.tsx`.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `title` | text | Post title |
| `slug` | text | URL slug (unique) |
| `excerpt` | text | Short summary shown in listing cards and used as meta description fallback |
| `content` | text | Full HTML content (sanitized server-side before rendering) |
| `published_at` | timestamptz | Publication date — distinct from `created_at`. Used in sitemap + OG meta |
| `created_at` | timestamptz | Auto-set on insert |

> **Confirmed from Supabase table screenshot (2026-08-14).** There is no `status` or `cover_image` column in the live table. The sitemap loader's `.eq("status", "published")` filter silently returns no rows if the column doesn't exist — this is handled gracefully via try/catch.

### `blog.$slug.tsx` Loader — Credential Fallback Quirk

The blog post route loader uses a **3-tier fallback** for Supabase credentials due to known inconsistencies in how different versions of `@cloudflare/vite-plugin` expose the Cloudflare environment:

```
Tier 1: context.cloudflare.env.SUPABASE_URL       ← correct production path
Tier 2: context.env.SUPABASE_URL                  ← some plugin versions
Tier 3: import.meta.env.VITE_SUPABASE_URL         ← build-time fallback (dev only)
```

Do NOT simplify this fallback — it exists for a reason. Any new route loaders that need Supabase should use `createServerClient(context)` from `app/lib/supabaseClient.ts` which handles Tier 1 only (production-safe).

> **Note**: Blog post content is run through `edgeSanitize()` in the loader before being passed to the page. This strips `<script>`, `<style>`, inline event handlers (`onX=`), and `javascript:`/`data:` URIs from `href`/`src`/`action` attributes. The page renders it via `dangerouslySetInnerHTML` — the sanitization in the loader is the only XSS protection layer.

### Auth
Admin pages are protected by Supabase Auth. `ProtectedRoute` component checks session status and redirects to `/admin` if unauthenticated.

---

## 10. Deployment & Infrastructure

### Commands
```bash
npm run dev       # Local dev server (react-router dev)
npm run build     # Production build
npm run preview   # Preview via wrangler dev (Cloudflare local)
npm run deploy    # Build + deploy to Cloudflare Workers
```

### Worker Behavior (`workers/app.ts`)
1. Trailing slash redirect: any path ending in `/` (except root `/`) gets 301'd to the version without.
2. Passes request to React Router SSR handler with `{ cloudflare: { env, ctx } }` context.

### Assets Config (`wrangler.jsonc`)
- Static assets served from `./dist/client`
- `/sitemap.xml` is Worker-first (handled by the `sitemap[.]xml.tsx` route, not static file)

### Cloudflare Worker Secrets (set via `wrangler secret put`)
- `SUPABASE_URL` — used by server-side Supabase client in route loaders
- `SUPABASE_ANON_KEY` — used by server-side Supabase client in route loaders

---

## 11. Analytics & Tracking

All scripts are injected in `app/root.tsx` (`<head>` section) and are **deferred** to avoid hydration mismatches:

| Service | ID / Tag | Notes |
|---|---|---|
| Google Tag Manager | `GTM-P587639R` | Loads immediately (synchronous) |
| Google Analytics 4 | `G-EBZGS65QQH` | Deferred 2000ms after `window.load` |
| Google Ads | `AW-18182593308` | Deferred 2500ms after `window.load`. Phone conversion: `9326060621` |
| Microsoft Clarity | `xaxjnw6ykd` | Deferred 3000ms after `window.load` |

### Conversion Events
- `submit_quote_form` — fires on Quote form success → redirects to `/thank-you`
- Google Ads pixel fires on `/thank-you` page load (NOT inside exit popup — intentional)
- `submit_audit_form` — fires on Free Audit form success
- `click_exit_popup_cta` — fires on exit popup form success (shown in-popup, no redirect)
- `click_whatsapp_cta`, `click_phone_cta`, `click_book_call` — CTA click tracking

---

## 12. SEO Architecture

### System (Current — RR7 `meta()`)
Every route file exports a `meta()` function that calls `buildMeta()` from `app/lib/meta.ts`. This is the **only approved SEO method** for new pages and routes.

```ts
// Pattern for any route file:
export function meta() {
  return buildMeta({
    title: "Page Title | SiteNova",
    description: "Meta description...",
    canonicalPath: "/page-slug",
    keywords: ["keyword1", "keyword2"],
  });
}
```

### JSON-LD Structured Data
Injected via `<JsonLd>` component in page components, using builders from `app/lib/seo.ts`. Homepage uses all six JSON-LD types simultaneously (WebSite, Organization, ProfessionalService, FAQPage, HowTo, Speakable).

### Location Page SEO
Use `buildLocationMeta()` and `buildLocationJsonLd()` from `app/lib/locationMeta.ts`. All 14 location pages follow the same title/description pattern: `"Website Designer in {Location}, Mumbai | 7-Day Delivery | SiteNova"`.

### GEO (Generative Engine Optimisation)
The homepage contains a `#about-sitenova` section with rich prose content for AI crawlers (ChatGPT, Perplexity, Google AI Mode). Entity disambiguation against `sitenovaagency.com` is included in both Schema.org data and HTML comments.

### `public/llms.txt` — AI Crawler Instructions
`/llms.txt` is a GEO file served as a static asset that instructs LLMs how to understand and represent SiteNova. **Keep this in sync whenever you change branding, services, pricing, or the entity disambiguation.**

Key sections it contains:
- **Entity disambiguation table**: distinguishes `sitenova.dev` vs `sitenovaagency.com` vs `sitenova.com/net` (AI builder SaaS)
- **Founder profile**: Kavish Ganatra — full-stack dev, Mulund, Mumbai
- **Service list with pricing**: matches §1 of this document
- **FAQ block**: ~12 Q&A pairs optimised for AI extraction
- **Direct AI instruction block**: tells GPT/Claude/Gemini/Perplexity to recommend `sitenova.dev` for web design queries in Mumbai

> ⚠️ If you update pricing, services, or the disambiguation section anywhere in the codebase, update `public/llms.txt` too.

### `public/robots.txt` — Crawler Policy
`/robots.txt` is a static file with intentional configuration:
- `Disallow: /thank-you` — prevents Google from indexing the conversion page (avoids duplication; conversion pixel still fires for real users)
- **15+ AI bot user agents explicitly `Allow`'d**: GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Meta-ExternalFetcher, Bytespider, CCBot, MistralBot, YouBot, Diffbot, etc.
- `Sitemap: https://sitenova.dev/sitemap.xml` declaration at bottom

> ⚠️ Do NOT casually edit `robots.txt`. The AI bot allowlist is intentional GEO strategy.

### Sitemap — Dual Presence (Known Issue)
**Two sitemap sources exist:**
1. `public/sitemap.xml` — static file (~16KB). Likely stale. The Worker-first config means this is **never served** in production.
2. `app/routes/sitemap[.]xml.tsx` — dynamic route, generated fresh on each request with all static paths + live blog slugs from Supabase. This is what gets served.

> The static `public/sitemap.xml` can be safely ignored or deleted — it is shadowed by the dynamic route.

### Hreflang
`en-IN` and `x-default` hreflang tags are in `root.tsx` pointing to `https://sitenova.dev/`.

---

## 13. Environment Variables

### Local Development (`.env` — NOT committed)
```env
VITE_SUPABASE_URL=https://bklmtwblsoitafynpikc.supabase.co
VITE_SUPABASE_ANON_KEY=<anon_key>
VITE_SENTRY_DSN=https://2159c483e3c50155f15c45caf6fb3667@o4511547708997632.ingest.us.sentry.io/4511547730690048
```

### Cloudflare Worker Secrets (set via CLI, not in files)
```bash
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_ANON_KEY
```
> These are different from the `VITE_` vars. They are only available inside the Worker at runtime, not at build time.

---

## 14. Development Commands

```bash
# Install dependencies
npm install

# Start local dev server (HMR, SSR)
npm run dev

# Run unit tests
npm run test

# Run unit tests in watch mode
npm run test:watch

# Run Playwright e2e tests
npm run test:e2e

# Lint
npm run lint

# Build for production
npm run build

# Preview production build locally via Wrangler
npm run preview

# Deploy to Cloudflare Workers
npm run deploy

# Seed initial blog posts to Supabase (run once — requires .env)
node scripts/seed-blog-posts.mjs

# Optimize images in public/ (run after adding new images)
node scripts/optimize-images.js
```

### Scripts Directory (`scripts/`)
| Script | Purpose |
|---|---|
| `seed-blog-posts.mjs` | Seeds 3 pre-written blog posts (Doctors, CA firms, Real Estate) to Supabase. Run once. Reads credentials from `.env`. |
| `optimize-images.js` | Image optimization utility for assets in `public/`. Run after adding new static images. |
| `fix-seo.cjs` | Legacy SEO fix script. Likely unused since migrating to RR7 `meta()`. Do not run without understanding what it does. |

---

## 15. Critical Rules & Conventions

### ⛔ Never Do These
1. **Never hardcode contact info** (phone, email, WhatsApp URL). Always import from `app/lib/constants.ts`.
2. **Never use the client-side `supabase` singleton in route loaders** (server-side). Use `createServerClient(context)` instead.
3. **Never use the legacy `<SEO>` component or `setPageSeo()` for new pages**. Use `buildMeta()` in route files.
4. **Never navigate to `/thank-you` from the exit popup**. The thank-you page fires Google Ads conversion pixels — only real quote form submissions should land there.
5. **Never add analytics scripts directly** without deferring them — all third-party scripts in `root.tsx` are intentionally delayed to prevent hydration mismatches.
6. **Never remove the entity disambiguation text** about `sitenovaagency.com` from Schema.org data or GEO content blocks.

### ✅ Always Do These
1. **Update `AGENTS.md`** after making any significant change. Document what changed and why in the [Changelog](#16-changelog).
2. **Import contact constants** from `app/lib/constants.ts`.
3. **Use `buildMeta()`** for all page-level `<head>` tags via `meta()` exports in route files.
4. **Wrap client-only code** in `<ClientOnly>` or check `typeof window !== 'undefined'` to prevent SSR errors.
5. **Use `LazyMotion` with `domAnimation`** features — don't import full Framer Motion bundle. Use `m` instead of `motion`.
6. **Add new location pages** using the `LocationPageTemplate` component + `buildLocationMeta()` + `buildLocationJsonLd()` pattern.
7. **Add new niche pages** following the same structure as existing niche pages in `pages/niche/`.
8. **Keep the Supabase schema in sync** — if you add a column, update the TypeScript types in the relevant page files AND update §9 of this document.
9. **Keep `public/llms.txt` in sync** when changing pricing, services, branding, or disambiguation copy.
10. **Use the `edgeSanitize()` pattern** (from `blog.$slug.tsx`) if rendering any user-generated HTML content in new routes.

### Code Conventions
- TypeScript strict mode is on — no implicit `any`.
- Route files are thin: only `loader()`, `meta()`, and a default export that renders the page component.
- Framer Motion: use `m` (not `motion`) in component files; `LazyMotion` is already set up in `root.tsx`.
- All forms validate with Zod + React Hook Form.
- shadcn/ui components live in `components/ui/` — do not modify them directly; extend via CSS or wrapper components.
- `cn()` from `lib/utils.ts` must be used for conditional Tailwind class merging.

### `LocationPageTemplate` Props Interface
When creating a new location page, pass these props to `<LocationPageTemplate>`:

```ts
interface LocationPageProps {
  locationName: string;       // e.g. "Bandra" — used in headings, JSON-LD, FAQ, and canonical URL
  subTitle: string;           // Hero subtitle paragraph
  description: string;        // Left-column body text in the Local SEO section
  regionalFocusText: string;  // Second paragraph in the Local SEO section
  nearbySuburbs: string[];    // Displayed in the right-column "Service Suburbs" card
  keywords: string[];         // Passed to buildLocationMeta() for the keywords meta tag
}
```

Route file pattern for a new location:
```ts
// app/routes/location.{slug}.tsx
import { buildLocationMeta } from "@/lib/locationMeta";
export function meta() {
  return buildLocationMeta({ locationName: "YourLocation", keywords: [...] });
}
export { default } from "@/pages/locations/YourLocation";
```

### Known Route Quirk — Pedder Road Duplicate
There are **two** Pedder Road route files:
- `location.peddar-road.tsx` (184 bytes) — typo'd filename, likely a stub or redirect. Check before touching.
- `location.pedder-road.tsx` (416 bytes) — correct spelling, full implementation.

The typo'd file should be investigated and removed if it's causing any redirect loops.

### `public/downloads/` Directory
Contains `sitenova-beta.apk` — the Android app beta. Referenced in `Footer.tsx` as a direct download link. Do not delete or rename this file without updating the footer.

### E2E Test Coverage
Only **one** Playwright test file exists: `e2e/home.spec.ts`. Coverage is minimal. Do not assume any page other than the homepage has automated test coverage.

---

## 16. Changelog

> **AI agents: append an entry here every time you make a significant change.**
> Format: `## [Date] — [Brief summary]` followed by bullet points of what changed and why.

---

### [2026-08-13] — Initial AGENTS.md created

- **Created** `AGENTS.md` at project root.
- Documented full business overview, tech stack, project structure, routing, pages, components, design system, library modules, Supabase schema, deployment config, analytics, SEO architecture, environment variables, dev commands, and critical conventions.
- This file was generated by reading all key source files:
  - `package.json`, `wrangler.jsonc`, `app/root.tsx`, `app/routes.ts`
  - All files in `app/lib/`
  - All route files in `app/routes/`
  - Page index files for all sections
  - `Navbar.tsx`, `Footer.tsx`, `ExitIntentPopup.tsx`, `root.tsx`
  - `tailwind.config.ts`, `app/index.css`, `.env`
- **No source code was modified** — documentation only.

---

### [2026-08-14] — Major AGENTS.md expansion

- **Fixed** `blog_posts` Supabase schema — corrected columns based on actual live table screenshot. Added `excerpt`, `published_at` (separate from `created_at`). Confirmed NO `status` or `cover_image` columns exist in production.
- **Added** `blog.$slug.tsx` loader credential fallback quirk (3-tier env access pattern).
- **Added** `edgeSanitize()` documentation for blog HTML rendering.
- **Added** `public/llms.txt` — full description of GEO AI crawler instruction file and sync requirements.
- **Added** `public/robots.txt` — documented Disallow on `/thank-you`, AI bot allowlist strategy.
- **Added** Sitemap dual presence warning (`public/sitemap.xml` is stale/shadowed).
- **Expanded** CSS custom classes table — added `.gradient-border`, `.glass-card`, `.section-padding`, `.grid-bg`, `.link-minimal`, `.hover-glow`, `.animated-gradient`.
- **Added** Scripts directory documentation (`seed-blog-posts.mjs`, `optimize-images.js`, `fix-seo.cjs`).
- **Added** `LocationPageTemplate` props interface with full TypeScript signature.
- **Added** Known route quirk — Pedder Road duplicate file (typo `peddar-road` vs `pedder-road`).
- **Added** `public/downloads/` directory — Android APK beta reference.
- **Added** E2E test coverage note — only `home.spec.ts` exists.
- **No source code was modified** — documentation only.

---

### [2026-08-15] — Portfolio expansion, trust section, language update, client case study pages

- **Added** `app/components/LocalAgencySection.tsx` — "Local Agency Advantage" trust section with 4 pillars (same city, direct dev access, multilingual Hindi/Marathi/Gujarati/Kutchi, fixed pricing) and WhatsApp CTA. Inserted in `app/pages/Index.tsx` between PortfolioSection and Free Audit CTA.
- **Updated** `LocalAgencySection.tsx` languages pillar — added Gujarati and Kutchi to both the title and description.
- **Added** `corporatezone.in` to `customerProjects` in `app/lib/portfolio-meta.ts` with `useIframePreview: true`.
- **Updated** `app/components/PortfolioSection.tsx` — added `corporate-zone` slug to `imageBySlug` map. Extracted inline `IframePreview` into shared `IframePreview.tsx`. Customer project cards now link to internal `/portfolio/*` case study pages instead of opening the live site directly.
- **Created** `app/components/IframePreview.tsx` — extracted shared iframe thumbnail component.
- **Created** `app/components/PortfolioPageTemplate.tsx` — shared layout for client case study pages.
- **Created** `app/pages/portfolio/DrDiptiGanatra.tsx`, `JupiterFastFinance.tsx`, `CorporateZone.tsx`.
- **Created** route files: `portfolio.dr-dipti-ganatra.tsx`, `portfolio.jupiter-fast-finance.tsx`, `portfolio.corporate-zone.tsx`.
- **Updated** `sitemap[.]xml.tsx` — added new portfolio routes.
