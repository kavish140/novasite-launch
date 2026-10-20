import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

// Offline only. Preserve the original research files; do not rerun network audits.
const path = 'scripts/audit-results-2026-08-31.csv';
const input = readFileSync(path, 'utf8');
const lines = input.trim().split(/\r?\n/);
const headers = lines.shift().split(',');
const rows = lines.map((line) => {
  const values = line.split(',');
  if (values.length !== headers.length || /["\r\n]/.test(line)) throw new Error('Review CSV format before parsing');
  return Object.fromEntries(headers.map((key, i) => [key, values[i]]));
});
const valid = rows.filter((r) => /^\d+$/.test(r.mobile_score) && /^\d+$/.test(r.desktop_score));
const metadata = valid.filter((r) => r.platform !== 'Error');
const average = (a, key) => Number((a.reduce((s, r) => s + Number(r[key]), 0) / a.length).toFixed(2));
const industries = [...new Set(valid.map((r) => r.industry))].map((industry) => {
  const subset = valid.filter((r) => r.industry === industry);
  return { industry, count: subset.length, mobile: average(subset, 'mobile_score'), desktop: average(subset, 'desktop_score') };
});
const summary = { source: path, sha256: createHash('sha256').update(input).digest('hex'), snapshotLabel: '2026-08-31', attempted: rows.length, scored: valid.length, missingScore: rows.length-valid.length, mobileMean: average(valid, 'mobile_score'), desktopMean: average(valid, 'desktop_score'), below50: valid.filter((r) => +r.mobile_score < 50).length, atLeast90: valid.filter((r) => +r.mobile_score >= 90).length, metadataAssessed: metadata.length, noJsonLdDetected: metadata.filter((r) => r.has_schema === 'No').length, industries };
writeFileSync('content/editorial-20261020-followup/research-verification.json', JSON.stringify(summary, null, 2)+'\n');
const columns = ['record','industry','mobile_score','desktop_score','mobile_lcp','mobile_cls','mobile_tbt','mobile_inp_crux','platform','metadata_status','json_ld_detected'];
const anonymized = valid.map((r,i) => [String(i+1).padStart(3,'0'), r.industry,r.mobile_score,r.desktop_score,r.mobile_lcp,r.mobile_cls,r.mobile_tbt,r.mobile_inp_crux,r.platform,r.platform==='Error'?'unavailable':'assessed',r.platform==='Error'?'unknown':r.has_schema]);
writeFileSync('public/downloads/mumbai-website-audit-2026.csv', [columns.join(','),...anonymized.map((r)=>r.join(','))].join('\n')+'\n');
const table = industries.map((r)=>`<tr><td>${r.industry}</td><td>${r.count}</td><td>${r.mobile}</td><td>${r.desktop}</td></tr>`).join('');
const html = `<p>SiteNova's saved Mumbai website audit contains 133 attempted URLs and 127 records with numeric mobile and desktop Lighthouse performance scores. Recalculating those records gives an average mobile score of 54.00 and an average desktop score of 69.46 out of 100. This report describes that historical sample, not the performance of every Mumbai business or a measurement of customers lost.</p>
<p>Research by Kavish Ganatra, SiteNova. The preserved results filename is dated 31 August 2026. This revised interpretation uses that saved snapshot; it does not imply that every site was retested in October. The original export does not retain individual run timestamps, complete Lighthouse JSON reports or a reproducible device configuration for every record.</p>
<h2>What was counted, and what was left out</h2>
<p>The source CSV contains 133 distinct URL rows. Six rows do not contain a numeric mobile score and are excluded from the score averages. The 127 scored rows include 126 businesses across seven industry labels and SiteNova itself under a separate Web Agency label. Three identified SiteNova clients are also included. Those relationships and the selection process make this a convenience sample, not an independent or representative survey of the city.</p>
<p>The supporting scripts request the mobile and desktop strategies from the PageSpeed Insights API and record laboratory metrics alongside limited HTML checks. The file is evidence of the recorded observations, but it cannot establish what every visitor experienced. A current rerun may differ because of content changes, test conditions, software versions, cache state and normal measurement variability. Missing reports should be described as missing rather than converted into a score of zero.</p>
<h2>The score distribution in the saved sample</h2>
<p>Of the 127 scored records, 48 fall below 50 on mobile: 37.8%, or 38% rounded to the nearest whole percentage. Nine score at least 90: 7.1%. The previous 37% statement was inconsistent with this denominator. Google's <a href="https://developer.chrome.com/docs/lighthouse/performance/performance-scoring">Lighthouse scoring documentation</a> describes the performance score bands. They are diagnostic categories, not a minimum score required to rank in search.</p>
<p>A score below 50 identifies a result worth investigating under the conditions tested. It does not prove that the business lost an enquiry, that another company outranks it, or that the page failed real-user Core Web Vitals. Establishing those conclusions requires different evidence. Conversely, a score of 90 does not establish that a form works, that information is correct, or that a visitor can complete a purchase.</p>
<h2>Industry averages without a city-wide league table</h2>
<table><thead><tr><th>Recorded category</th><th>Scored URLs</th><th>Mean mobile score</th><th>Mean desktop score</th></tr></thead><tbody>${table}</tbody></table>
<p>The real-estate subset has the lowest recorded mean mobile score, 46.24, among these seven business labels. That is a description of seventeen selected records, not a claim about the whole industry. The earlier figure of 49 did not match the saved export. Category membership is also an audit label: Corporatezone, a wholesale supplier, was placed under Consultants in the original file. That classification limits interpretation of the category comparison.</p>
<p>Do not infer that the platform or industry caused a score difference. The subsets differ in page content, scripts and implementation, and the collection does not control those variables. Automated platform detection uses text fingerprints and can misclassify a site; Custom/Unknown means that the detector did not confidently identify a named platform. It is not proof of a bespoke implementation. An observed gap is a starting point for inspection, not a verdict about a framework.</p>
<h2>What the structured-data check actually detected</h2>
<p>One scored URL has a failed metadata fetch. Among the remaining 126 assessed records, 45 have no detected JSON-LD script: 35.7%, rounded to 36%. The failed fetch is unknown, not evidence of absence. The detector looks for JSON-LD in fetched HTML; it does not exhaustively inspect Microdata, RDFa, later client-rendered markup or the validity and accuracy of every entity. Calling these sites completely without schema would overstate the method.</p>
<p>Missing JSON-LD does not make a business invisible to search or AI systems. <a href="https://developers.google.com/search/docs/appearance/ai-features">Google's AI-feature guidance</a> says no special schema is required. Appropriate structured data can describe visible facts, but inclusion and rankings are not guaranteed. The HTTPS flag is also limited: the collector checks the requested or final URL scheme, not certificate renewal, private-record protection or a complete security assessment.</p>
<h2>Client observations are not before-and-after experiments</h2>
<p>The saved clinic record has mobile/desktop scores of 90/100; Corporatezone has 79/99; Jupiter Fast Finance has 59/89. These are historical laboratory observations from the export. Comparing them with an industry mean does not measure an improvement caused by SiteNova, because there is no matched earlier version of each client in this dataset. A difference between a client score and a category average must not be labelled a before-and-after uplift.</p>
<p>For the same reason, the collection cannot establish a conversion increase, a footfall increase or the share of Mumbai internet use occurring on phones. It contains no customer transaction or city-wide audience dataset. Those claims have been removed. A real outcome study would need a defined observation period, consistent tracking, a meaningful baseline and an explanation of other changes that could influence results.</p>
<h2>Use the evidence to choose the next investigation</h2>
<p>Start with a real page and the task a customer needs to finish. Inspect the loading trace, layout movement and interaction delays; check that the contact or checkout journey actually works. <a href="https://developers.google.com/search/docs/appearance/core-web-vitals">Core Web Vitals guidance</a> concerns loading, responsiveness and stability. Laboratory Total Blocking Time is not itself the real-user Interaction to Next Paint metric, and an unavailable field reading should remain unavailable.</p>
<p><a href="/downloads/mumbai-website-audit-2026.csv">Download the anonymised scored-record CSV</a> to examine the sample. It retains numerical observations and original category labels, removes business names and URLs, and marks the metadata failure as unknown. The source checksum and reproducible calculation live with the project. Interpret this as a historical diagnostic snapshot with stated limits, then retain new dated reports when assessing a current website or making a new performance claim.</p>`;
writeFileSync('content/editorial-20261020-followup/research-report.html', html+'\n');
console.log(summary);
