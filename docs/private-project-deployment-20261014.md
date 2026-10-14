# Approved deployment and acceptance checks — 14 October 2026

**Later same-day status:** Owner subsequently approved public activation; both production collection flags are now true. See `public-payments-launch-20261014.md`. The OFF-state evidence below records the earlier rollout phase.

Public collection remains OFF in both Supabase (`RAZORPAY_ENABLED=false`) and Cloudflare (`PAYMENT_EDGE_ENABLED=false`). No Git push, new Razorpay order, charge, capture or refund was performed.

## Deployed, backend before website

- Migration `private_project_portal`, remote version `20261014095800`, from local `20261013122054_private_project_portal.sql`.
- Edge Functions: razorpay-payments v13, razorpay-webhook v9, razorpay-reconcile v7.
- Worker: `85243fb4-e2da-4648-914e-6fec2a0a738a`.
- Owner saved `PROJECT_PORTAL_ENABLED=true` and `RAZORPAY_ENABLED=false` in the correct Supabase profile. Authenticated runtime probes confirmed public collection disabled. The CLI could not edit project secrets; no credentials were disclosed.
- Existing `_shared/razorpay.ts` was byte-identical to the prior deployed payment API at this release. Receipt presentation and hydration repairs are included.

## Evidence

| Check | Result / scope |
|---|---|
| Locked-dependency regression suite | 244 tests, 39 files pass; provider/auth/component networking mocks |
| Isolated actual PostgreSQL project migration/RPC checks | Pass; RLS, browser denial, invoker permissions, reservations, retries, amount locking, revocation, event replay/rollback, monotonic settlement and fair recovery |
| Production build / scoped lint / credential scan | Pass |
| Application typecheck | 61 existing unrelated errors; no new project/payment errors. Whole repository is not type-clean |
| Live schema | All three project tables RLS-enabled, browser privileges denied; six invoker RPCs service-only |
| Live anonymous / forged admin access | Rejected; invalid project capability rejected; public order creation 503 |
| Real signed-in owner admin | Overview alerts, paid records, project creation/edit/search/recheck and scheduler health load successfully |
| Real project capability | Saved title/Design/₹2 total/₹1 recorded advance/₹1 remaining; refresh and status check recover. Development update appears after refresh; no checkout offered even with balance approved while global flags off |
| Link replacement / disable | Old link rejected, replacement works; disabled replacement rejected |
| Real existing ₹1 receipt | Payment received / Test payment / paid / ₹1.00; refresh and separate-tab opening pass; no customer contact/payment IDs exposed. Print control visible; actual PDF export unverified |
| Browser console | Zero captured errors on owner admin, project and receipt during acceptance |
| Scheduler | 10:30:05 UTC (16:00:05 IST) completed, checked 16, errors 0; next expected 16:10 IST shown in UI |
| No financial test writes | Ledger remains 16: 7 paid, 9 pending; zero project balance orders |

One owner test project, **Owner portal acceptance check**, references the existing verified ₹1 order `order_TnMYE3Cse5wDPn`. Final state: On hold, private link disabled, balance approval disabled. It is a project acceptance record, not a synthetic payment. Existing acknowledgements and payment states were not edited.

New live balance checkout/capture, actual refund/dispute webhook delivery, recovery of a real balance and cross-device opening on a physical second device remain **UNVERIFIED**. Authenticated non-admin login was unavailable; denial is covered by mocks, SQL role checks and live anonymous/forged requests, not an actual non-admin browser session. Do not infer live banking guarantees from these tests.

## Click-by-click owner review (no payment needed)

1. Open https://sitenova.dev/admin and press **Sign in to workspace** after entering your usual credentials. Reason: all payment/project admin reads require the owner session.
2. On Overview, press **Review Payments** (or Manage → **Payments**). Reason: review confirmed payments separately from unresolved checkouts.
3. In Recent paid orders, on your latest ₹1 payment press **Get ₹1 test receipt**, then **Open receipt**. Reason: retrieve its durable summary without making another charge. Refresh the receipt; the paid status remains.
4. Scroll to **Client projects & remaining balances**. Enter `Owner portal acceptance` in **Search project titles**, then press **Search projects**. Reason: find the acceptance record. **Edit progress & price** shows its final disabled flags. Leave them disabled.
5. Expand **Automatic checks — scheduler health**. Reason: see last successful run and next expected run; manual checks do not reset cron health.
6. On a genuine customer project, use **Create client project** → select its verified advance → enter **Project title**, **Website progress**, **Agreed final total (₹)** and **Update visible to the customer** → **Save project**. Reason: record the agreed scope/total and progress. Only enable balance approval when payment is actually due.
7. Press **Get private link** and share it privately with that customer. Reason: the capability is the customer’s access; `/project` without its complete fragment does not identify a project. Anyone holding the link can view its minimal summary. **Replace private link** invalidates the previous link; clearing **Private link enabled** and saving revokes access.

Do not click **Test ₹1 payment** for these checks: that control intentionally opens a real-charge checkout with live keys. Public activation needs separate approval.

## Existing advisor findings

Post-deployment advisor confirms expected no-policy INFO notices on service-only project/payment tables, with browser privileges independently denied. Existing warnings remain: [mutable search path](https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable), [anonymous definer execution](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable) / [authenticated definer execution](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable) for the existing identity-scoped `is_site_admin()`, and [leaked password protection disabled](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection). No unrelated changes made.

Admin-adjustable package prices and separate advances are a subsequent LOCAL change, not part of the deployed versions above.
