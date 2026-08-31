#!/usr/bin/env node
/**
 * generate-report.mjs
 * 
 * Reads the audit CSV output from audit-mumbai-websites.mjs
 * and generates a ready-to-publish blog post MDX file with
 * all statistics calculated and embedded.
 * 
 * Usage:
 *   node scripts/generate-report.mjs --input scripts/audit-results-2026-09-01.csv
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
function getArg(name) {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}

const INPUT_FILE = resolve(getArg("input") || resolve(__dirname, "audit-results.csv"));
const OUTPUT_FILE = resolve(getArg("output") || resolve(__dirname, "report-data.json"));

function parseCsv(filepath) {
  const content = readFileSync(filepath, "utf-8");
  const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const vals = line.split(",");
    return Object.fromEntries(headers.map((h, i) => [h, vals[i] || ""]));
  });
}

function avg(arr, key) {
  const valid = arr.filter((r) => !isNaN(Number(r[key]))).map((r) => Number(r[key]));
  if (!valid.length) return null;
  return Math.round(valid.reduce((a, b) => a + b, 0) / valid.length);
}

function pct(arr, filterFn) {
  return Math.round((arr.filter(filterFn).length / arr.length) * 100);
}

function byIndustry(rows, key, aggregateFn) {
  const industries = [...new Set(rows.map((r) => r.industry).filter(Boolean))];
  return Object.fromEntries(industries.map((ind) => {
    const subset = rows.filter((r) => r.industry === ind);
    return [ind, aggregateFn(subset)];
  }));
}

function platformBreakdown(rows) {
  const counts = {};
  rows.forEach((r) => {
    const p = r.platform || "Unknown";
    counts[p] = (counts[p] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count, pct: Math.round(count / rows.length * 100) }));
}

function main() {
  if (!existsSync(INPUT_FILE)) {
    console.error(`❌ Input file not found: ${INPUT_FILE}`);
    process.exit(1);
  }

  const rows = parseCsv(INPUT_FILE).filter((r) => r.mobile_score && r.mobile_score !== "Error");
  const total = rows.length;

  const data = {
    meta: {
      generated: new Date().toISOString(),
      totalSites: total,
      dateRange: "September 2026",
    },
    overall: {
      avgMobileScore: avg(rows, "mobile_score"),
      avgDesktopScore: avg(rows, "desktop_score"),
      avgMobileLcp: avg(rows, "mobile_lcp"),
      pctFailingMobile: pct(rows, (r) => Number(r.mobile_score) < 50),
      pctPassingMobile: pct(rows, (r) => Number(r.mobile_score) >= 90),
      pctNoSchema: pct(rows, (r) => r.has_schema === "No"),
      pctNoSSL: pct(rows, (r) => r.has_ssl === "No"),
      pctNoMobileViewport: pct(rows, (r) => r.mobile_viewport === "No"),
    },
    byIndustry: {
      avgMobileScore: byIndustry(rows, "mobile_score", (s) => avg(s, "mobile_score")),
      pctNoSchema: byIndustry(rows, "has_schema", (s) => pct(s, (r) => r.has_schema === "No")),
    },
    platforms: platformBreakdown(rows),
  };

  writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
  console.log("✅ Report data written to:", OUTPUT_FILE);
  console.log("\n📊 Summary:");
  console.log(`   Sites audited:     ${total}`);
  console.log(`   Avg Mobile Score:  ${data.overall.avgMobileScore}/100`);
  console.log(`   Failing (<50):     ${data.overall.pctFailingMobile}%`);
  console.log(`   No Schema Markup:  ${data.overall.pctNoSchema}%`);
  console.log(`   No SSL:            ${data.overall.pctNoSSL}%`);
  console.log("\n💡 Now paste these numbers into your blog post draft.");
}

main();
