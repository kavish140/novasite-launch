# SiteNova Comprehensive Growth Audit Plan

## Objective
Deliver a comprehensive, deep, actionable Growth Audit across SEO, GEO, Content, Conversion, and a 90-Day Execution Roadmap for SiteNova (sitenova.dev) to scale organic traffic, local dominance across Mumbai/Thane, AI engine visibility, and client conversion rates.

## Architecture & Work Packages

### Package 1: Technical, On-Page & Local SEO Deep Dive (R1)
- Crawlability & Indexation: robots.txt, sitemap.xml implementation, Cloudflare Workers trailing slash routing, React Router v7 SSR hydration.
- Web Vitals & Performance: Deep dive on INP 310ms root causes (main-thread blocking tasks, Framer Motion hydration, event handlers, Radix/next-themes overhead).
- On-Page Architecture: Meta tags generation (`buildMeta` in `app/lib/meta.ts`), heading structure (H1-H4 hierarchy), internal linking graph, orphan pages.
- Local SEO & Multi-Location: Evaluation of 14 location pages (`app/pages/locations/*`), NAP consistency against external profiles (Clutch, TechBehemoths, Crunchbase, Google Business), local keyword integration.

### Package 2: GEO & AI Generative Engine Visibility (R2)
- Zero Citation Analysis: Why Perplexity, ChatGPT/SearchGPT, Claude, Gemini aren't citing sitenova.dev.
- Schema & Structured Data: Deep audit of `app/lib/seo.ts` (LocalBusiness, Organization, Speakable, Service, FAQ, HowTo).
- AI Engine Ingestion Signals: Information gain, entity extraction, geo-entity-blocks markup, direct-answer definitions.
- E-E-A-T Profiling: Founder attribution, case studies, client testimonials, proof of local work.
- Competitor Benchmark: Reverse engineer 3 real Mumbai digital/web agencies ranking and cited in AI overviews.

### Package 3: Content Strategy & High-Intent Keyword Map (R3)
- Page Potential Matrix: Assessment of homepage, 7 niche pages (`app/pages/niche/*`), 3 service pages (`app/pages/services/*`), and blog engine (`app/pages/blog/*`).
- 15–25 High-Intent Keywords: Target queries with monthly search volume, keyword difficulty (KD), intent, and exact target URL mapping.
- Topical Authority & Content Clusters: Pillar-cluster model for web design, e-commerce, custom apps, and niche verticals in Mumbai.
- Programmatic & Template Quality: Unique content vs template duplication across 14 location pages and 7 niche pages.

### Package 4: Conversion Rate Optimization & Funnel UX (R4)
- 42.86% Dead-Click Analysis: Code-level inspection of interactive elements lacking affordance, unclickable cards, fake buttons, non-responsive spans.
- 42.86% Quick-Back / Bounce Analysis: Above-the-fold value proposition, page speed, mobile layout shifts, cognitive friction.
- Paid Landing Page Funnel: Deep review of `/lp/web-design` (`app/pages/lp/WebDesignLP.tsx`), QuoteWizard 3-step form, exit popups, sticky mobile CTA.
- Trust Signals & Micro-Conversions: WhatsApp floating triggers, phone tap targets, pricing clarity.

### Package 5: 90-Day Step-by-Step Execution Roadmap (R5)
- Week 1–2: Quick Wins (>= 5 zero-budget, high-impact fixes).
- Week 3–6: Medium-Effort High-Return Implementation (schema overhaul, INP fixes, content upgrades, LP optimization).
- Week 7–12: Sustained Growth & Authority Building (topical cluster rollout, citation building, link acquisition, continuous conversion tuning).
- Prioritization Matrix: Impact (High/Med/Low), Effort (Hours/Days), Cost (₹ / Free).

## Subagent Dispatch Strategy
- Explorer 1 (`teamwork_preview_explorer`): Technical SEO, Codebase Architecture & Performance Audit (INP, Crawlability, Meta, Indexation, Location Pages).
- Explorer 2 (`teamwork_preview_explorer`): GEO, AI Visibility, Schema & Competitor Intelligence (Perplexity/ChatGPT visibility, `app/lib/seo.ts`, Schema markup, 3 Mumbai competitors).
- Explorer 3 (`teamwork_preview_explorer`): Content Strategy, Keyword Research, CRO & Funnel UX (Keyword mapping, dead-click analysis, LP funnel, quick-back causes).
- Lead Strategist Worker / Specialist (`teamwork_preview_worker`): Comprehensive Audit Synthesis & 90-Day Roadmap Formulation.
- Reviewer & Auditor (`teamwork_preview_reviewer`, `teamwork_preview_auditor`): Independent verification of recommendations, technical accuracy, and integrity check.
