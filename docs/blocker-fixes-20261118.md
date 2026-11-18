# Blocker fixes — 18 November 2026

All four issues identified in the earlier release audit are resolved. Website source remains local: no Git push, Worker deployment or Edge Function deployment. The specifically requested portfolio database migration was applied through the restored SiteNova Web connector.

## Fixes

- Services and portfolio overview pages are now index routes. All five service detail routes and three client case studies render their own content and canonical metadata.
- Unknown paths return HTTP 404 and render the existing designed 404 page.
- Closing typed HTML headings now converts the following block to a paragraph, including when the caret precedes existing text. Existing document-end behaviour, marks, sanitization, paste and exports pass tests. The original reproducible editor browser scenario passes.
- Portfolio persistence is active in project `bklmtwblsoitafynpikc`. Migration `20261118100613_portfolio_projects` creates and seeds only the new portfolio table. The earlier local draft file was renamed to the actual remote migration version to avoid accidental reapplication. Public catalog has 11 rows and no AI SmartKit link. RLS is enabled; anonymous access is read-only and hidden rows/admin writes use the existing membership authorization.

## Verification

| Check | Result |
| --- | --- |
| Production client/SSR build | Pass |
| Full unit suite | 387/387 pass |
| Full isolated Edge browser suite | 29/29 pass, zero flaky or skipped cases |
| Added route regressions | All eight detail pages plus genuine 404 pass |
| Repeated route/viewport crawl | 97 checks; correct detail headings, no overflow, missing local images or browser page errors |
| Changed source lint | Pass |
| Isolated portfolio PostgreSQL checks | Pass after matching migration filename to production history |
| Live database verification | 11 seeds, no removed project, RLS and policy checks pass |
| Live rollback-only access/CRUD checks | Public read, anonymous write denial, non-admin deletion denial, admin insert/edit/hidden read/delete pass; transaction rolled back |
| Connected preview | `/api/portfolio` returns 11 real rows; service detail renders correct H1; nonexistent URL returns 404 |

The database verification used PostgreSQL role/claim simulation within a rollback-only transaction. It does not claim a new browser-authenticated admin save or real financial transaction. Browser interactions use isolated mocked APIs. Existing payment backend/credentials/prices/activation flags are untouched. Live provider checkout, webhook and refund end-to-end checks were not repeated.

Security advisors before and after the migration show the same pre-existing findings and no new portfolio issue. Existing warnings concern the [search path of an unrelated function](https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable), the existing [anonymous/signed-in SECURITY DEFINER membership helper](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable), and [leaked-password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection). They were not changed as part of this scoped fix.

Follow-up: the 60 TypeScript diagnostics and full-repository lint findings were subsequently resolved; see [TypeScript cleanup](typescript-fixes-20261118.md) and [ESLint cleanup](lint-cleanup-20261118.md). Actual Cloudflare workerd/provider acceptance is still distinct from the isolated SSR/browser tests.

Evidence is in ignored `logs/blocker-fixes-build.txt`, `logs/blocker-fixes-vitest.json`, `logs/logs/release-readiness-browser.json`, `logs/release-readiness-crawl.json`, `logs/blocker-fixes-types.txt`, and `test-results/release-readiness/`.
