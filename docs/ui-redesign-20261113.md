# SiteNova studio UI redesign — 13 November 2026

The site now presents SiteNova as an independent design and development studio, with a clear website-enquiry journey. This is a local source redesign; production has not been released.

## Conversion decisions

- The first screen states the website offer, shows actual client work, provides a starting-price reference when pricing is available, and gives the quote action priority.
- Client work and authentic reviews precede the service and pricing choices. No new customer, performance statistic, testimonial, or conversion-result claim is invented.
- Package cards lead to the existing qualified quote wizard, preserving package prefill. Existing gated advance links remain available with full-document checkout navigation and server-authorised amounts.
- The process and direct-developer section explain who does the work and how scope is agreed. Audit, FAQ and contact options address visitors who need more information.
- Educational resources and local context follow the main sales journey. Navigation retains the existing service, industry, marketing, company, pricing, blog, calculator and audit destinations.

## Visual coverage

Manrope display typography, DM Sans body text and a selective Instrument Serif accent sit on warm ivory, with ink and orange accents. Saved theme preferences remain; light is the new-visitor default. Primary text/button colour pairs support both themes. Solid surfaces and hairline borders replace glass, glow, decorative gradients and pulsing CTAs.

Shared styles cover navigation/footer/contact controls and all public page families: core pages, pricing, quote/contact/audit/booking, services, seven niches, fourteen local guides through their template, three case studies, journal, paid landing pages, legal and private payment/project/receipt pages. Admin has a coordinated scoped palette. Receipt print rules, status colours and reduced-motion preferences are retained.

Implementation is split between `app/styles/studio.css`, `app/components/site-shell.css`, `app/components/studio-sections.css`, `app/styles/studio-pages.css`, and the existing scoped admin stylesheet. No shadcn primitives were edited.

## Verification and limits

- Existing Vitest suite: 374 tests across 52 files pass. All 13 focused package/quote/hydration regressions pass again after final adjustments.
- Existing Edge conversion/home tests: eight pass with mocked booking, quote and diagnostic responses. Six existing admin browser tests pass with mocked sessions/data.
- Initial responsive audit covers 38 representative routes at 1440px/390px, plus eight critical pages at 320px. It found two intrinsic-layout overflows (Why Us comparison and finance case-study animation); these were repaired without clipping the page. Final built-source checks pass 32 page/width combinations across 320, 390, 768, 1024 and 1440px, with zero overflow or page errors and successful font loading. This is representative coverage, not a claim to have exercised every live account, article or payment state.
- Desktop keyboard menus close with Escape and restore focus; the mobile drawer closes on navigation. The audit's initial immediate menu-count check ran before the exit animation completed; the awaited focus/close check passes.
- Production client/SSR build and scoped lint pass. Full TypeScript checking still reports existing animation/template diagnostics; this is not a clean typecheck release.
- The local Cloudflare preview became unstable and exited. Browser validation uses the built application in an isolated, read-only Node preview with local pricing fixtures, disabled collection and blocked/mocked external services. It is visual/interaction verification, not a new live lead, booking, payment, authenticated account or production-runtime acceptance test.

No application backend, database/schema, auth, booking or quote API, payment verification/recovery/settlement, price setting, credentials or activation flags were changed. No real form submission, charge, deployment or Git push was performed. Actual conversion impact requires observing real traffic after a separately authorised release; these design choices do not establish a measured uplift.
