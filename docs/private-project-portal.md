# Private project portal — local implementation, 13 October 2026

## What the owner can do

Admin → Payments → Client projects & remaining balances:

1. Create a client project from a recorded paid/refunded advance. A booking or quote alone cannot establish a paid advance.
2. Set its title, agreed final total in rupees, current stage and a plain-text customer update. Blank total means the price is still being agreed.
3. Enable the private link and, when due, approve balance checkout. Global public collection switches still override this approval.
4. Get the private link and share it manually with that customer. No email is sent automatically. Replace the link to revoke the previous capability, or disable access completely.
5. Re-check a balance with Razorpay, review its latest 30 order-labelled check-history entries and acknowledge each specific verified paid/refunded balance attempt. No action can mark a payment paid manually.

Projects are searchable by title and paginated in groups of 25. The advance selector starts with the latest 50 records and provides Load older verified advances. Existing projects can be edited without reselecting their original advance.

## What the customer sees

The owner-shared URL is `https://sitenova.dev/project#<signed capability>`.
The fragment is sent only to the same-origin POST gateway, not in the page URL request or query string. The page is noindex/no-store/no-referrer and suppresses tracking, replay and promotions. No public name/email search or navigation button is added.

The page shows project title, owner-set progress/update, agreed total, recorded advance and balance payments less refunds, remaining balance, and a manual Check payment status control. It refreshes the saved summary every 60 seconds. Anyone holding the complete link can see that summary; it is a capability, not email-verified identity. No customer contact details are projected.

Pay remaining balance appears only after owner release and both global collection switches permit it. Checkout is opened only by an explicit click, with fixed server-priced paise and INR. Browser callback success requires HMAC verification plus actual captured provider state and durable database settlement. A dismissed, unattempted checkout can resume the same order. After Check payment status freshly confirms a known hard decline (such as an incorrect PIN or insufficient funds), Retry remaining balance payment may reserve one successor. Provider-explicit expiry with zero attempts also qualifies; browser age, timeouts, unknown failures and authorization never do. Every earlier order is freshly checked again before new checkout, and all attempts remain recorded. At most ten orders per project are supported; further attempts require owner investigation. No instalments are provided.

## Isolation and recovery

- The existing package/test checkout, verification and settlement bodies are unchanged. Balance collection has separate `client_projects`, `project_balance_payments` and `project_payment_history` tables and invoker-only service RPCs.
- A project references one verified advance. Total cannot be below that advance. Remaining checkout is final total minus advance, with one active reservation per project and at most one successor per confirmed declined attempt; browser totals are rejected. A total is locked after reservation, including if provider creation is uncertain.
- Creation explicitly rejects an advance that already has a project. Edits must include the existing project ID and its saved update timestamp; stale edits are rejected rather than overwriting newer progress/price/approval. Business conflicts return safe, actionable errors.
- Reservation checks the signed link's current share UUID and the expected approved total. A final database authorization checks the exact reservation ID, link revocation, balance release, key, amount, age, review flag and ledger state after provider reads, immediately before returning checkout options. It cannot cancel options already issued earlier.
- Advance capture is freshly re-fetched before opening balance checkout. A refunded advance blocks collection. Uncertain POST/attachment never authorizes a second provider order.
- Order ID, stored API key, order note/reference, payment relationship, amount in paise and INR must match. Authorization without capture remains unresolved. Paid cannot regress to pending/failed; refund amount is monotonic. Conflicting or multiple provider settlements require review.
- The additive, flag-gated webhook branch authenticates the raw body before project access, uses provider GETs and shares `payment_webhook_events` event-ID uniqueness. Existing advance events continue through the existing handler. Refunded/disputed records do not change website progress.
- Dispute event names always bypass balance settlement routing and reach the existing record-only dispute handler. Provider results contradicting an already recorded settlement, or claiming more payment pages remain, fail visibly instead of being treated as a healthy pending check.
- The existing ten-minute scheduler adds GET-only checks for attached pending/uncertain balances older than 15 minutes, failed/expired attempts created within 30 days, and paid/refunded balances confirmed within 30 days. Failures are logged per project and fail the overall run. No scheduler order creation, capture, refund or fulfilment is added.
- Balance batches use the database clock and oldest-check-first ordering. Rows checked in the current run are excluded from subsequent batches, so earlier UUIDs cannot repeatedly displace later rows. Provider reads respect the remaining run/request time budget. The existing shared 110-second run budget can still be exhausted; that fails the run visibly and requires monitoring/re-checking, rather than guaranteeing every balance finishes within one run.
- Overview/Payments badge adds project review counts for reserved/uncertain/refunded, overdue pending and unacknowledged paid balances. Acknowledgement changes only the selected payment's timestamp. Verification failures have a separate review flag so paid/refunded settlement protection cannot hide an error; a successful verified check clears that flag. A captured retired predecessor remains a review alert even after acknowledgement; manual investigation is required before any more collection. Unattached reservations stay blocked and visible for owner investigation; no automatic reattachment/reset is offered.
- Disabling collection prevents new checkout authorization, not completion of an already issued Razorpay checkout. Existing verification/webhooks/recovery remain available.

## Deployment — NOT performed

After approval, deploy backend before website:

1. Apply `supabase/migrations/20261013122054_private_project_portal.sql`.
2. Deploy updated `razorpay-payments`, `razorpay-webhook` and `razorpay-reconcile`.
3. Set Supabase `PROJECT_PORTAL_ENABLED=true` only after all three functions and schema are ready. Existing `PAYMENT_RECEIPT_SECRET` signs project links with a separate HMAC domain; optional previous receipt key is supported. No new signing secret is required.
4. Keep Supabase `RAZORPAY_ENABLED=false` and Worker `PAYMENT_EDGE_ENABLED=false`. The portal can read statuses without collecting payments.
5. Deploy the website, then verify signed-in project controls and a real private-link read. Activate payment collection only with separate owner approval.

Local UI plus deployed old backend will report that the portal is unavailable: the new schema/API is deliberately not provisioned remotely. To exercise real local endpoints, use a local Supabase database/functions with this migration and the portal flag. Use Test Mode keys for local checkout; the live-key origin lock remains enforced. The automated tests use fakes and an isolated PostgreSQL database, with no real orders or charges.

## Verification boundaries

Provider/auth/network operations in unit/component tests are mocked. PostgreSQL checks execute the actual migration/RPCs in isolated PGlite. Live balance payment, authenticated production portal, live new webhook/cron branches and real PDF rendering remain unverified. Subsequent owner-authorized local browser checks verified synthetic desktop/mobile UI states and the actual preview's disabled-payment/admin guards. The final React 19 production preview has clean project/quote startup and working interactions in both tested browsers; see the audit report. Production startup and authenticated new-flow checks still require approved deployment. Existing receipt redesign remains local too.

Bug-hunt evidence and remaining operational limits: `docs/private-project-audit.md`.

API references reviewed: [Razorpay order creation](https://razorpay.com/docs/api/orders/create/), [order payments](https://razorpay.com/docs/api/orders/fetch-payments/), [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security). Migration was generated by the Supabase CLI, not applied remotely.
