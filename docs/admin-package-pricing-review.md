# Local review: package pricing, landing payments and project details

**Release update:** Subsequently deployed backend first after owner approval. Live schema/config/admin reads and public forms verified; no real price edit or charge. See `release-20261014.md`. The local-only status below is historical preparation evidence.

Prepared 14 October 2026. **Not pushed or deployed. No real order, charge, capture, refund or production price edit was made in this pass.** Existing production public-payment activation flags were not changed.

## Customer experience

- Both the homepage `/` and `/lp/web-design` have Starter and Business cards with separate starting price and advance, a payment link, and an alternative quote link. The landing-page quote form remains available.
- Payment links perform a full document reload to the existing `/pay?package=starter` or `/pay?package=business`, preserving checkout's tracking suppression. They appear only if pricing is available and both collection switches permit payment.
- Before a new payment, customers enter their name, business/project name, email, mobile, a required project brief (20–2,000 characters) and preferred timeline, with an optional existing website URL. Timelines are preferences, not promised delivery dates. URLs must be HTTP(S) without embedded login credentials.
- The backend validates and stores project details privately. Admin → Payments → Recent paid orders shows Project brief, Preferred timeline and Existing website alongside the existing contact details. No new personal details enter public receipts or private-project summaries; briefs/timelines/URLs are not added to Razorpay order notes.
- Previously saved orders remain recoverable without supplying newly required fields. Their screen avoids labelling the saved order with a newly edited advance. Existing signed receipts and payment checks use the original ledger amount.

## Owner price controls

Admin → Settings → Package pricing has four rupee inputs: Starter starting price, Starter advance, Business starting price and Business advance. Advances are independent and need not be 50%; each amount must be ₹1–₹10,00,000, with at most two decimals, and an advance cannot exceed its package's starting price.

Saving creates an immutable price version and updates the current pointer atomically. It affects new bookings only. Existing order amounts, receipts and agreed project totals are unchanged. Recent price history is available. Stale saves are rejected; unsaved edits remain visible until you explicitly reload.

Frontend visibility uses freshly checked admin membership; backend actions independently verify the signed-in user and `site_admins`. Database pricing tables have RLS and revoked browser grants. Exact integer paise conversion and a version check occur before provider order creation. A database reservation trigger additionally rejects a concurrent/stale price read. Retry orders inherit the confirmed-failed parent's original amount/version.

Public package copy, relevant metadata, quote labels and calculator bases read the same catalog. If pricing cannot be read, the site does not invent an amount or authorize a fallback checkout. E-commerce, ads budgets, SEO services and separately priced add-ons remain outside these package controls.

Terms are locally revised to 14 October: the displayed advance counts toward the agreed total, and price changes affect new bookings only. Refund rules and payment-on-completion rules are unchanged. Review this wording with the new price controls before approving release.

## Validation completed

| Check | Evidence | Result / limit |
|---|---|---|
| Existing and new automated tests | `.pricing-all-tests.log` | **300/300 across 44 files pass**; includes the prior 250 tests. Provider calls use mocks, not real financial transactions. |
| Exact paise, stale prices, old-order verification/reconciliation/retries, private project details | `app/lib/package-pricing.test.ts` | Mocked provider/store checks pass. Invalid/missing project brief, timeline and unsafe URL fail before reservation/API creation. |
| Admin price reads/saves, rate limiting, validation, conflicts and masked errors | `app/lib/package-pricing-store.test.ts`, `payment-admin-edge.test.ts`, `PackagePricing.test.tsx` | Mocked HTTP/auth tests pass, including non-admin denial. |
| Public links, collection gating, metadata and secondary price labels | `PackageAdvanceOptions.test.tsx`, `QuoteForm-pricing.test.tsx` | Pass, including full-document navigation instead of SPA navigation. |
| Booking fields, reviewed version and legacy display | `payment-checkout.test.tsx`, `PaidOrders.test.tsx` | Component tests pass. |
| Actual local PostgreSQL price migration | `node scripts/test-package-pricing-db.mjs`, `.pricing-db.log` | Pass: historical-price backfill, browser denial, service grants, exact prices, independent advances, stale saves/reservations, immutable original amount, inherited retry price, duplicate settlement and monotonic refunds. Isolated PGlite database; no production SQL. |
| Existing SQL regressions | Ledger, events, reconciliation, schedule, retry, operations, disputes and project scripts (`.pricing-*-db.log`) | **Eight additional isolated SQL scripts pass**. These validate database logic, not the live scheduler or provider network. |
| Production build | `.pricing-build.log` | Client and SSR build pass. |
| Focused lint | `.pricing-lint.log` | Pass for new pricing/card/form modules and affected payment handlers/admin records. No claim of global lint cleanliness. |
| Type diagnostics | `.pricing-types.log` compared to `.launch-public-types.log` | **61 remain**, same diagnostics after normalizing line shifts; **zero added**. Existing animation/generated-route errors were not changed. |
| Client/review credential scan | `.pricing-security.log` | Pass against locally available real credentials. Supabase-only secret values were not read, so those specific values were not scanned. |
| Real browser layout / controls | `test-results/local-pricing/*.png` | Actual homepage/LP components, correct package link, required-field rejection, project fields, separate mock price save and 320/390px layout pass without horizontal overflow. Browser preview uses fake data only. React reports its existing JSON-LD script warning in this CSR-only fixture; this is not a production hydration check. |

New feature behavior against the live Supabase schema/provider is **unverified** because deployment is forbidden until approval. New-price live charges, live package/balance failure paths and live refund/dispute exercises were not performed. No absolute “bug free” claim is made.

## What is live versus local

Production remains the earlier fixed-price release: backend API v13 / webhook v9 / reconciler v7, website active version `d796eb99-ff16-4bd2-b712-628789f2d2b5`, previously approved Starter ₹5,000 and Business ₹7,500 advances. Its private-project/receipt/admin updates remain as described in the prior deployment report. No live check of flags was repeated in this local-only pass.

The price migration `20261014103622_admin_package_pricing.sql`, pricing tables/RPC/actions, editable Settings UI, shared dynamic catalog, landing cards and new project intake **exist only locally**. The local fixture is ignored, outside routes/public, and absent from the production build. No new secret is needed for this change.

## Review locally without moving money

The isolated preview runs at **http://127.0.0.1:8791/** and blocks live API calls, payments and saves. Its example values are not the production price book.

1. Open http://127.0.0.1:8791/ and scroll to **Websites from ₹10,000 onwards**. Inspect both payment cards; quote links remain beside them.
2. Press **Pay ₹5,000.00 advance** to inspect the Starter form. Do not expect this preview to open real Razorpay or create an order.
3. Open http://127.0.0.1:8791/lp/web-design and scroll to **Ready to start with a package?**. Press **Pay ₹7,500.00 advance** to inspect the Business form.
4. In the blank form press the Pay button: missing contact details, brief and acceptance are rejected. Fill the brief and choose a timeline to inspect the new controls. The final financial action is blocked in the preview.
5. Open http://127.0.0.1:8791/pricing-admin. Edit **Starter starting price (₹)** and **Starter advance (₹)** separately, then press **Save package prices**. This saves to a temporary in-memory mock only; it does not update production or the preview's fixed public catalog. Refreshing the document resets mock edits.

## Future release order — approval required

1. Temporarily suspend new public collection for the coordinated rollout; preserve verification, receipts, webhook processing and recovery.
2. Apply the price migration, then deploy **all three backend functions** with the updated shared files and the two new pricing modules. Existing settlement RPCs and webhook settlement logic are unchanged; the shared verifier now compares stored immutable amounts rather than today's fixed catalog amount.
3. Check database privileges/current seed, authenticated admin catalog/save denial paths, existing receipt/recovery and cron health. Run Supabase advisors. Do not create a real charge to perform these checks.
4. Deploy the reviewed website with the customer form and versioned catalog together. Check both cards, both forms, admin controls, tracking suppression and no hydration errors on the real release.
5. Re-enable collection only after those checks pass and the owner-approved starting/advance prices match across pages. New orders require the updated form; an older website/form is deliberately rejected rather than accepting missing project details or a stale price.

No part of this release sequence has been executed in this pass.

## Diffs

- `docs/admin-package-pricing.diff`: scoped frontend/new-module/migration/test changes against the current Git baseline. That baseline predates some already deployed private-project changes, so overlapping files can include those previously reviewed lines. Runtime caches, credentials and dependency changes are excluded.
- `docs/admin-package-pricing-backend.diff`: shared payment-handler differences against the **reviewed deployed v13/v9/v7 source snapshot**, rather than the older Git baseline. New pricing files/migration are in the first diff. This comparison shows the unchanged settlement paths and the precise price snapshot/input changes.
