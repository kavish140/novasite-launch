# SiteNova editorial and local-content repair — 20 October 2026

Status: **database changes applied by the owner; website deployment and Git push still pending.** On 20 October 2026 the owner ran the canonical schema SQL and guarded content batch, both with success screenshots. Independent read-only production verification confirms the eight replacement articles (six published, two still drafts) and the root duplicate canonical, with content update time 10:37:53 UTC (16:07:53 IST). Agent access to production remained read-only. Do not rerun the old-source-guarded batch after this successful application. AdSense is intended for AI Insights and Toolbox; no display-ad script was installed on the agency domain.

## Source map and resulting changes

| Fix | Source files/data | Result |
|---|---|---|
| 1. Local pages | `app/components/LocationPageTemplate.tsx`, 14 `app/pages/locations/*.tsx`, `app/lib/locationMeta.ts`; new `app/lib/location-content.ts` | Two distinct market paragraphs per location, qualified search-intent/competition discussion, three unique FAQs, and a relevant real project reference. Removed the shared 50% bounce claim, delivery/ranking promises, generic FAQs, full portfolio/testimonial stacks and body-level service/suburb grids. Quote state and pricing/contact links remain. |
| 2. Reading time | `app/routes/blog._index.tsx`, `app/pages/blog/BlogIndex.tsx`, new `app/lib/blog-content.ts` | Fetch full HTML on the server, exclude tags/scripts/styles/comments from word counts, compute at 200 words/minute, omit bodies from listing payloads. Both featured and ordinary cards use the same actual reading-time value. Related cards use it too. |
| 3. Article structure | Supabase `public.blog_posts`; `content/editorial-20261020/`, `scripts/prepare-editorial-repair.mjs` | Eight complete, independently outlined replacements; 903–995 words each. Prepared atomic SQL checks IDs, slugs, original body hashes, title, status and update time before changing anything. It preserves status and publication dates, removes obsolete blank placeholders, and aborts/rolls back on a conflicting edit. |
| 4. Editorial page | `app/pages/blog/BlogPost.tsx`, `app/components/BlogCTA.tsx`, `app/components/RelatedPosts.tsx`, `app/lib/relatedPosts.ts`, `app/lib/booking.ts` | One small contextual CTA outside the editorial article, followed by three server-rendered related links. Published/original-only selection, topic inference for older rows, byline, publish/update times and author bio. No post-body suburb/service grids, stacked banners or blog floating/popup promotions. Main navigation/footer and agency form/payment flows remain. |
| 5. Canonicals | `app/lib/meta.ts`, `app/lib/blog-content.ts`, `app/routes/blog.$slug.tsx`, `app/routes/sitemap[.]xml.tsx`, admin editor/types, `supabase/migrations/20261020082731_editorial_canonical_url.sql` | Nullable original-publication URL, HTTPS validation, consistent head canonical/OG/Twitter/BlogPosting URL and visible original-version link. Copies are excluded from the agency index/related reading/sitemap. Default is the existing root slug. No original URL was guessed. |
| 6. Trust/discovery | `app/pages/legal/PrivacyPolicy.tsx`, new `app/components/LatestGuidesSection.tsx`, `app/pages/Index.tsx`, `app/pages/About.tsx`, new `/privacy` and `/terms` routes | Four verified root guide URLs in SSR homepage HTML; publisher/corrections policy; subdomain-focused Google cookie/personalization disclosure and opt-out links; canonical legal-page redirects. |

The shared manual review prompt in `app/lib/blog-review-export.ts` now asks for a distinct operational angle, archive-overlap checks, relevant engineering examples and verified original canonicals. This does not introduce an automated publication gate or change an external scheduler.

## Content manifest

Slugs remain stable to preserve inbound links. Titles, excerpts, tags and bodies change; publication dates and draft/published states do not.

| Existing slug | Words | State preserved | New angle |
|---|---:|---|---|
| `website-for-architects-mumbai-2026` | 958 | published | Project arguments, gallery stability and private drawings |
| `5-things-every-ca-firm-website-must-have` | 995 | published | Professional review, checklists and document boundaries |
| `5-things-every-salon-spa-website-needs` | 967 | published | Staff/resource scheduling and request versus reservation |
| `why-every-doctor-in-mumbai-needs-a-website-in-2026` | 983 | published | Verified patient information, schema and minimal appointment requests |
| `do-interior-designers-mumbai-need-website-2026` | 932 | published | Room narratives, gallery delivery and fit-out qualification |
| `do-photographers-mumbai-need-website-2026` | 903 | **draft** | Public edits, image budgets and private client galleries |
| `do-consultants-in-mumbai-need-a-website-2026` | 949 | published | Engagement fit, evidence and lead triage |
| `caterers-event-planners-mumbai-need-website-2026` | 994 | **draft** | Feasibility, local date handling and reviewed menus |

`manifest.json` records IDs and pre-edit content hashes. HTML files contain complete prose; interiors, photography, consulting and events combine their base and `-engineering.html` files in that order. `apply.sql` is the complete generated batch. The generator is offline and does not connect to Supabase.

## Duplicate audit

Read all 72 root blog rows (68 published) and all 59 published AI Insights articles. Compare slugs/titles and normalized seven-word sequences across full bodies. No substantial cross-domain duplicate was found in this snapshot: the highest smaller-body containment was approximately 0.115%, a shared phrase in otherwise different material. This is a text comparison of the available published archive, not a guarantee about unpublished material, earlier versions, images or future republication.

The two root articles `openai-agent-medicare-portal-breach` and `openai-agent-medicare-breach-disclosure-delay` have the same title and substantially overlapping prose. The former was published 22 seconds earlier. The prepared SQL assigns the latter's canonical to `https://sitenova.dev/blog/openai-agent-medicare-portal-breach`. Neither exists as a matching published AI Insights article in the inspected data, so assigning an AI Insights URL would be unsupported. This audit does **not** independently verify the news allegations in the retained original.

Five overlapping local sales articles are consolidated with permanent redirects in `legacyLocalArticles`:

| Blog slug | Destination |
|---|---|
| `web-design-company-in-thane-2026` | `/location/thane` |
| `web-design-company-in-andheri-2026` | `/location/andheri` |
| `web-design-company-in-powai-2026` | `/location/powai` |
| `wix-vs-real-website-bhandup-businesses` | `/location/bhandup` |
| `why-small-business-mulund-needs-website` | `/location/mulund` |

The original database records are retained. Listing, related and sitemap filters exclude these redirected slugs. `/location/peddar-road` already redirects correctly to `/location/pedder-road`; that existing alias is unchanged.

## Evidence and verification

- All 372 tests across 52 Vitest files pass, including nine original editorial checks plus a topic-relevance regression. Existing conversion/payment/booking coverage remains included; no real financial request was made.
- Isolated PGlite/PostgreSQL executes the actual migration and content SQL against the captured article fixture. Checks cover eight unique 900+ word bodies with no shared H2 text, status/date preservation, canonical assignment, untouched unrelated rows, retained RLS/publication filtering and atomic rollback on a concurrent edit.
- Production client/SSR build and changed-file ESLint pass. Build emits the existing large-admin-chunk and React Router future-flag notices. Final application TypeScript comparison is against `npx tsc -p tsconfig.app.json --noEmit --pretty false`; the result retains exactly the same 61 baseline diagnostics, with no added file/code/message entries. A root-only `tsc --noEmit` does not check the referenced app project and should not be reported as a clean app typecheck.
- Actual built React Router server rendered with an isolated Node loopback harness and mocked Supabase/external responses; headless Edge checks real SSR index times and related links, draft/copy exclusion, canonical output, all 14 location routes, quote navigation/prefill, local-article 301, sitemap exclusions, homepage guide links, privacy redirect and 390px overflow. No browser page errors in the checked run. A pre-existing homepage preload property casing warning was corrected (`fetchPriority`). Desktop/mobile screenshots visually inspected. Backend/provider responses are fixtures; this does not verify a deployed Worker or real lead delivery.
- Ignored `test-results/` contains the pre-edit content snapshot, logs, the temporary browser harness and screenshots. None is shipped by the website build. Existing generated route types, Worker state and `.launch-public-deployments.json` were present before this task and are not source-release artifacts.

## Release order

Steps 1–3 were completed by the owner on 20 October 2026 and the resulting article rows were independently verified. Continue at step 4; website code remains undeployed.

1. Export/back up the currently targeted blog rows. Recheck the content and canonical choice against any edits since this audit. The captured local snapshot is `test-results/content-before-20261020.json`.
2. Apply `supabase/migrations/20261020082731_editorial_canonical_url.sql` through the normal migration process. It adds only a nullable text column and a format constraint; existing RLS, grants and publication rules remain unchanged. The new website's explicit selects and admin save require this column.
3. Review and run `content/editorial-20261020/apply.sql` in a transaction-capable SQL client. It is already wrapped in a transaction. A stale-source exception means the entire batch must be rolled back, compared and regenerated after review; do not remove its guards. The batch does not publish the two drafts.
4. Release the verified website with existing runtime settings preserved. Do not change payment flags, prices, credentials or analytics configuration as part of this release.
5. Check live homepage guide destinations, index reading times, article original/update metadata, sitemap exclusions, local redirects, mobile quote navigation and legal disclosure. Then request the relevant Google review through the account workflow. This task has not submitted a review.

To reproduce local SQL checks: `node scripts/test-editorial-repair.mjs test-results/content-before-20261020.json`. To regenerate the reviewed batch from an authorised current snapshot: `node scripts/prepare-editorial-repair.mjs <snapshot.json>`. The snapshot needs id, title, slug, excerpt, content, tags, status, published_at and updated_at for each row. Review the generated diff before execution.

## Scope and sources

The six identified patterns are addressed in source/prepared content. This is not an exhaustive factual/editorial rewrite of every remaining archive article or a guarantee of AdSense acceptance. Google has not confirmed which specific pattern caused this site's rejection. Local searches are explicitly illustrative; there is no fabricated keyword volume, PIN-code difficulty dataset, local office, case-study result or ranking promise. All 14 market briefs include reference links and use actual SiteNova portfolio records for project examples.

Advertising wording follows [Google's required publisher disclosures](https://support.google.com/adsense/answer/1348695), including prior-visit advertising cookies and personalization opt-out. The legacy DART name is contextualized rather than represented as the guaranteed current cookie. Adding this prose does not configure consent management or activate ads on either subdomain. Relevant implementations also reference [Google LCP guidance](https://web.dev/articles/optimize-lcp), [CLS guidance](https://web.dev/articles/optimize-cls), [MedicalClinic](https://schema.org/MedicalClinic), [Cloudflare cache-control documentation](https://developers.cloudflare.com/cache/concepts/cache-control/) and [ICAI](https://www.icai.org/). Professional content asks the responsible practitioner to verify current obligations rather than claiming compliance from a template.

## Owner review preview

Started the built local Cloudflare Worker at `http://127.0.0.1:8788/` for owner review after the database update. Actual local Worker requests confirm HTTP 200 and updated content on the homepage, blog index, Mulund location page and privacy policy. Published article titles/read times are returned from the connected CMS. Vite startup repeatedly re-optimised dependencies, so that development session was stopped in favour of this built preview. No deployment or push.

## Subsequent full-archive follow-up

The owner requested broader coverage after reviewing the local site. See `content/editorial-20261020-followup/README.md` for the complete 72-row audit, 46 content revisions and 17 consolidations. The owner subsequently applied the complete factual-review SQL in Supabase SQL Editor; all 63 records were independently verified, including preserved publication states/dates and contribution fields (body line endings normalised for comparison). The earlier eight owner-applied rewrites remain saved. All 14 location pages are now linked from `/locations`, and About's clipped Custom stat has been corrected in the local code preview.

## Final source release verification — 20 October 2026

The owner-applied full archive transaction is independently verified: all 63 prepared records match (normalising harmless SQL Editor CRLF/LF body line endings), and all nine retained rows match their original content/state. Four drafts stay unpublished. Current source fixes missing excerpt fallbacks, adds legal sitemap paths and uses the blog per-request database client in the sitemap so its credential fallbacks remain consistent.

The exact final production build, 374 tests across 52 files, changed/new-app-file lint, isolated complete-SQL rollback and staged credential/whitespace scans pass. Final application typecheck retains the same 61 normalised file/code/message diagnostics, none added. A complete final test run passes with two workers after an earlier simultaneous build/full-worker run timed out two existing payment UI tests. The root hydration regression intentionally logs its expected mismatch warning. Browser checks verify the About glyph at four widths, all 14 location routes, four flagship links, blog search/empty state and mobile location-to-quote navigation with no page errors or real lead/payment submission.

The requested GitHub source release targets the existing `ssr` branch. No manual Cloudflare deployment, payment/booking backend, runtime price/flag, credential or schema operation is included. Generated route types, local Worker state, ignored test fixtures and the pre-existing deployment metadata are excluded from the source commit.
