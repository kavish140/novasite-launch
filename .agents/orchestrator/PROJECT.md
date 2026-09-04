# Project: SiteNova SEO Strategy & Implementation Plan

## Architecture
- Site: SiteNova (https://sitenova.dev)
- Stack: React Router v7 SSR on Cloudflare Workers, Vite 6, Tailwind CSS, Framer Motion 12, Supabase JS v2
- Target Market: Mumbai / Mulund / Thane & Greater Mumbai Metro Area + Niche Businesses (Doctors, CA/Finance, Lawyers, Real Estate, Startups, Restaurants)

## Feature Inventory
| # | Feature / Area | Description | Milestone | Source |
|---|---|---|---|---|
| 1 | GSC Data Deep Dive | Analysis of impressions, clicks, CTR, and average positions across queries, pages, countries, devices | M1 | Request R1 |
| 2 | High-Priority Opportunity Identification | Identify at least 5 priority pages/queries stuck on page 2/3 or with high impressions and poor CTR with root-cause hypotheses | M1, M2 | Request R1 |
| 3 | SEO Strategy Document (`seo_strategy.md`) | Comprehensive strategy: GSC diagnostics, CTR snippet optimization, URL normalization, Schema & entity signals, content upgrades, 90-day roadmap | M2 | Request R2 |
| 4 | Technical Implementation Plan (`seo_implementation_plan.md`) | Detailed step-by-step codebase changes (meta exports, schemas, headings, routes) compatible with RR7 and Cloudflare Workers SSR | M2 | Request R2 |
| 5 | Independent Technical Review & Forensic Audit | Reviewer verification of RR7/Cloudflare compatibility & AGENTS.md rules + Forensic integrity check (codebase untouched) | M3 | Acceptance Criteria |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|---|---|---|---|
| 1 | GSC & Codebase Survey | Parallel Explorers analyzing GSC dataset and codebase architecture | none | DONE |
| 2 | Strategy & Implementation Plan Drafting | Specialist Worker drafting `seo_strategy.md` & `seo_implementation_plan.md` | M1 | DONE |
| 3 | Independent Review & Forensic Audit | Agent-as-Judge verification of compatibility, AGENTS.md compliance, and zero codebase modifications | M2 | DONE |
| 4 | Gate Evaluation & Sentinel Reporting | Orchestrator gate check, synthesis, and final reporting | M3 | DONE |

## Code Layout & Audit File Targets
- `app/routes/*` — Route entry points and meta configurations (`meta()` exports)
- `app/lib/meta.ts` & `app/lib/seo.ts` — Metadata and Schema.org JSON-LD builders
- `app/pages/*` — Full page templates (niche, locations, services, blog, lp)
- `app/components/*` — Interactive UI components, CTAs, popups, hero, portfolio
- `workers/app.ts` & `wrangler.jsonc` — SSR & edge routing configuration

