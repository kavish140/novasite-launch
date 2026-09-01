# Project: SiteNova Growth Audit & 90-Day Execution Roadmap

## Architecture
- Site: SiteNova (https://sitenova.dev)
- Stack: React Router v7 SSR on Cloudflare Workers, Vite 6, Tailwind CSS, Framer Motion 12, Supabase JS v2
- Target Market: Mumbai / Mulund / Thane & Greater Mumbai Metro Area + Niche Businesses (Doctors, CA/Finance, Lawyers, Real Estate, Startups, Restaurants)

## Feature Inventory
| # | Feature / Area | Description | Milestone | Source |
|---|---|---|---|---|
| 1 | Technical & On-Page SEO | Crawlability, robots, sitemap, meta tags, INP 310ms root cause, headings, 14 location pages | M1, M2 | Request R1 |
| 2 | GEO & AI Citation Audit | 0 citations diagnosis, schema (`app/lib/seo.ts`), speakable, E-E-A-T, 3 Mumbai competitor benchmark | M1, M3 | Request R2 |
| 3 | Content Strategy & Keywords | High-ranking pages, 20 target keywords with volume/difficulty, clusters, content quality | M1, M4 | Request R3 |
| 4 | Conversion & Dead-Click Audit | 42.86% dead clicks, 42.86% quick-backs, paid LP `/lp/web-design` funnel, lead capture | M1, M5 | Request R4 |
| 5 | 90-Day Action Roadmap | Week-by-week prioritized plan with 8 zero-budget quick wins, medium effort, sustained effort | M6 | Request R5 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|---|---|---|---|
| 1 | Survey & Technical Investigation | Parallel exploration across codebase, SEO/GEO architecture, UX and competitors | none | DONE |
| 2 | R1: Full SEO Audit Synthesis | Detailed Technical, On-Page, Off-Page, and Local SEO Audit | M1 | DONE |
| 3 | R2: GEO & AI Visibility Audit | Schema audit, AI citation factors, competitor analysis | M1 | DONE |
| 4 | R3: Content Strategy & Keyword Map | 20 keyword opportunities, topical clusters, page potential | M1 | DONE |
| 5 | R4: Conversion & UX Audit | Dead-click root causes, quick-back remedies, LP optimization | M1 | DONE |
| 6 | R5: 90-Day Prioritised Roadmap | Consolidated week-by-week actionable roadmap | M2, M3, M4, M5 | DONE |
| 7 | Verification & Delivery | Independent review and final comprehensive report delivery | M6 | DONE |

## Code Layout & Audit File Targets
- `app/routes/*` — Route entry points and meta configurations
- `app/lib/meta.ts` & `app/lib/seo.ts` — Metadata and Schema.org JSON-LD builders
- `app/pages/*` — Full page templates (niche, locations, services, blog, lp)
- `app/components/*` — Interactive UI components, CTAs, popups, hero, portfolio
- `workers/app.ts` & `wrangler.jsonc` — SSR & edge routing configuration
