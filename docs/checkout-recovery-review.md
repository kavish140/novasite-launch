# Checkout recovery — local review, 14 October 2026

**Release update:** Subsequently deployed after owner approval; live original-order recovery and tab closure verified. See `release-20261014.md` for current versions and limits. The local-only statements below describe preparation.

## Confirmed live cause

A read-only inspection found the affected Business booking already has a ₹7,500 Razorpay order. At inspection, Razorpay returned zero payment attempts. Closing the tab loses the old session-only request UUID; submitting again uses another UUID, collides with the existing booking reservation and currently returns a misleading 503. Supabase logs show corresponding unique-constraint violations. No provider order or charge was created by this investigation.

Retrieved payment API metadata reports version 17, with the previously reviewed static-price source. This recovery update and the pending editable-pricing/landing updates are NOT deployed. Public activation flags were not changed.

## Local behavior

- Save the original opaque request UUID before creating an order and save the minimal signed session in both tab storage and persistent browser storage. No contact or project details are stored there.
- Returning in the same browser restores the original order and checks its status. Continue checkout uses the unchanged fresh provider authorization checks. Paid/refunded orders show their verified outcome; attempts, uncertain states, retired orders and the original 24-hour checkout limit retain their protections.
- Reuse the original UUID if the tab closes before the order response arrives. Exact original payload matching is still required. Contact details alone cannot retrieve a token or authorize someone else's checkout.
- For recovery data already lost, an authenticated admin can choose **Get recovery link** in Payments. The backend verifies the original pending order with Razorpay GET requests, refuses attempted/paid/refunded/expired/retired/uncertain orders and signs a private fragment link to the original order. It never creates another order or extends checkout expiry. Share this link only with the matching customer after checking their identity. The fragment is consumed after saving so refreshing a confirmed successor uses the current session.
- Reservation conflicts now return an actionable 409. Database/provider outages still fail closed; the customer must not pay again while debit status is uncertain.

Cleared storage, another browser/device and older bookings cannot automatically recover by email. Those require the private admin link if eligible. Orders older than 24 hours require owner investigation; this pass does not invent expiry or relax the existing retry policy. Reusing one provider order reduces duplicate-payment risk but is not a promise against temporary bank debits or provider delays.

## Evidence and limitations

- Full local suite: **332 tests / 48 files pass**, retaining all previous 300 tests. Provider/database responses are mocked in unit/component tests.
- An isolated copy of retrieved live source with only recovery changes passes **16 scenarios**: same UUID, changed details, insert/lookup outages, unattached order, captured/refunded/authorized/created/failed attempts, provider failure, amount/currency mismatch, paid ledger, retired order and old session. All calls are mocked; assertions prohibit provider POSTs/new orders and ledger overrides.
- Actual browser close/new-tab/reopen/simulated-success/close/new-tab tests pass with the production recovery client and an isolated fake provider. Only one simulated order API call occurs. Verified-paid return has no Pay/Continue control. Browser console error count: zero for the inspected fixture tab.
- Production client/SSR build and scoped lint pass. Typecheck retains **61 pre-existing errors**, with no new recovery/payment diagnostics. Credential scan passes without displaying values.
- No live deployment or live recovery-link check has been performed. Production recovery remains **unverified** until an approved backend-first release and read-only post-release checks. No real payment, capture or refund was initiated.

## Review and release

`checkout-conflict-hotfix.diff` compares the narrow additive backend changes with retrieved live source. `checkout-recovery.diff` shows browser/admin recovery source and tests; overlapping Pay, gateway and Payments files also include previously pending changes relative to Git, explicitly labelled in its header. The pricing review remains `admin-package-pricing-review.md`.

A full website release from current local source requires the pending pricing migration and matching Edge Functions first. The isolated static-price backend artifact alone must not accompany the full editable-pricing website. Deploy nothing or push nothing before the owner approves the precise release scope. Preserve existing activation flags. Fixtures under ignored `test-results/` are never shipped.

Local safe demonstration: http://127.0.0.1:8792/pay?package=business. **Continue checkout** opens a fake provider; closing the whole tab and returning restores the same fake order. **Simulate successful payment** records only the fixture's browser state. These controls cannot contact live APIs or collect money.
