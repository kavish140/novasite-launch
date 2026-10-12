# Admin payment deployment — 12 October 2026

Owner approved deploying backend and website, then pushing source, with public payments disabled. No agent-created order, payment, charge, capture, refund or dispute. No secret was printed or downloaded from Supabase.

## Production

- SiteNova Web: `bklmtwblsoitafynpikc`, active/healthy.
- Applied four migrations: payment_operations (20261012114507), payment_investigations (20261012114512), payment_dispute_acknowledgements (20261012114517), payment_dispute_sync (20261012114522). Local migration timestamps differ because MCP assigns production execution timestamps.
- Edge Functions: razorpay-payments v10, razorpay-webhook v8, razorpay-reconcile v6. Existing custom authentication and secrets preserved.
- Backend passed checks before website deployment. Worker: `15808942-a8fc-4e09-ba97-c4bc877252ed`, deployed with `--keep-vars`.
- Public payments remain disabled: live Edge config enabled=false; public order/retry/checkout reject requests, `/pay` shows coming soon, pricing has no payment links. No activation flag was changed.

## Evidence

- Full regression: **168 tests / 31 files pass**, original 133 retained. Source lint for the deployment fix passes. Prior unchanged website passed production build, four real-browser preview tests using mocked accounts, seven isolated PostgreSQL scripts and client secret scan.
- Live migration checks: all four tables have RLS; zero anon/authenticated/PUBLIC grants; six paid orders backfilled into operations metadata.
- First new reconciliation run failed after checking 13 orders because the live dispute API's empty collection omits items. Fixed only the new read-only dispute parser. It accepts an explicit empty terminal collection, honours has_more pagination, and rejects malformed/error/nonterminal empty responses. Three new regression tests pass. Checkout, verification and settlement code unchanged.
- Corrected live run `a9992639-e20b-49e5-a1ae-8df3ed0de3b2` completed **2026-10-12 11:50:18 UTC**, checked=13, errors=0. Six paid orders re-fetched and remained paid. GET dispute listing succeeded with no disputes. Cron is active every 10 minutes; failed initial run remains in audit history.
- Live website: new paid/investigation admin bundle served; existing monitoring bundle and public pages available; anonymous/forged admin calls denied; bad webhook signature denied; receipt page has no tracking scripts; invalid receipt token denied with 403. The latter also confirms a sufficiently long receipt signing secret is configured without reading its value.
- Security scan: no private identifiers in browser bundles and no locally stored secret values in review/client artifacts. Supabase-only values were not inspected.
- Supabase advisors show intentional no-policy information for service-only tables. Existing unrelated warnings remain: mutable cleanup-function search_path, admin-membership SECURITY DEFINER callable by browser roles, and disabled leaked-password protection. No new migration warning beyond intentional no-policy information. See [Supabase advisor guidance](https://supabase.com/docs/guides/database/database-linter).

## Unverified

Signed-in live admin list/acknowledgement clicks, a real signed receipt round trip, actual refund/dispute ingestion, orphan detection with a real unattached reservation, bank failures and high-volume scheduler completion. These have local tests/mocks or SQL checks, not live money tests. Full application typecheck still has 62 unrelated errors, zero payment errors in the prior review.

## Owner walkthrough

1. Open https://sitenova.dev/admin and sign in. Refresh the dashboard.
2. Overview should show previously paid orders needing acknowledgement; open Manage → Payments.
3. In Recent paid orders, compare the stored details against Razorpay. Toggle Acknowledged, return to Overview and refresh; that order should stop contributing to the paid alert. Toggle back to restore it if desired.
4. Review Needs investigation, unresolved orders and dispute warnings. Investigation entries have no manual paid/attachment action.
5. Check last successful reconciliation and next expected run. The new recovery adds paid orders to the run's checked count.
6. For an existing confirmed test session, use Check status to obtain its receipt link, then open the full link in a private window/another device. Verify only package, amount and status; no new payment is needed.

The original review diffs remain historical snapshots. Source pushed in this deployment also includes the narrow empty-dispute compatibility fix and its tests.
