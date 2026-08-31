#!/usr/bin/env node
/**
 * audit-mumbai-websites.mjs
 * 
 * Audits a list of URLs via the Google PageSpeed Insights API.
 * Extracts performance scores, Core Web Vitals, platform detection,
 * and Schema markup presence.
 * 
 * Usage:
 *   node scripts/audit-mumbai-websites.mjs
 *   node scripts/audit-mumbai-websites.mjs --key YOUR_API_KEY
 *   node scripts/audit-mumbai-websites.mjs --input scripts/mumbai-urls.csv --output results.csv
 * 
 * Rate limits (free, no key): ~25 requests per 100 seconds
 * Rate limits (with key):     ~400 requests per 100 seconds
 * 
 * Get a free API key: https://developers.google.com/speed/docs/insights/v5/get-started
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------- CLI args ----------
const args = process.argv.slice(2);
function getArg(name) {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}

const API_KEY = getArg("key") || "";
const INPUT_FILE = resolve(getArg("input") || resolve(__dirname, "mumbai-urls.csv"));
const OUTPUT_FILE = resolve(getArg("output") || resolve(__dirname, `audit-results-${new Date().toISOString().split("T")[0]}.csv`));
const DELAY_MS = API_KEY ? 300 : 4500; // throttle: ~400/100s with key, ~25/100s without

// ---------- Helpers ----------
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(url, retries = 4) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.status === 429) {
        const wait = (i + 1) * 20000;
        console.log(`  ⏳ Rate limited (HTTP 429), waiting ${wait / 1000}s...`);
        await sleep(wait);
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = await res.json();
      // PSI sometimes returns HTTP 200 with an error body (quota / rate limit)
      if (data.error) {
        const code = data.error.code;
        if (code === 429 || code === 403) {
          const wait = (i + 1) * 20000;
          console.log(`  ⏳ Quota/rate error (${code}), waiting ${wait / 1000}s...`);
          await sleep(wait);
          continue;
        }
        throw new Error(`PSI API error ${code}: ${data.error.message}`);
      }
      return data;
    } catch (err) {
      if (i === retries - 1) throw err;
      console.log(`  ⚠️  Retry ${i + 1}/${retries}: ${err.message}`);
      await sleep(8000);
    }
  }
}

// ---------- PageSpeed Insights ----------
const PSI_BASE = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

async function auditUrl(url, strategy) {
  const params = new URLSearchParams({
    url,
    strategy,
    category: "performance",
    ...(API_KEY && { key: API_KEY }),
  });

  const data = await fetchWithRetry(`${PSI_BASE}?${params}`);

  const lhr = data.lighthouseResult || {};
  const audits = lhr.audits || {};
  const categories = lhr.categories || {};

  const perfScore = Math.round((categories.performance?.score ?? 0) * 100);
  const lcp = audits["largest-contentful-paint"]?.numericValue
    ? (audits["largest-contentful-paint"].numericValue / 1000).toFixed(2)
    : "N/A";
  const cls = audits["cumulative-layout-shift"]?.numericValue?.toFixed(3) ?? "N/A";
  const tbt = audits["total-blocking-time"]?.numericValue
    ? Math.round(audits["total-blocking-time"].numericValue)
    : "N/A";
  const fcp = audits["first-contentful-paint"]?.numericValue
    ? (audits["first-contentful-paint"].numericValue / 1000).toFixed(2)
    : "N/A";
  const si = audits["speed-index"]?.numericValue
    ? (audits["speed-index"].numericValue / 1000).toFixed(2)
    : "N/A";

  const crux = data.loadingExperience?.metrics || {};
  const inp = crux.INTERACTION_TO_NEXT_PAINT?.percentile ?? "N/A";

  return { perfScore, lcp, cls, tbt, fcp, si, inp };
}

// ---------- Platform & Schema Detection ----------
async function detectPlatformAndSchema(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SiteNovaAuditBot/1.0)" },
      redirect: "follow",
    });
    clearTimeout(timeout);

    const html = await res.text();
    const htmlLower = html.toLowerCase();

    let platform = "Custom/Unknown";
    if (htmlLower.includes("/wp-content/") || htmlLower.includes("wp-json") || htmlLower.includes("wordpress")) {
      platform = "WordPress";
    } else if (htmlLower.includes("wix.com") || htmlLower.includes("wixsite")) {
      platform = "Wix";
    } else if (htmlLower.includes("squarespace")) {
      platform = "Squarespace";
    } else if (htmlLower.includes("shopify") || htmlLower.includes("myshopify")) {
      platform = "Shopify";
    } else if (htmlLower.includes("webflow")) {
      platform = "Webflow";
    } else if (htmlLower.includes("godaddy") || htmlLower.includes("secureserver.net")) {
      platform = "GoDaddy";
    } else if (htmlLower.includes("weebly")) {
      platform = "Weebly";
    } else if (htmlLower.includes("blogger.com") || htmlLower.includes("blogspot")) {
      platform = "Blogger";
    } else if (htmlLower.includes("__next")) {
      platform = "Next.js";
    } else if (htmlLower.includes("_reactroot") || htmlLower.includes("__react")) {
      platform = "React (Custom)";
    }

    const hasSchema = htmlLower.includes("application/ld+json");
    const schemaTypes = [];
    const schemaRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = schemaRegex.exec(html)) !== null) {
      try {
        const parsed = JSON.parse(match[1]);
        const types = Array.isArray(parsed) ? parsed.map((p) => p["@type"]) : [parsed["@type"]];
        schemaTypes.push(...types.filter(Boolean).flat());
      } catch { /* malformed JSON-LD */ }
    }

    const hasSSL = url.startsWith("https://") || res.url.startsWith("https://");
    const hasMobileViewport = htmlLower.includes('name="viewport"') || htmlLower.includes("name='viewport'");

    return {
      platform,
      hasSchema,
      schemaTypes: [...new Set(schemaTypes)].join("; ") || "None",
      hasSSL,
      hasMobileViewport,
    };
  } catch {
    return {
      platform: "Error",
      hasSchema: false,
      schemaTypes: "Error",
      hasSSL: url.startsWith("https://"),
      hasMobileViewport: false,
    };
  }
}

// ---------- CSV Parsing ----------
function parseInputCsv(filepath) {
  const content = readFileSync(filepath, "utf-8");
  const lines = content.split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));

  const header = lines[0].toLowerCase();
  const hasHeader = header.includes("url") || header.includes("industry") || header.includes("business");
  const dataLines = hasHeader ? lines.slice(1) : lines;

  return dataLines.map((line) => {
    const parts = line.split(",").map((p) => p.trim());
    return {
      url: parts[0],
      business: parts[1] || "",
      industry: parts[2] || "",
    };
  }).filter((row) => row.url && row.url.startsWith("http"));
}

// ---------- Main ----------
async function main() {
  console.log("🔍 SiteNova Mumbai Website Audit Tool");
  console.log("═".repeat(50));

  if (!existsSync(INPUT_FILE)) {
    console.error(`❌ Input file not found: ${INPUT_FILE}`);
    console.log("   Create it with columns: url, business_name, industry");
    process.exit(1);
  }

  const urls = parseInputCsv(INPUT_FILE);
  console.log(`📋 Loaded ${urls.length} URLs from ${INPUT_FILE}`);
  console.log(`🔑 API Key: ${API_KEY ? "Yes (fast mode)" : "No (slow mode — get a free key for 15x speed)"}`);
  console.log(`⏱️  Estimated time: ~${Math.ceil((urls.length * 2 * DELAY_MS) / 60000)} minutes`);
  console.log("");

  const results = [];

  for (let i = 0; i < urls.length; i++) {
    const { url, business, industry } = urls[i];
    console.log(`[${i + 1}/${urls.length}] ${business || url}`);

    try {
      console.log("  📱 Mobile audit...");
      const mobile = await auditUrl(url, "mobile");
      await sleep(DELAY_MS);

      console.log("  🖥️  Desktop audit...");
      const desktop = await auditUrl(url, "desktop");
      await sleep(DELAY_MS);

      console.log("  🔎 Platform detection...");
      const meta = await detectPlatformAndSchema(url);

      const row = {
        url,
        business_name: business,
        industry,
        mobile_score: mobile.perfScore,
        mobile_lcp: mobile.lcp,
        mobile_cls: mobile.cls,
        mobile_tbt: mobile.tbt,
        mobile_fcp: mobile.fcp,
        mobile_si: mobile.si,
        mobile_inp_crux: mobile.inp,
        desktop_score: desktop.perfScore,
        desktop_lcp: desktop.lcp,
        desktop_cls: desktop.cls,
        desktop_tbt: desktop.tbt,
        desktop_fcp: desktop.fcp,
        desktop_si: desktop.si,
        platform: meta.platform,
        has_ssl: meta.hasSSL ? "Yes" : "No",
        has_schema: meta.hasSchema ? "Yes" : "No",
        schema_types: meta.schemaTypes,
        mobile_viewport: meta.hasMobileViewport ? "Yes" : "No",
      };

      results.push(row);
      console.log(`  ✅ Mobile: ${mobile.perfScore}/100 | Desktop: ${desktop.perfScore}/100 | ${meta.platform}`);
    } catch (err) {
      console.log(`  ❌ Failed: ${err.message}`);
      results.push({
        url, business_name: business, industry,
        mobile_score: "Error", mobile_lcp: "", mobile_cls: "", mobile_tbt: "",
        mobile_fcp: "", mobile_si: "", mobile_inp_crux: "",
        desktop_score: "Error", desktop_lcp: "", desktop_cls: "", desktop_tbt: "",
        desktop_fcp: "", desktop_si: "",
        platform: "", has_ssl: "", has_schema: "", schema_types: "", mobile_viewport: "",
      });
    }
    console.log("");
  }

  // ---------- Write CSV ----------
  if (results.length === 0) {
    console.log("No results to write.");
    return;
  }

  const headers = Object.keys(results[0]);
  const csvLines = [
    headers.join(","),
    ...results.map((row) =>
      headers.map((h) => {
        const val = String(row[h] ?? "");
        return val.includes(",") || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val;
      }).join(",")
    ),
  ];

  writeFileSync(OUTPUT_FILE, csvLines.join("\n"), "utf-8");
  console.log("═".repeat(50));
  console.log(`📊 Results written to: ${OUTPUT_FILE}`);
  console.log(`📋 Total sites audited: ${results.length}`);

  // ---------- Summary Stats ----------
  const validMobile = results.filter((r) => typeof r.mobile_score === "number");
  if (validMobile.length > 0) {
    const avgMobile = Math.round(validMobile.reduce((s, r) => s + r.mobile_score, 0) / validMobile.length);
    const avgDesktop = Math.round(validMobile.reduce((s, r) => s + (r.desktop_score || 0), 0) / validMobile.length);
    const failingMobile = validMobile.filter((r) => r.mobile_score < 50).length;
    const noSchema = validMobile.filter((r) => r.has_schema === "No").length;
    const noSSL = validMobile.filter((r) => r.has_ssl === "No").length;
    const wpCount = validMobile.filter((r) => r.platform === "WordPress").length;

    console.log("");
    console.log("📈 Quick Stats (for your report):");
    console.log(`   Avg Mobile Score:     ${avgMobile}/100`);
    console.log(`   Avg Desktop Score:    ${avgDesktop}/100`);
    console.log(`   Failing Mobile (<50): ${failingMobile}/${validMobile.length} (${Math.round(failingMobile / validMobile.length * 100)}%)`);
    console.log(`   No Schema Markup:     ${noSchema}/${validMobile.length} (${Math.round(noSchema / validMobile.length * 100)}%)`);
    console.log(`   No SSL:               ${noSSL}/${validMobile.length} (${Math.round(noSSL / validMobile.length * 100)}%)`);
    console.log(`   WordPress:            ${wpCount}/${validMobile.length} (${Math.round(wpCount / validMobile.length * 100)}%)`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
