# Razorpay backend on Supabase Edge Functions

Payment processing now runs in Supabase Edge Functions. Cloudflare serves the website and forwards same-origin payment requests using a server-only gateway credential. Cloudflare has no Razorpay payment secrets or payment-verification logic. On 11 October 2026 the owner completed the admin-only ₹1 live checkout on sitenova.dev using Paytm. Read-only verification confirmed Razorpay capture and a paid Supabase ledger record. Public package checkout remains disabled. Earlier preparation and validation notes below are historical; the latest production verification is recorded below.

## Deployed backend

- Payment API: https://bklmtwblsoitafynpikc.supabase.co/functions/v1/razorpay-payments (authenticated server calls to /config, /order, /checkout, /verify, /status).
- Razorpay webhook: https://bklmtwblsoitafynpikc.supabase.co/functions/v1/razorpay-webhook
- Both functions initially deployed on 10 October 2026. Current versions: razorpay-payments 4 and razorpay-webhook 4, ACTIVE, including the 11 October admin test flow, payment-attempt safeguards and independent webhook reception. Website deployment is recorded below; no Git push was performed.
- Applied payment ledger and rate-limit migrations: 20261010170200_razorpay_backend_payments.sql and 20261010173513_payment_edge_rate_limits.sql. Both tables use RLS and have no browser grants; settlement/rate-limit RPCs are service-only SECURITY INVOKER with an empty search_path.

## Secret locations

Enter Razorpay TEST MODE values in ignored supabase/functions/.env:

RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_TEST_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET=YOUR_INDEPENDENT_RANDOM_SECRET
RAZORPAY_ENABLED=false
PAYMENT_GATEWAY_SECRET=ALREADY_GENERATED_DO_NOT_CHANGE_ONE_SIDE_ONLY

A matching random gateway credential was generated in that file and the ignored .dev.vars file without displaying its value. Existing local Razorpay assignments, if any, were moved into the Edge secret file. Both activation flags remain false. Do not put secret values into chat, VITE_ variables, browser code or Git.

For local website requests to the remote Supabase backend, upload the Edge secret file using Supabase's dashboard Edge Functions Secrets or the CLI secrets command after validating every key is Test Mode. Change RAZORPAY_ENABLED to true only for the controlled Test Mode run. Supabase supplies SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to deployed functions automatically; do not upload replacements for those built-in variables.

The local website reads these from .dev.vars:

SUPABASE_URL=https://bklmtwblsoitafynpikc.supabase.co
PAYMENT_GATEWAY_SECRET=THE_MATCHING_GENERATED_VALUE
PAYMENT_EDGE_ENABLED=false

Set PAYMENT_EDGE_ENABLED=true only when the remote Test Mode backend is configured and ready. Preserve other existing Worker variables used by quotes/booking. Local secrets do not update production Worker secrets or Supabase secrets automatically.

For fully local Edge development, use supabase functions serve with the Edge environment file and configure a local backend deliberately; the website gateway currently permits only HTTPS supabase.co backends. The supported current test flow is the local website forwarding to the deployed Supabase backend.

## Webhook configuration

In Razorpay Test Mode add the webhook URL above, use exactly the RAZORPAY_WEBHOOK_SECRET value from the Edge file, and subscribe to payment.captured, payment.failed, refund.created and refund.processed. The secret is independently chosen, not your API key secret. This URL is publicly reachable; there is no localhost webhook or tunnel requirement.

The owner has instead configured live API keys, saved Edge secrets and enabled the live dashboard webhook with four events. Keep RAZORPAY_ENABLED=false and PAYMENT_EDGE_ENABLED=false until checkout testing is explicitly authorized. Webhook signature verification and reconciliation remain active independently of checkout activation, so disabling checkout does not prevent updates for existing payments. Live keys create real purchases; a payment-link test does not verify this site's checkout.

Platform JWT verification is disabled deliberately on these functions because they implement custom authentication: gateway requests require the independent server-only secret, while webhook requests require Razorpay raw-body HMAC verification. There is no permissive browser CORS access. Payment configuration is available only to the authenticated website gateway. Gateway origin checks allow sitenova.dev and local HTTP development origins. The backend hashes the gateway-supplied client IP before storing rate buckets and atomically limits creation/check requests to 30/minute separately.

## Financial behavior and tests

### Admin ₹1 integration test

In the local admin dashboard, click **Test ₹1 payment** in the header. It opens Razorpay for service **Test** using a server-created 100-paise INR order. With the current live keys this charges a real ₹1 when you complete checkout. Package payments remain disabled; you do not need to change either public activation flag for this admin test. Existing .dev.vars gateway settings are sufficient for local requests to deployed Supabase.

Every test API request verifies the Supabase access token and site_admins membership. The backend owns the name and amount, binds the saved order to the verified admin, and uses the normal verification/webhook ledger flow. Migration 20261011064503_admin_test_payment.sql permits only marked test=100 rows; browser access remains denied. No extra secrets are required.

Closing checkout preserves the order. Retry resumes it; **Check status** checks the saved session without another charge. A completed/refunded test allows another explicit button click to create a new test. An uncertain reservation cannot be automatically replaced: reconcile it in Razorpay before clearing browser storage. Actual ₹1 payment/capture/webhook/refund testing remains for the owner; the agent's checks create no order or charge.

Validation added: verified admin authorization/non-admin denial, fixed amount and override rejection, cross-channel/owner isolation, test capture and webhook settlement, double-click prevention, cancellation/retry reuse and refresh status recovery. Direct deployed probes reject missing/forged admin tokens, keep public checkout disabled and accept harmless signed webhook payloads.

Final local validation: 67 tests pass across the existing suite and scoped follow-up tests, isolated PostgreSQL checks pass, scoped ESLint and production build pass. Application typecheck retains 62 existing diagnostics and none in changed payment files. Live metadata confirms browser ledger and settlement denial. Website code remains unpushed/undeployed.

Local runtime follow-up: Cloudflare does not implement fetch redirect="error". The gateway uses redirect="manual" and rejects 3xx responses before parsing them, preserving credential isolation. All 8 gateway tests pass, including redirect rejection, and an actual Worker-runtime probe reaches Supabase and gets 401 for an invalid admin token. Keep RAZORPAY_ENABLED=false for the admin ₹1 test; changing the public activation flag does not resolve gateway connection failures.

The corrected production build is running locally at http://127.0.0.1:8788/admin. Final live-preview checks: admin page 200, backend authentication 401 for a harmless invalid token. Refresh the admin page and retry the existing saved test request. No payment was created during these diagnostics or website code pushed.

11 October production update: owner approved deployment to the registered website after Razorpay blocked live checkout from localhost. The admin test is now at https://sitenova.dev/admin (Worker version 004ab7de-308b-448b-99cb-a6729fd2aa9e). Production has the matching gateway credential and PAYMENT_EDGE_ENABLED=false; public order requests return 503 and pricing advance links remain hidden. Admin requests independently verify Supabase identity and site_admins membership. No Git push performed.

The owner's earlier local GPay debit still requires reconciliation: its screenshots show a completed bank transfer, while the checked Razorpay account exposed only the local order's failed website-mismatch attempt and no corresponding successful payment/reference. Do not mark that order paid manually or promise a refund. The owner subsequently authorized and completed a separate ₹1 production test. No refund or capture was initiated by the agent.

11 October successful production test: order `order_TmWaNOWkXh9a80`, payment `pay_TmWfLfOqrwu9EN`. Razorpay's read-only payment API confirms 100 paise INR, status captured, captured=true and refunded amount zero. Supabase payment_intents records the same order/payment as paid, amount=100, verified_at=2026-10-11 07:55:21.050932+00. The owner saw “₹1 Test payment verified” after Paytm checkout. This validates the live checkout and durable backend settlement; it does not independently establish webhook delivery because callback verification can settle the same ledger. Independent webhook recovery and live refund testing remain pending. Public package payments remain disabled; no Git push or further payment was initiated for this verification.

11 October payment-attempt safeguards: live-key order creation and checkout authorization now require https://sitenova.dev on the Edge backend. Local/preview live checkout is rejected before provider or ledger access; local development requires Test Mode keys. Status and signed callback verification remain available for existing sessions even when public checkout flags are off. Checkout authorization is withheld for any provider payment attempt, including failed/created/unknown states, any non-created order, or a paid/refunded ledger record. Such orders require reconciliation before another payment; they are never automatically replaced. Both checkout UIs disable Razorpay's built-in retries and tell users to check status/reconcile debits instead of immediately retrying. This intentionally also blocks legitimate failed attempts until owner reconciliation. An unopened, unattempted order can still resume after cancellation. These controls reduce repeat-payment risk but cannot prevent issuer debits or delayed provider status. See [Razorpay late authorisations](https://razorpay.com/docs/payments/payments/late-authorisation/).

Safeguards deployed: razorpay-payments v4 and website Worker 7213eb54-4989-4763-ac6d-895454d3ae41. All 48 payment tests, scoped lint and production build pass. Live harmless probes confirm local live checkout blocked, public purchases disabled and invalid recovery sessions denied. Existing secrets preserved; no database migration, Git push or agent-initiated payment/refund.

Starter advance is ₹5,000 (50% of ₹10,000 starting price); Business is ₹7,500 (50% of ₹15,000); custom packages require a quote. Amounts are owned by the Edge backend. Advances count toward the final agreed invoice; scope, balance and delivery are agreed separately. Legal/digital delivery pages are prepared locally and await website deployment.

Reserve-before-create order handling blocks duplicate/concurrent requests and requires manual reconciliation of uncertain provider responses. A reservation with no attached provider order is never automatically replaced. Use its receipt/request UUID to reconcile in Razorpay and the database. Project deduplication intentionally remains across tabs and after payment; a second project with identical details requires owner intervention.

Callback signatures, provider order/payment relationships, INR amount and capture state are verified on Supabase. Success requires durable settlement. Signed sessions support refresh recovery. Authorized/paid orders cannot reopen; unpaid checkout authorization lasts 24 hours. Refund/webhook updates fetch current provider state and make idempotent monotonic database writes. There is no automatic invoicing/email/fulfilment; manage refunds in Razorpay. The admin Payments tab provides provider re-checks and reconciliation history.

Validation: 55 unit/UI tests, isolated PostgreSQL migration/access/deduplication/refund/rate-limit tests, scoped ESLint and production build pass. Live unauthenticated deployed calls return 503 while unconfigured. Actual Test Mode checkout, callback loss/webhook recovery, cancellation, pending capture and partial/full refunds remain to be tested after secret configuration. Test records in the real backend carry an rzp_test_ key_id and must never be treated as live purchases.

11 October verification: all 29 backend/gateway tests and scoped ESLint pass, including signed settlement and forged-event rejection while checkout is disabled. Deployed webhook probes return 200 for a correctly signed harmless payload and 403 for unsigned or altered payloads. Authenticated gateway configuration returns enabled=false and testMode=false, confirming the matching gateway credential and disabled live checkout. No order, charge or payment record was created by these probes. Actual Razorpay-generated event delivery and a complete custom checkout remain unverified.

The ads-inquiry access exposure was separately fixed and verified in production. Existing unrelated security-advisor findings are documented in AGENTS.md. RLS-with-no-policies information for server-only payment tables is intentional: browser roles are denied rather than granted policies.

References: [Supabase function authentication](https://supabase.com/docs/guides/functions/auth-headers), [Razorpay webhook signatures](https://razorpay.com/docs/webhooks/validate-test/), [Razorpay Standard Checkout](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/).

## Current reconciliation and admin controls — 11 October 2026

Public package checkout remains disabled in both Cloudflare and Supabase. The existing verified admin ₹1 callback flow is preserved. No additional keys or webhook subscriptions are required for these changes.

- Webhook IDs are stored in `public.payment_webhook_events.event_id`, protected by `payment_webhook_events_event_id_key UNIQUE(event_id)`. The event marker and settlement are committed together; duplicate insert conflicts return HTTP 200 as already processed. Failed transactions leave the event retryable.
- `sitenova-payment-reconciliation` runs via pg_cron every 10 minutes. It sends a Vault-generated credential to `razorpay-reconcile`, which checks pending orders older than 15 minutes using provider GETs only. It never creates orders, payments, captures, refunds or fulfillment. Matching order, package, key, INR and paise amount are mandatory; paid/refunded states are monotonic.
- Server-only `payment_reconciliation_runs` and `payment_reconciliation_log` store runs, per-order old/new states, sanitized errors and flags. Failed/abandoned runs and unresolved orders older than 24 hours are flagged. Alerts are visible in the admin Payments tab; no email alert delivery is configured.
- **Admin dashboard → Manage → Payments** lists pending orders and recent confirmed failures. **History** shows previous checks; **Re-check with Razorpay** fetches the actual provider state. There is no manual mark-paid control. Missing, forged, anonymous and non-admin identities are rejected by the backend on every request.
- Public **Check eligibility for a fresh checkout**, once public payments are deliberately enabled, requires a signed previous session and fresh Razorpay fetch. Explicit PIN/OTP/CVV/card-detail/insufficient-funds declines can permit one successor; technical/unknown failures, business mismatches and authorization remain blocked for reconciliation. Browser failure events and browser age never establish failure or expiry. The prior checkout is retired, concurrent requests cannot reserve two successors, and previous attempts are checked again before opening the replacement checkout.
- A reservation without an attached provider order remains a flagged manual case. Use its request UUID/receipt in Razorpay to investigate; the system never automatically replaces it or trusts a screenshot as payment evidence. Refunds and bank debit discrepancies are resolved in Razorpay/bank support. The earlier GPay mismatch remains unresolved; the later Paytm capture remains paid.

Applied migrations: `20261011085842_payment_webhook_events.sql`, `20261011090250_payment_reconciliation.sql`, `20261011090645_payment_reconciliation_schedule.sql`, `20261011091631_payment_confirmed_retry.sql`, `20261011092645_payment_queue_alerts.sql`. Deployed functions: payments v6, webhook v5, reconciliation v2. Website Worker: `c0fd2b62-ddd7-4980-ba1b-12b5b11cf6f2`.

Validation: 100 unit/UI/backend tests, isolated PostgreSQL event/reconciliation/scheduler/retry checks, production build and scoped lint pass. Type checking retains 62 unrelated baseline errors. Live disabled-public and unauthorized-admin probes pass; automatic scheduled reconciliation and production queue/history SQL checks pass. Authenticated live queue clicks have not been checked because no signed-in browser session was available. Review changes in `docs/payment-reliability.diff`. No Git push or agent-initiated financial transaction occurred.
