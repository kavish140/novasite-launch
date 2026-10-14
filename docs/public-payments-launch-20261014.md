# Public activation — 14 October 2026

Enabled and verified live by **16:25 IST**, before the owner's 16:30 deadline. Supabase RAZORPAY_ENABLED=true (owner saved, authenticated runtime verified); Cloudflare PAYMENT_EDGE_ENABLED=true (saved only after tests passed). PROJECT_PORTAL_ENABLED=true remains set.

Backend is the reviewed payment API v13, webhook v9, reconciler v7, project migration remote version 20261014095800. All 15 shared source files match the reviewed snapshot. Cloudflare secret-only update created active Worker **d796eb99-ff16-4bd2-b712-628789f2d2b5** at 16:21:20 IST, 100% traffic, retaining the tested website code. No checkout/verification/settlement change, Git push or new real order/charge/capture/refund.

## Passed evidence

- All **250 tests / 39 files** pass: earlier 244 retained plus six Starter/Business enabled/disabled/input/paise/currency cases. Provider/Auth financial interactions are mocked.
- Eight actual isolated PostgreSQL scripts, production build, scoped lint, whitespace and client/credential scans pass. Typecheck retains **61 pre-existing unrelated errors**, zero payment/project file diagnostics; the full repo is not error-free.
- Live capture of the latest existing ₹1 payment confirmed by Razorpay connector; recent ₹1 and ₹7 settlements processed. Account capture/website/bank/webhook settings were owner-confirmed previously, not changed here.
- Approved Terms/Refunds/Delivery/Privacy pages all HTTP200; advance terms and refund window present.
- Live smoke script passes: actual pricing links, correct active forms/policies, single-doctype SSR, tracking suppression, invalid amount/input/session/origin denial, anonymous/forged admin denial, invalid project capability and bad webhook signature rejection. All POSTs deliberately invalid; no order/payment created.
- Real browser clicked both pricing advance links; Starter shows ₹5,000 and Business ₹7,500, zero captured console errors, Razorpay script absent before submission. No acceptance box ticked or payment submitted by agent.
- First request immediately after flag update briefly showed disabled fallback. Fresh requests, browser navigation and the full subsequent live smoke check passed; initial transient cause not independently established.
- Final ledger remains **16 orders: 7 paid/9 pending; zero balance orders**. Cron 16:20:06 IST completed checked16/errors0. Owner acceptance project is On hold with private link and balance approval disabled.

## Exact customer entry and buttons

1. https://sitenova.dev/pricing → Starter **Pay ₹5,000.00 advance** or Business **Pay ₹7,500.00 advance**. Reason: opens the secure form; no order on page load.
2. Direct forms: https://sitenova.dev/pay?package=starter and https://sitenova.dev/pay?package=business.
3. For an intended real purchase, fill Full name, Business or project name, Email address and Mobile number. Read the policies, accept them yourself, then press the matching **Pay … advance** button to create a server-priced order and open real Razorpay checkout. Merely viewing a form requires no payment.
4. Owner: https://sitenova.dev/admin → **Sign in to workspace** → **Review Payments** / Manage → Payments → Recent paid orders. Review/acknowledge verified money; create the agreed project and share its private link. Remaining balances still require agreed total and explicit owner approval.

Editable pricing is **postponed, untested and unpublished**. Drafts are preserved in ignored `test-results/pricing-draft/` outside active source/migrations. Prices remain Starter ₹10,000/₹5,000 advance and Business ₹15,000/₹7,500 advance; Premium quote-only.

Real ₹5,000/₹7,500 captures, live balance captures/recovery, actual refunds/disputes, bank failure paths, actual non-admin browser login, physical cross-device opening and PDF export remain **UNVERIFIED by this launch**. No banking guarantee is inferred from mocks. Refunds remain owner-managed in Razorpay.

Emergency stop: Cloudflare PAYMENT_EDGE_ENABLED=false and Supabase RAZORPAY_ENABLED=false. Existing signed recovery/webhooks/cron continue; already-issued checkout options cannot be withdrawn remotely, so monitor late payments.

Evidence logs: `.launch-public-final-tests.log`, `.launch-public-all-db.log`, `.launch-public-db.log`, `.launch-public-build.log`, `.launch-public-lint.log`, `.launch-public-final-security.log`, `.launch-public-live.log`. Ignored screenshots: `test-results/deployment/public-starter-live.jpg`, `public-business-live.jpg`. No secret values or private tokens included.
