# Release readiness — 17 November 2026

Historical audit. The four listed blockers were subsequently resolved on 18 November; see [the fix and verification report](blocker-fixes-20261118.md). Counts and findings below document the original failing state.

**Verdict: NOT READY TO DEPLOY.** No Git push, website/function deployment, production migration, accepted lead, live admin mutation, order creation, charge, capture or refund was performed during this audit. Application code was not changed to mask failures. Only local audit helpers, generated test reports and documentation were added.

## Results

| Check | Result |
| --- | --- |
| Production client + SSR build | PASS. Initial sandbox subprocess denial was resolved by allowing the local build. |
| Complete Vitest suite | 385 / 386 tests pass across 55 files. One quote-prefill test fails because jsdom has no window.matchMedia. |
| Complete browser suite, isolated Edge | 17 / 20 pass. Three failures described below. |
| Isolated PostgreSQL verification | All 12 scripts pass: portfolio, booking, payment ledger, retry, operations, disputes, pricing, projects, webhook events, reconciliation, scheduler and ads access. No production database connection. |
| Public page/viewport crawl | 97 checks at 1440px, 390px and selected 320px routes. No horizontal overflow, browser page errors, missing local images or missing canonical tags. Content checks exposed eight incorrect detail pages. |
| Changed/new TS/TSX lint | PASS, no diagnostics. |
| Full repository lint | FAIL: 172 errors and 3 warnings, chiefly generated .react-router/.wrangler content plus existing unrelated source diagnostics. |
| Application typecheck | FAIL: 60 diagnostics. Animation typings, portfolio template props, and generated route-type resolution; no diagnostics in the new portfolio modules, payment cards or quote form. These match the previously recorded typecheck backlog. |
| Credential exposure scan | 313 changed-source/built-client files checked; no configured private gateway/service credential or targeted private-key/token pattern exposed. This is a scoped scan, not a general security certification. |
| Navigation/package follow-up | Business package prefill works with the renamed discussion action. Desktop Escape and mobile menu navigation close correctly after their animations. |

## Release blockers and findings

### 1. Detail routes render their parent overview — blocking

New `app/routes/services.tsx` and `app/routes/portfolio.tsx` become parent routes under file-system routing. Their directory page components do not render an Outlet. The result is HTTP 200 and the right URL but the wrong page body:

- `/services/ecommerce`, `/services/web-applications`, `/services/seo-optimization`, `/services/google-ads`, `/services/meta-ads` all display H1 **Services** and the services directory.
- `/portfolio/dr-dipti-ganatra`, `/portfolio/jupiter-fast-finance`, `/portfolio/corporate-zone` all display H1 **Portfolio** and the portfolio directory.

This also hides the SEO diagnostic tool on its existing service route. Resolve the index-versus-layout route structure and add explicit body/content checks for every detail route before release. A successful HTTP status alone is not sufficient.

### 2. Portfolio persistence migration is not applied — blocking for the requested admin feature

`supabase/migrations/20261117101158_portfolio_projects.sql` is prepared and passes isolated RLS/CRUD/validation tests but has not been applied. The previous connector path requires an unavailable link_id, and the CLI management read was denied HTTP 403. No remote schema check or migration was attempted again during this audit because the user explicitly requested no deployment.

Public missing-table fallback shows the static portfolio, but admin add/edit/delete cannot persist until the new table is installed. The connected design preview also uses an ignored portfolio fixture, so its appearance is not evidence that production persistence works.

### 3. Full regression suites are not green

- Unit: `QuoteForm-pricing.test.tsx` package-prefill/unsaved-text scenario throws `window.matchMedia is not a function` at `QuoteForm.tsx:42`. This is an unconfigured browser API in jsdom; the corresponding package-prefill browser flow passes. Test setup needs updating and the full suite needs rerunning.
- Browser: package selection still looks for the old **Choose Business** text, which was renamed **Discuss this package**. A separate browser check selected the Business card with the new action and confirmed the correct prefill. Update this selector rather than restoring old copy solely for the test.
- Browser: SEO diagnostic scenario cannot find its input because the detail-route body is replaced by the parent directory (finding 1).
- Browser: blog editor literal-HTML typing test produces two h2 elements instead of its expected single h2. This reproduces when run alone. The audit does not establish whether it is an editor regression or an overly strict test expectation; investigate before sign-off.

### 4. Unknown URLs return a soft 404

`/missing-audit-page` displays a 404 heading but responds HTTP 200 at both desktop and phone widths. The catch-all route exports a page but no HTTP 404 loader/response. Correct the status before SEO sign-off; this appears separate from the newly introduced nested-route regression.

## Scope and limitations

Browser tests used a separate local server on ports 8091/8092 with a fake Supabase endpoint and controlled pricing readiness. They exercised built SSR/client assets, admin authorization scenarios, quote retry/deduplication/confirmation, booking, receipts, payment review controls, history, recovery display and mobile navigation. No real financial interaction or user-data write occurred. Actual Cloudflare workerd acceptance, signed-in live portfolio CRUD, real provider checkout/webhook delivery and provider refunds were not tested here. Prior production integrations are not replaced by this audit.

The existing connected preview on port 8080 retains the user's earlier authorization to use real quote/admin services. Do not mistake that preview for the isolated audit server. Existing Wrangler state, generated route types and .launch-public-deployments.json should be kept out of a source release unless separately reviewed.

Evidence: ignored `logs/release-readiness-vitest.json`, `logs/release-readiness-browser.json`, `logs/release-readiness-crawl.json`, `logs/release-readiness-build.txt`, `logs/release-readiness-types.txt`, `logs/release-readiness-lint.txt`, `logs/release-readiness-changed-lint.txt` and `test-results/release-readiness/`.
