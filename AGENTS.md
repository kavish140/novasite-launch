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

### Automated blog review removed (2026-10-04)

- At the user's request, the Gemini/Groq review feature was removed and application code restored to `acc915e` (the successful Google Meet/quote implementation plus the legacy quote-status fix). Manual blog editing and publishing are restored in the code.
- Google Meet booking, Calendar synchronization, Scheduled Calls, quote intake and notification delivery remain intact.
- `supabase/migrations/20261004_remove_blog_review_gate.sql` removes the review-only publication trigger and RPCs and restores the original published status default. Existing posts, private review history and recovery data are preserved; admin authorization and RLS remain unchanged. The user applied this SQL in production on 2026-10-04; their Supabase screenshot confirms "Success. No rows returned."
- The Worker bindings `GROQ_API_KEY`, `GEMINI_API_KEY` and `GEMINI_FREE_TIER_CONFIRMED` were removed. Calendar and Supabase bindings remain.
- Validation: production build and all 16 existing conversion, quote, Calendar and scheduled-call tests passed. No articles were published as a test.
- Restored application deployed as Worker version `0cc34d0c-438a-4d19-bf9a-c9c449a1fd4a`. Live `/book-a-call` and `/api/booking-settings` return HTTP 200 with booking enabled; the removed review endpoint renders the fallback page and rejects POST with HTTP 405. Code deployment and database rollback are complete.

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
- E-Commerce Stores (from ₹18,000 — Razorpay + Stripe integration)
- Custom Web Applications / Dashboards (from ₹30,000)
- SEO & Speed Audits / Core Web Vitals (from ₹8,000)
- Google Ads Management (recommended ad spend: ₹10,000–₹15,000/month — management priced based on budget)
- Meta Ads Management / Facebook & Instagram Ads (recommended ad spend: ₹10,000–₹15,000/month — management priced based on budget)
- Niche websites: Doctors, Lawyers, Finance/CA, Real Estate, Consultants, Startups, Restaurants

### Geo Service Areas
Mulund, Mumbai, Bhandup, Nahur, Thane, Ghatkopar, Powai, Vikhroli, Kurla, Dadar, Andheri, Lower Parel, Mahalakshmi, Pedder Road, Central Mumbai

---

## 2. Tech Stack & Architecture

### Core
| Layer | Technology |
|---|---|
| Framework | React Router v7 (RR7) + React 19.3 - SSR via Cloudflare Workers |
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
| `pay.tsx` | `/pay` | `pages/Pay.tsx` — noindex package advance checkout |
| `payment-thank-you.tsx` | `/payment-thank-you` | `pages/PaymentThankYou.tsx` — private, verified-only advance/balance confirmation and next steps (deployed 2026-10-15) |
| `project.tsx` | `/project` | `pages/Project.tsx` — owner-shared private project/progress/balance page (deployed 2026-10-14) |
| `api.project.$action.ts` | `/api/project/:action` | Signed-capability project reads and isolated balance checkout/recovery (deployed 2026-10-14) |
| `api.payments.order.ts` | `/api/payments/order` | Server-priced Razorpay order creation |
| `api.payments.verify.ts` | `/api/payments/verify` | Signed callback and captured-payment verification |
| `api.payments.checkout.ts` | `/api/payments/checkout` | Server-authorized checkout options |
| `api.payments.webhook.ts` | `/api/payments/webhook` | Signed backend settlement reconciliation |
| `api.payments.status.ts` | `/api/payments/status` | Signed-session payment status and refresh recovery |
| `api.payments.retry.ts` | `/api/payments/retry` | Fresh provider-confirmed failure/expiry retry; public activation required |
| `api.admin.payments.$action.ts` | `/api/admin/payments/:action` | Fresh admin-authenticated test checkout, payment queue/history and provider re-checks |
| `api.admin.payments.$action.ts` | `/api/admin/payments/:action` | Authenticated admin-only ₹1 Test checkout, verification and recovery |
| `delivery-policy.tsx` | `/delivery-policy` | `pages/legal/DeliveryPolicy.tsx` |
| `quote.tsx` | `/quote` | `pages/Quote.tsx` |
| `book-a-call.tsx` | `/book-a-call` | `pages/BookACall.tsx` |
| `api.quotes.ts` | `/api/quotes` | Validated, idempotent quote action |
| `api.booking-settings.ts` | `/api/booking-settings` | Sanitized public booking configuration |
| `api.integrations.google-calendar.ts` | `/api/integrations/google-calendar` | HMAC-signed Calendar/notification API |
| `thank-you.tsx` | `/thank-you` | `pages/ThankYou.tsx` |
| `website-cost-calculator.tsx` | `/website-cost-calculator` | `pages/WebsiteCostCalculator.tsx` |
| `why-us.tsx` | `/why-us` | `pages/WhyUs.tsx` |
| `privacy-policy.tsx` | `/privacy-policy` | `pages/legal/PrivacyPolicy.tsx` |
| `terms-and-conditions.tsx` | `/terms-and-conditions` | `pages/legal/TermsAndConditions.tsx` |
| `refund-policy.tsx` | `/refund-policy` | `pages/legal/RefundPolicy.tsx` |
| `blog._index.tsx` | `/blog` | `pages/blog/BlogIndex.tsx` |
| `blog.$slug.tsx` | `/blog/:slug` | `pages/blog/BlogPost.tsx` |
| `admin._index.tsx` | `/admin` | `pages/admin/AdminLogin.tsx` |
| `admin.dashboard.tsx` | `/admin/dashboard` | `pages/admin/AdminDashboard.tsx` |
| `admin.blog.new.tsx` | `/admin/blog/new` | `pages/admin/AdminBlogEditor.tsx` |
| `admin.blog.$id.tsx` | `/admin/blog/:id` | `pages/admin/AdminBlogEditor.tsx` |
| `services.ecommerce.tsx` | `/services/ecommerce` | `pages/services/Ecommerce.tsx` |
| `services.seo-optimization.tsx` | `/services/seo-optimization` | `pages/services/SeoSpeed.tsx` |
| `services.web-applications.tsx` | `/services/web-applications` | `pages/services/WebApps.tsx` |
| `services.google-ads.tsx` | `/services/google-ads` | `pages/services/GoogleAds.tsx` |
| `services.meta-ads.tsx` | `/services/meta-ads` | `pages/services/MetaAds.tsx` |
| `ads-contact.tsx` | `/ads-contact` | `pages/AdsContact.tsx` |
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
| `lp.web-design.tsx` | `/lp/web-design` | `pages/lp/WebDesignLP.tsx` — **noindex** paid ad LP |
| `lp.thank-you-quote.tsx` | `/lp/thank-you-quote` | `pages/lp/LpThankYouQuote.tsx` — **noindex** LP quote confirmation |
| `lp.thank-you-audit.tsx` | `/lp/thank-you-audit` | `pages/lp/LpThankYouAudit.tsx` — **noindex** LP audit confirmation |
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
| Homepage | `pages/Index.tsx` | Buyer-focused hero with prices and client imagery, customer portfolio and testimonials immediately after hero, features, Resources by SiteNova, service areas, pricing, demos, process, FAQ and GEO block |
| About | `pages/About.tsx` | Company story, founder bio, values, team section |
| Contact | `pages/Contact.tsx` | Contact form + WhatsApp / phone links |
| Free Audit | `pages/FreeAudit.tsx` | Lead capture form — saves to Supabase `audit_requests` table |
| Our Process | `pages/OurProcess.tsx` | 4-step process: Discovery → Design → Development → Launch |
| Pricing | `pages/Pricing.tsx` | Pricing tiers and breakdown |
| Quote | `pages/Quote.tsx` | Shared `QuoteForm`: explicit budget, business/contact/project/timing, optional details; saves via `/api/quotes` before confirmation |
| Thank You | `pages/ThankYou.tsx` | Post-quote confirmation with optional booking CTA; requires accepted submission state; never fires a conversion on page load |
| Website Cost Calculator | `pages/WebsiteCostCalculator.tsx` | Interactive calculator with dynamic pricing |
| Why Us | `pages/WhyUs.tsx` | Differentiators, trust signals |
| Not Found | `pages/NotFound.tsx` | 404 page |

### Specialized payment confirmation — DEPLOYED (2026-10-15)

- Owner approved deployment and source push after checks. Website Worker `10c28fd0-e456-4408-862b-ffbb5282fb27` adds this page, preserving all existing runtime settings with `--keep-vars`. No backend deployment/schema/secret/activation change or financial action. Live route returns 200 with private headers, no tracking and no unverified SSR success; payment redirect/paid behavior is browser-verified with local mocks, not a new real charge. Earlier local-preparation wording below records the implementation checks.

- Previously public payments displayed inline success on `/pay`. Verified-paid advances now navigate with replacement to `/payment-thank-you?package=starter|business#resume=<signed-session>`. The new page independently checks the existing signed status endpoint on entry/refresh and offers the existing durable receipt link, reference, next steps and optional WhatsApp/email contact. It never trusts a success query or navigation state and never creates an order or a payment. The opaque session remains in a fragment/private storage, never a query parameter. No customer contact or project brief is displayed.
- Verified remaining-balance callbacks navigate only when the backend reports `balanceStatus=paid`, positive recorded balance, zero remaining and no review flag. Their `kind=balance` confirmation uses the existing private project capability/view and links back to the project summary. No new balance receipt endpoint is invented. Old-project/stale callbacks retain their existing generation checks; admin ₹1 test checkout stays in admin.
- Pending/refunded/missing-link/network-failure states cannot display the thank-you success. Manual read-only status recheck clears stale success and can recover after a delay. Test Mode is explicitly labelled. No conversion is fired on page mount. Root/entry/promotion guards exclude this private page from analytics/replay/promotions; route is noindex/no-store/no-referrer and excluded from the static sitemap paths.
- 350 tests across 49 files pass (all previous 332 retained, 18 new confirmation cases), as do production build and scoped lint. Same 61 baseline type errors; zero added. Actual isolated browser tests confirm the payment redirect, receipt preparation, refresh, pending/refund/offline states, with provider/network responses mocked and no real financial request. Preview is ignored `test-results/payment-thank-you/` on port 8793. Live behavior is unverified until approved release. No Supabase source/schema/secrets, price/activation flags, deployment or Git push changed in this pass.

### Pricing and recovery release — DEPLOYED (2026-10-14)

- Owner approved final checks and push. Applied `20261014103622_admin_package_pricing.sql`, deployed payment API v18/webhook v14/reconciler v12, then Worker `d78a12fb-11d9-4067-b78e-02b31744ea0e`. Restoring the prior public activation produced active Worker `07a616b1-f31e-4073-82d7-ccf91b0991ba` with the same code. Supabase activation and all credentials were preserved; Cloudflare new collection was briefly paused for coordination and restored to true. This entry supersedes the local-only preparation states below.
- Admin independently adjustable package/advance prices, landing cards, private project intake and closed-tab recovery are live. Existing price seeds remain Starter ₹10,000/₹5,000 and Business ₹15,000/₹7,500; no live price edit, new order, charge, capture or refund. Existing 20 orders and seven paid tests retain their state/amounts. Previously deployed receipt/project/hydration code is retained in the source release.
- Final checks: 332 tests/48 files, nine isolated PostgreSQL scripts, production build, dependency validation, changed/new-file lint (zero errors/warnings), credential/release scans and whitespace checks pass. Typecheck retains 61 existing errors, no added payment/recovery diagnostics. Live schema/grants/config, active forms/links/security denials, signed-in pricing reads and recovery of the original untouched Business order pass; a fresh tab restores the same order with no inspected console errors. Updated cron's 22:30 IST run completed checked=20/errors=0. No real payment popup or price-save exercised; live financial/new-price-save paths remain unverified.
- Report, limitations, advisor findings and exact owner steps: `docs/release-20261014.md`. Source release targets existing `ssr`; runtime caches, environment files and ignored UI fixtures are excluded. Preparation review/diffs below remain historical evidence.

### Closed-tab checkout recovery — local preparation, subsequently deployed (2026-10-14)

- Read-only production diagnosis confirmed an existing untouched Business Razorpay order and duplicate reservation errors after tab-only recovery storage was lost. Retrieved API metadata is version 17 with the previously reviewed static-price source; this pass changes no live flags, order, secret or deployed code.
- `razorpay-client.ts` now retains the opaque request UUID and minimal signed session across tab closure using localStorage plus sessionStorage, without saving customer/project details. Returning checks the same order and uses the existing provider authorization before reopening. An existing captured payment shows verified success; uncertain attempts remain blocked. Closing during the order response retains the original UUID for exact-payload idempotent reuse.
- Admin Payments adds Get recovery link for already-lost recovery data. Existing fresh admin auth and the `resume-checkout` action verify a pending, unretired, untouched Starter/Business order with provider GETs before signing its original session. No new order, settlement change, contact-only lookup or 24-hour expiry extension. Fragment links are consumed after saving so a later approved retry survives refresh correctly. Cross-device/cleared-storage recovery requires this privately shared owner link; old/uncertain orders require investigation.
- Typed reservation conflicts now return actionable HTTP 409 rather than misleading 503; outages remain unavailable. RLS, grants, schema, checkout/verification/settlement logic and public activation flags are unchanged. Review: `docs/checkout-recovery-review.md`; narrow retrieved-source backend diff: `docs/checkout-conflict-hotfix.diff`; frontend/test diff: `docs/checkout-recovery.diff`.
- Validation: 332 tests across 48 files pass, including all prior 300, plus 16 isolated retrieved-source recovery scenarios with mocked calls and no provider POSTs. Actual browser close/reopen/payment/return checks against an isolated fake provider reuse one original order, make one simulated creation call, show paid status without another Pay control, and have zero inspected console errors. Build/scoped lint/credential scan pass; 61 pre-existing type errors remain with no recovery/payment diagnostics. Production behavior of this update is unverified until approved release. Fixture `test-results/recovery-ui/` is ignored and never ships.
- No deployment or Git push. A future full local website release needs the pending pricing migration and matching Edge Functions deployed first; the isolated static-price recovery backend artifact must not be paired with the full editable-pricing website.

### Editable pricing and landing payment options — LOCAL ONLY (2026-10-14)

- Owner requested separate admin controls for Starter/Business starting prices and advance amounts, plus payment options on both `/` and `/lp/web-design`. This preparation is active local source only; nothing from this pass is deployed or pushed. Production activation flags remain as previously approved and are untouched.
- `PackageAdvanceOptions` retains quote links and adds full-document advance links only when the shared public catalog is available and both backend/website collection gates allow payment. `/pay` collects a required 20–2,000 character project brief and timeline, plus optional HTTP(S) existing website URL. These details are validated server-side, saved in the private ledger and shown in Recent paid orders; they are not added to Razorpay notes or public receipts. Legacy stored customer details remain valid for existing order retries.
- Admin Settings → Package pricing is mounted only after fresh identity/admin membership checks. Existing authenticated admin API actions `pricing`/`pricing-save` independently re-check membership, validate exact integer paise and rate-limit by verified admin ID. Four rupee inputs allow independent advances up to each starting price; optimistic version checks reject conflicting edits and preserve unsaved input.
- Local migration `20261014103622_admin_package_pricing.sql` adds append-only `payment_package_prices`, singleton `payment_price_current`, and immutable `payment_intents.pricing_version`. Tables have RLS and no browser grants. Invoker-only, service-executable price saves validate admin membership and lock the version pointer. Reservation triggers reject stale prices before provider order creation; retries inherit their parent's original version and amount. Existing settlement RPCs are unchanged. All three payment Edge Functions need the updated shared files in a future backend-first rollout.
- Public copy, pricing offers, relevant SSR metadata, quote prefill and the website calculator use the same catalog. Unavailable pricing hides monetary estimates/new checkout instead of authorizing a fallback amount. Old signed orders/verification/reconciliation retain ledger/provider checks using the immutable original amount; the saved-order screen avoids showing a newly edited advance as the old order's price. ₹1 admin tests remain fixed at 100 paise.
- Terms are locally revised to 14 October 2026: the displayed advance is credited toward the agreed total and future price edits affect new bookings only. No refund-policy or agreed-total change. Review report/diffs: `docs/admin-package-pricing-review.md`, `docs/admin-package-pricing.diff`, `docs/admin-package-pricing-backend.diff`. The ignored `test-results/local-pricing/` browser preview blocks all live API calls, payments and admin saves and is never included in the website build.

### Razorpay package advances (2026-10-10)

- **Current activation, 2026-10-14:** Owner prioritised public launch before 16:30 IST. Production Supabase RAZORPAY_ENABLED=true / Cloudflare PAYMENT_EDGE_ENABLED=true; pricing links and both correct forms verified live by 16:25 IST. Existing API/webhook/reconciler v13/v9/v7 and all 15 shared backend files unchanged. Secret-only active website version `d796eb99-ff16-4bd2-b712-628789f2d2b5` retains reviewed code. All 250 tests, eight isolated SQL checks, build/lint/credential scans and live browser/security checks pass; 61 unrelated type errors remain, zero payment/project diagnostics. No real order/charge or Git push. Editable pricing postponed; incomplete untested drafts preserved in ignored `test-results/pricing-draft/`, outside active source/migrations. Report: `docs/public-payments-launch-20261014.md`. Earlier disabled/local notes below are historical.

- `pages/Pay.tsx` provides direct Starter/Business advances of ₹5,000/₹7,500, approved by the owner as 50% of their starting prices. Final scope and price remain proposal-based; Premium/custom projects retain quote-only CTAs.
- The `/pricing` loader exposes only readiness. Secondary advance links appear only when explicitly enabled and navigate with a full document reload so checkout does not inherit tracking scripts. Existing quote CTAs remain.
- Supabase Edge `functions/_shared/razorpay.ts` creates fixed-price INR orders, signs their sessions, validates callback HMAC against the provider-fetched order, and checks actual payment capture, amount, currency and order relationship. Server-only `lib/razorpay.server.ts` forwards same-origin requests with the private gateway credential. Secrets never enter client bundles.
- Backend payment_intents ledger and service-only invoker record_package_payment RPC are staged in migration 20261010170200_razorpay_backend_payments.sql. RLS plus revoked browser grants protect customer/payment data. Unique retry/project reservations block duplicate Orders API calls; uncertain creation fails closed for manual reconciliation. Settlement must be saved before success. Signed raw-body webhooks fetch provider state and use monotonic settlement writes. No production migration/deployment or automatic emails/invoices/fulfilment.
- The Edge backend owns prices; `lib/payments.ts` holds the shared form/types; `lib/razorpay-client.ts` loads checkout on demand. A signed session without contact details is kept in browser session storage for status recovery and resuming unattempted orders. Any payment attempt, including failed/created states, blocks reopening pending reconciliation. Live checkout requires https://sitenova.dev. Unattempted checkout is limited to 24 hours, but signed verification can continue even when checkout is disabled. Backend project deduplication also covers separate browser sessions; uncertain debit/order creation requires owner reconciliation.
- `/pay` is noindex and excluded from sitemap; root analytics/Clarity/GTM and client Sentry replay are suppressed there, and promotional controls are hidden. API responses and readiness loaders use no-store. Cloudflare `PAYMENT_RATE_LIMITER` limits creation/checking separately to 30/minute/IP/location.
- Legal pages use a stable 10 October 2026 revision date, shared contact constants, advance/payment-processing details and existing refund rules; `/delivery-policy` describes digital delivery using the agreed proposal schedule and is linked in the footer and sitemap. `public/llms.txt` documents the advances.
- Setup and remaining account checks: `docs/razorpay-setup.md`. Default disabled. No real transaction, credentials, production configuration or deployment was performed during preparation.

### Receipt presentation — deployed 2026-10-14 (prepared 2026-10-13)
- Live retrieval of an existing real ₹1 receipt, refresh and separate-tab opening pass. Print control is visible; actual PDF export unverified. Deployment supersedes the historical local-only notes below; see `docs/private-project-deployment-20261014.md`.
- `app/pages/Receipt.tsx` uses a navy SiteNova header, white receipt card, prominent original amount, readable service/status, contact action and browser Print / save PDF. Scoped `app/pages/receipt.css` hides actions/private-link notes for printing. No new personal data, dates, payment IDs or refund amounts are invented; a recorded refund does not imply the full original amount was returned.
- Existing fragment-token loading, endpoint, signing, verification, checkout and settlement remain unchanged. Public payments remain disabled. Owner reports live receipts, admin payment records and bank settlement working; owner declines further package Test Mode and live refund exercises. Those omitted live exercises remain unverified; automated coverage is retained.
- All 182 unit/component tests pass (179 existing plus three receipt regressions); scoped receipt lint passes. Browser visual/print rendering has not been checked, respecting the owner's browser prohibition. Nothing pushed or deployed.

### Legal Pages

| Page | File | Description |
|---|---|---|
| Privacy Policy | `pages/legal/PrivacyPolicy.tsx` | Privacy Policy required for standard compliance |
| Terms & Conditions | `pages/legal/TermsAndConditions.tsx` | General T&Cs for services |
| Refund Policy | `pages/legal/RefundPolicy.tsx` | Refund & Cancellation policy required by payment gateways |

### Paid Ad Landing Pages (`pages/lp/`)
Stripped-down, distraction-free pages with no Navbar/Footer. `noindex, nofollow`. Insert `source: "paid_ad"` into `audit_requests` on form submit. Ad leads appear in a separate "Ad Leads" tab in the Admin Dashboard.

| Page | URL | Description |
|---|---|---|
| `pages/lp/WebDesignLP.tsx` | `/lp/web-design` | Google + Meta ads LP. **Hero**: shared 3-step `QuoteForm` (project → budget/timing → business/contact). Uses `/api/quotes`; durable email queue is delivered by Apps Script. **Bottom CTA**: 4-field free audit form (`LeadForm`) — saves to `audit_requests` with `source: 'paid_ad'`. Fires `trackAuditSubmit()` on audit submit. Sections: hero+quote form, real client work and testimonials, pain points, process, FAQ and audit CTA. No floating controls on this form page. |
| `pages/lp/LpThankYouQuote.tsx` | `/lp/thank-you-quote` | Confirmation page for LP quote form. Shows name + project type + email. No mount conversion. Guard: redirects to `/lp/web-design` without an accepted submission ID in router state. Includes booking CTA when configured. |
| `pages/lp/LpThankYouAudit.tsx` | `/lp/thank-you-audit` | Confirmation page for LP audit form. Shows name + email. Fires `trackAuditSubmit()`. Guard: redirects to `/lp/web-design` if accessed directly without router state. |


### Blog Pages
| Page | File | Description |
|---|---|---|
| Blog Index | `pages/blog/BlogIndex.tsx` | Lists all blog posts fetched from Supabase |
| Blog Post | `pages/blog/BlogPost.tsx` | Individual post, fetched by slug from Supabase |

### Admin Pages (Protected — `/admin/*`)
| Page | File | Description |
|---|---|---|
| Admin Login | `pages/admin/AdminLogin.tsx` | Redesigned login page — gradient Zap icon, password visibility toggle, error shake animation, three animated glow orbs. |
| Admin Dashboard | `pages/admin/AdminDashboard.tsx` | Thin shell (~180 lines) — imports all tab components, owns data fetching + mutations, passes props down. Tabs include Overview, Scheduled Calls, lead/quote queues, analytics, blog/content tools, settings and activity log. Exports shared types (`AuditRequest`, `BlogPost`, `AdsInquiry`, `PageView`). AnimatePresence cross-tab transitions. |
| Admin Blog Editor | `pages/admin/AdminBlogEditor.tsx` | Blog post create/edit with **TipTap WYSIWYG editor** (Phase 4). Toolbar: undo/redo, H1-H3, bold/italic/underline/strike/inline-code, bullet/ordered lists, blockquote, code block, text alignment, link insert, image URL insert, horizontal rule, hard break. Live Preview toggle in header renders the post as it will appear on the blog. Slug auto-generated from title on create. |

> **Admin guard**: `components/ProtectedRoute.tsx` is now **actively wired** to all three protected routes: `admin.dashboard.tsx`, `admin.blog.new.tsx`, `admin.blog.$id.tsx`. Any unauthenticated access redirects to `/admin`. The exit intent popup is suppressed on all `/admin/*` routes.

### Admin Sub-Components (Phase 1 — `pages/admin/components/`)
| Component | File | Role |
|---|---|---|
| `AdminSidebar` | `components/AdminSidebar.tsx` | Redesigned sidebar — gradient Zap brand icon, left-border accent bar on active item, nav grouped into General / Marketing sections, no Test Sentry button. Exports `AdminTab` type. |
| `AdminHeader` | `components/AdminHeader.tsx` | Top header — breadcrumb path, backdrop-blur-xl, contextual action buttons (Refresh, Export CSV, Copy Blogs, New Post) per active tab. |
| `KpiCard` | `components/KpiCard.tsx` | Glassmorphism KPI card — hover-lift animation, glow effect, accepts icon/color/accent props. |
| `ChartCard` | `components/ChartCard.tsx` | Card wrapper for Recharts charts — consistent title/description/sizing. |
| `StatusBadge` | `components/StatusBadge.tsx` | Centralised status badge — maps status strings to Tailwind colour classes. |
| `EmptyState` | `components/EmptyState.tsx` | Reusable empty state — icon + title + description + optional action CTA. |
| `PhoneCell` | `components/PhoneCell.tsx` | Long-press-to-copy phone link — extracted from monolith, shared by all lead tabs. |

### Admin Tabs (Phase 2 — `pages/admin/tabs/`)
| Tab | File | Description |
|---|---|---|
| `OverviewTab` | `tabs/OverviewTab.tsx` | Stagger entrance animation, gradient bar chart fill |
| `LeadsTab` | `tabs/LeadsTab.tsx` | Search, date range filter (All/Today/7d/30d/90d/Custom), sortable columns (date/name/email), TableSkeleton on load, pagination (20/page) for both pending and resolved sections |
| `QuoteRequestsTab` | `tabs/QuoteRequestsTab.tsx` | **NEW** — fetches `quote_requests` table. Status flow: new → contacted → converted → lost (shadcn Select). Summary count chips. Date filter + search + sortable columns (date/name/project/budget) + pagination. |
| `AdLeadsTab` | `tabs/AdLeadsTab.tsx` | Same features as LeadsTab: date filter, sort, TableSkeleton, pagination |
| `AdsInquiriesTab` | `tabs/AdsInquiriesTab.tsx` | shadcn Select for status. Sortable columns (date/name/status). TableSkeleton on load. Pagination. |
| `AnalyticsTab` | `tabs/AnalyticsTab.tsx` | AreaChart with gradient fills, stagger animation, gradient traffic-source bars |
| `BlogsTab` | `tabs/BlogsTab.tsx` | Sortable (date/title). TableSkeleton on load. Pagination. Delete now triggers `ConfirmDialog` in shell (no more `window.confirm`). |

### Admin Shared Components (Phase 2 additions — `pages/admin/components/`)
| Component | File | Role |
|---|---|---|
| `TableSkeleton` | `components/TableSkeleton.tsx` | **NEW** — Shimmer skeleton table with configurable columns/rows. Widths vary via sin() to feel natural. Used in all tabs. |
| `ConfirmDialog` | `components/ConfirmDialog.tsx` | **NEW** — Wraps shadcn AlertDialog into a controlled component (open + onConfirm). Replaces `window.confirm()` for blog delete. Destructive variant styles the confirm button red. |
| `DateRangeFilter` | `components/DateRangeFilter.tsx` | **NEW** — Preset buttons (All/Today/7d/30d/90d) + shadcn Calendar popover for custom range. Exports `filterByDateRange<T>()` utility. |

### Admin Phase 3 Components & Hooks (`pages/admin/`)
| File | Role |
|---|---|
| `components/QuickActions.tsx` | One-click WhatsApp (`wa.me/91{digits}?text=…`), Call (`tel:`), Email (`mailto:`) buttons with Tooltips. `stopPropagation` on click so row click doesn't also fire. |
| `components/BulkActionBar.tsx` | Floating bar (fixed bottom center, AnimatePresence) that appears when table checkboxes are selected. Buttons: Resolve All, Export CSV, Delete (optional). Dismiss with X. |
| `components/LeadDetailDrawer.tsx` | shadcn Sheet slide-out panel. Accepts `DrawerLead` union (`audit_request \| quote_request \| ad_inquiry`). Renders type-specific fields, QuickActions in header, notes timeline (fetches `lead_notes`), Add Note form (Ctrl+Enter to save). Exports `DrawerLead` and `LeadNote` types. |
| `hooks/useRealtimeLeads.ts` | Supabase `channel()` subscriptions on `audit_requests`, `quote_requests`, `ads_inquiries` INSERT events. On new insert: updates parent state. Existing audit/ads email behavior remains; quotes are emailed through the durable server queue and Apps Script, independently of the dashboard. Callbacks stored in ref — effect never re-runs on render. |

**Phase 3 Supabase changes:**
- New table: `lead_notes` (id, lead_type CHECK('audit_request'|'quote_request'|'ad_inquiry'), lead_id uuid, note text, created_at). RLS: authenticated full access only. Index on (lead_id, created_at DESC).
- Realtime enabled on `audit_requests`, `quote_requests`, `ads_inquiries` via `ALTER PUBLICATION supabase_realtime ADD TABLE …`.

**AdminDashboard Phase 3 changes:**
- `ConfirmDialog` upgraded to config-object pattern (`confirmConfig` state) — handles single and bulk deletes via a single dialog instance.
- Bulk mutations: `bulkUpdateRequestStatus(ids, status)`, `bulkDeleteRequests(ids)`, `bulkUpdateQuoteStatus(ids, status)` — use `.in("id", ids)` Supabase filter.
- `openConfirm(title, description, onConfirm)` helper exposed for child-triggered confirms.
- `LeadNote` type exported alongside other shared types.

### Booking and quote improvements (2026-09-29)

- `tabs/ScheduledCallsTab.tsx`: attendee search, upcoming/past/cancelled filters, IST date/duration, Meet/Calendar actions, notification status and sync age.
- `hooks/useScheduledCalls.ts`: paginated reads and 60-second refresh while Overview or Scheduled Calls is open; scheduling itself runs independently in Apps Script.
- Sidebar, header and command palette include Scheduled Calls; Overview counts upcoming confirmed appointments only.
- `components/BookingSettings.tsx`: validates and saves the Google appointment URL and enabled flag in `booking_settings`; mounted by SettingsTab.
- Quote detail drawer includes business, selected package and source.
- `components/QuoteForm.tsx`: shared form with pricing/package prefill and idempotent retries.
- `BookingProvider`/`BookingCTA`: public sanitized configuration, hidden CTAs until enabled and valid.

### Blog HTML input and manual AI review (2026-10-05)

- `components/HtmlInput.ts` adds immediate formatting for typed editor-supported HTML tags and parses raw HTML pastes, including HTML code fences copied from an AI chat. Supports headings, paragraphs, inline marks, lists, quotes, links, images and breaks. Inline closing tags stop their formatting; HTML examples inside code stay literal (closing `</code>` / `</pre>` exits the corresponding format). Pasted HTML is sanitized to remove scripts, event handlers and unsafe URLs before TipTap parsing.
- `AdminBlogEditor.tsx` includes **Copy review prompt + post**, using all loaded metadata with current unsaved title/slug/excerpt/tags/content/status/source/contribution details. Clipboard failures expose selectable text for manual copying.
- **Download review TXT (all posts)** includes the same prompt/current post plus full details and HTML for every currently published post. Reads Supabase in ordered batches of 500, excludes drafts/review/archived rows, and refuses partial exports if any batch fails. This is a local copy/download workflow; the owner pastes or uploads the result to an LLM.
- `app/lib/blog-review-export.ts` holds the shared prompt and export/pagination helpers. The prompt requests current authoritative research, source URLs, corrections, upgraded metadata and paste-ready HTML, and explicitly requires disclosure when browsing or verification is unavailable. No automated publication/review gate or AI credentials are introduced.
- `TipTapEditor.tsx` uses the TipTap v3 `setContent` options and disables duplicate StarterKit link/underline extensions.

### Admin Phase 4 Components & Enhancements

| File | Role |
|---|---|
| `components/Sparkline.tsx` | Pure SVG sparkline mini-chart (no extra dependency). Renders a filled area + stroke line from a `number[]` array. Used in KpiCard for 7-day trend visualisation. |
| `components/LeadCard.tsx` | Mobile-first stacked card for an `AuditRequest`. Shown in a 2-col card grid below the `md` breakpoint in LeadsTab and AdLeadsTab. Shows status badge, date, name, email, website link, QuickActions, and Resolve/Reopen button. Click opens LeadDetailDrawer. |
| `components/TipTapEditor.tsx` | Full WYSIWYG editor built on TipTap. Toolbar: undo/redo, H1/H2/H3, bold/italic/underline/strike/inline-code, bullet/ordered lists, blockquote, code block, text alignment, link insert (window.prompt), image URL insert (window.prompt), horizontal rule, hard break. Output: HTML via `editor.getHTML()`. Syncs external `content` prop for edit mode. |

**Phase 4 modifications:**
- `KpiCard.tsx` — now accepts optional `sparkData: number[]` (renders Sparkline bottom-right of value), `trend: number` (% change badge with TrendingUp/Down/Minus icon, green/red/muted coloured), `sparkColor: string` (override sparkline colour).
- `OverviewTab.tsx` — KpiCards now receive 7-day sparkline data and trend% from `buildSparkData()` + `calcTrend()` helpers. Bar chart + Lead Source donut chart now in 2/3 + 1/3 grid layout. Donut uses Recharts PieChart with `PieChart`, `Pie`, `Cell`, `Legend`.
- `LeadsTab.tsx` / `AdLeadsTab.tsx` — mobile card grid (LeadCard components) rendered below `md` breakpoint; desktop table remains above `md`.
- `AdminBlogEditor.tsx` — TipTap WYSIWYG replaces raw textarea; live preview toggle in header; form submit via `form id` pattern.
- `app/index.css` — TipTap editor canvas styles added (placeholder, code block, blockquote, HR, images, links, focus ring).

### Admin Phase 5 Components & Enhancements
| File | Role |
|---|---|
| `components/CommandPalette.tsx` | `Cmd+K` / `Ctrl+K` modal using shadcn `<Command>` component. Navigate to any of the 9 tabs, create new blog post, search leads/quotes by name or email. Registered in AdminDashboard via a `useEffect` keydown listener. |
| `tabs/SettingsTab.tsx` | Two sections: (1) Announcement Banner — text, link, bg/text color pickers, image upload to Supabase Storage `images` bucket, enabled toggle, live inline preview; saves to `site_settings` JSONB via upsert. (2) Change Password — Supabase Auth `updateUser`. |
| `tabs/ActivityLogTab.tsx` | Scrollable audit trail from `activity_log` table. Timeline with colour-coded action icons. Filters: action type dropdown + date range presets. Pagination at 30/page. Human-readable descriptions from `describeLog()`. |
| `components/AnnouncementBanner.tsx` | Sitewide top banner — fetches `site_settings.announcement_banner` from Supabase on client mount. Renders if `enabled: true`. Dismiss button persists to `sessionStorage`. Suppressed on `/admin/*`. Lazy-loaded via `ClientOnly` in `root.tsx`. |

**Phase 5 modifications:**
- `AdminSidebar.tsx` — `AdminTab` union extended with `"settings"` and `"activity_log"`. New **System** section in sidebar with Settings (gear) + Activity Log (history) nav items.
- `AdminHeader.tsx` — `TAB_LABELS` map includes `settings` and `activity_log`.
- `AdminDashboard.tsx` — `cmdOpen` state + `Cmd+K` keydown effect + `logActivity()` helper (writes to `activity_log`). CommandPalette rendered alongside ConfirmDialog. `settings` and `activity_log` entries in `tabContent` map. `updateRequestStatus` and `handleDeleteClick` now call `logActivity` after mutations.
- `root.tsx` — `AnnouncementBanner` lazy-imported and rendered above `<Outlet>` in a `ClientOnly` + `Suspense` wrapper.

**Phase 5 Supabase tables (run SQL below):**
- `site_settings` — key TEXT PRIMARY KEY, value JSONB, updated_at. Seeded with `announcement_banner` default row.
- `activity_log` — id UUID, action TEXT, entity_type TEXT, entity_id TEXT, details JSONB, created_at.
- **Storage buckets**: `images` (public, 10MB limit, image/* MIME types) + `blog-images` (authenticated, 5MB limit).


### Service Pages
| Page | URL | Description |
|---|---|---|
| `pages/services/Ecommerce.tsx` | `/services/ecommerce` | E-commerce store service |
| `pages/services/SeoSpeed.tsx` | `/services/seo-optimization` | SEO & Core Web Vitals service |
| `pages/services/WebApps.tsx` | `/services/web-applications` | Custom web apps service |
| `pages/services/GoogleAds.tsx` | `/services/google-ads` | Google Ads management service. **Orange/amber theme** distinct from web design pages. Hero + interactive Results Estimator (goal/industry/spend → estimated clicks & leads). 4-step Process section (Audit → Strategy → Launch → Optimise & Report). Pain points, FAQ, JSON-LD Service + FAQ + BreadcrumbList. CTA links to `/ads-contact`. No PortfolioSection. |
| `pages/services/MetaAds.tsx` | `/services/meta-ads` | Meta (Facebook & Instagram) Ads management service. **Orange/amber theme**. Hero + Audience Reach Estimator (age group/interest/spend → Mumbai reach & leads). Same 4-step Process section. Pain points, FAQ, JSON-LD. CTA links to `/ads-contact`. No PortfolioSection. |
| `pages/AdsContact.tsx` | `/ads-contact` | Ads inquiry form page. 7-field form: name, phone, business, platform (Google/Meta/Both), monthly budget, industry, goals. Saves to Supabase `ads_inquiries` table + Web3Forms email. Orange/amber theme. Success state inline — no separate thank-you page. |

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
| `Navbar` | `components/Navbar.tsx` | Fixed top nav. Scroll-to-section links (Features, Portfolio, How It Works, Testimonials), **Services** dropdown (3 core web services + 7 niche industry links), **Marketing** dropdown (Google Ads + Meta Ads + "Book a Free Strategy Call" → `/ads-contact`), Blog, Pricing, Cost Calculator, Free Audit, dark/light toggle, "Get a Quote" CTA button. Marketing dropdown uses orange/amber accent. |
| `Footer` | `components/Footer.tsx` | Links to all services, **Marketing** column (Google Ads, Meta Ads, Book a Strategy Call), locations, company pages. Contact links (phone, WhatsApp, email, YouTube). Android app download button. |
| `PageTransition` | `components/PageTransition.tsx` | Wraps pages in a Framer Motion fade-in transition. |
| `ScrollProgress` | `components/ScrollProgress.tsx` | Thin progress bar at top of viewport. Lazy-loaded. |
| `CustomCursor` | `components/CustomCursor.tsx` | Custom cursor effect (desktop only). |

### Lead Generation / Conversion
| Component | File | Role |
|---|---|---|
| `ExitIntentPopup` | `components/ExitIntentPopup.tsx` | Appears on desktop mouse-leave-viewport, or after 45s on mobile. Collects name + email + WhatsApp + industry. Saves to Supabase `audit_requests`. Session-gated via `sessionStorage`. Hidden on admin, LP, booking, quote, contact, audit and confirmation routes via `suppressPromotions()`. |
| `BookCallWidget` | `components/BookCallWidget.tsx` | One mobile Quote/WhatsApp bar and desktop WhatsApp/phone controls; hidden on form, booking, confirmation and admin pages. Lazy-loaded. |
| `MobileAuditBar` | `components/MobileAuditBar.tsx` | Legacy component, no longer mounted; consolidated into `BookCallWidget`. |

### Section Components (used on Homepage & other pages)
| Component | Role |
|---|---|
| `HeroSection` | Main hero with headline, CTA buttons |
| `FeaturesSection` | Key differentiators grid |
| `ResourcesSection` | Server-rendered homepage section after features (`#resources`), introducing AI Insights and Toolbox with three published article links and three real tool examples. Static curated links; no client fetch or ad code. |
| `TechMarquee` | Scrolling marquee of tech logos |
| `PortfolioSection` | Portfolio grid with showcase + customer projects. Customer cards link to internal `/portfolio/*` case study pages. Showcase cards link directly to external sites. |
| `LocalAgencySection` | "Local Agency Advantage" trust pillar section — 4 pillars: same city, direct dev access, Hindi/Marathi/Gujarati/Kutchi, fixed pricing. Includes WhatsApp CTA. Inserted on homepage between PortfolioSection and Free Audit CTA. |
| `HowItWorksSection` | 4-step process visual |
| `TestimonialsSection` | Three client review cards from `lib/client-reviews.ts`, with case-study links. Corporatezone is a five-star Google rating without written review text. |
| `FaqSection` | FAQ accordion (uses `lib/faq-data.ts`) |
| `CtaSection` | Bottom call-to-action banner |
| `BlogCTA` | CTA block for blog pages |
| `RelatedPosts` | Related blog post cards |

### Utility Components
| Component | Role |
|---|---|
| `SEO` | **Legacy** — still referenced in `Index.tsx`. For new pages use `buildMeta()` in route files instead. |
| `JsonLd` | Injects a JSON-LD `<script>` tag inline |
| `BlurImage` | Image with blur-up loading effect. Accepts all standard `<img>` HTML attributes. **Important**: always pass `width` and `height` props — these are forwarded to both the `<img>` element and used to set `aspect-ratio` on the outer wrapper div, preventing CLS before the image loads. For above-fold images always pass `loading="eager" fetchPriority="high"`. |
| `IframePreview` | Shared component that renders a live iframe thumbnail with loading/error states. Extracted from `PortfolioSection`. Used in both `PortfolioSection` and `PortfolioPageTemplate`. Props: `src`, `title`. |
| `PortfolioPageTemplate` | Shared full-page layout for all client portfolio case study pages. Accepts `client`, `project`, `backSlug` props. Renders: hero + live iframe, stats bar, optional shared client review (written testimonial or rating only), features grid, tech stack pills, dual CTA. See `app/pages/portfolio/` for usage. |
| `ClientOnly` | Renders children only after client hydration (prevents SSR mismatches) |
| `ErrorBoundary` | Top-level error boundary with fallback UI |
| `ProtectedRoute` | Auth gate for admin pages |
| `ThemeProvider` | next-themes wrapper (`storageKey: "novasite-theme"`, default: `"dark"`, no system preference) |

### UI Primitives (`components/ui/`)
Full shadcn/ui library: Accordion, AlertDialog, Avatar, Badge, Button, Card, Carousel, Checkbox, Command, Dialog, Drawer (vaul), DropdownMenu, Form, Input, Label, Popover, Progress, RadioGroup, ScrollArea, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner, Switch, Table, Tabs, Textarea, Toast, Toggle, Tooltip, etc.

---

## 7. Design System

### Admin workspace (2026-10-04)

- `app/pages/admin/admin.css` defines scoped light/dark admin tokens: indigo accents, solid card surfaces, subtle borders and consistent table typography. Public-site tokens remain independent. The sidebar uses a dark navy palette in both themes.
- Dashboard navigation groups all 12 tabs into Workspace, Marketing, Content and Manage; selecting a mobile item closes the drawer. The header exposes command search, theme toggle, refresh, contextual exports and New post.
- Overview uses four spacious metrics, a seven-day audit/quote chart, acquisition breakdown, recent inquiries linking to their respective queues, and content summaries. Counts derive from existing data, with loading/empty states; quotes are included in total inquiries.
- Login uses a two-column brand panel and accessible sign-in form. The blog editor shares admin tokens and uses wrapping header actions on narrow screens.
- `e2e/admin.spec.ts` uses isolated mocked sessions/data to check the auth redirect, password visibility, overview counts, search, theme switching and mobile navigation without production writes.
- AI Drafts now uses stage-filter cards, a responsive article grid, excerpt/tag previews, contribution progress with expandable guidelines, and explicit edit/review actions. Search remains available when there are no matches; published and archived cards do not show a Publish shortcut.
- Topic Queue now highlights the next pending topic, orders by priority then age, offers searchable stage filters including in-progress topics, and shows all used topics. Its expanded creation form explains priority and separates the article angle from keywords; named actions and a delete confirmation replace tiny icon-only controls.

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
| `booking.ts` / `quote.ts` | Booking URL validation, promotion suppression, shared quote schema. |
| `payments.ts` / `razorpay-client.ts` / `razorpay.server.ts` | Approved advance catalog/form schema, on-demand checkout/session recovery, and server-only Razorpay order/status verification. |
| `quote-client.ts` | Shared submission client, attribution capture and conversion deduplication. |
| `server-db.server.ts` / `calendar-sync.server.ts` | Per-request service-role client and signed integration validation; server-only imports. |
| `analytics.ts` | GA4 event tracking. ID: `G-EBZGS65QQH`. Typed `ConversionEvent` union. Functions: `trackEvent()`, `trackPageView()`, `trackGoogleAdsConversion()`, `trackWhatsAppClick()`, `trackPhoneClick()`, `trackBookCallClick()`, `trackQuoteSubmit()`, `trackAuditSubmit()`, `trackExitPopupSubmit()`, `trackNichePageView()`. Google Ads tag: `AW-18182593308`. |
| `faq-data.ts` | Exports `faqs` array used by `FaqSection` and FAQ JSON-LD builder. |
| `portfolio-meta.ts` | Exports `showcaseProjects` and `customerProjects` arrays. Showcase projects: AI SmartKit, Business Showcase, Design Showcase, E-commerce Showcase, Sanitaryware Showcase, Nuts Design Golden Showcase (all SiteNova sub-domains, all `useIframePreview: true`), plus Dr. Dipti Ganatra, Jupiter Fast Finance, and CorporateZone (real clients). |
| `supabaseClient.ts` | Dual client exports (see §2 Architecture). |
| `relatedPosts.ts` | `PostSummary` interface + `rankPosts(candidates, currentTags, limit)` — pure ranking function for the "Continue Reading" section. Scores candidates by tag overlap, then view count, then recency. No Supabase imports — fully testable. |
| `blog-review-export.ts` | Manual AI review prompt, current-post/complete-published-archive TXT serialization, and paginated archive helper. Used by the blog editor copy/download actions. |
| `seoRoutes.js` | **Legacy** — build-time SEO route injection. No longer used (replaced by RR7 `meta()` exports). Do not modify unless you know what you're doing. |
| `utils.ts` | `cn()` utility (clsx + tailwind-merge). |

---

## 9. Data & Backend (Supabase)

### Package price history — LOCAL migration awaiting approval (2026-10-14)
- `payment_package_prices` stores immutable Starter/Business starting-price/advance snapshots in paise. `payment_price_current` selects the one current version. Service-only invoker RPC `save_payment_package_prices` checks `site_admins`, strict JSON, amount bounds and a reviewed version before inserting history and updating the pointer atomically. No anonymous/authenticated browser read or write grants.
- `payment_intents.pricing_version` references the snapshot used by the order. Existing public orders are backfilled to the original fixed-price version; test orders keep a null version and must remain 100 paise with their admin marker. Inserts must use the current reviewed version or their retry parent's immutable price; updates cannot change package, amount or version. This schema is not deployed yet.

### Private project portal — DEPLOYED (2026-10-14)
- Owner approved backend-first deployment with payments off. Applied remote migration `20261014095800_private_project_portal`; deployed payment API v13, webhook v9, reconciler v7, then Worker `85243fb4-e2da-4648-914e-6fec2a0a738a`. Owner saved PROJECT_PORTAL_ENABLED=true / RAZORPAY_ENABLED=false; Cloudflare PAYMENT_EDGE_ENABLED=false. No Git push or charge.
- Locked-dependency suite 244/244, isolated actual SQL, build, scoped lint and credential scan pass; 61 unrelated type errors remain. Live owner admin creation/edit/search/recheck, private summary/refresh/progress, disabled checkout, link rotation/revocation and real existing ₹1 receipt/refresh/separate-tab opening pass with no console errors. Final acceptance project is on hold, link/balance disabled; ledger stays 16 orders (7 paid/9 pending), zero balance orders. Cron 10:30 UTC completed checked16/errors0. Real balance financial/recovery paths remain unverified; prior local-only notes below are historical. Evidence and exact owner clicks: `docs/private-project-deployment-20261014.md`.
- Bug hunt: 220 tests now pass, with fixes for dispute interception, late checkout authorization after revocation/release/price changes, duplicate/stale admin edits, stale private summaries/Pay controls, fragment changes, unmounted/old checkout callbacks and early dismissal during verification. Added invoker SQL authorization and database-clock/fair batch selection, bounded provider checks, explicit business errors and missing-settlement/incomplete-page detection. Isolated SQL verifies >50-row batch progress and all private access/state guards. Production build/lint pass; zero new portal errors and 62 unrelated type errors. Findings/remaining limits: `docs/private-project-audit.md`. Public flags unchanged; no deployment, push, browser use or charge.
- Owner chose a manually shared private project link instead of name/email lookup. Admin Payments → Client projects creates projects from verified advances, sets agreed total/customer update/progress, releases a balance, disables/rotates links and acknowledges verified balance payments. The signed fragment capability exposes only that project's summary, with no customer contact data. Anyone holding the link can read it; revocation is enforced against the stored random share UUID.
- `client_projects`, `project_balance_payments` and `project_payment_history` are staged in CLI-generated `20261013122054_private_project_portal.sql`. RLS/revoked browser grants and invoker-only service RPCs protect them. Balance pricing uses approved total minus recorded advance in paise; one active atomic reservation per project with a unique retained successor for a freshly provider-confirmed decline/expiry, fixed INR, total lock after reservation, provider identity/amount/capture/HMAC checks, monotonic paid/refunded state and shared webhook event-ID uniqueness. No browser price/status overrides or manual paid action.
- New flag `PROJECT_PORTAL_ENABLED` defaults off. Its additive Edge project handlers, authenticated admin actions, webhook branch and GET-only scheduled balance/refund recovery remain inactive until schema/functions are provisioned. It does not activate collection: both existing public switches are still required for balance checkout. Existing package/test checkout and settlement bodies are unchanged. Overview/Payments badge adds balance review/unacknowledged-paid flags when the portal is configured.
- Public `/project` has no public lookup/navigation link; noindex/no-store/no-referrer plus tracking/replay/promotion suppression. It shows saved progress, net verified payments, remaining amount and a gated Pay remaining balance action. No orders/payments/fulfilment are created on load or by scheduled checks. Attempted/uncertain/refunded/old balances block fresh checkout for review; no automatic replacement, reattachment, instalments or manual ledger override is offered.
- Latest local verification: all 238 tests pass (earlier suites retained), actual PostgreSQL migration/permission/reservation/deduplication/refund/acknowledgement checks pass, scoped lint and production website build pass. Type checking has zero new portal/payment errors and retains 62 unrelated errors. Auth/provider/UI behavior is mocked; new live portal/checkout/webhook/cron branches and browser visual layout are unverified. No browser, real order, charge, production migration, secret changes, push or deployment. Setup/limitations: `docs/private-project-portal.md`; review: `docs/private-project-portal.diff`.

### Admin payment list clarity — DEPLOYED (2026-10-12)
- Read-only audit confirmed the screenshot's 21:20 IST time was a cron status check, not a new payment. At audit time the ledger had 13 existing test checkouts: six paid and seven unpaid/unconfirmed. Repeated flagged log rows referred to the same orders; automated tests use mocks and do not insert live payments.
- Payments now shows confirmed paid/refunded entries first with order/payment IDs, separates checkout creation from last automatic/admin check time, labels recorded confirmation accurately, and renders each unpaid checkout once. Repeated flags remain in per-order status-check history rather than the main list. Scheduler health is expandable; timestamps use 24-hour IST. Sidebar/Overview counts explicitly mean review flags, which may overlap.
- Admin read projections add latest matching run source and paid-order IDs/creation date. No schema, scheduler, webhook, checkout, verification, settlement, data deletion or ledger corrections. Payment API v12 deployed before website Worker 43deeacf-1a99-4bc6-9dbf-8b2c7bc959f3 with --keep-vars. Public payments remain disabled.
- All 179 unit/component tests and six production-preview browser tests pass (Auth/provider/data mocked), plus scoped lint, production build, secret scan and whitespace checks. Zero payment type errors; 62 pre-existing unrelated diagnostics remain. Live bundle/public-disable/auth-denial/signature checks pass; database FK relationships verified. Real authenticated admin reads/clicks remain unverified: local service credential rejected with 401. No charges or secrets printed. Review/evidence: docs/payment-clarity.md and docs/payment-clarity.diff.
### Payment operations additions — DEPLOYED (2026-10-12)
- Receipt-button website deployed as Worker 59ed3dff-9a04-43d2-bee7-c92277f70cd0 after payment API v11 passed live access/disabled checks. Live website serves Get ₹1 test receipt / Open receipt, rejects missing/forged admin identity, and keeps public order/retry/checkout disabled. No schema, webhook, reconciliation or settlement changes in this addition. Owner can open a receipt from any previously confirmed ₹1 test row; no original checkout browser session is required. Real signed-in retrieval remains unverified by the agent; browser end-to-end retrieval/refresh uses mocks.
- Admin ₹1 receipt recovery (2026-10-12): Recent paid orders now offers Get ₹1 test receipt / Open receipt for recorded test payments. The fresh admin-authenticated order-receipt action accepts only a stored request UUID, reads a paid/refunded test ledger entry for exactly 100 paise, and signs the existing durable receipt identity. It does not require the original browser checkout token and cannot invoke reconciliation, order creation or settlement. Anonymous/forged/non-admin, pending/failed/unknown/other-package orders and browser status overrides are denied. Full suite 173/173 and five production-preview browser tests pass (provider/auth mocked); scoped lint, production build and security scan pass. Zero payment type errors; 62 unrelated application diagnostics remain. Backend payment API v11 deployed first; live anonymous/forged receipt requests are rejected and public checkout remains disabled. Signed-in live receipt round trip remains unverified. Diff: docs/payment-test-receipt.diff.
- Owner authorized backend-first deployment and Git push on 2026-10-12, keeping public payments disabled. Applied payment_operations, payment_investigations, payment_dispute_acknowledgements and payment_dispute_sync migrations; deployed razorpay-payments v10, razorpay-webhook v8, razorpay-reconcile v6, then website Worker 15808942-a8fc-4e09-ba97-c4bc877252ed with --keep-vars. Prior local-only entries below are historical preparation evidence, superseded by this deployment entry.
- Live validation found Razorpay's empty dispute list is {entity:collection,has_more:false} without items. A narrow GET-only parser compatibility fix and three regression tests were added; missing/malformed/nonterminal collections still fail visibly. All 168 tests pass (original 133 retained), and scoped lint passes. Post-fix live reconciliation run a9992639-e20b-49e5-a1ae-8df3ed0de3b2 completed at 11:50:18 UTC, checked=13/errors=0; all six previously paid orders remained paid. Initial failed run remains in audit history.
- Live RLS/grants checks confirm all four new tables have RLS and zero browser grants. New admin API anonymous denial, bad webhook signature denial, receipt secret configuration/invalid-token denial, new paid/investigation bundle, receipt-page tracking suppression, hidden pricing links and disabled public order/retry/checkout checks pass. Signed-in admin clicks, real signed receipt round trip, real refunds/disputes and orphan scan with actual unattached reservations remain unverified. No new payment/order/charge/capture/refund was created, and no secret value was read from Supabase or printed. Runtime public flags were preserved; public checkout is confirmed disabled. Deployment evidence: docs/payment-deployment-20261012.md.
- Publication review on 2026-10-12: 165 unit/integration tests (all original 133 retained), four isolated real-browser production-preview checks, seven isolated PostgreSQL scripts, scoped lint and client/SSR build pass. Browser testing found and fixed mobile investigation-button overflow by wrapping the new paid/investigation controls; checkout/verification/settlement remain unchanged. Added paginated recovery, provider mismatch, receipt failure/rate/input and sidecar-failure rollback tests. Client/review artifact scans find no private server identifiers in browser bundles or matching local credential values. Zero payment type diagnostics; 62 unrelated diagnostics and existing build/React preview warnings remain. Live new backend/query/account/secret behaviour is unverified. Owner reports saving PAYMENT_RECEIPT_SECRET in Supabase; no value was read or printed. Nothing pushed/deployed/charged. Details: docs/payment-publication-review.md; final changes: docs/payment-publication-check.diff.
- Four unapplied migrations add service-only sidecars for paid-order acknowledgement/receipt identity, record-only investigations, dispute acknowledgement by dispute ID, and minimal dispute snapshots. No existing settlement RPC or checkout/verification body changes. Public activation remains disabled; no push, deployment or charge was performed.
- Admin Payments adds recent paid/refunded orders with stored contact/project details and acknowledgement, investigation evidence, and persistent lost-dispute alerts. Overview and Payments badge include their counts. Fresh existing admin authentication protects every read/write; browser roles have no table grants.
- The scheduler adds GET-only recovery for paid/refunded orders confirmed within 30 days, orphan order evidence matched to unattached reservations older than 15 minutes, and paginated dispute reads. It retains existing monotonic reconciliation, 110-second budget and visible failure reporting. No creation, capture, refund, attachment or fulfilment action is added.
- Receipt success links use random UUID/HMAC fragment tokens and expose only package, amount and saved paid/refunded status. Dedicated Supabase PAYMENT_RECEIPT_SECRET (minimum 32 bytes) is required after approval; optional PAYMENT_RECEIPT_PREVIOUS_SECRET preserves one previous signing key. Neither is configured by this pass. Receipt pages suppress tracking/replay/promotions and are noindex/no-store/no-referrer.
- Validation: 160 tests pass (all 133 existing retained), isolated PostgreSQL migration/access/atomicity/monotonicity checks pass, scoped lint and production build pass; application typecheck has zero payment diagnostics and 62 unrelated diagnostics. Provider/auth reads and cross-device behaviour are mocked/simulated; all new live behaviour is unverified. Review: docs/payment-operations-review.md and docs/payment-operations.diff. After explicit approval, migrations/functions deploy before website.

### Untouched checkout reconciliation classification (2026-10-11)
- Fresh provider GETs distinguish a created order with zero payment attempts from uncertain attempted payments. The server-only internal `unattempted` result is persisted as `pending` by `record_payment_reconciliation`; it never grants fresh-order retry eligibility. Provider errors/ambiguous attempts still require reconciliation, and pending orders older than 24 hours remain flagged.
- Applied `20261011105638_payment_unattempted_reconciliation.sql`; deployed razorpay-payments v8 and razorpay-reconcile v3. Checkout authorization, callback verification, settlement RPC, webhook v6 and website Worker are unchanged. Public payments remain disabled.
- Scoped lint passes; application typecheck retains 62 unrelated diagnostics and no payment diagnostics. Live disabled-public-checkout and unauthorized-admin probes pass after deployment.
- Validation: 133 tests pass; isolated PostgreSQL verifies warning clearing, retained 24-hour flags, uncertain-error flags, retry denial, browser denial and monotonic paid/refunded states. Live 11:00 UTC cron completed checked=2/errors=0 and changed one eligible untouched order to pending; both paid orders remained paid and the earlier website-mismatch order retained needs_reconciliation. Four newer untouched orders await the 15-minute threshold or explicit admin recheck; their corrected live state is not yet verified. Review diff: docs/payment-unattempted-fix.diff.

### Local payment monitoring and dispute audit (2026-10-11)
- **Deployment update:** Owner subsequently authorized backend and website deployment. Applied payment_dispute_audit, deployed razorpay-payments v7 / razorpay-webhook v6, and deployed Worker 9854dd6c-b230-4150-a755-49f6164240e9 with --keep-vars. Monitoring/dispute code is now live; reconciler remains v2. Live probes confirm hidden pricing payment links, disabled direct package checkout/public APIs, served admin monitoring bundle, denied unauthenticated/forged requests and invalid dispute signature rejection. Database checks confirm event uniqueness, RLS/browser denial, active cron and the previously captured test still paid. No Git push, charge or signed synthetic event. Authenticated new UI clicks and real dispute delivery remain unverified; account subscriptions need the six documented dispute events. This supersedes the local-only preparation notes below.
- Scoped application typecheck finds zero payment diagnostics; 62 pre-existing diagnostics remain in unrelated files, unchanged. Read-only production checks confirm payment API v6, webhook v5, reconciler v2, active ten-minute cron, and scheduled completion at 2026-10-11 10:10:02.340 UTC with checked=1/errors=0. Production event table still has only id/event_id/order_id/processed_at, so new dispute metadata is not live.
- `PaymentCronHealth` shows the last successful scheduled completion and the next expected ten-minute wall-clock run in IST, using the server observation clock. Manual admin checks do not mask a dead cron. Missing summary data is explicitly unverified.
- Staged migration `20261011100002_payment_dispute_audit.sql` adds `event_type` and a minimal `dispute` JSON record to the existing, service-only `payment_webhook_events` table. `record_payment_dispute_event` deduplicates with its existing UNIQUE(event_id). It never calls settlement or updates payment_intents. Signed unknown dispute events/payment references are recorded; raw payloads, evidence and customer details are not stored.
- The existing authenticated admin queue operation accepts `summaryOnly:true` locally, reading scheduled run health, ledger-wide exact counts and open dispute history. No new HTTP API/service or email. Terminal dispute states won/lost/closed clear the open-dispute warning; provider event time prevents late delivery reopening it. Refund warnings reflect the durable ledger and remain while refunds are recorded.
- Dashboard alerts are visible on Overview and other tabs, with a Payments issue-count badge. Fresh Auth identity and is_site_admin membership gate payment queries; existing Edge authorization independently rechecks membership. Refresh runs every 60 seconds, on focus and explicit refresh. Logout/revocation clears state and stale in-flight results are discarded. Issue count counts conditions/items; an overdue order needing reconciliation contributes to both conditions.
- These monitoring/dispute changes are LOCAL ONLY; migration, updated payment/webhook functions and UI are not deployed or pushed. Existing production checkout, cron, settlement and public disabled flags remain unchanged. Deployment must apply the additive migration and update razorpay-webhook/razorpay-payments before the website UI uses the new summary.

**Project URL**: `https://bklmtwblsoitafynpikc.supabase.co`

### Database Tables

#### `audit_requests`
Stores leads from: Free Audit form, Exit Intent Popup, Contact form submissions, and the paid ad landing page (`/lp/web-design`).

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `name` | text | Lead's full name |
| `email` | text | Lead's email address |
| `mobile` | text | 10-digit Indian mobile number |
| `website_url` | text | Their website URL or "Exit popup lead — Industry: X" |
| `status` | text | `'pending'` or `'completed'` |
| `source` | text (nullable) | `'paid_ad'` for leads from `/lp/web-design`; `null` for all organic leads. Used to split the Admin Dashboard "Audit Requests" tab (organic) from the "Ad Leads" tab (paid). **You must add this column in Supabase:** `ALTER TABLE audit_requests ADD COLUMN source text;` |
| `created_at` | timestamptz | Auto-set |

#### `quote_requests`
Stores quote leads from both `/quote` and `/lp/web-design` through one server action. Managed via the **Quote Requests** tab in the admin dashboard.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key (`gen_random_uuid()`) |
| `name` | text | Lead's full name |
| `email` | text | Lead's email address |
| `mobile` | text (nullable) | Phone / WhatsApp number |
| `project_type` | text (nullable) | Selected project type (e.g., "Business Website") |
| `requirements` | text (nullable) | Project description |
| `budget` | text (nullable) | Selected budget range |
| `timeline` | text (nullable) | Selected timeline preference |
| `status` | text | `'new' \| 'contacted' \| 'converted' \| 'lost'`. Run `20261001_quote_status_default.sql` on older tables to replace the legacy `quote_pending` default and values. |
| `created_at` | timestamptz | Auto-set to `now()` UTC |

RLS: anonymous access revoked; server-only inserts through `accept_website_quote`. Existing authenticated policies retained, with owner allowlist policy added.
Additional columns: `phone` (legacy compatibility), `business_name`, `source`, `package_name`, `attribution` JSONB, `submission_id` UUID unique and `submission_hash`. Both phone fields are populated for new leads; legacy phone values are backfilled to mobile.
Index: `quote_requests_created_at_idx` DESC for fast admin load.

#### `blog_posts`
Managed via Admin Dashboard. Fetched by `BlogIndex.tsx` and `BlogPost.tsx`.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `title` | text | Post title |
| `slug` | text | URL slug (unique) |
| `excerpt` | text | Short summary shown in listing cards and used as meta description fallback |
| `content` | text | Full HTML content (sanitized server-side before rendering) |
| `tags` | text[] | Array of topic tags (e.g. `["SEO", "Google Ads"]`). Added 2026-09-04. Used by `RelatedPosts` for semantic matching. Set via comma-separated input in `AdminBlogEditor`. Default `'{}'`. |
| `published_at` | timestamptz | Publication date — distinct from `created_at`. Used in sitemap + OG meta |
| `created_at` | timestamptz | Auto-set on insert |

> **Confirmed from Supabase table screenshot (2026-08-14).** There is no `status` or `cover_image` column in the live table. The sitemap loader's `.eq("status", "published")` filter silently returns no rows if the column doesn't exist — this is handled gracefully via try/catch.

#### `blog_post_views`
Created 2026-09-04. Records one row per blog page load (server-side, fire-and-forget). Used by `RelatedPosts` to compute all-time view counts as a ranking tiebreaker.

| Column | Type | Notes |
|---|---|---|
| `id` | bigserial | Primary key |
| `slug` | text | Blog post slug being viewed |
| `viewed_at` | timestamptz | Auto-set to `now()` on insert |

- RLS enabled. Anon INSERT allowed (needed by the SSR loader). Authenticated SELECT allowed (for future admin analytics).
- Index: `idx_blog_post_views_slug` on `slug` for fast `GROUP BY` aggregation.
- Migration: `supabase/migrations/20260904_blog_tags_and_views.sql`


#### `ads_inquiries`
Created by user SQL (2026-09-01). Populated by `pages/AdsContact.tsx` form. Displayed in Admin Dashboard "Ad Inquiries" tab.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key (`gen_random_uuid()`) |
| `name` | text | Contact name |
| `phone` | text | Phone / WhatsApp number |
| `business_name` | text | Business name |
| `platform` | text | `'google_ads'` / `'meta_ads'` / `'both'` |
| `monthly_budget` | text | Selected budget range (e.g., `'₹10,000–₹15,000'`) |
| `industry` | text | Business industry / niche |
| `goals` | text | Comma-separated goals (e.g., `'Leads, Calls'`) |
| `created_at` | timestamptz | Auto-set |
| `status` | text | `'new'` / `'contacted'` / `'closed'` (default: `'new'`) |


### Booking and notification data (2026-09-29)

Migration and copy/paste SQL: `supabase/migrations/20260929_conversion_booking.sql`. Setup: `docs/booking-setup.md`.

Older production `quote_requests` tables can retain a `quote_pending` status default after the additive conversion migration. Apply `supabase/migrations/20261001_quote_status_default.sql` to set the default to `new` and relabel only existing `quote_pending` rows; other statuses are preserved.

- `site_admins`: explicit UUID allowlist seeded from the confirmed owner account. `is_site_admin()` governs new booking access.
- `booking_settings`: singleton, public URL/enabled state only, admin updates. Disabled by default; valid Google appointment schedule URL required.
- `call_bookings`: unique calendar/event identity, Google change version, attendee, start/end, scheduled/cancelled status, Meet/Calendar links and timestamps. Admin-only reads; server writes. Upcoming and email indexes.
- `calendar_sync_state`: last successful sync; admin-readable status. The Google incremental token is private in Script Properties.
- `calendar_sync_nonces`: server-only replay protection. Signed requests expire after five minutes; nonces retained ten minutes.
- `lead_notifications`: durable deduplicated payloads, attempts, delivery acknowledgement and error state. Admin reads metadata only; private payloads and processing are server-only.
- `accept_website_quote` atomically saves a quote and notification, with advisory locking and payload hashes for idempotent retries.
- `sync_call_bookings` handles event versions, rescheduling, late Meet links and cancellation tombstones. `ack_lead_notification` cannot revert a delivered notification.

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
- `/api/*` is Worker-first for server actions and booking settings.
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
- `submit_quote_form` — emitted once per accepted submission by `quote-client.ts`, after server storage; session and memory deduplication. The existing Google Ads quote action also fires here with `transaction_id=submissionId`. Neither confirmation page emits conversions.
- Direct contact-click calls to the shared Google Ads conversion action were removed. Existing account settings and base tags remain unchanged.
- `open_booking_calendar` records opening the external fallback; booking CTA clicks are separate from confirmed Calendar appointments. No personal contact details in event parameters.
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

### Razorpay (runtime only)

`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `RAZORPAY_ENABLED` and `PAYMENT_GATEWAY_SECRET` are Supabase Edge secrets; Supabase supplies its database runtime bindings. Ignored `supabase/functions/.env` is the local Edge secret file. The website Worker holds only payment `SUPABASE_URL`, matching `PAYMENT_GATEWAY_SECRET` and `PAYMENT_EDGE_ENABLED`; ignored `.dev.vars` is its local file. Both production public activation flags are true after explicit owner approval on 2026-10-14; local environment files are independent. Freshly authenticated admins can explicitly test ₹1 independently of those flags. Live checkout is restricted by the Edge backend to https://sitenova.dev; local checkout requires Test Mode keys. Existing signed recovery remains enabled without activating new purchases. Never use `VITE_` for payment credentials. Rate limits run through the server-only Supabase RPC, not a Cloudflare binding. See `docs/razorpay-setup.md`.

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
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
wrangler secret put CALENDAR_SYNC_SECRET
```
Local Worker secrets go in ignored `.dev.vars`; never use `VITE_` variables or public settings for service-role or integration secrets.

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
| `google-calendar/Code.gs` + `appsscript.json` | Five-minute Calendar sync and MailApp notifications with locking, pagination, invalid-token recovery and delivery ACKs. |
| `test-booking-db.mjs` | Isolated PostgreSQL migration, replay, idempotency and RLS verification with PGlite. |
| `seed-blog-posts.mjs` | Seeds 3 pre-written blog posts (Doctors, CA firms, Real Estate) to Supabase. Run once. Reads credentials from `.env`. |
| `optimize-images.js` | Image optimization utility for assets in `public/`. Run after adding new static images. |
| `fix-seo.cjs` | Legacy SEO fix script. Likely unused since migrating to RR7 `meta()`. Do not run without understanding what it does. |

---

## 15. Critical Rules & Conventions

### ⛔ Never Do These
1. **Never hardcode contact info** (phone, email, WhatsApp URL). Always import from `app/lib/constants.ts`.
2. **Never use the client-side `supabase` singleton in route loaders** (server-side). Use `createServerClient(context)` instead.
3. **Never use the legacy `<SEO>` component or `setPageSeo()` for new pages**. Use `buildMeta()` in route files.
4. **Only accepted quote submissions navigate to quote confirmation pages**. Track quote conversion in the shared successful submission handler, never on thank-you page mounts or contact clicks.
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
`e2e/home.spec.ts` covers the homepage. `e2e/conversion.spec.ts` covers booking enable/disable, embed/fallback, both mobile quote flows, errors/retry IDs, conversion deduplication, package prefill, floating controls, reduced-height mobile forms and verified-only SEO checker results. Google Calendar and quote responses are mocked; real account delivery requires the setup walkthrough.

Vitest covers validation, HMAC signing, endpoint failures, and the actual Apps Script with mocked Google services. `scripts/test-booking-db.mjs` executes the migration twice and tests PostgreSQL idempotency, changes/cancellations, replay protection and RLS in isolated PGlite; install `@electric-sql/pglite` with `npm install --no-save --package-lock=false @electric-sql/pglite` before running it.

---

## 16. Changelog

### [2026-10-15] Approved payment thank-you website release
- Owner authorized publishing after 350 tests/49 files, build, lint, same-baseline typecheck, credential checks, real local Worker header/no-tracking/SSR checks and mocked browser redirect/refresh/failure checks. Website deployed with preserved settings as Worker `10c28fd0-e456-4408-862b-ffbb5282fb27`. Existing Supabase backend unchanged; no secrets/flags or money moved. New live route has private headers and never renders unverified paid success; a real new charge remains unverified.
- Source release targets existing `ssr`; no generated runtime or isolated test fixture files included. Review: `docs/payment-thank-you-review.md`.

### [2026-10-15] Verified payment thank-you page (local preparation)
- Add a specialized advance/balance confirmation with next steps, reference, receipt access for advances and private-project return for balances. Redirect only from backend-confirmed payment, independently recheck on refresh, retain private-capability recovery, and show pending/refunded/error states without false success. Checkout authorization, verification and settlement logic are unchanged; admin tests stay in admin.
- 350 tests/49 files, production build and scoped lint pass; 61 existing type diagnostics remain, none added. Mocked browser redirect/refresh/failure checks pass. No live charge, backend mutation, deployment or Git push; public activation remains unchanged. New feature live behavior remains unverified until approved publication.

### [2026-10-14] Approved backend-first pricing and recovery release
- Applied versioned price schema and updated all three payment Edge Functions before the website. Preserved original amounts/secrets and restored the approved public activation after coordinated checks. Live admin price reads, landing/public forms/security boundaries and original-order recovery across complete tab closure pass. No charge or provider order creation; ledger counts unchanged. Active Worker `07a616b1-f31e-4073-82d7-ccf91b0991ba`, API/webhook/reconciler v18/v14/v12.
- 332 tests, nine isolated SQL scripts, build/dependencies/lint/scans/whitespace pass; 61 unrelated type errors remain. Financial exercises and live price-save remain explicitly unverified. Release report: `docs/release-20261014.md`; approved source push targets `ssr` without runtime/secret/fixture files.

### [2026-10-14] Closed-tab checkout recovery (local preparation)
- Persist the original private session/request UUID so an abruptly closed checkout can resume the same order. Add an admin-only provider-verified recovery link for previously lost sessions; never grant recovery using guessed contact details or change existing settlement rules. Consume shared links after saving to preserve confirmed successors after refresh. Distinguish booking conflicts from outages.
- No deployment, source push, financial transaction or activation changes. 332 automated tests, 16 mocked retrieved-source scenarios, actual browser closure/recovery checks, build/scoped lint and credential scans pass. 61 existing type diagnostics remain. Live behavior remains unverified; details and release dependencies are in `docs/checkout-recovery-review.md`.

### [2026-10-14] Admin pricing, landing payment cards and project intake (local preparation)
- Added separate Starter/Business starting-price and advance controls, append-only versions and stale-page safeguards, preserving existing order amounts. Added payment cards on homepage and paid ad landing page while retaining quote CTAs. New public payments require a project brief/timeline and optionally collect the existing website; admin paid-order records show those stored details.
- No deployment, Git push, secret/flag changes or real charge. Local browser checks use isolated mocks; real new price-save/package financial behavior remains unverified live. Production continues the previously approved fixed-price release until a separately approved backend-first rollout. Detailed checks and limitations are recorded in `docs/admin-package-pricing-review.md`.
- Validation: 300 tests across 44 files (all prior 250 included), nine isolated SQL scripts, client/SSR build, focused payment/pricing lint and available-credential scans pass. Type diagnostics remain the same 61 pre-existing errors with none added. Actual browser checks cover both page placements, package navigation, required details, mock independent-price saves and narrow-phone layout; no financial API or production save is performed by the ignored fixture. Live new-feature behavior remains unverified until approved deployment.

### [2026-10-14] Public package collection activated
- Explicit owner launch request fulfilled and verified live by 16:25 IST. Both production public flags enabled on reviewed code, no checkout/verification/settlement changes or source push. Backend v13/v9/v7; secret-only Worker `d796eb99-ff16-4bd2-b712-628789f2d2b5`. Editable pricing deferred outside active release files.
- All 250 tests, eight isolated SQL checks, build, scoped lint and secret scans pass. Live Starter/Business forms, tracking suppression and invalid input/auth/signature rejection pass with zero browser errors. Ledger unchanged: 7 paid/9 pending, zero balance orders. 61 unrelated type errors remain. No agent charge; real package/balance financial edge cases remain unverified. Report: `docs/public-payments-launch-20261014.md`.

### [2026-10-14] Approved private-project rollout and live acceptance
- Backend migration/functions deployed before website, public collection kept disabled and source not pushed. Hydration and receipt styling fixes included. Live owner acceptance covered stored project/progress/refresh, disabled balances, private-link replacement/revocation, existing ₹1 receipts, search/recheck and scheduler visibility without financial writes. Test project retained on hold with private access and balance approval off.
- 244 tests and actual isolated SQL checks, production build, scoped lint and secret scans pass. 61 unrelated type diagnostics remain. Current release details, limits, advisor findings and click-by-click owner instructions: `docs/private-project-deployment-20261014.md`. New editable pricing remains a separate local preparation.

### [2026-10-13] Document hydration repair (local only)
- React/React DOM and their TypeScript definitions are pinned to 19.3.0 for native full-document hydration compatibility with browser-extension elements. next-themes 0.4.6 and vaul 1.1.2 provide compatible existing theme/drawer components; the installed dependency tree has no peer errors. Checkout, verification and settlement bodies are unchanged.
- Client hydration runs in startTransition so React Router can decode streamed state. Server responses use React's stream directly (exactly one doctype). No DOM observer, extension-node relocation, forced synchronous hydration or new error suppression remains.
- Wrangler keep_names=false prevents its server-only __name helper from entering the next-themes serialized browser startup script. QuoteForm initializes its existing submission ref explicitly for React 19 types; form behavior is unchanged.
- All 244 tests across 39 files pass, including five real React-renderer document regressions (normal shell, one doctype, injected extension identity/listener preservation, delayed Router startup, and genuine mismatch reporting). Scoped lint passes. Typecheck has 61 existing errors, zero added versus the earlier 62-error baseline. Production build passes; final Chrome and in-app /project and /quote checks have zero errors/warnings and working initialization/form steps. In-app disabled payments and anonymous admin redirect pass too. Actual Worker HTML has one doctype and no server-only theme helper. Evidence: docs/private-project-audit.md and test-results/local-browser/hydration-fixed.jpg. Live new-flow verification remains outstanding.
- Local only: no deployment, Git push, production SQL or charges; public collection switches remain disabled.

### [2026-10-13] — Project selection contrast and reload feedback (local only)
- Scoped opaque blue/white selection colours to the private-project page, including light cards and dark warning text. Browser computed styles confirm white text on rgb(29,78,216).
- Reload retains the error while checking, disables the button with Reloading…, and shows an explicit failure or success outcome. It remains a read-only request and never creates a payment. Added an ignored recover-on-reload fixture alongside persistent network failure.
- All 239 tests, production build and scoped lint pass; browser confirmed persistent failure feedback and successful recovery with a clean fixture console. No push, deployment or charge; public payment switches remain disabled. SSR hydration investigation was outstanding at this stage; superseded by the document hydration repair above.

### [2026-10-13] — Owner-authorized local browser checks
- Started isolated loopback SSR preview and an ignored synthetic component harness without live payment secrets or backend writes. Browser exercised private-link warning, disabled Starter checkout, anonymous admin redirect, customer error/review/paid/fake-retry states, admin search/paging/older advances/acknowledgement/link/history, and 320px/390px layout geometry. Fixture console is clean.
- Fixed invalid UTF-8 separators in ClientProjects and completed order-reference rendering in history; browser and the existing history regression confirm the correction. All 238 tests and scoped lint pass.
- Earlier SSR preview reported hydration errors #418/#423; the document hydration repair above supersedes this local finding. Production impact remains unverified until approved deployment. This earlier result was not clean; final local browser results are recorded in the repair entry above. New live backend/provider checks remain unverified; no push, deployment or charge. Report: `docs/private-project-audit.md`; ignored screenshots in `test-results/local-browser/`.

### [2026-10-13] — Second private-project production-readiness audit (local only)
- Final SQL authorization now requires the exact balance reservation ID; payment-specific acknowledgement cannot silently acknowledge newly captured attempts. Earlier captured orders are individually reviewable. History includes balance/order references.
- Added a separate review_required flag so provider errors on paid/refunded balances remain visible without downgrading settlement. Healthy verified recovery clears the flag. Known order-only balance webhooks use the GET-verified sidecar; contradictory refund data fails closed. Retry exhaustion is flagged, and malformed provider responses return masked service/uncertainty errors.
- Project snapshots reuse one attempt list, admin reads avoid duplicate queries, full project/attempt/history indexes cover the new access paths, and unused service-role DELETE grants are revoked.
- All 238 tests across 38 files, isolated actual SQL checks, production build, scoped lint and secret scan pass. Zero new payment/project type errors; 62 unrelated existing diagnostics remain. Live new functionality and visual browser acceptance remain unverified. Existing advance/test bodies and public flags are unchanged; no push, deployment, production SQL or charge. Evidence: `docs/private-project-audit.md`.

### [2026-10-13] — Private project launch preparation (local only)
- Added fresh Razorpay GET-confirmed balance retries for known hard declines or explicit expiry; unknown/timeout/authorized/late-captured predecessors block replacement. One active reservation and one unique successor per prior attempt retain all orders; ten-order cap bounds ancestry checks. SQL authorization fences late predecessor capture; webhook/GET recovery keeps old attempts traceable and paid never regresses.
- Added admin title search and 25-project pagination, older advance loading, attempt details, stale-response protection and wrapping money rows for narrow screens. Existing advance/test checkout/verification/settlement bodies and runtime public flags are unchanged.
- All 230 regression tests and actual isolated PostgreSQL guards/retry/deduplication checks pass. Auth/provider/UI networking is mocked; live new balance behavior and browser visuals remain unverified. Publication checks are recorded in `docs/private-project-audit.md`; rollout/owner acceptance in `docs/private-project-launch.md`. No push, deployment, remote schema/flag change or charge.

### [2026-10-13] — Private project portal bug hunt (local only)
- Fixed confirmed dispute routing, checkout revocation/approval race, duplicate project overwrite, stale admin edit, polling/privacy, hash-change and callback lifecycle bugs. Added database-clock oldest-check recovery, final checkout authorization, safe error mapping and provider contradiction/page/time-budget guards.
- All 220 tests, actual isolated project SQL checks, production website build and scoped lint pass. New code has zero type errors; 62 unrelated diagnostics remain. Existing verified checkout/settlement bodies and runtime public flags remain unchanged. New live behavior/browser visuals are unverified; That audit originally identified balance retry and admin visibility caps; the subsequent launch preparation below addresses these locally. Uncertain/orphan recovery and live acceptance remain explicit limits. See `docs/private-project-audit.md`. Nothing pushed or deployed; no real payments.

### [2026-10-13] — Private project status and remaining balance (local only)
- Added owner-shared project capabilities, admin progress/price/link controls and separate server-priced balance checkout with verified capture, webhook/cron recovery and balance review/acknowledgement alerts. Kept public collection disabled, existing advance checkout/settlement unchanged, and all new schema/functions unapplied remotely.
- All 209 tests, isolated project PostgreSQL checks, scoped lint and local production build pass; 62 unrelated type diagnostics remain. Provider/auth interactions are mocked; live new functionality and browser visuals are unverified. No charges, secret changes, source push or deployment. Backend must be deployed before website after owner approval. See section 9 and `docs/private-project-portal.md`.

### [2026-10-13] — Receipt presentation redesign (local only)
- Replaced the plain summary with branded navy/white receipt styling, a prominent original amount, service/status details, accessible loading/error states and Print / save PDF. Refund copy avoids claiming a full refund when the minimal reader does not expose refunded amounts. The signed-token reader and all payment backend flows remain unchanged.
- Validation: all 182 tests pass, scoped lint and production client/SSR build pass. Typecheck retains 62 unrelated diagnostics and none in Receipt files. Added regression checks for test receipt privacy/printing, refund wording and missing-link denial. Browser layout/actual PDF rendering remain unverified; no browser was used. Diff: docs/receipt-redesign.diff.
- Owner reports bank settlement, durable receipts and admin records working live; declines additional package Test Mode and live refund exercises. Public payments remain disabled; no push, deployment, order, charge or refund.

### [2026-10-12] — Admin payment operations deployed
- Owner approved backend-first deployment and source push while retaining disabled public checkout. Four operations/investigation/dispute migrations applied; payment API v10, webhook v8 and reconciler v6 deployed before website Worker 15808942-a8fc-4e09-ba97-c4bc877252ed. Live empty-dispute API compatibility fix passed three new regressions; full suite 168/168, original 133 retained. Live run checked 13 orders with zero errors; six paid orders remained paid. Public disabled/read-only/auth smoke checks pass; signed-in admin clicks and real receipt/refund/dispute round trips remain unverified. No charges or secret exposure. Details: docs/payment-deployment-20261012.md.

### [2026-10-12] — Payment publication checks
- Expanded to 165 passing tests plus four real-browser checks and seven PostgreSQL scripts. Fixed narrow-screen overflow in the new investigation/paid pagination controls; added provider pagination/mismatch/redirect, receipt storage/rate/input and metadata-failure rollback checks. Production build, scoped lint and bundle/credential scans pass. Existing 62 unrelated type diagnostics remain; all new live backend behaviour is unverified. Owner reports saving the independent receipt secret. No push/deployment/charges; public payments remain disabled. Backend must deploy and pass live read-only checks before website after approval. See docs/payment-publication-review.md.

### Payment operations review (2026-10-11)
- Prepared local-only paid-order acknowledgement, investigations, persistent lost-dispute acknowledgement, GET-only refund/dispute recovery and minimal durable signed receipts. See section 9 and docs/payment-operations-review.md for evidence and limits. Nothing pushed or deployed; public payments remain disabled. Final suite: 160 passing tests, including all 133 baseline tests.

### [2026-10-11] — Correct warnings for untouched checkouts
- Diagnosed six unpaid review-queue entries: five had no Razorpay payment attempts; the earlier GPay order had a failed risk-check attempt. Both captured website orders were already paid and correctly excluded from the review queue.
- Added provider-confirmed untouched classification and an audited pending-state write, preserving uncertainty warnings, paid-state protection, existing retry and checkout rules, 24-hour alerts and server-only permissions. Applied migration and deployed payment API v8/reconciler v3 after all 133 tests and isolated database tests passed; live cron confirms classification correction on the eligible untouched order. No Git push, website deployment, order creation, charge, capture or refund.

### [2026-10-11] — Deploy admin monitoring with public checkout disabled
- Owner approved deployment of the previously validated 129-test build. Applied the additive dispute audit migration; updated existing payment API to v7 and webhook to v6, retaining custom gateway/admin authentication and raw-body signatures. Existing settlement, checkout, public activation flags and ten-minute reconciliation remain unchanged.
- Deployed website Worker 9854dd6c-b230-4150-a755-49f6164240e9 preserving existing runtime settings. Read-only live probes confirm HTTP 200 for admin/pricing/booking configuration, new admin monitoring code served, no public payment links, disabled package checkout/public APIs, unauthenticated summary rejection and bad dispute signature denial. Live SQL confirms service-only dispute access, event-ID uniqueness and retained paid state. No Git push, charge, capture, refund or synthetic signed event.
- Updated docs/payment-alerts-verification.md with actual deployed state. Full authenticated production UI and actual dispute delivery remain unverified. New live smoke check: scripts/check-payment-monitoring-live.mjs.

### [2026-10-11] — Local admin payment alerts and record-only disputes
- Completed in order: dashboard alerts/dispute audit (124 tests passing before the next step), cron health visibility (five targeted UI tests passing), scoped typecheck cleanup (no payment errors; 62 unrelated diagnostics left untouched), final regression checks (129 tests passing, including clearing of historical failure warnings). Scoped lint, production build and isolated dispute PostgreSQL checks pass. Existing 100 tests remain intact and passing.
- Added a main-dashboard alert/banner and Payments count badge, automatic membership-gated refresh, open dispute/deadline visibility and scheduled-run health. Added only a signed record-only dispute branch and service-only event metadata migration; existing checkout and settlement path are unchanged. Duplicate dispute events use the same unique event-ID table; unknown events/payment references return 200 after durable storage. Bad signatures are denied before storage.
- All new changes remain local, with no push/deployment or payment. Current live payment functions/cron and disabled public checkout were checked read-only. Authenticated new production UI and actual dispute delivery are unverified. Setup, deployment distinctions and click-by-click verification: docs/payment-alerts-verification.md; review diffs: docs/payment-alerts-step-1.diff and docs/payment-alerts-step-2.diff.

### [2026-10-10] — Prepare Razorpay package advance checkout

- Added direct package checkout for owner-approved Starter ₹5,000 and Business ₹7,500 advances. Preserved quotes and disabled payment CTAs until runtime configuration is complete.
- Added server-controlled pricing, signed order sessions, callback signature checks, provider capture/refund reconciliation, refresh recovery and Cloudflare request limits. Adds staged server-only Supabase ledger/migration and signed webhook settlement without automatic fulfilment.
- Added digital-delivery policy and payment/privacy/refund details, shared contact constants, footer/sitemap links and advance information in `public/llms.txt`. Suppressed tracking/replay and promotional controls on checkout.
- Validation: production client/SSR build, all 36 regression/server tests, all 4 checkout UI tests and scoped ESLint passed. Styled production-preview browser checks passed at 1440px, 390px and 320px, including both package amounts, no overflow, disabled checkout/API behavior, no tracking scripts and delivery-policy/footer links. Desktop/mobile screenshots inspected. The application TypeScript check retains 62 existing diagnostics, with none in the new payment files. No real payment or deployment performed.

### [2026-10-10] — Restore original paid landing page

- At the user's request, restored `app/pages/lp/WebDesignLP.tsx` exactly to its pre-illustration Git baseline, including original spacing, typography, process layout and form placement.
- Removed the three added illustration assets, their prompt README and the page-specific compact stylesheet. Earlier entries below describe superseded designs; the original landing page is now current.
- Verified no diff remains in the landing-page source against the original baseline. No production deployment performed.

### [2026-10-10] — Shorter paid landing page layout

- Moved the three illustrations into existing hero pricing/process/audit heading rows, reduced section padding and heading gaps, and restored a three-column desktop process. All copy, client proof and submission handlers are retained.
- Added `app/pages/lp/web-design-lp.css` scoped to `.web-design-lp` to tighten shared portfolio/review padding and reduce portfolio thumbnail height without affecting the homepage.
- Local fully styled measurements with booking disabled: 1440px page height decreased from 6,160px to 4,422px (28%); 390px decreased from 9,513px to 7,440px (22%). No deployment.
- Validation: production client/SSR build, scoped ESLint and existing mocked LP quote qualification/retry test passed. Browser checks confirmed all three images load and no overflow at 1440px, 390px and 320px; desktop and mobile previews inspected.

### [2026-10-10] — Theme-matched ads landing page illustrations

- Added three generated transparent blue/teal/navy illustrations to `/lp/web-design`: responsive website in the hero, project planning beside the process, and website inspection beside the free audit form. Artwork uses understated glass/outline styling to blend with the existing theme; rejected bright clay-style variants are not included.
- Final optimized WebP assets and generation prompts are in `app/assets/lp/`. Images reserve dimensions, and below-fold images lazy-load. Mobile quote/audit forms appear before their accompanying artwork.
- Retained existing copy, pricing, quote/audit submission handlers and conversion tracking. No production deployment performed.
- Validation: production client/SSR build and scoped ESLint passed. Inspected desktop hero/process/audit previews; browser checks verified all three images load, no horizontal overflow at 1440px/390px/320px, and the quote form precedes its artwork on mobile. Existing mocked landing-page quote validation/retry/conversion test passed.

### [2026-10-07] — Three-client showcase and Corporatezone Google rating

- Added `app/lib/client-reviews.ts` as the shared review source for the homepage/reusable review section and all three existing case-study pages. Preserved Dr. Dipti Ganatra and Jupiter Fast Finance's existing review wording.
- Added Corporatezone's owner-confirmed five-star Google rating with no invented quotation, review date, individual reviewer identity or direct review URL. The UI explicitly identifies it as a rating without written text.
- Review cards use a responsive three-column desktop grid and links to existing case studies. Corrected Corporatezone's portfolio description to wholesale stationery/business essentials in Lower Parel, Mumbai.
- Retained all three `/portfolio/*` routes; no duplicate pages, database changes or deployment.
- Validation: production client/SSR build and scoped ESLint passed; local browser DOM confirmed all three review cards, case-study links and rating-only copy. The normal build output folder was locked, so Vite output cleanup was temporarily disabled for verification and the original configuration restored. The development preview had an existing stylesheet loading issue; responsive visual verification remains outstanding.


### [2026-10-07] — Homepage resources section

- Added `ResourcesSection.tsx` after homepage features, introducing `ai-insights.sitenova.dev` and `tools.sitenova.dev` with descriptive cards, three published AI articles and QR code/PDF tool examples linked to their verified public routes.
- Uses existing theme tokens, responsive columns, semantic headings and visible keyboard focus. Statically imported so content and links appear in server-rendered HTML.
- Agency hero and existing conversion flows remain intact. No AdSense settings, subdomain content or production deployment changed.
- Validation: production build and ESLint for changed source files passed. Local Edge preview confirmed HTTP 200, resources in server-rendered HTML, all eight links, and no section overflow at 390px or 320px; desktop and mobile screenshots inspected.

### [2026-10-05] — HTML blog editing and manual AI review exports

- Added immediate formatting for typed supported HTML tags and safe raw/rich HTML paste handling in the blog editor. Code examples remain literal; formatting integrates with editor undo and existing HTML storage.
- Added a predefined fact-checking/improvement prompt copied with the current unsaved post details, and a TXT download with the same prompt/current post plus all published posts fetched in batches. Copy failures provide selectable text; failed database batches cannot produce a partial download.
- Validation: production build, all 24 Vitest tests (8 new editor/export checks), lint for changed source/test files, and a mocked Edge browser test passed. Browser coverage verifies typing/pasting, copying unsaved changes, TXT archive contents and mobile overflow against a fresh local production preview. The existing development server had a stale React cache; no production data was changed. The repository-wide TypeScript check still reports existing errors, with no diagnostics in changed files.
- No deployment or database migration was performed.

### [2026-10-04] — Content studio and topic planning redesign

- Redesigned AI Drafts and Topic Queue to match the admin workspace, with interactive stage counts, readable cards, recoverable search/empty states and responsive layouts.
- Draft cards show article excerpts and contribution progress; topic cards show priority, keywords and clear actions. In-progress topics and previously hidden older used topics are now accessible. New topics immediately re-sort into their correct queue position.
- Retained manual publishing and existing data workflows; topic deletion uses the existing confirmation dialog. Browser checks use mocked data only, including topic creation.
- Validation: production build and all 16 existing regression tests passed. All 5 admin browser checks pass in Edge, covering draft contribution details/status filtering, search recovery, no redundant Publish action on published cards, every topic stage, priority ordering, deletion cancellation, mocked creation and narrow-screen overflow. No new diagnostics appear in the changed components; the 63 existing application TypeScript errors remain.

### [2026-10-04] — Admin workspace design overhaul

- Rebuilt sidebar/header, redesigned login, and replaced the crowded overview with an actionable daily summary, larger metrics, inquiry charts, recent inquiries and content shortcuts.
- Added scoped admin theme tokens and consistent card/table/form styling across existing tabs; matched the editor and improved its mobile action wrapping. Retained authentication, Supabase queries and mutations, booking synchronization, manual publishing and existing bulk workflows.
- Validation: production build passed; all 16 existing Vitest tests and all 3 new admin browser checks passed in installed Edge. Desktop dark/light and mobile screenshots were inspected. The application TypeScript check still reports existing repository errors, with none in files changed by this overhaul. Local preview is available at `/admin`; no production deployment or database changes were made for the design work.

> **AI agents: append an entry here every time you make a significant change.**
> Format: `## [Date] — [Brief summary]` followed by bullet points of what changed and why.

---

### [2026-10-01] — Align legacy quote status with admin workflow

- Added `20261001_quote_status_default.sql` to change the retained production `quote_pending` default to `new` and relabel pending rows, preserving contacted, converted and lost records.
- Extended the isolated database test to start from the legacy default and verify the follow-up migration is repeatable and new quotes receive `new`.

---

### [2026-09-29] — Conversion journey and Google Meet booking

- Added business-focused pricing and quote CTAs, real client imagery/proof before demos, optional detailed requirements, explicit budget selection, and package prefill. Removed conflicting refund promises, unsupported numerical outcomes/statistics across sales pages and unsourced audit testimonials. SEO checker now displays only returned Google scores; unavailable checks show an error instead of invented fallback results. Consolidated mobile controls and suppressed promotional interruptions on conversion pages.
- Added `/book-a-call`, conditional booking links, admin booking settings, Scheduled Calls and Overview count.
- Added shared server quote submission, durable notification queue, signed/replay-protected integration, additive SQL migration and Calendar Apps Script with pagination, incremental tokens, locking and retries.
- Added setup guide, automated browser/unit/database checks, fixed Playwright server port and Vitest configuration, ignored local runtime output and Worker secrets. Live Google/Supabase setup remains required before rollout.

### [2026-09-08] — Added Sanitaryware and Nuts Design Golden showcase sites

- **Added** `sanitaryware-showcase` entry to `showcaseProjects` in `app/lib/portfolio-meta.ts` — links to `https://sanitaryware-showcase.sitenova.dev/`, `useIframePreview: true`, fallback image reuses `ecommerce-showcase.webp`.
- **Added** `nuts-design-golden-showcase` entry to `showcaseProjects` in `app/lib/portfolio-meta.ts` — links to `https://nuts-design-golden-showcase.sitenova.dev/`, `useIframePreview: true`, fallback image reuses `design-showcase.webp`.
- **Updated** `app/components/PortfolioSection.tsx` — added both new slugs to the `imageBySlug` fallback map.

---

### [2026-09-06] — Blog pages redesign (UX overhaul)

- **Modified** `app/pages/blog/BlogIndex.tsx` — Complete rewrite. Most recent post is now rendered as a full-width featured hero card (`FeaturedCard`) with a "Latest post" badge, full excerpt, primary CTA button, and gradient accent glow. Remaining posts use an improved `PostCard` with reading-time badge, `Clock` icon meta, and `interactive-card` hover lift. Header now shows live article count pill. Skeleton loaders match the actual layout. Empty state has an icon, message, and CTA instead of a plain text line. Added `readingTime()` and `formatDate()` helpers extracted as module-level functions.
- **Modified** `app/pages/blog/BlogPost.tsx` — Complete rewrite. Added `ReadingProgress` component: a fixed 3px top bar driven by `scroll` event, showing read progress from 0–100% in the primary-to-accent gradient. Added `TableOfContents` component: parses `<h2>`/`<h3>` tags from the post HTML client-side, injects IDs into the rendered headings, tracks the active heading with `IntersectionObserver`, and renders a sticky sidebar on desktop (`lg:` only) with smooth-scroll on click. Hides automatically when the post has fewer than 2 headings. Article header now has a bottom border (`border-b border-border/40`) visually separating it from the content, plus word count shown alongside read time. Author bio now has a larger avatar with `ring-2 ring-primary/20`, gradient background tint (`bg-gradient-to-r from-primary/5`), and an `ExternalLink` icon next to the name.
- **Modified** `app/components/BlogCTA.tsx` — Removed `"Free for Mumbai businesses"` uppercase eyebrow from the `mid` variant. Heading now stands alone.
- **Modified** `app/components/RelatedPosts.tsx` — Related article cards now show a 2-line excerpt preview and a reading-time badge with `Clock` icon. Cards use `interactive-card` hover lift + primary glow shadow instead of plain `hover:shadow-md`. View count badge moved to the bottom-right of the card.

---

### [2026-09-04] — Smart blog post suggestions (tags + view count hybrid ranking)

- **New** `supabase/migrations/20260904_blog_tags_and_views.sql` — adds `tags text[]` column to `blog_posts` and creates `blog_post_views` table (bigserial id, slug, viewed_at). RLS: anon INSERT + authenticated SELECT.
- **New** `app/lib/relatedPosts.ts` — pure `rankPosts(candidates, currentTags, limit)` utility. Scores candidates by tag overlap (primary), view count (tiebreaker 1), recency (tiebreaker 2). No Supabase dependency — fully testable.
- **Modified** `app/routes/blog.$slug.tsx` — added fire-and-forget `blog_post_views` insert after each page load. Not awaited; does not affect response latency.
- **Modified** `app/components/RelatedPosts.tsx` — now accepts `currentTags: string[]` prop. Runs two parallel Supabase queries (all posts with tags + all view counts), merges them, calls `rankPosts()`. Fallback: if no tag matches, ranks purely by view count then recency. Shows view count badge (e.g. "1,234 views") only when a post has ≥ 100 views, using `TrendingUp` Lucide icon.
- **Modified** `app/pages/blog/BlogPost.tsx` — passes `post.tags ?? []` as `currentTags` prop to `RelatedPosts`.
- **Modified** `app/pages/admin/AdminBlogEditor.tsx` — added `tags` state (comma-separated string), "Tags (comma-separated)" `Input` field between Excerpt and Content. On load: joins `string[]` to display string. On save: splits/trims/filters to `string[]` stored in the `tags` column.
- **Modified** `AGENTS.md` — updated §8 (added `relatedPosts.ts`), §9 (`blog_posts` tags column + new `blog_post_views` table).

---

### [2026-09-02] — SEO click-maximization fixes (GSC-data-driven)

- **Modified** `app/routes/_index.tsx` — Fixed keyword cannibalization between Homepage and `/location/mulund`. Homepage title/description now targets Mumbai-wide searches (`"Website Designer in Mumbai"`). Mulund-specific hyper-local keywords moved exclusively to `app/routes/location.mulund.tsx`.
- **Modified** `app/pages/WebsiteCostCalculator.tsx` — Added `WebApplication` JSON-LD schema to the existing `<JsonLd>` array. Improves rich-result eligibility for the cost calculator page.
- **Verified** `workers/app.ts` — Trailing-slash 301 redirect already implemented. No change needed.
- **Verified** all 14 location pages — Each passes unique, accurate `geoCoordinates` props. No coordinates bug in practice.
- **Verified** `app/root.tsx` hreflang — Correctly points to homepage canonical. No change made.

---

### [2026-09-01] — Ads pages made visually & structurally distinct; new /ads-contact page & admin tab


- **Rebuilt** `app/pages/services/GoogleAds.tsx` — completely distinct orange/amber theme (no blue primary). Removed `PortfolioSection`. Added 4-step ads Process section (Audit → Strategy → Launch → Optimise & Report). Replaced `CtaSection` with dedicated "Book a Free Strategy Call" CTA linking to `/ads-contact`. All orange accent via inline Tailwind only — no global CSS token changes.
- **Rebuilt** `app/pages/services/MetaAds.tsx` — same treatment as GoogleAds. Orange/amber theme throughout. Audience Reach Estimator retained. No PortfolioSection. CTA → `/ads-contact`.
- **New** `app/pages/AdsContact.tsx` — standalone ads inquiry form page at `/ads-contact`. 7 fields: name, phone, business name, platform (Google/Meta/Both), monthly ad budget, industry, campaign goals (multi-select). Saves to Supabase `ads_inquiries` table + Web3Forms email notification. Orange/amber theme. Inline success state — no separate thank-you redirect.
- **New** `app/routes/ads-contact.tsx` — RR7 route file with `buildMeta()` SEO export.
- **Rebuilt** `app/components/Navbar.tsx` — Google Ads and Meta Ads moved OUT of `coreServiceLinks` (Services dropdown). New `marketingLinks` array and **Marketing** top-level dropdown added alongside Services. Marketing dropdown: orange/amber accent, Google Ads, Meta Ads, "Book a Free Strategy Call" shortcut. `marketingRef` and `marketingOpen` state added for independent open/close control.
- **Modified** `app/components/Footer.tsx` — Grid changed from `lg:grid-cols-5` to `lg:grid-cols-6`. Google Ads + Meta Ads removed from "Our Services" column. New **Marketing** column added (Google Ads, Meta Ads, Book a Strategy Call — all link to `/ads-contact`).
- **Modified** `app/pages/admin/AdminDashboard.tsx` — Added `AdsInquiry` type. Added `adsInquiries` state and fetch from `ads_inquiries` table in `fetchData()`. Added "Ad Inquiries" `navItems` entry with `Target` icon + badge. Added full `ads_inquiries` tab content panel (table with all 10 columns + inline status dropdown: new → contacted → closed). Updated `activeTab` union type.
- **Modified** `app/routes/sitemap[.]xml.tsx` — Added `/ads-contact` to `staticPaths` and `lastModified` map.
- **Modified** `AGENTS.md` — Updated §4 Routing, §5 Pages Catalog (GoogleAds, MetaAds descriptions + AdsContact row), §6 Components Catalog (Navbar + Footer descriptions), §9 Supabase (added `ads_inquiries` table schema).

---

### [2026-08-31] — Added Google Ads & Meta Ads service pages

- **New** `app/pages/services/GoogleAds.tsx` — Google Ads management service page at `/services/google-ads`. Sections: hero (management from ₹5,000/mo + ₹10,000–₹15,000/mo ad spend callout), interactive Results Estimator (campaign goal × industry × ad spend → estimated clicks/leads/CPL), 8-item full-service breakdown, 6-item pain points grid, 6-item FAQ, JSON-LD (Service + FAQPage + BreadcrumbList). Reuses `PortfolioSection`, `TestimonialsSection`, `CtaSection`.
- **New** `app/pages/services/MetaAds.tsx` — Meta Ads management service page at `/services/meta-ads`. Same structure as above but with an Audience Reach Estimator (age group × interest × ad spend → Mumbai audience size/reach/leads). JSON-LD (Service + FAQPage + BreadcrumbList).
- **New** `app/routes/services.google-ads.tsx` — Route file with `buildMeta()` export for `/services/google-ads`.
- **New** `app/routes/services.meta-ads.tsx` — Route file with `buildMeta()` export for `/services/meta-ads`.
- **Modified** `app/components/Navbar.tsx` — Added `Target` and `Megaphone` icon imports. Added Google Ads and Meta Ads to `coreServiceLinks` array (auto-renders in both desktop dropdown and mobile menu).
- **Modified** `app/components/Footer.tsx` — Added Google Ads Management and Meta Ads Management links to "Our Services" footer column.
- **Modified** `app/routes/sitemap[.]xml.tsx` — Added `/services/google-ads` and `/services/meta-ads` to `staticPaths` and `lastModified` map.
- **Modified** `AGENTS.md` — Updated §1 Services Offered, §4 Routing System, §5 Pages Catalog.

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

---

### [2026-08-21] — E-Commerce pricing increase (~15–20%)

- **Updated** `app/pages/services/Ecommerce.tsx` — increased all estimator prices by ~17.5%:
  - Base WooCommerce/WordPress: ₹15,000 → ₹18,000
  - Shopify add-on: ₹10,000 → ₹12,000; Custom React add-on: ₹20,000 → ₹24,000
  - Medium catalog: ₹8,000 → ₹9,500; Large catalog: ₹15,000 → ₹18,000
  - Stripe gateway: ₹3,000 → ₹3,500; Razorpay: ₹2,000 → ₹2,500; CoD: ₹1,000 → ₹1,200
  - Coupons: ₹1,500 → ₹1,800; Inventory: ₹3,000 → ₹3,500; Accounts: ₹2,500 → ₹3,000; Multi-currency: ₹3,000 → ₹3,500
  - Updated SEO title/description from ₹15,000 → ₹18,000
  - Updated budget bracket logic: ₹30,000 → ₹35,000 threshold
- **Updated** `app/routes/services.ecommerce.tsx` — route-level meta title/description updated to ₹18,000.
- **Updated** `app/pages/WebsiteCostCalculator.tsx` — E-Commerce Store base: ₹35,000 → ₹41,000; FAQ text updated.
- **Updated** `app/pages/Pricing.tsx` — meta description updated to mention ₹18,000 for e-commerce.
- **Updated** `AGENTS.md` §1 Services Offered — E-Commerce Stores now shows `from ₹18,000`.

---

### [2026-08-23] — Paid Ad Landing Page + Admin Ad Leads Tab

- **Created** `app/pages/lp/WebDesignLP.tsx` — high-converting landing page for Google + Meta ads. Offer: Free Website Audit ("Is Your Website Costing You Customers?"). No Navbar/Footer. Sections: hero+form, social proof strip, 3 pain-point cards, how it works (3 steps), 2 testimonials, FAQ (4 questions), final CTA form, sticky mobile CTA bar. Fires `trackAuditSubmit()` + `trackGoogleAdsConversion("FLS8CJvM3LscEJy2kd5D")` on submit. Inserts to `audit_requests` with `source: "paid_ad"`.
- **Created** `app/routes/lp.web-design.tsx` — RR7 route wrapper for `/lp/web-design`. `noindex: true`.
- **Updated** `app/pages/admin/AdminDashboard.tsx` — added `source` field to `AuditRequest` type; added "Ad Leads" sidebar tab (purple `Megaphone` icon) with badge count; added full Ad Leads tab content (pending/resolved tables, purple "Ad Lead" badge, search, info banner); updated Overview KPI grid from 4→5 cards adding "Ad Leads" card; "Audit Requests" tab now excludes `paid_ad` rows; both tabs have Export CSV.
- **Action required**: Run `ALTER TABLE audit_requests ADD COLUMN source text;` in Supabase SQL Editor to add the `source` column.

---

### [2026-08-24] — LP Dual-Form Redesign (Quote Wizard + Audit Form)

- **Modified** `app/pages/lp/WebDesignLP.tsx` — full redesign. Hero form replaced with inline 3-step `QuoteWizard` component (Step 1: project type cards, Step 2: requirements + budget + timeline selectors, Step 3: contact details). Quote wizard saves to new `quote_requests` Supabase table + sends email via Web3Forms (`access_key: 671591b9-2925-44ba-ba00-12e0e092bb34`). Bottom CTA section retains 4-field `LeadForm` (audit) — now navigates to `/lp/thank-you-audit` instead of `/thank-you`. Hero copy updated to quote-first offer. How It Works steps updated to reflect quote flow. Sticky mobile CTA now scrolls to quote wizard (`#qw-name`).
- **Created** `app/pages/lp/LpThankYouQuote.tsx` — confirmation page for LP quote submissions. Fires `trackQuoteSubmit()`. Guards against direct URL access (redirects to `/lp/web-design`).
- **Created** `app/pages/lp/LpThankYouAudit.tsx` — confirmation page for LP audit submissions. Fires `trackAuditSubmit()`. Guards against direct URL access (redirects to `/lp/web-design`).
- **Created** `app/routes/lp.thank-you-quote.tsx` — RR7 route for `/lp/thank-you-quote`. `noindex: true`.
- **Created** `app/routes/lp.thank-you-audit.tsx` — RR7 route for `/lp/thank-you-audit`. `noindex: true`.
- **Supabase**: New `quote_requests` table created (id, name, email, phone, business_name, project_type, requirements, budget, timeline, source, status, created_at).

---

### [2026-08-24] — Phase 1 Core Web Vitals Fixes (LCP + CLS)

- **Fixed** `app/components/HeroSection.tsx` — `<BlurImage>` for `dashboard-preview.webp` now passes `loading="eager"` and `fetchPriority="high"`. Previously used `BlurImage`'s default `loading="lazy"`, which deferred loading of the primary LCP element — directly hurting LCP score.
- **Fixed** `app/components/BlurImage.tsx` — wrapper `<div>` now receives `style={{ aspectRatio: "W / H" }}` derived from the `width` and `height` props. This reserves the correct layout space before the image loads, eliminating CLS. `width` and `height` are also now explicitly destructured and forwarded to `<img>` rather than relying solely on `...props` spread.
- **Fixed** `app/root.tsx` — added `<link rel="preload" as="image" href="/hero-bg.webp" fetchPriority="high">` to `<head>`. The hero background is a static `public/` asset with a known URL; preloading it lets the browser fetch it before React hydrates.
- **Added** `app/routes/_index.tsx` — exported `links()` function that injects a `<link rel="preload" as="image">` for the Vite-hashed `dashboard-preview.webp`. Because Vite hashes this file at build time, its URL can only be resolved via a JS import — `links()` is the correct RR7 mechanism to inject it server-side.
- **Updated** `AGENTS.md` §6 — updated `BlurImage` component entry with new `width`/`height`/`aspect-ratio` behaviour and above-fold usage guidance.
- Build: `✓ built in 42.46s` — no errors. All 3574 modules transformed successfully.

---

### [2026-08-24] — Phase 2 Performance Improvements (Bandwidth + Caching + Code Split)

- **Fixed** `public/favicon-16x16.png`, `public/favicon-32x32.png`, `public/apple-touch-icon.png`, `public/logo-icon.png` — all were 186 KB each (same unresized source). Resized to correct dimensions (16×16, 32×32, 180×180, 32×32) using `sharp`. Total reduction: ~746 KB → ~14 KB (98% savings). Script saved as `scripts/resize-favicons.mjs`.
- **Reverted** `React.lazy()` in `app/pages/Index.tsx` — after auditing `entry.server.tsx`, confirmed the app uses `renderToReadableStream` (streaming SSR). `React.lazy()` inside a `<Suspense>` boundary with streaming SSR renders only the fallback div in the initial HTML shell — Googlebot would see a blank page instead of the section content, directly harming SEO. Reverted to static imports. A comment explains the reason in the file.
- **Updated** `vite.config.ts` — added `build.rollupOptions.output.manualChunks` (function form) to split vendor libraries into dedicated cached chunks: `vendor-motion` (Framer Motion), `vendor-supabase`, `vendor-query` (TanStack), `vendor-sentry`, `vendor-radix` (all Radix UI). React/react-router are NOT listed — they are externalized in the SSR bundle and cannot be in manualChunks.
- **Created** `public/_headers` — Cloudflare Workers static assets cache-control rules. Hashed `/assets/*` bundles: `max-age=31536000, immutable`. Public images (`.webp`, `.png`, `.svg`, `.ico`): 30-day cache with `stale-while-revalidate=86400`. Note: the `wrangler.jsonc` `headers` field is not supported by wrangler v4 — `_headers` is the correct mechanism.
- Build: `✓ built in 19.39s` — exit code 0, no errors. TypeScript: 0 errors.

---

### [2026-08-24] — Phase 3 Housekeeping (Animation + OG Image + Asset Cleanup)

- **Fixed** `app/index.css` — replaced `btn-quote-pulse` `box-shadow` keyframe animation with a GPU-compositable `::before` pseudo-element that animates `transform: scale()` + `opacity`. `box-shadow` forces a full layer repaint on every frame of the 2s infinite loop; the new approach runs entirely on the compositor thread. Used in 16 places across the codebase — no JSX changes required. Keyframe updated to `0% scale(1) opacity(1)` → `70% scale(1.35) opacity(0)`.
- **Created** `public/seo-preview.webp` — converted from `seo-preview.png` (460 KB) to WebP at quality 85, resulting in 34 KB before optimizer (29 KB after). 93% file size reduction for social crawlers.
- **Updated** `app/lib/meta.ts` — `DEFAULT_OG_IMAGE` changed from `/seo-preview.png` to `/seo-preview.webp`. `seo-preview.png` is kept in `public/` as a fallback for crawlers that don't support WebP.
- **Deleted** 9 unused/duplicate assets from `app/assets/`: `dashboard-preview.jpg`, `hero-bg.jpg`, `hero-bg.webp` (duplicate of `public/hero-bg.webp`), `business-showcase.png`, `design-showcase.png`, `ecommerce-showcase.png`, `portfolio-1.jpg`, `portfolio-2.jpg`, `portfolio-3.jpg`. All `.webp` versions used in code are unaffected.
- Build: `✓ built in 17.84s` — exit code 0, no errors. TypeScript: 0 errors.


### [2026-08-30] — Growth Audit Phase 1: Schema Blackout Fix, Dead-Click Trap, QuoteWizard UX, GEO Disambiguation

- **Fixed** Schema Blackout — `<SEO />` component returns `null`, silently dropping all JSON-LD structured data across the entire site. Added `import { JsonLd } from "@/components/JsonLd"` and `<JsonLd data={...} />` as a sibling to `<SEO>` in 20 page files: `Index.tsx`, `About.tsx`, `FreeAudit.tsx`, `OurProcess.tsx`, `Pricing.tsx`, `WebsiteCostCalculator.tsx`, `WhyUs.tsx`, `BlogIndex.tsx`, `BlogPost.tsx`, `Ecommerce.tsx`, `SeoSpeed.tsx`, `WebApps.tsx`, all 7 niche pages, and `LocationPageTemplate.tsx` (covering all 14 location pages). JSON-LD schemas (LocalBusiness, FAQ, Organization, HowTo, Speakable, Service, Article, BreadcrumbList) are now rendered in the HTML.
- **Fixed** Dead-Click Trap (42.86% dead clicks in Clarity) — removed `interactive-card hover-glow` from non-clickable elements in `HeroSection.tsx` (announcement badge + preview div), removed `interactive-card` from `TestimonialsSection.tsx` testimonial cards. In `FeaturesSection.tsx`, wrapped 6 feature cards in `<Link>` elements pointing to relevant service routes and added `href` property to each feature data object.
- **Added** Character counter in `WebDesignLP.tsx` Step 2 textarea — shows "X more characters needed" / "✓ Looks good" with live count. Fixes the invisible validation gate where users couldn't tell why the "Next" button was disabled.
- **Fixed** GEO Entity Disambiguation — in `Index.tsx` (line ~201) and `About.tsx` (line ~316), replaced JSX comments containing SiteNova ≠ sitenovaagency.com disambiguation with real `<section className="geo-entity-block sr-only">` blocks that are hidden visually but present in the DOM for AI and search crawlers.
- Build: `tsc --noEmit` — 0 errors.

---

### [2026-08-31] — Growth Audit Phase 2: Technical Infrastructure (robots.txt, noindex, sitemap, navbar, INP)

- **Fixed** `public/robots.txt` RFC 9309 compliance — per RFC 9309, specific `User-agent` blocks override the wildcard block. Added `Disallow: /admin`, `/admin/`, `/thank-you`, `/lp/thank-you-quote`, `/lp/thank-you-audit` to Googlebot and Bingbot blocks. AI bot blocks remain `Allow: /` only (we want them to crawl everything).
- **Fixed** `app/routes/thank-you.tsx` — added `noindex: true` to `buildMeta()`. LP thank-you routes already had this.
- **Fixed** `app/routes/sitemap[.]xml.tsx` — replaced `const today = new Date().toISOString().split("T")[0]` (dynamic date on every request, causing Googlebot to distrust lastmod) with a static `lastModified` map per path + `defaultLastMod` fallback.
- **Updated** `app/components/Navbar.tsx` — added 3 core service links (E-Commerce Stores, SEO & Speed Audits, Web Applications) above the 7 niche links in both desktop dropdown and mobile menu, separated by a "By Industry" divider. Added `ShoppingCart`, `Search`, `Code2` lucide-react icons.
- **Fixed** INP 310ms — `app/components/IframePreview.tsx` now uses `IntersectionObserver` with `rootMargin: "200px"` to defer iframe `src` until the element scrolls near the viewport. Shows a "Live Preview" placeholder before entering view. Live iframes are preserved (not replaced with screenshots per user requirement).
- **Fixed** INP — `app/components/ScrollProgress.tsx` replaced Framer Motion `useScroll` + `useSpring` JS physics loop with CSS `animation-timeline: scroll()` (zero JS scroll listener). Added `@keyframes scroll-progress` to `app/index.css`.
- Build: `tsc --noEmit` — 0 errors.

---

### [2026-08-31] — Growth Audit Phase 3: Location Page Enrichment

- **Updated** `app/components/LocationPageTemplate.tsx` — added optional `geoCoordinates?: { latitude: number; longitude: number }` prop. JSON-LD `geo` block now uses per-location coordinates (falls back to Mulund default if not provided). Added "Specialised Web Design Services in {locationName}" cross-links section linking to all 7 niche pages, inserted between FAQ and "Other Areas We Serve" sections.
- **Updated** all 14 location page files — added correct `geoCoordinates` prop for each suburb: Mulund (19.1726, 72.9570), Thane (19.2183, 72.9781), Bandra (19.0544, 72.8371), Andheri (19.1197, 72.8464), Powai (19.1176, 72.9060), Bhandup (19.1480, 72.9370), Nahur (19.1530, 72.9490), Ghatkopar (19.0860, 72.9080), Vikhroli (19.1100, 72.9280), Kurla (19.0726, 72.8794), Dadar (19.0178, 72.8478), Lower Parel (18.9981, 72.8318), Mahalakshmi (18.9830, 72.8120), Pedder Road (18.9710, 72.8050). Previously all 14 pages used hardcoded Mulund coordinates (doorway page signal).
- Build: `tsc --noEmit` — 0 errors.

---

### [2026-09-02] — SEO Maximisation: Marketing Pages (Google Ads, Meta Ads, Ads Contact)

**Objective**: Fix critical duplicate meta tag issue, upgrade all JSON-LD schemas, expand keyword sets, add GEO entity blocks, and raise sitemap priorities for the 3 marketing pages.

#### Critical Fixes
- **Removed legacy `<SEO>` component** from all 3 marketing page files (`GoogleAds.tsx`, `MetaAds.tsx`, `AdsContact.tsx`). The `<SEO>` component renders `null` and was causing duplicate `<title>` / `<meta description>` tags in the SSR output (both the `<SEO>` client render AND the route `buildMeta()` export were firing). Single `<title>` per page is now guaranteed.
- **Fixed broken BreadcrumbList JSON-LD** — the "Marketing" breadcrumb item position 2 incorrectly pointed to `https://sitenova.dev/` (the homepage). Google ignores invalid breadcrumb items. All 3 pages now have valid, unique breadcrumb URLs at every level.

#### Schema Upgrades
- **`provider` type** changed from `ProfessionalService` → `LocalBusiness` with full `PostalAddress` (Mulund, Mumbai, 400080, IN) and `telephone` in `GoogleAds.tsx` and `MetaAds.tsx`.
- **Added `hasOfferCatalog` + `Offer`** schema inside the `Service` JSON-LD on both `GoogleAds.tsx` and `MetaAds.tsx` — enables pricing/offer rich results.
- **Added `HowTo` schema** for the 4-step process section (Audit → Strategy → Launch → Optimise & Report) on both `GoogleAds.tsx` and `MetaAds.tsx` — eligible for HowTo rich results in SERPs.
- **Added `ContactPage` schema** in `AdsContact.tsx` with `LocalBusiness` provider — replaces the minimal bare `BreadcrumbList`-only schema.
- **`areaServed`** upgraded from single `City: Mumbai` to an array `[Mumbai, Thane]` on both service pages.

#### GEO Entity Blocks
- **Added `<section className="geo-entity-block">` sections** to `GoogleAds.tsx` (between TestimonialsSection and CTA) and `MetaAds.tsx` (same position). These contain geo-rich prose naming all 14 service areas and key industry verticals — consistent with the pattern used on the homepage and location pages for AI crawler targeting.

#### Keyword Expansion
- **`services.google-ads.tsx`** — 6 → 22 keywords: added long-tail ("hire Google Ads expert Mumbai", "Google Ads for small business Mumbai"), geographic ("Google Ads agency Mulund", "Google Ads Thane", "PPC agency Andheri Mumbai", "Google Ads Bandra Mumbai"), and industry-specific variants.
- **`services.meta-ads.tsx`** — 6 → 22 keywords: added Facebook/Instagram-specific long-tail, geographic, and industry variants.
- **`ads-contact.tsx`** — 4 → 13 keywords: added consultation/booking-intent queries ("free Google Ads consultation Mumbai", "book Google Ads expert Mumbai") and problem-aware queries.
- **Added `modifiedTime`** to all 3 route `buildMeta()` calls for freshness signals.

#### Sitemap
- **`sitemap[.]xml.tsx`** — added `priorities` map. `/services/google-ads`, `/services/meta-ads`, and `/ads-contact` now get `priority: 0.9` (up from the generic `0.8`). Implemented via a lookup map rather than the old single ternary, allowing easy per-path overrides in future.

---

### 2026-09-08 — LP Analytics Bug Fixes

**Files changed**: `app/root.tsx`, `app/pages/lp/WebDesignLP.tsx`

#### Bug 1 — GA4 script never set `window.gtag` (Critical)
The GA4 deferred script used a local variable `g` instead of assigning `window.gtag`, so all `trackEvent()` calls in `analytics.ts` silently dropped on GA4 (they only worked through the Ads script which loaded 500ms later). Both deferred scripts were merged into a single `setTimeout(2000)` block in `root.tsx` that initialises `window.dataLayer` and `window.gtag` once, calls `gtag('config', ...)` for both properties, then dynamically loads both library scripts. Eliminates the race window and guarantees `window.gtag` is available for all subsequent tracking calls.

#### Bug 2 — `trackAuditSubmit()` fired twice per audit submission
`LeadForm.handleSubmit` in `WebDesignLP.tsx` called `trackAuditSubmit()` immediately before navigating to `/lp/thank-you-audit`, which itself calls `trackAuditSubmit()` again on mount. Every audit submission was double-counted. Fixed by removing the call from `LeadForm.handleSubmit` — the event now fires exactly once on the thank-you page (consistent with how `trackQuoteSubmit` works for the QuoteWizard flow).

#### Note on Google Ads conversions
Google Ads conversions are tracked via GTM triggers (GTM-P587639R), not direct `trackGoogleAdsConversion()` calls. GTM picks up GA4 custom events from `dataLayer` and fires its own conversion tags.

---

### 2026-09-14 — Admin Dashboard Redesign: Phase 1 (Foundation)

**Files changed**: `app/routes/admin.dashboard.tsx`, `app/routes/admin.blog.new.tsx`, `app/routes/admin.blog.$id.tsx`, `app/pages/admin/AdminLogin.tsx`, `app/pages/admin/AdminDashboard.tsx`
**Files created**: `app/pages/admin/components/AdminSidebar.tsx`, `AdminHeader.tsx`, `KpiCard.tsx`, `ChartCard.tsx`, `StatusBadge.tsx`, `EmptyState.tsx`, `PhoneCell.tsx` + `app/pages/admin/tabs/OverviewTab.tsx`, `LeadsTab.tsx`, `AdLeadsTab.tsx`, `AdsInquiriesTab.tsx`, `AnalyticsTab.tsx`, `BlogsTab.tsx`

#### Security Fix
- **Wired `ProtectedRoute`** onto all 3 admin routes (`admin.dashboard.tsx`, `admin.blog.new.tsx`, `admin.blog.$id.tsx`). Previously the component existed but was never used — unauthenticated users could access the full dashboard. Routes now require an active Supabase session; any unauthenticated access redirects to `/admin`.

#### AdminLogin Redesign
- Gradient `Zap` icon replacing plain "S" box. Three animated pulse glow orbs in background. Password show/hide toggle (Eye/EyeOff). Error shake animation on failed login (Framer Motion keyframe via `shakeKey` increment). `Loader2` spinner during authentication. `ArrowRight` icon on submit button.

#### AdminDashboard — Monolith → 15-File Architecture
- Dashboard reduced from **1,091 lines to ~180 lines** (thin shell). All tab content extracted into `pages/admin/tabs/`. All shared UI extracted into `pages/admin/components/`. Shared TypeScript types (`AuditRequest`, `BlogPost`, `AdsInquiry`, `PageView`) exported from `AdminDashboard.tsx`.
- `AnimatePresence` wraps tab content for smooth cross-tab transitions.
- `updateInquiryStatus` now has full toast success/error handling (previously had none).
- CSV export now includes the `source` column.

#### AdminSidebar Redesign
- Brand logo upgraded to gradient `Zap` icon with glow shadow. Active item uses left-border accent bar instead of just background highlight. Nav grouped into "General" and "Marketing" sections with section labels. "Test Sentry" button removed.

#### AdminHeader
- Breadcrumb path (`Admin / [Tab Name]`). `backdrop-blur-xl` frosted glass effect. Contextual buttons per tab.

#### Tab Improvements
- All tabs: Framer Motion fade-up entrance. Zebra-stripe table rows. Shared `StatusBadge`, `PhoneCell`, `EmptyState`.
- `AdsInquiriesTab`: Raw `<select>` replaced with shadcn `Select` component.
- `AnalyticsTab`: Switched from `LineChart` to `AreaChart` with gradient fills. Traffic source bars now have gradient fill.
- `OverviewTab`: Bar chart uses gradient fill.
- `BlogsTab`: Added Tags column.

---

### 2026-09-14 — Admin Dashboard Redesign: Phase 2 (Data & Tables)

**Files created**: `components/TableSkeleton.tsx`, `components/ConfirmDialog.tsx`, `components/DateRangeFilter.tsx`, `tabs/QuoteRequestsTab.tsx`
**Files modified**: `AdminDashboard.tsx`, `AdminSidebar.tsx`, `AdminHeader.tsx`, `components/StatusBadge.tsx`, `tabs/LeadsTab.tsx`, `tabs/AdLeadsTab.tsx`, `tabs/AdsInquiriesTab.tsx`, `tabs/BlogsTab.tsx`

#### New Features
- **Quote Requests Tab** — fetches `quote_requests` Supabase table. Status flow: new → contacted → converted → lost. Shows in sidebar with a badge counting `status = 'new'` entries.
- **TableSkeleton** — shimmer loading state used on all data tabs. Columns/rows configurable per tab.
- **ConfirmDialog** — shadcn AlertDialog replacing `window.confirm()` for blog post deletes. State managed in `AdminDashboard` shell (keeps tabs pure).
- **DateRangeFilter** — preset buttons (All / Today / 7d / 30d / 90d) + custom calendar range picker. Applied to LeadsTab, AdLeadsTab, QuoteRequestsTab.
- **Sortable columns** — all tables now have click-to-sort column headers (asc/desc toggle). Applies to: LeadsTab (date/name/email), AdLeadsTab (date/name/email), AdsInquiriesTab (date/name/status), BlogsTab (date/title), QuoteRequestsTab (date/name/project/budget).
- **Pagination** — all tables paginated at 20 rows per page with Prev/Next controls and page indicator. Page resets when filter/sort changes.

#### StatusBadge additions
- Added `quote_new`, `quote_contacted`, `quote_converted`, `quote_lost` keys (prefixed `quote_` to avoid collision with `ads_inquiries` statuses).

#### AdminSidebar / AdminHeader
- `AdminTab` union type now includes `"quote_requests"`. Sidebar badges prop includes `quote_requests`. FileSignature icon.

---

### 2026-09-16 — AI Blog Content Pipeline (Phases 1–6)

**Files created**: `supabase/functions/blog-api/index.ts`, `mcp-servers/sitenova-blog-mcp/index.js`, `mcp-servers/sitenova-blog-mcp/package.json`, `.agents/skills/daily-blog-generator/SKILL.md`, `.agents/skills/daily-blog-generator/GEMINI_APP_PROMPT.txt`, `tabs/DraftsTab.tsx`, `tabs/TopicsTab.tsx`

**Files modified**: `routes/blog._index.tsx`, `routes/blog.$slug.tsx`, `pages/blog/BlogIndex.tsx`, `pages/admin/AdminDashboard.tsx`, `pages/admin/AdminBlogEditor.tsx`, `pages/admin/tabs/BlogsTab.tsx`, `pages/admin/tabs/OverviewTab.tsx`, `pages/admin/components/AdminSidebar.tsx`, `pages/admin/components/AdminHeader.tsx`, `pages/admin/components/CommandPalette.tsx`, `C:\Users\Kavish Ganatra\.gemini\config\mcp_config.json`

#### Phase 1 — Database Schema + Blog Status System
- Added columns to `blog_posts`: `status TEXT CHECK('draft'|'review'|'published'|'archived') DEFAULT 'published'`, `source TEXT CHECK('manual'|'ai') DEFAULT 'manual'`, `blanks_metadata JSONB DEFAULT '[]'`, `ai_model TEXT`, `ai_prompt_used TEXT`, `reviewed_at TIMESTAMPTZ`, `reviewed_by TEXT`, `updated_at TIMESTAMPTZ`.
- Created `blog_topics` table: `id UUID, title TEXT, description TEXT, target_keywords TEXT[], status TEXT CHECK('pending'|'in_progress'|'used'|'skipped') DEFAULT 'pending', priority INTEGER DEFAULT 0, created_at TIMESTAMPTZ, used_at TIMESTAMPTZ`. RLS: authenticated full access. Index on `(status, priority DESC)`.
- All public blog routes now filter `.eq("status","published")` — drafts return 404.
- Admin fetches all posts (no status filter). `BlogsTab` shows Status column (inline shadcn Select), Source badge (🤖 AI / 👤 Manual).
- `AdminBlogEditor` saves `status` field. Default for new posts: `"draft"`. Dynamic Save/Publish button label.
- `BlankMeta` type exported from `AdminDashboard`: `{ id, label, guideline, location, filled, filled_content }`.

#### Phase 2 — Supabase Edge Function + MCP Server
- **Edge function** `blog-api` deployed at `https://bklmtwblsoitafynpikc.supabase.co/functions/v1/blog-api`. Handles 7 actions: `create_draft`, `list_recent_posts`, `list_topics`, `mark_topic_used`, `add_topic`, `get_site_context`, `get_blank_guidelines`. Uses auto-injected `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`.
- **MCP wrapper** at `mcp-servers/sitenova-blog-mcp/index.js` — thin stdio MCP server wrapping all 7 edge function actions as MCP tools for use by Antigravity.
- `C:\Users\Kavish Ganatra\.gemini\config\mcp_config.json` updated with project URL + anon key (restart Antigravity to reload).

#### Phase 3 — Skill + Gemini App Prompt
- **SKILL.md** at `.agents/skills/daily-blog-generator/SKILL.md` — 10-step Antigravity skill for generating daily blog posts. AI selects topics based on current SiteNova context and pending `blog_topics` queue. Produces 1600–1800 word HTML posts with 4–6 human-fill blanks (`<!-- BLANK:id -->`).
- **GEMINI_APP_PROMPT.txt** at `.agents/skills/daily-blog-generator/GEMINI_APP_PROMPT.txt` — ready-to-paste Gemini Gem instructions with real API endpoint baked in. Schedule at 2AM IST in the Gemini app.

#### Phase 4 — DraftsTab + Blog Editor Blank-Fill UI
- **`DraftsTab`** — shows all AI-generated posts grouped by status (Draft / In Review / Published / Archived). Each card shows: title, status selector, AI model, slug, time ago, blank progress bar, inline preview of unfilled blanks with their guidelines, one-click publish when all blanks filled. Search bar filters by title/slug/tag.
- **`AdminBlogEditor` blank-fill panel** — appears when editing an AI post with blanks. Toggle "Blanks (N left)" button in header (auto-opens if blanks unfilled). Each blank card: label, AI guideline, location hint, textarea, "Mark as filled" button. On save: `<!-- BLANK:id -->` replaced with `<span class="filled-blank" data-blank-id>` in HTML. `blanks_metadata` saved back to DB.
- Sidebar: "AI Drafts" entry with `Bot` icon + live badge count. Header: "AI Drafts" shows New Post button. Command palette: "AI Drafts" entry.

#### Phase 5 — Search
- **BlogsTab**: Search bar (title/slug/tag filter) with `X` clear button + live count. Resets pagination on query change.
- **DraftsTab**: Search bar above summary strip (title/slug/tag filter).
- **Public blog** (`/blog`): Search bar below the heading. Filters by title or excerpt client-side (no re-fetch). Featured card hidden when searching (all matching results show in grid). No-results empty state with "Clear search" button.

#### Phase 6 — TopicsTab + OverviewTab KPIs + AGENTS.md
- **`TopicsTab`** — full CRUD UI for `blog_topics`. Shows: pending queue, used, skipped sections. Actions per card: ✓ mark used, ↷ skip, Restore, Delete. Add form with title, description, target keywords (comma-sep), priority (higher = AI picks first). Animated accordion form reveal. Chip summary (Pending / Used / Skipped counts).
- **`OverviewTab`** — 7-card KPI grid (was 5). Added: `AI Drafts` (pending drafts awaiting fill, violet) + `Topics Queue` (pending topics count, cyan). Published Blogs KPI now correctly counts only `status='published'` posts. Props expanded: `aiDraftsPending: number`, `topicsInQueue: number`.
- `AdminDashboard` fetches pending topics count via lightweight Supabase `count` query on mount. `topicsInQueue` state updated accordingly.
- Sidebar: "Topic Queue" entry with `ListChecks` icon between AI Drafts and Blog Posts. Header: `TAB_LABELS` includes `"topics"`. Command palette: "Topic Queue" entry.

### Verification notes — 2026-09-29

Production build and automated unit, browser and isolated PostgreSQL checks were run locally. The app TypeScript check still reports pre-existing repository errors (65 at Git baseline; 63 after the changes, with no new diagnostics in the comparison). The Google schedule and actual notification delivery require the account setup in `docs/booking-setup.md`.

### Payment backend audit (2026-10-10)
- Connected SiteNova Web project bklmtwblsoitafynpikc. The initial read-only audit found ads_inquiries had RLS disabled; the user subsequently authorized fixing it, and migration 20261010171139_secure_ads_inquiries.sql was applied to production successfully on 10 October 2026. delete_old_completed_requests still has a mutable search_path, and leaked-password protection is disabled. Payment schema is now applied to SiteNova Web; public payment code remains undeployed and disabled pending local Razorpay test-mode verification.

- Payment backend validation: All 49 unit/UI tests pass (including 21 payment backend tests); local PostgreSQL payment migration/access/deduplication/refund tests and ads-access tests pass. Scoped backend ESLint and production build pass. Application typecheck retains baseline errors with no payment-file diagnostics.
- Applied migration 20261010171139_secure_ads_inquiries.sql removes anonymous read/update/delete/truncate, preserves validated public inserts, and limits dashboard access to is_site_admin(). Live metadata verification confirms RLS/grants/policies; rollback-only role tests confirm anonymous read denial, valid public insertion, rejected forged statuses, non-owner isolation and verified owner access. No test records remain. The Supabase advisor no longer reports ads_inquiries as RLS-disabled. No code push/deployment or payment migration was performed.

### Payment schema provisioned (2026-10-10)
- User authorized backend SQL and local checkout against SiteNova Web. Applied razorpay_backend_payments migration (local file 20261010170200_razorpay_backend_payments.sql) transactionally after isolated PostgreSQL tests passed. Live verification confirms payment_intents RLS, no browser SELECT/INSERT/UPDATE privileges, no browser RPC execution, service-role settlement execution and SECURITY INVOKER. Existing tables/data are untouched.
- Created ignored .dev.vars and opened it in VS Code for the owner to enter Test Mode Razorpay keys, separate webhook secret and Supabase server credentials. Values are never displayed. Owner reports KYC setup and a ₹1 payment-link test; custom checkout/webhook delivery remain unverified. No code push/deployment or active public webhook.

### Supabase payment Edge Functions (2026-10-10)
- Payment logic moved from app/lib/razorpay.server.ts to supabase/functions/_shared/razorpay.ts and payment-store.ts. App lib now forwards same-origin calls only; Edge Functions own prices, order creation, signed sessions, capture verification, ledger writes and webhooks. app/lib/payments.ts re-exports shared validation/types.
- Deployed razorpay-payments and razorpay-webhook version 1 to SiteNova Web. Custom gateway-secret authentication protects payment API; raw-body Razorpay HMAC protects webhook, so verify_jwt=false is deliberate. Unconfigured live endpoints return 503; payments remain disabled. Website code remains unpushed/undeployed.
- Applied 20261010173513_payment_edge_rate_limits.sql: server-only RLS table and service-only invoker consume_payment_limit RPC enforce atomic 30/minute creation/check buckets. Hashed IP bucket identifiers, daily stale-row cleanup and expiry index; no Cloudflare payment rate binding remains.
- Local secret locations changed: ignored supabase/functions/.env holds Razorpay secrets plus generated PAYMENT_GATEWAY_SECRET; ignored .dev.vars holds matching gateway credential, SUPABASE_URL and PAYMENT_EDGE_ENABLED=false. Existing local Razorpay assignments were moved safely; no secret values displayed or uploaded. Supabase supplies its server database bindings to deployed functions. RAZORPAY_ENABLED=false in Edge file.
- Webhook URL: https://bklmtwblsoitafynpikc.supabase.co/functions/v1/razorpay-webhook. Real webhook delivery and Test Mode API checkout remain pending owner secret configuration; the prior payment-link test does not validate this implementation. See docs/razorpay-setup.md for current architecture; it supersedes the initial Worker-payment preparation notes above.
- Validation: 55 tests pass, local PostgreSQL payment and rate-limit checks pass, production build and scoped lint pass. Application TypeScript check retains exactly 62 baseline diagnostics, with none in payment files. Live rate-limit metadata confirms RLS, denied browser access/RPC execution and service-only invoker execution. No payment credentials or settlement RPC names appear in client bundles. Security advisor reports only intentional no-policy information for server-only payment tables plus the existing unrelated warnings.

### Webhook activation separated from checkout (2026-10-11)
- Owner saved live Razorpay and gateway secrets in Supabase and enabled the dashboard webhook with four events. A configured webhook now validates signatures and reconciles existing orders independently of RAZORPAY_ENABLED; new checkout requests remain gated by that flag and the rate limiter.
- Deployed razorpay-webhook version 3, ACTIVE, with custom raw-body HMAC authentication and verify_jwt=false. Harmless remote probes: correctly signed payload 200; unsigned and altered payloads 403. Authenticated gateway configuration returns enabled=false/testMode=false. No order, charge or database payment record created by these checks; no website code pushed/deployed.
- All 29 backend/gateway tests and scoped ESLint pass, including settlement while checkout is disabled and forged-event rejection. Actual Razorpay-generated deliveries, full custom checkout and refund flows remain pending; the earlier payment-link test does not validate them. Setup documentation records the current live-key state and preserves both checkout activation flags as false.

### Admin ₹1 Test payment (2026-10-11)
- AdminHeader mounts TestPaymentButton: explicit click opens Razorpay for service "Test", 100 paise INR. This is a real ₹1 charge with the owner's live keys. Callback success appears only after backend capture verification and durable ledger settlement; cancellation/retries reuse the saved request/order, and Check status recovers the same session after refresh. No payment is initiated automatically.
- The new same-origin POST-only /api/admin/payments/:action gateway forwards the admin access token privately. Supabase verifies it with auth.getUser and reads site_admins membership on every call; missing/forged/anonymous identities and non-admins are denied. Test sessions must belong to that verified admin. Public endpoints reject test sessions, and client price/package/name overrides are rejected.
- Backend-only test catalog sets amount=100 and service=Test; public Starter/Business catalog and prices remain unchanged. Admin tests work independently of both public activation flags, which remain false. They share reservation, rate limits, callback HMAC, provider-state verification, signed sessions, settlement and webhook/refund reconciliation with package payments.
- Applied 20261011064503_admin_test_payment.sql extends the server-only payment_intents package/amount constraint to test=100 with a nonempty customer.admin_id marker. Existing browser grants/RLS, package amounts and service-only settlement remain intact. Deployed razorpay-payments v3 and razorpay-webhook v4, both ACTIVE with custom authentication. Live probes deny missing/forged admin tokens (401), retain disabled public checkout (503), and accept a harmless signed webhook (200). No test order/charge created by the agent; actual paid end-to-end testing awaits the owner's click.
- Tracking scripts and Sentry initialization are suppressed on direct admin loads as well as /pay. Website source remains local, unpushed and undeployed. Validation: 63 existing/backend tests, 3 new admin-button tests and the additional gateway isolation test pass (67 total); isolated PostgreSQL constraints/access/rate/refund tests pass. Scoped lint and production build pass. Application typecheck retains 62 baseline diagnostics with none in changed payment files. Live metadata confirms RLS, denied browser ledger reads/inserts/settlement, and fixed price constraints. Security advisors retain only the previously documented warnings and intentional no-policy server-table information.
- Local testing preview started at http://127.0.0.1:8788/admin using the built website and ignored .dev.vars. Admin login responds HTTP 200. The owner cancelled phone access; the temporary tunnel session was stopped, its port 8787 is unreachable, and no tunnel-origin changes were retained or deployed. The preview listens only on loopback.

### Local payment gateway runtime fix (2026-10-11)
- The owner's first admin test clicks failed before contacting Supabase: Cloudflare workerd rejects fetch redirect:"error". The gateway now uses supported redirect:"manual" and explicitly rejects all 3xx responses; no gateway/admin credential can follow a redirect to another host.
- All 8 gateway boundary tests and scoped lint pass, including redirected-response rejection. A read-only probe in the actual local Worker runtime reaches deployed Supabase and returns the expected 401 for an invalid admin token. Diagnostic probe files/processes were removed/stopped. No order/charge created during diagnosis; both public activation flags remain false.
- Production build passes with the runtime fix. Windows held dist/client open, so output cleanup was temporarily disabled for this build and the original Vite configuration restored afterward. Restarted loopback preview at http://127.0.0.1:8788/admin: page 200; harmless invalid-token request through the actual website gateway returns backend 401 rather than the former forwarding 503. No website push/deployment; the owner can refresh and retry the same saved test request.

### Admin test website deployed (2026-10-11)
- Owner explicitly approved deploying the prepared website to sitenova.dev for the admin-only ₹1 test after Razorpay rejected the local checkout's website origin. Securely added the matching PAYMENT_GATEWAY_SECRET and PAYMENT_EDGE_ENABLED=false to the production Worker; existing Supabase/Calendar secrets were preserved. No Razorpay secrets were uploaded to Cloudflare.
- Deployed the already validated production build as Worker version 004ab7de-308b-448b-99cb-a6729fd2aa9e. Live /admin, /pricing and /api/booking-settings return 200; no pricing advance links appear, public order POST returns 503, and an invalid-token admin status request reaches Supabase and returns 401. Supabase admin membership and owner checks remain mandatory. No Git commit/push or agent-initiated payment.
- Owner reports a ₹1 GPay debit during local testing. Read-only Razorpay checks show only the local order's failed payment with website-mismatch rejection, zero captured money and no later matching payment reference in the checked account. GPay screenshots show completed bank transfer, but provider reconciliation remains unresolved. Do not mark the ledger paid from a screenshot or presume a refund/merchant settlement; owner needs Razorpay/bank reconciliation before another payment. No capture/refund was triggered by the agent.

### Production ₹1 test verified (2026-10-11)
- Owner subsequently authorized a separate production test and completed Paytm checkout on sitenova.dev; the admin screen showed “₹1 Test payment verified.” Read-only Razorpay API verification confirms payment pay_TmWfLfOqrwu9EN for order order_TmWaNOWkXh9a80 is captured, amount=100 paise INR, refunded amount=0. Supabase payment_intents records the matching order/payment as paid, with verified_at 2026-10-11 07:55:21.050932+00.
- Live checkout and durable backend settlement are verified. Independent webhook delivery/recovery and live refunds remain unverified; callback verification can write the same paid ledger state. Public package checkout remains disabled. The earlier local GPay debit remains separately unresolved. No agent-initiated charge, capture, refund, Git push or deployment occurred during this read-only verification; only documentation was updated.

### Payment-attempt safeguards (2026-10-11)
- Reviewed the unmatched GPay debit: available evidence shows a provider website-mismatch rejection and conflicting bank completion, not a confirmed misplaced merchant settlement. Identified two avoidable integration gaps: live-key localhost checkout was permitted, and failed/created attempts could receive checkout authorization again.
- Supabase razorpay-payments v4 now permits live order/checkout requests only from https://sitenova.dev, before provider/ledger access. Existing signed status/verify requests remain available even when checkout is disabled. Any provider attempt (including failed/created/unknown), non-created order or settled ledger blocks checkout with 409 pending reconciliation. Local Test Mode remains supported; unattempted orders can resume after cancellation. No schema, secret or activation-flag changes.
- Public/admin checkout disable built-in retries and replace immediate retry advice with status/debit reconciliation guidance. This conservatively blocks legitimate failed attempts too; the owner must resolve them before another payment. Bank/provider delays and debit discrepancies cannot be guaranteed away by site code.
- Validation: all 48 payment/backend/gateway/UI tests pass, including local live blocking, failed-attempt locks, settled-ledger protection and failed-to-captured recovery with checkout disabled. Scoped ESLint and production client/SSR build pass. The Windows output-folder lock was worked around without deleting output; the original Vite configuration was restored. Harmless deployed probes confirm local order/checkout 403, disabled public order 503 and invalid signed recovery 403. No agent-created order, charge, refund or Git push.
- Deployed website protections as Worker version 7213eb54-4989-4763-ac6d-895454d3ae41 with --keep-vars. Live admin, pricing and booking configuration return 200; pricing hides advance links, public order returns 503 and unsigned/invalid signed recovery is rejected. Public checkout remains disabled; Supabase payment API is v4 and webhook remains v4.

### Ordered payment reliability work — step 1 (2026-10-11)
- No Razorpay event-ID storage previously existed. Applied 20261011085842_payment_webhook_events.sql: service-only RLS table payment_webhook_events with explicit UNIQUE(event_id), and invoker complete_payment_webhook RPC that atomically inserts the event marker and applies existing monotonic settlement. Duplicate conflicts return false without settlement; failed settlement rolls back the marker.
- Deployed webhook v5. Signed requests require a valid x-razorpay-event-id; already processed events return 200 without provider calls, and concurrent completion conflicts also return 200. The callback verification/order flow is unchanged. Step-1 validation: 40 backend/boundary tests and isolated PostgreSQL uniqueness/rollback/browser-denial checks pass. Public checkout remains disabled.

### Ordered payment reliability work — step 2 (2026-10-11)
- Applied 20261011090250_payment_reconciliation.sql and 20261011090645_payment_reconciliation_schedule.sql. Active pg_cron job sitenova-payment-reconciliation runs every 10 minutes and dispatches razorpay-reconcile v1 using a database-generated Vault secret; only its hash is available to the service-only verifier. No credential is exposed to browser roles.
- Pending orders older than 15 minutes are fetched in bounded batches using provider GET requests, with order/package/key/paise/currency validation and the same monotonic settlement RPC as webhooks. Duplicate run claims and overlapping scheduled runs are prevented. No orders, captures, refunds or fulfillment are created by reconciliation.
- Server-only RLS tables payment_reconciliation_runs and payment_reconciliation_log record run results and per-order old/new state, generic error and alert flags. Failed dispatches, abandoned runs, provider/storage errors and unresolved orders older than 24 hours are flagged, including when the Edge Function is unavailable.
- Validation: 36 backend/reconciliation tests, isolated PostgreSQL monotonic/access checks, schedule/overlap/watchdog checks and scoped lint pass. Live run 5706d5c3-8b79-4d30-99b4-bb1a18ea4b29 completed with checked=1/errors=0; the earlier GPay order remains needs_reconciliation because provider capture is unconfirmed. Public checkout flags remain false.

### Ordered payment reliability work — step 3 (2026-10-11)
- Applied 20261011091631_payment_confirmed_retry.sql; deployed payment API v5 and reconciler v2. Public retry requires a signed prior session, fresh provider GETs and clear customer/issuer decline reasons. Timeouts, unknown failures, authorization and website mismatch remain blocked and logged for reconciliation. Provider expiry is accepted only if explicitly returned with no attempts; browser age never establishes expiry.
- reserve_payment_retry locks the parent, requires a fresh failure/expiry check and unchanged stored customer/package/paise/key, reserves one unique successor, and retires the parent's checkout. Request reuse is idempotent; uncertain order creation and late confirmed capture block new retries. No callback verification or settlement logic changed. Public flags stay false.
- Added /api/payments/retry and a disabled-by-public-readiness eligibility action on /pay; the action verifies the previous order before offering a fresh checkout and never opens checkout automatically. Validation: 48 backend/reconciliation/checkout tests, PostgreSQL one-successor/idempotence/late-capture/browser-denial checks and scoped lint pass. No agent-created live order or payment.

### Ordered payment reliability work — steps 4–5 (2026-10-11)
- Manage → Payments in the protected admin dashboard lists pending/needs-reconciliation and recently failed/expired orders, paginated 50 at a time, with failed-run and unresolved-order flags. Per-order history is paginated; Re-check with Razorpay uses fresh provider GETs and the same audited settlement writer. Strict bodies prohibit manual paid/amount/payment-ID overrides. Every queue/history/recheck request verifies Auth identity and site_admins membership, with per-admin backend rate limits; browser roles retain no ledger/log/run grants.
- Applied 20261011092645_payment_queue_alerts.sql prevents confirmed failed/expired attempts from being labelled unresolved solely because their ledger status remains pending. Active order alerts join the current ledger state so settled/resolved orders are excluded; historical flags remain in the audit history.
- Checkout for a reserved retry additionally verifies all previous attempts before opening; late capture or uncertain ancestry blocks checkout and flags review. Existing signed callback verification is unchanged.
- Validation: all 100 tests pass, including event-ID replay/conflict, scheduled captured recovery, duplicate-run denial, fresh-decline retry/uncertain blocking, late-capture blocking, admin/non-admin authorization, no manual-paid overrides, queue/history UI and query safeguards. Isolated PostgreSQL tests prove atomic event rollback, one paid transition under repeat reconciliation, monotonic paid/refunded state, scheduler overlap/watchdog/24-hour flags, one retry successor and browser denial. Production build and scoped lint pass; TypeScript retains 62 pre-existing diagnostics and none in payment changes.
- Deployed payment API v6 and website Worker c0fd2b62-ddd7-4980-ba1b-12b5b11cf6f2 with --keep-vars. Webhook remains v5; reconciler v2. Public configuration enabled=false; live order/retry/checkout remain disabled and missing/forged admin queue identities are denied. Automatic cron runs and the final dispatched validation run completed checked=1/errors=0; the previous captured Paytm payment remains paid. SQL verifies queue/history rows and browser denial. Authenticated live browser queue clicks remain unverified because no signed-in browser session was available; a direct local service-key probe returned 401. No credentials were changed or exposed.
- Automatic approval review rejected an optional diagnostic inside the production cron because it could interrupt reconciliation. That diagnostic was not deployed; the cron remained unchanged, and separate query tests/SQL permission checks were used. Reviewable source diff: docs/payment-reliability.diff. No Git commit/push, new live order, charge, capture, refund or fulfillment was initiated by the agent. Public flags remain false; the earlier GPay debit still needs provider/bank resolution.
