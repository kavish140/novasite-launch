# Payment publication review — 12 October 2026

Owner approved the rollout on 12 October 2026. Backend and website are now deployed; see `payment-deployment-20261012.md` for current versions, live evidence and remaining limits. The review below is the historical pre-deployment check record. Deployment added three empty-dispute-response regressions, bringing the passing suite to 168 tests. Public activation flags were preserved and public checkout is verified disabled. No order, charge, capture or refund was created by the agent.

## Confirmed checks

| Check | Result | What this proves / limits |
|---|---|---|
| Full Vitest regression | 165 tests / 31 files pass; original 133 retained | Provider/Auth HTTP uses mocks; no bank transactions |
| Real-browser production preview | 4 / 4 pass in installed Edge | Actual built UI, mock backend/account data: paid/lost acknowledgement clears alerts, investigations stay record-only, mobile queue fits 390px, receipt refresh in two fresh contexts, no personal details/tracking scripts on receipt, non-admin makes no payment query, public checkout disabled |
| Seven database scripts | All pass in isolated PGlite/PostgreSQL | Fixed paise constraints, browser grants/RLS denial, atomic event IDs/rollback, monotonic settlement/refunds, one retry successor, schedule overlap/watchdog, record-only disputes/investigations, stable receipt ID, acknowledgement cannot settle; pg_cron/pg_net/Vault in schedule test are stubs |
| Metadata failure | Additional real SQL assertion passes | Receipt-sidecar insertion failure rolls back the original settlement and webhook marker together; cannot report success with an unsaved ledger |
| Production build | Client and SSR pass | Deployable website artifact; not a live Supabase Edge runtime check |
| Scoped ESLint | Pass | All payment-change TypeScript files plus new browser checks/config |
| Application typecheck | 0 payment diagnostics; 62 unrelated remain | Full application typecheck is not clean; unrelated code unchanged |
| Client/artifact security scan | Pass | Private server identifiers absent from browser bundles; values from local ignored credential settings absent from client/review artifacts. Supabase-only secret values were not inspected |

Useful commands: `node node_modules/vitest/vitest.mjs run`; `node node_modules/@playwright/test/cli.js test --config playwright.payments.config.ts`; `node scripts/check-payment-client-security.mjs`; `npm run build`. Database scripts: `test-payment-db`, `test-webhook-events-db`, `test-payment-disputes-db`, `test-reconciliation-db`, `test-reconciliation-schedule-db`, `test-payment-retry-db`, `test-payment-operations-db` under scripts.

## Fix and added evidence

Browser testing exposed mobile overflow from the new investigation action row. Paid/investigation controls now wrap, without changing any payment action. The final browser run passes after rebuilding. Initial test assertions were also corrected to await the existing asynchronous acknowledgement update and use the site's two-decimal rupee formatting; those were test mistakes, not settlement bugs.

Five extra regression cases cover dispute identity/currency/amount mismatch, paid recovery beyond a full 100-row page and exhausted time budget, paginated GET dispute reads/redirect denial, receipt storage/rate failures, and missing/malformed/oversized receipt requests. Actual SQL additionally tests receipt observer failure rollback. No checkout, verification or settlement body/migration changed in this review.

Existing non-blocking warnings remain: React's development preview reports the shared root `fetchPriority` prop warning, the build reports large chunks/React Router future flags and an unused unrelated import. They are not failing payment tests, but the repository is not warning-free. The 62 unrelated type errors remain outside this task's payment scope.

## Unverified and deployment gates

- New migrations/functions/UI remain undeployed. Live PostgREST relationships, Edge module/runtime deployment and permissions for GET dispute listing must be checked after backend deployment and before website deployment. The documented [Razorpay dispute-list API](https://razorpay.com/docs/api/disputes/fetch-all/) supports the read; account access has not been tested.
- Owner reports saving a random 64-character PAYMENT_RECEIPT_SECRET. Its presence/value in the intended project and a real signed receipt round trip are unverified; no value was requested, read or printed. The same receipt signing key must remain stable for existing links.
- High-volume completion within the existing 110-second scheduler budget is unverified. Pagination/deadline failure is tested; sustained backlog capacity/fairness is not. An incomplete run is visibly failed, rather than silently reported successful.
- Real bank failures/refunds/disputes and true concurrent webhook deliveries are not exercised here. SQL deduplication/transaction behaviour and provider mocks cover their local logic. No automated service fulfilment is added.
- Investigation evidence is retained with an alert and cannot be manually marked paid/attached/resolved by this feature. Backfilled paid time uses existing stored verification time, not a newly verified provider capture timestamp.

After explicit approval: apply the four new migrations, deploy the three backend functions with their existing authentication/flags, verify grants, new query shapes, signed minimal receipt, admin denial and scheduled GET completion. Deploy website only after those checks pass. Keep public payment flags false throughout. Live smoke checks must not initiate charges/refunds/disputes. Before a Git push, exclude secrets and tracked generated runtime/framework artifacts; existing local Git status includes such output.

Review the original additive diff in `payment-operations.diff` plus the final publication changes in `payment-publication-check.diff`. The admin click-through steps remain in `payment-operations-review.md`.
