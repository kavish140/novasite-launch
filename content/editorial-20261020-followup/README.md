# Full archive follow-up — 20 October 2026

**Current status: APPLIED by the owner in Supabase SQL Editor on 20 October 2026; independently verified.** All 63 targets match the prepared titles, excerpts, canonicals, statuses, publication dates, tags and contribution metadata. Article bodies match after normalising SQL Editor CRLF/LF line endings. The earlier connector attempts failed without changes; the owner subsequently ran the complete tested file successfully. Do not rerun either applied SQL batch. Website code is local until separately deployed. Factual evidence and limitations: `FACTUAL-REVIEW.md`.

## Review and applied SQL archive

1. Read all 46 revised articles at `http://127.0.0.1:8790/` while the local review server is running, or open `review.html`. The review includes draft labels and performs no remote calls or writes.
2. `apply.sql` records the complete atomic transaction already applied in SiteNova Web (`bklmtwblsoitafynpikc`). Do not rerun it or the six split batch artifacts; old-source guards should now fail. The canonical schema migration is also already applied.
3. The local website at `http://127.0.0.1:8788/blog` reads the saved CMS content. `review.html` is an offline reference snapshot including clearly marked drafts.

Each UPDATE targets a stored UUID and checks the original slug, title, status, body hash, update timestamp and canonical value before writing. Status and publication dates remain unchanged. The transaction makes no schema, RLS, grant, payment, price, credential or activation change.

## Coverage

All **72** stored rows were inspected and classified in `archive-audit.json`:

| Action in this follow-up | Rows |
|---|---:|
| Complete independent rewrites | 21 |
| Topic-specific editorial restructuring | 22 |
| Targeted factual corrections to retained independent guides | 3 |
| Consolidation into a maintained article/local guide | 17 |
| Earlier eight rewrites and existing canonical copy retained | 9 |

All 43 complete rewrites/restructures contain at least 900 words each. Three targeted corrections preserve the independent short-guide format where applicable. The additional factual pass reconciles the actual research CSV, rewrites zero-click/COD/manufacturing/news claims and corrects the unfinished ad-budget draft without publishing it or removing owner-contribution fields.

The 22 restructures replace repeated broad hooks/headings, distribute useful questions under relevant sections and add specific engineering examples. The factual pass corrects unsupported messaging limits, causal ranking claims, GA4 bounce semantics, security assurances, platform/agency comparisons and universal cost assumptions. Regulated guidance remains conditional on current professional review; see the source ledger and limitations in `FACTUAL-REVIEW.md`.

The 17 consolidations preserve original database records and publication states, set their canonical to a useful maintained destination, and have matching local-code 301s. Five are the suburb sales articles already retired in code; twelve consolidate overlapping speed, generic pricing, profile-update, seasonal or brochure material. `consolidations.json` lists every source and destination. Targets must be published, not drafts.

The nine unchanged rows are the earlier eight distinct rewrites and the existing canonical news copy. The copy now also redirects to its original through local code. A generic FAQ heading alone is not proof of spam; no word count guarantees Google approval.

## Website changes and local preview

- About's statistic value keeps the glyph fix, uses the shared current price and replaces unsupported delivery/niche claims with an agreed schedule and three published case studies. Old ranking/security promises and undocumented performance/delivery badges were removed from linked client pages. `public/llms.txt` now reflects these same limits.
- All 14 location pages already use distinct code-backed market records; the earlier Mulund/Lower Parel links were examples. `/locations` now provides the complete directory with each location's own heading and introduction.
- Footer links to that directory, and Mulund now correctly links to `/location/mulund` rather than the homepage.
- All 14 actual local location routes returned HTTP 200. About's complete text bounds were checked at 320/390/714/1024px. Screenshots were inspected. This is a scoped glyph/directory check, not a claim that all inherited page-layout issues have been repaired.
- Main website preview: `http://127.0.0.1:8788/about` and `/locations`. Pending editorial review: `http://127.0.0.1:8790/`. The main blog now reads the saved revisions from the CMS. Neither preview is a production deployment.

## Validation and artifacts

- 372 Vitest tests across 52 files pass; production client/SSR build and scoped lint pass.
- App typecheck retains the identical 61 baseline file/code/message diagnostics. None added.
- `scripts/test-editorial-followup.mjs` executes the actual complete SQL in isolated PostgreSQL/PGlite and verifies 63 guarded changes, 46 content revisions, preserved statuses/dates/tags and contribution metadata/markers, unchanged unrelated rows, published-only RLS filtering and full-file rollback after a conflicting edit near the end.
- Real local built Worker/headless Edge verifies the About glyph box, directory, all 14 location routes, news-copy redirect, anonymous 127-row CSV, 46 read-only review articles and rejection of review-server POSTs. No page errors. No real lead submission, payment, production publish or source push.
- Preparation sources: `replacements.json`, individual HTML files, `section-plans.json`, `editorial-notes.json` and `consolidations.json`. `expected.json` contains the precise prepared revisions; `archive-audit.json` covers every row.
- Ignored pre-change backup: `test-results/content-before-followup-20261020.json`. Logs/screenshots remain under ignored `test-results/`. Keep a fresh target-row export before applying the SQL if any owner edits have occurred since this snapshot.

Recompute historical research with `node scripts/recompute-editorial-research.mjs`, then prepare with `node scripts/prepare-editorial-followup.mjs` and verify in isolation with `node scripts/test-editorial-followup.mjs`. Corrections and topic notes are recorded in the `*fact-corrections.json` and `factual-notes.json` sources. Start the read-only review with `node scripts/editorial-review-server.mjs`. These scripts do not connect to Supabase or read credentials.
