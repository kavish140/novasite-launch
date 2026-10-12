# Payment list clarity — 12 October 2026

The live read-only audit found 13 stored ₹1 test checkout orders: six paid, seven unpaid/unconfirmed. The 21:20 IST timestamp in the screenshot was a cron status check, not order creation or payment time. Repeated warning log rows referred to the same orders. Automated tests use mocks; they do not insert these live rows.

Changes:
- Confirmed paid/refunded orders appear first, with order/payment IDs. Recorded confirmation is when SiteNova saved the status; it is not presented as the bank's capture time.
- Unpaid/unconfirmed checkouts appear once per reservation, with separate order-created and last-status-check times. Requested amount is not evidence that money was debited.
- The main list no longer renders repeated flagged audit rows. Every check remains available in per-order history, labelled automatic/admin/retry where the stored run identifies it. Unknown or unmatched sources remain generic.
- Scheduler health is expandable. Dates use unambiguous 24-hour IST. The sidebar badge and Overview banner identify review flags, not payment counts; flags may overlap.
- Backend changes are read-only projections/enrichment for the existing admin queue/history/paid actions. No migrations, ledger corrections, deletions, checkout, settlement, scheduler or webhook changes.

Validation: all 179 unit/component tests and all six production-preview browser tests pass. Browser/provider/Auth/data are mocked. Added tests cover latest-check source attribution, missing/stale sources, bounded embedded log query, history source, duplicate warnings/orders, IST creation versus automatic check time, mobile overflow and retained receipt/access/public-disable behaviour. Scoped ESLint, production build, client secret scan and whitespace check pass. Application typecheck: zero payment diagnostics; 62 pre-existing unrelated diagnostics remain.

Live evidence: database foreign keys confirm the log→order and log→run relationships. Payment API v12 deployed before website; missing/forged admin requests denied and public order/retry/checkout disabled. Real authenticated admin reads and clicks remain UNVERIFIED by the agent: the local service credential returned 401. Refresh the live dashboard and open Manage → Payments to verify them with your admin session. No charges or secrets printed.

Review diff: payment-clarity.diff; new display helper and its tests: app/lib/payment-display.ts and app/lib/payment-display.test.ts.

Website deployed as Worker 43deeacf-1a99-4bc6-9dbf-8b2c7bc959f3 with --keep-vars. Live bundle label/duplicate-list absence, admin/public pages, pricing-link suppression, direct public-disable, missing/forged Auth denial and bad webhook signature checks pass. Signed-in real admin data reads remain unverified.
