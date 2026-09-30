# Conversion and booking verification — 29 September 2026

## Passed locally

- Production client and Cloudflare server build.
- 16 Vitest checks: configuration, input validation, signed integration requests, replay rejection, save failures, Apps Script filtering/pagination/checkpoints, invalid-token recovery, notification retry handling, and Scheduled Calls search/status filters.
- 8 Playwright checks against the built Worker using installed Chrome: booking and disabled settings; both quote journeys on mobile; preserved data and submission IDs after failure; GA4 and Google Ads conversion deduplication; pricing package retention; one mobile contact bar; direct confirmation guard; mobile booking/fallback; focused form in a reduced-height viewport; verified SEO scores with no fabricated fallback.
- PostgreSQL checks in isolated PGlite: apply the SQL twice, backfill legacy phone fields, quote idempotency/conflicts, new/rescheduled/cancelled/stale Calendar events, email acknowledgements, nonce replay protection, and anonymous/non-admin access restrictions.
- Screenshot review of the homepage, mobile booking page and focused mobile form.

## Existing repository limitation

The app TypeScript check had 65 diagnostics at the Git baseline and 63 after the implementation comparison, with no new diagnostics. Existing errors include animation type inference, old component props and route type configuration. Production builds pass.

## Requires your Google/Supabase setup

Automated browser tests use mocked quote/Calendar responses; script tests simulate Google services. They do not create appointments or send real invitations/emails. Follow [booking-setup.md](booking-setup.md), then make, reschedule and cancel a real test appointment and check the notification email. Check the embedded Calendar on a physical phone, including its time-zone display and keyboard behavior; the reduced-viewport test does not emulate the native on-screen keyboard.

Booking starts disabled. Run the SQL and configure server secrets before deploying the new quote handler. Authorize the Apps Script before relying on quote/booking email notifications. A five-minute trigger is a normal target; external service timing and quotas can delay it.
