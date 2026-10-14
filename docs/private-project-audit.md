# Private project portal bug hunt — 13 October 2026

Local fixes only. Public collection flags and production remain unchanged. No browser tools, real order, charge, refund, deployment or push.

## Confirmed findings fixed

| Finding | Fix | Evidence |
|---|---|---|
| A dispute containing a balance order could be consumed by balance reconciliation, skipping dispute recording | Always forward dispute events to the existing record-only handler | `does not intercept a signed dispute for a balance order before the existing dispute recorder` |
| Revocation, release changes or price changes during provider reads were not checked at final authorization | Expected share/total reservation guard plus final invoker SQL authorization | `withholds checkout options after a final database authorization detects owner revocation`; actual SQL revocation/release/paid guards |
| Creating a duplicate project could silently overwrite progress/price; two admin tabs could overwrite newer edits | Explicit create/edit intent and exact saved revision checks | Isolated SQL `project_already_exists` / stale-version rejection; original create/edit flow regressions |
| Failed refreshes retained stale private data/Pay; warnings did not clear after a healthy poll | Hide stale data and payment controls on failed reads; successful reads clear errors; add Reload project | `clears stale private data and Pay on a failed poll, then clears the warning after recovery` |
| Changing the URL fragment retained the previous project; older network responses could overwrite it | Hash-change listener, request revision and captured link checks | `switches private links on hash change and never applies a stale response from the old project` |
| Leaving while checkout script/authorization loaded could still open Razorpay | Recheck mount/project identity before creation/opening | `does not start backend checkout or open Razorpay after leaving while the script loads` |
| Dismissal during verification could unlock checkout prematurely; old callbacks could unlock a newer project | Verification lock and per-attempt generation; verify against original capability | `ignores dismissal while verification is in flight and cannot reopen checkout early`; `verifies late callbacks against their original private link without unlocking a newer checkout` |
| Missing captured provider data for a previously paid ledger was logged as a healthy pending result | Treat contradictions as review errors while SQL preserves paid/refunded state | `fails visibly on missing provider settlement for a previously paid order and incomplete payment pages` |
| A payment collection saying more pages remain could be mistaken for complete evidence | Fail closed on `has_more` | Same backend regression above |
| Expired checkout still appeared eligible in the saved summary | Age check in eligibility/review projection | `hides expired checkout eligibility and refuses provider work after the time budget expires` |
| Repeated UUID-ordered paid checks could consume batches/time before later balances | Database-clock checkpoint, oldest-check-first SQL selection, exclude already checked rows | Actual SQL 52-row / 50-row batch test; GET-only recovery regressions |
| Confirmed declined balance orders could not retry | Fresh provider-decline/expiry checks plus one retained successor per attempt; uncertainty and late captures block authorization | `classifies only fresh hard declines or explicit provider expiry as retryable`; `opens a fresh successor only after verified decline and resumes that successor without another POST`; isolated SQL retry uniqueness and late-capture checks |
| Older projects and advances were inaccessible | Project title search, 25-row pages, Load older verified advances | `paginates admin projects and rejects malformed search/page inputs`; `loads older projects, searches titles and loads older paid advances` |
| Expected business conflicts looked like unexplained outages | Whitelist safe 409 messages; unknown SDK details remain masked | `returns safe actionable conflicts but never exposes unexpected SDK error bodies or prototype names` |

## Second production-readiness audit

Additional local findings fixed:

| Finding | Fix | Evidence |
|---|---|---|
| Final authorization could validate a successor but return a retired order's checkout options | Bind SQL authorization to the exact reservation UUID | `binds final checkout authorization to the exact provider order reservation`; actual SQL retired-ID rejection with healthy successor |
| Project-wide acknowledgement could include a newly captured payment the owner had not reviewed | Require the exact balance ID, scope it to the project and show earlier captured attempts individually | `acknowledges only the selected payment instead of all current project settlements`; `acknowledges the specific earlier captured attempt without acknowledging a newer payment` |
| Paid/refunded ledger protection hid a verification error from project alerts | Separate review_required flag; settlement remains paid/refunded; verified recovery clears the flag | `flags verification errors on previously paid balances without downgrading the saved paid status`; actual SQL flag set/clear |
| Order-only balance webhooks could skip balance recovery | Route known order payload IDs to the existing GET-verified balance sidecar | `processes known balance order-only webhooks with verified GETs and the shared event ID` |
| Contradictory refund data could show an inaccurate net amount | Fail closed on refunded-with-zero-refund and authorized-with-refund responses | `rejects contradictory refund data rather than presenting an inaccurate net balance` |
| Retry exhaustion could still show a Pay button | Mark a tenth declined attempt for review and hide retry eligibility | `shows review rather than a retry button once the ten-order limit is exhausted`; actual SQL review flag |
| Malformed provider creation data looked like a customer input error | Return a masked service/uncertainty error and keep the original reservation blocked | `reports malformed provider order creation as uncertain service failure without exposing data or replacing the reservation` |
| Retry history did not identify the checked order; project reads repeated inconsistent queries | Store balance/order IDs in history; build amounts/status from one attempt-list read; reuse admin records | Actual SQL history order-reference assertion; full regression suite |

Added full project/attempt/history indexes and removed unused service-role DELETE grants. Isolated SQL verifies indexes and service/browser delete denial. Existing advance/test checkout/verification/settlement bodies are unchanged.

## Validation

- All 244 tests passed across 39 files. All earlier tests are retained.
- Isolated PostgreSQL passed actual migration, browser denial, invoker privileges, expected share/price, duplicate creation, stale edits, final authorization, NULL denial, uniqueness, monotonic refund/capture, acknowledgement, event rollback and >50-row recovery checks.
- Scoped lint and production client/SSR build passed. New portal/payment files have no type diagnostics; 61 unrelated existing diagnostics remain.
- Provider/Auth/UI networking is mocked. Live new portal/payment/webhook/cron behavior and browser layout are unverified. The suite does not establish bank behavior or that the implementation is bug-free.

## Remaining operational limitations

1. Uncertain/unattached/aged created orders remain blocked for owner investigation; no automatic orphan attachment/reset is provided. Do not delete a possibly live reservation or mark it paid manually. Retry is limited to ten recorded orders, fresh provider-confirmed hard declines or explicit expiry. Old checkout options already issued to another tab cannot be cancelled by our database: a later capture is retained and flagged, and blocks further checkout. Refund decisions remain manual in Razorpay.
2. Listing/search and advance pagination are locally tested. Concurrent admin list responses cannot overwrite a newer response. The interface and private portal still require owner visual/live acceptance after approved backend-first deployment.
3. Project recovery shares the existing scheduler's overall time budget. Exhaustion is visible as a failed run; checks are GET-only and progress through batches fairly, but a busy/outage-prone run may defer later balances. Signed webhooks and explicit checks provide additional recovery paths.
4. Private links are bearer capabilities. Anyone holding one can view that project's summary; revocation blocks subsequent server requests, not information already seen or checkout options already issued.

These limitations must remain explicit before public activation. No production schema/functions/flags were changed during this audit.

## Browser checks — 13 October 2026

Owner authorized local browser testing. Used the in-app browser with loopback previews only; no real order, charge, production write or secret inspection.

- Actual local SSR preview: `/project` without a link shows the expected warning; `/pay?package=starter` displays ₹5,000 and collection-disabled messaging with no payment button/provider script; unauthenticated `/admin/dashboard` redirects to `/admin`.
- Separate ignored local harness imports the actual Project/ClientProjects components with synthetic API data and a fake SDK. Checked disabled, uncertain, failed-read/reload, simulated declined retry and paid states. Admin search, pagination, older advances, payment-specific acknowledgement, private-link display and order-labelled history were exercised.
- Narrow 320px/390px geometry checks found no horizontal overflow/offscreen controls in the tested states; desktop screenshot inspected. Isolated fixture browser console has zero error/warning entries.
- Browser found invalid UTF-8 separator bytes in the new ClientProjects source. Converted that file to valid UTF-8 and confirmed the replacement characters disappeared. It also exposed that the order-reference rendering change had not reached the history text; fixed and confirmed both in the browser and the existing acknowledgement/history regression test.
- Earlier SSR checks emitted React hydration errors #418/#423. The document hydration repair below supersedes that local blocker; production verification still requires approved deployment.
- New deployed backend, real signed-in project operations, actual balance checkout/webhooks and real scheduler behavior remain UNVERIFIED. Fixture success is not payment-provider evidence.

Screenshots: `test-results/local-browser/admin-desktop.jpg` and `project-paid.jpg`. Local preview/harness configuration is ignored and contains no live payment secrets. The first rebuild was blocked by the serving preview's Windows build-directory lock; stopped the preview to rebuild before restarting.

## Selection/reload follow-up

Scoped portal selection uses opaque #1d4ed8 with #ffffff text, confirmed by browser computed styles. Reload now retains the current warning while checking, displays Reloading…, and reports an explicit failed or successful retry. The request stays read-only. The regression `shows reload progress and a persistent-failure outcome, then restores the project after successful retry` verifies the second request, disabled/loading UI, unchanged payment eligibility and healthy recovery.

Owner-facing fixture options: Network failure (persistent) and Network failure (recovers on reload). Browser confirmed both outcomes; fixture console is clean. All 239 tests, local production rebuild and scoped lint pass. Screenshot: `test-results/local-browser/reload-recovered.jpg`. No production changes.


## Document hydration repair - final local evidence

The installed React 18 full-document renderer rejected browser-extension elements placed directly under html. Real in-app checks also showed that moving those elements could race the browser controller. The final change uses React 19.3.0 native document hydration support, with compatible next-themes 0.4.6 and vaul 1.1.2. It does not move/remove extension controls, observe document mutations, force synchronous hydration or suppress recoverable errors. Reference: https://react.dev/blog/2024/12/05/react-19#compatibility-with-third-party-scripts-and-extensions

Client entry uses startTransition for streamed Router startup. The server returns React's original stream without prepending another doctype. Wrangler keep_names=false prevents server-only name-preservation helpers appearing in the theme's serialized startup script. QuoteForm's existing submission ref is explicitly initialized for the updated React types, without behavioral changes.

Verified locally:
- All 244 tests across 39 files pass. Five real React renderer regressions in app/lib/root-hydration.test.tsx cover the parsed document shell, exactly one streamed doctype, preserved injected-node identity and event listener, injection during suspended Router startup, and continued reporting of a genuine markup mismatch. Router/provider/auth network responses remain mocked where existing suites use mocks.
- Final production client/SSR build and scoped lint pass. Installed React/theme/drawer dependencies have no peer-resolution errors. Typecheck: 61 existing diagnostics, zero added relative to the earlier 62-error baseline; the repository-wide check still fails.
- Final fresh Chrome and in-app browser tabs: /project finishes initialization and shows missing-private-link feedback; /quote advances to Step 2 after selecting Business Website. Both consoles have zero error/warning entries for these checks.
- In-app /pay?package=starter still shows online payments coming soon with no Pay control; anonymous /admin/dashboard redirects to /admin. The same tab's error/warning console stays empty. No quote was submitted, login attempted, Razorpay checkout opened or payment initiated.
- Actual local Worker HTML has exactly one doctype and no __name call in its serialized theme script. Screenshot: test-results/local-browser/hydration-fixed.jpg.

This is local browser/build evidence, not a production check. Authenticated live project operations, the new balance flow/webhooks/cron and real balance payments remain UNVERIFIED. Nothing was deployed or pushed, and public collection remains disabled.
