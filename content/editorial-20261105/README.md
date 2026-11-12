# Editorial corrections — 5 November 2026

**Status: APPLIED by the owner in Supabase SQL Editor on 12 November 2026; independently verified through read-only production queries.** All eight titles, excerpts and bodies match the prepared replacements (bodies normalised for SQL Editor CRLF/LF line endings). Slugs, publication states/dates, tags and canonicals are preserved. Do not rerun `apply.sql`: its original-source guards should now fail. No website deployment is required for these CMS content changes.

The earlier connector installation did not expose SQL tools to the running session, so no agent SQL write was executed. An existing local server credential returned HTTP 401 on a single read and was not used again. The owner subsequently applied the complete tested fallback. No access controls, credentials or policies were changed to work around that failure.

The root agency site will not show AdSense ads. The intended advertising properties are `tools.sitenova.dev` and `ai-insights.sitenova.dev`. This batch changes editorial content, not ad placement, verification records or the agency conversion funnel.

## Eight content corrections

| Existing slug | Correction |
| --- | --- |
| `why-your-website-dropped-google-inp-metric-2026` | Replace new-2026/automatic-penalty framing with sourced INP diagnosis, field/lab distinctions, task testing and a dated correction. Repair escaped HTML. |
| `ai-agents-upi-payments-why-offline-businesses-need-ecommerce` | Separate announcements, payment support, authorisation and settlement; remove unverified protocol/limit/adoption claims and inevitable-customer-loss sales claims. |
| `replace-pdf-catalogue-with-searchable-product-catalog` | Correct PDF indexing/ranking claims and unverified percentages; explain Corporatezone's documented categories and enquiry basket without inventing results. |
| `pagespeed-score-95-mumbai-case-study` | Retain the existing diagnostic guide and add a concrete excerpt from SiteNova's actual `BlurImage` source, with its limits and a link to the retained research. |
| `what-a-website-project-looks-like-start-to-finish` | Replace generic supplier judgements with reviewable project checkpoints and documented clinic/catalogue examples. |
| `what-happens-if-you-forget-to-renew-your-domain` | Remove universal recovery periods, fee multiples, simultaneous mail-failure claims and undocumented anecdotes; distinguish registration, DNS, hosting and mail. |
| `freelancer-vs-web-design-agency-when-to-switch` | Correct residual assertions that an agency necessarily supplies specialists, cover, takeover capability or recovered leads. Retain useful scope/access guidance. |
| `website-security-basics-small-business` | Correct unsupported attack-frequency/password-frequency claims, recovery-time promises and overly casual security setup advice. |

Publication states, original publication dates, slugs, tags, canonicals and contribution metadata are preserved. No new articles are published. No URLs are merged, removed, redirected or marked noindex. Changed titles describe the corrected subject; URLs stay stable. These revisions do not guarantee unchanged rankings or Google approval.

## Apply and verify

**Completed for this batch.** The following procedure records the release safeguards; it is not an instruction to rerun the applied file. The production read-back verified all eight prepared records on 12 November 2026. The owner subsequently authorised a GitHub source release containing these artifacts and the manual review-prompt change. Website deployment remains a separate action.

1. Preserve the ignored pre-change export at `test-results/editorial-20261105/published-before.json`. `expected.json` also retains each of the eight exact source records and prepared values.
2. Confirm the connector project is **SiteNova Web**, ref `bklmtwblsoitafynpikc`. Use the complete `apply.sql` as a single transaction through the authorised SQL connector, or use the SQL Editor if connector tools remain unavailable. This is content DML, not a schema migration.
3. All eight source records are locked and checked before writing. A body, title, excerpt, state, date, canonical or update-timestamp conflict aborts the entire transaction. Do not bypass failed guards; compare with the owner's newer edit and regenerate only after reconciliation.
4. Read back all eight bodies, titles and excerpts and compare with `expected.json`. Confirm the preserved metadata and public URLs, and recheck the live `/blog` listing, related reading, canonical and reading times. A successful SQL result alone does not complete release verification.
5. Record the actual application and verification result here. Do not describe this batch as live before that happens. Do not rerun the October source-guarded batches.

## Files and local checks

- `review.html`: self-contained read-only copy review, eight articles, narrow-screen layout checked at 390px with no document overflow. This preview is not the production page template.
- `apply.sql`: all-or-nothing eight-record guarded transaction.
- `expected.json`: exact sources/replacements; public editorial data only, no credentials.
- `archive-audit.json`: all 55 public original root articles checked for HTTP/canonical/content structure and claim risks. This is not a fresh verification of every historical assertion.
- `node scripts/prepare-editorial-20261105.mjs`: offline regeneration from the pre-change export.
- `node scripts/test-editorial-20261105.mjs`: executes the real SQL in isolated PostgreSQL/PGlite; verifies exact values, metadata, unrelated records, a private draft and full rollback after a conflicting edit.
- Existing blog regressions: 20 tests across three files passed. Production client/SSR build and scoped app lint passed. Build retains existing framework/chunk warnings. This pass did not rerun the entire payment suite or claim to fix the repository's earlier typecheck baseline.
- `scripts/snapshot-editorial-20261105.mjs`: public-key GET-only archive export; no service credentials. Do not overwrite the pre-change backup after application.
- `scripts/audit-editorial-live.mjs`: public GET-only root/subdomain crawl. Raw outputs and browser evidence are in ignored `test-results/editorial-20261105/`.

The only application-code edit is the manual review-export prompt in `app/lib/blog-review-export.ts`. It now explicitly checks announcement/availability distinctions, ranking causation, PDF indexing, escaped HTML, correction notes and the root/subdomain advertising boundary. No automated publication gate was restored. The owner authorised its GitHub source release; no manual website deployment is part of that source push.

## Source ledger and limits

- INP history: https://developers.google.com/search/blog/2023/05/introducing-inp — effective 12 March 2024. Current optimisation guidance: https://web.dev/articles/optimize-inp .
- AI search eligibility: https://developers.google.com/search/docs/appearance/ai-features . No special AI schema required; discovery is not guaranteed.
- PDF indexing: https://developers.google.com/search/docs/crawling-indexing/indexable-file-types . PDF is a supported format; this does not guarantee indexing of a particular file.
- NPCI Reserve Pay: https://www.npci.org.in/uploads/UPI_OC_No_228_FY_2025_26_Enhancement_in_UPI_Single_Block_Multiple_Debits_UPI_Reserve_Pay_a9095c181d.pdf . The circular does not alone establish universal AI purchasing authority.
- NPCI UPI HELP pilot: https://www.npci.org.in/uploads/UPI_OC_No_227_FY_2025_26_Introduction_of_UPI_HELP_Assistant_pilot_an_AI_powered_support_for_UPI_payments_cd501de8f3.pdf . Distinguish payment support from autonomous shopping.
- Domain lifecycle: https://www.icann.org/resources/pages/gtld-registration-lifecycle-2012-02-25-en . Applicability and provider terms must be checked; not a universal country-code recovery schedule.
- Google HTTP responses: https://developers.google.com/crawling/docs/troubleshooting/http-status-codes .
- Firsthand project support: existing `app/pages/portfolio/CorporateZone.tsx`, `DrDiptiGanatra.tsx` and public case studies. Implementation excerpt: `app/components/BlurImage.tsx`. No client-private source, screenshot, testimonial, benchmark or result was invented.
- Historical 127-score research remains intact. No new research run or client outcome is asserted. No legal, medical or security certification is implied.

## Additional URL consolidation

**None proposed for immediate application.** INP diagnosis and the broader performance investigation have different tasks; catalogue/enquiry design and manufacturing capability/RFQ design also have distinct scopes. Keep useful cross-links. A common topic or heading is not sufficient evidence to merge URLs. Any future merge must have its own source/destination and traffic/SEO review before approval.
