# Activate SiteNova booking and quote notifications

The code is complete without changing your advertising accounts. Booking links start disabled. Follow this order before making the new quote flow live: SQL → server secrets → deploy → Google script → test → enable booking.

## 1. Run the Supabase SQL

Open **Supabase → SQL Editor → New query**. Copy the entire contents of [`20260929_conversion_booking.sql`](../supabase/migrations/20260929_conversion_booking.sql) and run it. This file is the copy-and-paste SQL, including indexes, row-level security, transactional quote saving, notification deduplication, and phone-field backfill. It is safe to rerun.

The final result should contain the UUID of your existing confirmed admin account. If it is empty, verify that your admin account uses `kavishganatra5@gmail.com` and has a confirmed email. For another existing, trusted admin account, run the following with its real UUID from **Authentication → Users**:

```sql
insert into public.site_admins(user_id)
values ('REPLACE_WITH_EXISTING_ADMIN_UUID'::uuid)
on conflict do nothing;
```

Do not add public visitors to this table. Only allowlisted admins can see calls or change booking settings. The sync and notification tables have no anonymous access. No private calendar credentials belong in `site_settings` or frontend environment variables.

## 2. Configure Cloudflare Worker secrets

Keep the existing `SUPABASE_URL` and `SUPABASE_ANON_KEY`. Add:

```powershell
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put CALENDAR_SYNC_SECRET
```

Get the service-role key from Supabase's API settings. Generate a long random secret for `CALENDAR_SYNC_SECRET` (at least 32 random bytes). Use the identical value in the script's `SYNC_SECRET`. Never put either secret in a `VITE_` variable or commit it.

For local development, put these four variables in an untracked `.dev.vars` file, using the example below as a guide. Do not copy the example values literally.

```dotenv
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
CALENDAR_SYNC_SECRET=YOUR_RANDOM_SECRET
```

Build and deploy with the project's normal deployment command. The new endpoints use React Router server actions and work through both Worker entrypoints. `/api/*` is Worker-first.

## 3. Create your appointment schedule

In Google Calendar on a computer, create an **Appointment schedule**:

- Title: **SiteNova Website Consultation** (keep this title unchanged).
- Duration: **15 minutes**.
- Conferencing: **Google Meet**.
- Calendar: your own primary calendar, using the same account that will own the script.
- Time zone: **Asia/Kolkata**. Choose the days and times you actually want to offer.
- Description: discussion of the business, website requirements, budget, and next steps. Mention landing pages from ₹10,000 and business websites from ₹15,000.
- Booking form: retain name and email. Additional business questions can be added in Google Calendar if your account supports them.

Copy the full booking-page URL. If Google supplies a `calendar.app.google` short link, open it and copy the final `https://calendar.google.com/calendar/.../appointments/schedules/...` URL from the browser. The website validates Google's schedule URL before embedding it.

Google handles booking confirmation, conferencing, guest invitations, and availability. Do not use one reusable Meet room URL as the booking URL.

## 4. Install the Calendar sync script

1. Open [Google Apps Script](https://script.google.com/) signed in as the calendar owner. Create **one** standalone project called `SiteNova Calendar Sync`.
2. Paste [`Code.gs`](../scripts/google-calendar/Code.gs) into its code editor.
3. Under Project Settings, enable **Show appsscript.json manifest file in editor**. Replace the manifest with [`appsscript.json`](../scripts/google-calendar/appsscript.json).
4. Check that the **Calendar API** advanced service appears under Services. For a standard Google Cloud project, also enable Calendar API in that project's Cloud console. A default Apps Script project normally enables it when the service is added.
5. Under **Project Settings → Script Properties**, set:

| Property | Value |
|---|---|
| `SYNC_ENDPOINT` | `https://sitenova.dev/api/integrations/google-calendar` |
| `SYNC_SECRET` | Same secret as Cloudflare's `CALENDAR_SYNC_SECRET` |
| `CALENDAR_ID` | Exact Calendar ID from Google Calendar settings; normally your email for the primary calendar |
| `OWNER_EMAIL` | Email of the appointment organizer |
| `NOTIFY_EMAIL` | `kavishganatra5@gmail.com` |
| `APPOINTMENT_TITLE` | `SiteNova Website Consultation` |

6. Run **installSiteNovaTrigger** once and approve Calendar read, email send, external requests, and trigger permissions. This installs a five-minute trigger and performs the first sync. Running installation again replaces only this project's existing SiteNova trigger.
7. In Apps Script **Executions**, confirm a successful run. Do not deploy the script as a public web app. Do not install a second copy, which could send duplicate emails.

Five minutes is the normal operating target, not a guaranteed delivery deadline. Google trigger timing, API availability and quotas can delay processing.

The first sync inspects the configured calendar and imports only matching appointments with a guest. Unrelated calendar events are not sent to SiteNova. Future runs use Google's incremental sync token. Known booking IDs allow cancellation tombstones to be processed even when Google omits the title or attendee. After a token reset, the script checks missing known events individually before marking them cancelled.

Only an exact appointment title, or the title followed by ` (guest name)`, is recognized for new bookings. The organizer must match `OWNER_EMAIL`. Verify Google's generated event title with your test booking. If your account generates another format, adjust `matchesSchedule_` explicitly; do not broaden it to import every event.

## 5. Enable the website and verify

In **Admin → Settings → Google Meet booking**, save the full URL and enable booking links. Then:

1. Open the homepage, paid landing page, pricing, and contact page. The booking link should appear. Open it on a phone and test the fallback link.
2. Make a test appointment through Google Calendar using an email you control. This creates a real calendar event and may send Google invitations.
3. Allow a normal five-minute cycle, then check **Admin → Scheduled Calls**. Verify attendee, IST time, duration, Meet link, and email receipt. Refreshing the admin reads Supabase; it does not force Google's scheduled trigger.
4. Reschedule and cancel the test appointment in Google Calendar. Verify the database and notification updates after each sync.
5. Submit one test quote from `/quote` and one from `/lp/web-design`. Verify each appears once in Quote Requests and generates an email, then test booking from both confirmation pages.
6. Refresh the confirmation pages. No new quote conversion event should fire. Opening the booking calendar is a click event, not a confirmed booking conversion.

The server saves the lead and queues its notification in one database transaction. Quote emails now depend on this script, so complete script setup before directing traffic to the new quote flow. Closing the admin page has no effect on notifications.

## Monitoring and recovery

- **No calls appear:** check the SQL, allowlisted admin UUID, title/organizer match, Calendar ID, and script execution errors. A guest must be present; manually creating an empty calendar block is not a completed booking.
- **Sync older than 15 minutes:** the admin shows a delay warning. Check Apps Script authorization, trigger, quotas, and endpoint availability. Fix the issue and run `syncSiteNova` manually.
- **HTTP 401:** secrets differ or the timestamp/signature is invalid. **HTTP 409:** a signed request was replayed. Each retry must be signed with a fresh nonce.
- **HTTP 503:** confirm the migration and Worker service-role secret. The script retains its previous checkpoint for retry.
- **Expired Calendar token:** the next execution performs a full sync; existing IDs prevent duplicate bookings.
- **Missing Meet link:** check the appointment schedule's conferencing setting. A later Google update fills in the link and queues a change email.
- **Email pending/failed:** notification rows remain queued. Check MailApp quotas and script authorization. `sent_at` means Google accepted the send; it does not prove inbox delivery. Google may also send its own calendar notification.
- **Rare duplicate email:** if sending succeeds but acknowledgement fails, the script retries. Delivery is at least once; normal repeated syncs are deduplicated by event/change version.

Booking records and lead details stay private. Analytics records only event type, placement, and project type; it does not receive names, email addresses, phone numbers, or appointment links. The existing Google Ads quote action is recorded only after storage, with the submission ID as its transaction ID. Campaign conversion settings are unchanged; coordinate any later goal changes with your ad manager.

To temporarily disable booking, turn off the setting. Keep synchronization running for existing appointments and quote notifications. To stop all processing, disable the Apps Script trigger; pending emails remain queued until it resumes.

## Reference

- [Google Calendar appointment schedules](https://support.google.com/calendar/answer/10729749)
- [Apps Script scheduled triggers](https://developers.google.com/apps-script/guides/triggers/installable)
- [Calendar incremental synchronization](https://developers.google.com/workspace/calendar/api/guides/sync)
- [MailApp](https://developers.google.com/apps-script/reference/mail/mail-app)

## Automated verification

- `npm test`: quote/integration validation and Apps Script retry simulations.
- `npm run test:e2e`: browser flows with mocked Calendar and API responses. Install the Playwright browser first, or set `PLAYWRIGHT_CHANNEL=chrome` to use installed Chrome.
- `npm install --no-save --package-lock=false @electric-sql/pglite`, then `node scripts/test-booking-db.mjs`: isolated PostgreSQL migration and access tests; no production data is used.
- To test the built Worker, run `npm run build` and set `PLAYWRIGHT_SERVER_COMMAND` to `npx wrangler dev workers/deploy.ts --local --ip 127.0.0.1 --port 8080` before the browser suite.

These checks do not replace the real Google booking, reschedule, cancellation and email tests in step 5.
