# Payment monitoring — deployed implementation, 11 October 2026

The owner subsequently authorized deployment. The additive dispute migration, payment API v7, webhook v6 and website Worker 9854dd6c-b230-4150-a755-49f6164240e9 are now deployed. No Git push, charge, capture or refund was performed. Credentials and activation flags were preserved. Public package checkout remains disabled, confirmed by read-only live probes.

## Verified now

- All 129 Vitest tests pass, including all 100 original tests. New tests cover each alert condition and clearing, historical failure warning clearing, the strict >30-minute cron threshold, periodic refresh, logout/in-flight response isolation, membership revocation, non-admin fetch denial, scheduled timestamps, open-dispute queue details, duplicate dispute IDs, unknown payments/events and bad signatures.
- Isolated PostgreSQL dispute migration tests pass: shared event-ID uniqueness across dispute/settlement, unknown-payment storage, browser-role denial and unchanged paid/payment/refund ledger values.
- Scoped payment lint and production client/SSR build pass. The temporary Windows build workaround was restored; Vite configuration is unchanged.
- Application typecheck: zero payment errors; 62 unrelated existing diagnostics remain. No unrelated error files were edited.
- Read-only deployment checks: payment API v7, webhook v6 and reconciler v2 are ACTIVE. Job `sitenova-payment-reconciliation` is active with `*/10 * * * *`. The latest checked run completed at 11 October 2026 15:50:02.738 IST, checked=1/errors=0. One current needs-reconciliation order remains flagged; no paid state was changed by deployment.

## Deployed versus local

| Item | Deployed now | Local-only items |
|---|---|---|
| Ledger and security | payment_intents, browser denial/RLS, fixed paise amounts, safe settlement | Unchanged |
| Event IDs | payment_webhook_events with UNIQUE(event_id), atomic settlement event completion, event_type/dispute metadata and record-only dispute RPC | None awaiting deployment |
| Reconciliation | run/log tables, watchdog/flags, ten-minute scheduled GET reconciliation, read-only admin health projection | Test/diff artifacts |
| Retry/admin queue | confirmed retry reservation, admin queue/history/recheck, banner/badge, open disputes/deadlines and cron health panel | None awaiting deployment |
| Edge Functions | razorpay-payments v7; razorpay-webhook v6; razorpay-reconcile v2 | Source remains unpushed to Git |
| Website | Worker 9854dd6c-b230-4150-a755-49f6164240e9 serves the new monitoring UI; public payment links remain hidden | Source/tests/docs remain unpushed to Git |

Previously applied payment migrations: razorpay_backend_payments, payment_edge_rate_limits, admin_test_payment, payment_webhook_events, payment_reconciliation, payment_reconciliation_schedule, payment_confirmed_retry and payment_queue_alerts. The ads-inquiries security migration was also applied previously. **20261011100002_payment_dispute_audit.sql is now applied to production.** Live event columns include event_type/dispute; uniqueness, RLS and browser-role denial were verified.

Backend and website deployments are complete. Both public activation flags remain false. No new HTTP endpoint, service, email or scheduler was introduced. Live checks confirm pricing hides payment links, /pay?package=starter shows coming-soon, public order/retry/checkout are disabled, the deployed admin bundle contains monitoring UI, unauthenticated summary access returns 401 and a bad dispute signature returns 403. No signed synthetic dispute was sent.

## Click-by-click check after those deployments

1. Open https://sitenova.dev/admin and sign in with the existing owner admin account.
2. On the initial **Overview** screen, look above the overview cards for **Payments need attention**. An existing needs-reconciliation order should trigger it. The Payments menu badge counts alert items/conditions; an overdue order also needing reconciliation contributes to both.
3. Click **Review Payments** in the banner, or **Manage → Payments** in the sidebar.
4. Read **Last successful reconciliation run** and **Next expected run** in the scheduler panel. Times are IST. The next time is an expectation based on the ten-minute schedule, not proof of future execution. Admin re-checks do not update the scheduled-run time.
5. Click **Refresh payments**. The banner, badge and health panel should refresh. Leave the page open: monitoring refreshes every 60 seconds and refreshes again when the window gains focus.
6. Allow the next scheduled run to finish, then refresh. The last successful time should advance. If no scheduled run completes for more than 30 minutes, the main Overview banner should warn that the scheduler may be stopped. Do not disable the production cron just to manufacture this condition; stale/failure scenarios are covered by isolated tests.
7. Select an existing pending order and click **Re-check with Razorpay**, then **History**. This fetches provider state and uses existing safe reconciliation. An uncertain order remains flagged; it clears only when its actual underlying state resolves. There is no manual paid button. Do not create a payment for this check.
8. For an actual signed dispute event, check **Open disputes** in Payments and each dispute/deadline in the Overview banner. Unknown payments show the supplied payment reference and an unknown/not-supplied order. Respond through Razorpay's dashboard. Won/lost/closed statuses remove the open-dispute warning; the audit remains. Do not create a real dispute to test the UI; synthetic dispute events are covered locally.
9. Sign out. In a private window open /admin/dashboard: it should redirect to login and show no payment alerts. A signed-in non-admin's payment data access is denied; this was tested locally. A live signed-in non-admin check is unverified.
10. Open /pricing and confirm public package advance links remain absent. Do not click the admin ₹1 test button during these monitoring checks.

## Razorpay webhook event selections

Keep the existing payment/refund subscriptions. Add all six dispute events:

- payment.dispute.created
- payment.dispute.action_required
- payment.dispute.under_review
- payment.dispute.won
- payment.dispute.lost
- payment.dispute.closed

Razorpay Dashboard → Accounts & Settings → Webhooks → open the existing Supabase webhook → Edit → search each exact event name → tick it → Save. Some accounts group this under Developers → Webhooks. Do not change the URL or signing secret.

Source: https://razorpay.com/docs/webhooks/disputes/ — official event list and payloads. Status, amount/currency, payment/order, respond_by and event creation time are stored from the signed payload. Raw payloads, evidence, payment customer details and secrets are not stored or logged. Dispute handling never writes to payment_intents or calls settlement/provider mutations.

## Explicitly unverified

- New UI clicks in an authenticated production browser: unverified. The monitoring bundle is deployed and served, but no signed-in browser session was used for these checks.
- Real Razorpay dispute webhook delivery/account event subscriptions and live dispute resolution: no real dispute was created or received for testing.
- Backfill of disputes predating the new recorder: not provided; existing historical event markers do not contain dispute payloads. Review existing Razorpay disputes separately.
- Provider-independent discovery of missed dispute events: this recorder relies on signed webhook delivery; the unchanged cron reconciles payment state, not disputes.
- Refund warnings clear only if the actual current ledger no longer records a refund. A real partial/full refund remains visible; dismissing it locally does not erase financial history.

Preparation source diffs: payment-alerts-step-1.diff, payment-alerts-step-2.diff and payment-alerts-step-all.diff. Runtime code/migration are deployed; source changes remain unpushed to Git.
