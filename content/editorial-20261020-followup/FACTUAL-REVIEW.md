# Factual and consistency review — 20 October 2026

## State of the work

The owner successfully applied the complete corrected SQL in Supabase SQL Editor on 20 October 2026. Independent connector reads confirm all 63 prepared titles, excerpts, canonicals, statuses, publication dates, tags and contribution metadata. All content matches after normalising CRLF/LF line endings introduced by the SQL Editor. Earlier connector write attempts returned `invalid_request_state` and committed nothing; the owner-run transaction subsequently completed. Do not rerun the applied SQL. Website source remains local until separately deployed.

The source/preview contains 46 revised articles: 21 complete rewrites, 22 restructures and three targeted factual corrections. Seventeen further rows receive canonical consolidation. Nine records are unchanged (the earlier eight rewrites and the existing canonical news copy). The existing news copy also has a local 301 to the original, in addition to its existing canonical. The complete current `apply.sql` is atomic and preserves publication states/dates. Draft contribution fields/markers are retained. Do not run an old clipboard copy or both complete and split SQL.

## Research reconciled against the owner's original data

Owner confirmed that the research was performed. Original files are retained unchanged: `scripts/audit-results-2026-08-31.csv`, `scripts/mumbai-urls.csv`, `scripts/audit-mumbai-websites.mjs`, `scripts/report-data.json`, `scripts/generate-report.mjs`. The new offline `scripts/recompute-editorial-research.mjs` derives the revised report, calculation manifest and anonymous public download. It makes no network requests and does not overwrite historical source data.

- CSV source SHA256: `329b28e449ad83bca718b9a73e23a1deb4cdcc48e64a4fa82a93c28a630a38ef`.
- 133 attempted distinct URLs; six without numeric scores; 127 scored mobile/desktop observations.
- Mean mobile 54.00; mean desktop 69.46. Below 50: 48/127 = 37.8%, rounded **38%**, not 37%. At least 90: 9/127 = 7.1%.
- Real-estate subset mean mobile **46.24**, not 49. The original industry labels remain visible: Corporatezone was categorised Consultants, so comparisons need that caveat.
- One HTML metadata fetch failed. Of 126 successfully assessed scored records, 45 have no JSON-LD detected (35.7%). Unknown is not absence. The detector does not exhaustively assess all structured-data formats, rendered markup or semantic validity.
- The 127 scored rows include SiteNova plus three clients. This convenience sample is not a representative city-wide survey. Comparing clients with category averages is not a before-and-after experiment.
- The saved filename is dated 31 August; the generated JSON incorrectly labels a September range. Per-run dates/device configurations/full PSI reports are not retained. The revised article identifies the file as a historical snapshot rather than inventing exact run settings or a new October test.
- HTTPS detection checks a URL scheme; it is not a certificate or application security audit. TBT is not INP. A low lab score does not establish customer loss or field Core Web Vitals failure.
- Anonymous download now exists at `/downloads/mumbai-website-audit-2026.csv`, with no business names or URLs. Original numerical observations/category labels are retained; metadata failure is explicitly unknown. Publication occurs only with website deployment.

## Sources checked and how they affect wording

Primary references accessed 20 October 2026:

| Source | Supported distinction / correction |
|---|---|
| [Google Lighthouse scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring) | Score bands are diagnostics, not minimum ranking eligibility. |
| [Google Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals) | Loading/interactivity/stability differ from an overall lab score; no score-based business-outcome guarantee. |
| [Google AI features](https://developers.google.com/search/docs/appearance/ai-features) | No special schema or AI text file required; eligibility does not guarantee inclusion. |
| [Google structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) | Accurate markup describes content; it is not proof of a particular result presentation. |
| [Google local ranking](https://support.google.com/business/answer/7091) | Relevance, distance and prominence; no universal NAP-abbreviation penalty, citation formula or guaranteed position inferred. |
| [Google review requests](https://support.google.com/business/answer/3474122) | Honest optional feedback, no incentives or selective positive-review gating; no invented weighting for recency/replies. |
| [Business Profile chat changes](https://support.google.com/business/answer/14919056) | Original chat/call-history features removed 31 July 2024; text/WhatsApp options depend on account eligibility. |
| [GA4 engagement/bounce](https://support.google.com/analytics/answer/12195621) | Bounce means non-engaged sessions, not every single-page visit. Verify actual property configuration. |
| [Google site moves](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes) | Crawl blocking is distinct from noindex; purposeful canonicals may differ from self-references. Migration checks do not guarantee stable rankings. |
| [Google Ads budgets](https://support.google.com/google-ads/answer/6385083) | Most unchanged average daily budgets use a 30.4 monthly limit, with exceptions. ₹500 is not automatically a ₹15,000 monthly cap. |
| [Google keyword matching](https://support.google.com/google-ads/answer/7478529) | Exact match can use meaning/intent; not literal-only matching. |
| [Google location options](https://support.google.com/google-ads/answer/1722038) | Campaign location options need account-specific review; no precision/radius guarantee. |
| [ONDC seller participants](https://www.ondc.org/pages/seller-network-participants.html) and [policies](https://www.ondc.org/pages/resources-network-policy.html) | Integration, category/serviceability and participant terms matter; remove universal app counts, fee savings, GSTIN and free-registration assumptions. |
| [ICAI advisory](https://www.icai.org/post/advisory-website-guidelines-of-the-institute) and [revised Code announcement](https://www.icai.org/post/prc-icai-press-release-12-12-2025) | The CA guide properly requires responsible member review of current rules; it does not reproduce outdated categorical permissions. |
| [OpenAI Australian incident account](https://openai.com/index/how-we-will-do-better-for-australia/) | Correct the claim that other agency accesses were all ordinary; distinguish June activity, mid-August discovery and September notification. Attribute findings to the company, not independent forensics. |
| [AdSense disclosures](https://support.google.com/adsense/answer/1348695) | Existing privacy wording matches cookie/opt-out disclosures and truthfully says root ads are not planned; it does not assert subdomain ads are active. |
| [MMRDA BKC](https://mmrda.maharashtra.gov.in/en/planning/badra-kurla-complex/overview), [MIDC mapping](https://gis.midcindia.org/MIDCGISPortal/), district/campus references | Support geographic context, not a measured census of industries or demand. The template now explicitly distinguishes those uses. |

Corporatezone's current public page confirms the Lower Parel headquarters and quote basket. Jupiter's public site confirms service information/contact routes, but the previous fixed five-service count no longer matches its expanded menu. The clinic site did not yield readable content in automated extraction; unsupported rank/delivery/permanent score/credential badges are removed from the agency case study rather than independently certified.

## Consistency repairs

- About uses shared pricing, an agreed schedule and three published case studies. Industry guides do not imply delivered clients in every industry. Remove contradictory universal no-platform claims while preserving custom-development positioning.
- Client pages no longer promise every-query rankings, permanent performance scores, perfect notification, inherent database security or automatic rich results. Preserve owner-confirmed review wording, actual project links and conversion CTAs.
- All 14 location records remain distinct. Queries and business examples are illustrative; coverage is not an office. Thane is described as a city, not merely another Mumbai suburb. The geographic reference is not presented as endorsement of the advice.
- Remove invented WhatsApp device/broadcast limits, fixed October policies, platform-wide Instagram explanations, agency-vs-freelancer generalisations, automatic app/web price/security advantages, unsupported hacked-client anecdotes and universal COD/prepaid return claims.
- Distinguish opening WhatsApp from a sent message, accepted enquiries from delivered notifications, requests from confirmed bookings, and technical checks from business outcomes.
- `public/llms.txt` now reflects the actual website stack, current-price source, documented case studies and these limits. It no longer asserts unsupported best-agency endorsements or guaranteed AI visibility.

## Limits

This review reconciles the changed copy and research against available records and primary guidance. It is not an independent rerun of all 133 historical audits, a professional legal/medical/financial certification, a client-system security audit, or a guarantee that future provider rules stay unchanged. Professional copy needs the responsible practitioner's review before implementation. The unfinished advertising draft remains unpublished. Retired source articles remain stored but redirect in local website code; they are not the preferred published destinations.

The original agency conversion paths remain available. No payment, schema, RLS, credential, price-setting or deployment change was made. The shared current price is read, not changed.

## Verification

Production client/SSR build, 372 tests, scoped lint and isolated complete-transaction execution/rollback pass. The final application typecheck retains exactly the same 61 normalised file/code/message diagnostics as the prior baseline. Local Edge verifies About's complete glyph at 320/390/714/1024, all 14 location URLs, the news-copy redirect, the 127-scored-row CSV, 46 read-only review articles and POST rejection; no page errors. Both local servers remain available (8788 website, 8790 pending copy). CMS changes are applied; these local checks do not establish a website deployment.
