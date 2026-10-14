# Private project launch readiness — 13 October 2026

**Superseded:** Rollout/acceptance completed on 14 October; see `private-project-deployment-20261014.md`. Owner then approved public activation, verified by 16:25 IST; see `public-payments-launch-20261014.md`. This checklist below is historical.

All changes are local. Public payment collection remains disabled. This checklist is not authorization to deploy or collect payments.

## Local release evidence

- 244 regression tests across 39 files pass. Existing suites remain present.
- Actual migration/RPC checks run in isolated PGlite: browser permission denial, invoker-only privileges, fixed paise, one active reservation, one retry successor, retained predecessors, stale edits, revocation, event replay/rollback, monotonic paid/refunded states, late-capture fencing, exact-order authorization, paid-review flag set/clear, indexed query paths, restricted delete permissions and fair recovery batches pass.
- Provider responses, auth and component networking are mocked; no real Razorpay order/charge was created.
- New payment/project code has no type diagnostics; 61 unrelated existing TypeScript errors remain. The entire repository type-check is not clean.
- Owner-authorized checks of the final production build in Chrome and the in-app browser verify clean /project and /quote startup, interactive quote steps and zero error/warning entries. Disabled-payment messaging and anonymous admin redirection remain verified locally. The prior hydration blocker is repaired; live new-flow verification is still outstanding. Existing advance/test flow bodies and production configuration are unchanged. See the final hydration section in the audit report.

## After approval: backend first, website second

1. Apply the private-project migration. Verify production RLS, browser grant denial, service invoker permissions and indexes.
2. Deploy the updated payment API, webhook and reconciliation functions.
3. Enable PROJECT_PORTAL_ENABLED only after the schema and all three functions are ready. Use the existing PAYMENT_RECEIPT_SECRET; no new signing secret is needed.
4. Preserve RAZORPAY_ENABLED=false in Supabase and PAYMENT_EDGE_ENABLED=false in Cloudflare. This release must not authorize customer checkout.
5. Deploy the website. Check anonymous admin denial, invalid project-link denial, disabled checkout denial, unchanged pricing CTAs and scheduler health.
6. Owner logs in to Admin > Payments > Client projects & remaining balances. Create a project from an existing verified advance; enter an agreed total, progress and an update. Save and get its private link.
7. Open that link privately/on another device. Confirm title, status, total, advance and update match, contact details are absent, and collection remains disabled. Refresh and check status; no order should be created by reading.
8. Edit progress, refresh the private page, then disable or replace the link. Confirm the old link stops working and the new link reflects the saved record.
9. Search a title, use Previous/Next projects and Load older verified advances. Review attempt order IDs and creation times separately from reconciliation history.
10. Confirm non-admins cannot fetch project-admin data and that Overview alerts, Payments badge and cron status load.

## Needed from the owner

- Approval for backend-first deployment and website publication, with both public collection switches still off.
- Visual and real private-link acceptance after deployment. No new secret or payment is required for these checks.
- Separate approval before enabling collection. Confirm final project scope/price and published terms, refund and delivery policy reflect the agreements offered to customers.

## Explicit limits

An uncertain order POST/attachment cannot safely be retried automatically; owner investigation is required. A created order older than 24 hours is not assumed expired. Checkout options already issued in another tab cannot be revoked remotely by our database: a late capture remains recorded, alerts the owner and blocks further authorization. Monitor the scheduler's shared time budget and stale-run alerts. Refunds remain manual in Razorpay; the portal records verified refunds but does not issue them. Private links are bearer capabilities; share only with the intended customer.

Public activation and new live balance/webhook/cron behavior are UNVERIFIED until approved production checks occur. Passing mocks and local SQL checks cannot guarantee bank behavior or a bug-free system.
