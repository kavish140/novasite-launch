# SiteNova SEO Strategy & Technical Implementation Plan

## Objective
Analyze Google Search Console performance data, identify high-impression low-click opportunities, formulate a breakthrough SEO strategy (`seo_strategy.md`), and design an exact, fully compatible technical implementation plan (`seo_implementation_plan.md`) for React Router v7 and Cloudflare Workers edge SSR architecture without modifying source code prematurely.

---

## Phase 1: Deep GSC & Codebase Survey (Parallel Explorers)
- **Explorer 1 (`explorer_gsc_1`)**:
  - Quantitative & qualitative analysis of GSC data export (impressions, clicks, CTR, average position trends).
  - Identification of 5+ high-priority pages/queries (e.g., `/location/bandra`, `/website-cost-calculator`, `/location/thane`, `/location/powai`, `/location/mulund`, `/websites-for-restaurants`, `web development`, `business webdesign`, `website designer in mulund`).
  - Evidence-backed root cause hypotheses for low clicks (low position, poor SERP title snippet, missing structured data, search intent mismatch, trailing slash URL cannibalization).
- **Explorer 2 (`explorer_code_1`)**:
  - Audit codebase architecture: React Router v7 routes (`app/routes/`), `buildMeta()` in `app/lib/meta.ts`, JSON-LD structured data in `app/lib/seo.ts` / `app/components/JsonLd.tsx`, Cloudflare Worker routing & trailing-slash handling in `workers/app.ts`, `sitemap[.]xml.tsx`, headings and content across priority pages.
  - Establish technical compatibility constraints for React Router v7 `meta()` exports and Cloudflare Workers SSR.

---

## Phase 2: SEO Strategy & Technical Implementation Plan Drafting (Specialist Worker)
- **Worker (`worker_strategy_1`)**:
  - Formulate and draft `seo_strategy.md`:
    - Executive Summary & GSC Performance Analysis.
    - Deep Dive on 5+ High-Priority Pages & Queries with Root Cause Hypotheses.
    - CTR & Snippet Optimization Engine (Title/Description formulas, SERP intent alignment).
    - Technical SEO & Trailing-Slash URL Normalization Strategy.
    - Structured Data & Rich Snippet Enhancement (LocalBusiness, Service, WebApp, FAQ, Breadcrumbs).
    - Content & Heading Hierarchy Optimization across Target Pages.
    - Local & Niche Landing Page Authority Strategy.
    - 90-Day Roadmap & Measurement Framework.
  - Formulate and draft `seo_implementation_plan.md`:
    - Codebase architecture overview & constraints.
    - Exact file-by-file specification of proposed changes (meta exports, schemas, headings, routes).
    - React Router v7 `meta()` export signatures and types.
    - Cloudflare Workers SSR & edge considerations.
    - Strict compliance with `AGENTS.md` (no code modified prematurely).

---

## Phase 3: Independent Technical Review & Forensic Audit (Agent-as-Judge)
- **Reviewer (`reviewer_1`)**:
  - Independent review of `seo_implementation_plan.md` against RR7 `meta()` conventions, Cloudflare Workers SSR, TypeScript types, and `AGENTS.md` rules.
  - Verify acceptance criteria: R1 (at least 5 high-priority queries/pages identified with root cause hypotheses), R2 (both docs generated, codebase untouched), RR7 & Cloudflare compatibility, no AGENTS.md rule violations.
- **Forensic Auditor (`auditor_1`)**:
  - Forensic verification that codebase source files (`app/`, `workers/`) remain unmodified.
  - Verify authenticity of GSC data citations and code references.

---

## Phase 4: Gate Evaluation, Synthesis & Sentinel Reporting
- Evaluate reviewer and auditor reports in `GATE_STATUS.md`.
- Update `progress.md`, `BRIEFING.md`, and `handoff.md`.
- Report final synthesized results to the Sentinel.

