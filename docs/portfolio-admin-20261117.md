# Portfolio administration and mobile forms

Local implementation: Admin → Content → Portfolio projects can add, edit, hide, order and delete listing entries. Titles, descriptions, screenshot URLs, live URLs, category, product highlight and existing case-study paths are editable. Existing case-study page content is separate and is not deleted with a listing.

Applied on 18 November 2026 as `supabase/migrations/20261118100613_portfolio_projects.sql`, matching the connector-assigned production migration version. It creates one new table, seeds 11 projects without AI SmartKit, enables RLS, grants published public reads and restricts writes/hidden reads to existing admin authorization. No payment, lead or authentication tables are changed. The original local draft version was 20261117101158; do not apply it again. Live role/CRUD checks passed inside a rollback-only transaction. The website UI remains local, unpushed and undeployed.

Public portfolio uses an SSR catalog; embedded sections use `/api/portfolio`. Successful empty results stay empty. Missing-table fallback supports rollout; other failures show unavailable rather than restoring deleted defaults. Admin mutations recheck identity/membership, compare revision, and report conflicts without clearing edits.

The connected preview now reads the live public catalog, and authenticated admin edits use existing Supabase RLS. Its former ignored portfolio fixture override was removed. Public reads, anonymous write denial, non-admin deletion denial and admin insert/edit/hidden-read/delete have been verified through live rollback-only database checks, leaving no test rows. Browser UI actions are covered by isolated mocked tests. See `blocker-fixes-20261118.md` for current release status.

Mobile quote introduction is shortened, project choices use two columns, and step changes bring the next question into view. Desktop retains the original split layout. Mobile audit header is shortened as well.

Checks: production client/SSR build; focused schema/component tests; isolated PostgreSQL RLS/CRUD/validation/concurrency checks; 320/360/390/1440 layout checks. First project choice is visible at approximately 312px on a 360px phone, and all choices fit within 800px height. Existing unrelated application type errors remain.
