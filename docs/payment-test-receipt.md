# Receipts for previous ₹1 test payments

Open https://sitenova.dev/admin/dashboard, refresh, then Manage → Payments → Recent paid orders. On the confirmed ₹1 test payment click **Get ₹1 test receipt**, then **Open receipt**. Save/copy the full receipt link to view it after refresh or on another device. No new payment is needed.

The new admin-only order-receipt action accepts a stored request UUID, checks the ledger's test package, 100-paise amount and paid/refunded state, then signs the existing receipt identity with the configured receipt secret. It requires fresh Auth validation and site_admins membership. It cannot create orders, charge, capture, refund, reconcile, alter settlement or mark paid. Public checkout flags are unchanged and disabled.

Verification: 173 unit/integration tests and five production-preview browser tests pass; provider/auth/data in these tests are mocked. Browser test retrieves a past test receipt without the original checkout session and reads paid after refresh, with no order/checkout/verify/recheck call. Tests deny unknown/unpaid/other-package/wrong-amount rows, browser state overrides, missing signing configuration and unauthorized users. Scoped lint, production client/SSR build, secret scan and change whitespace checks pass. Application typecheck has zero payment errors and 62 unrelated errors.

Deployment: payment API v11 first, then website Worker 59ed3dff-9a04-43d2-bee7-c92277f70cd0 with --keep-vars. Live checks confirm the new UI bundle, denied missing/forged admin requests and disabled public checkout. No schema/webhook/reconciler update or new charge. Real signed-in receipt generation/round trip is **unverified** by the agent; use the steps above for that check. Diff: payment-test-receipt.diff.
