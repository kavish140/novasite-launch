import { SITE_URL } from "./constants";

/** Consolidate overlapping legacy articles into maintained local or editorial guides. */
export const legacyLocalArticles: Record<string, string> = {
  "web-design-company-in-thane-2026": "/location/thane",
  "web-design-company-in-andheri-2026": "/location/andheri",
  "web-design-company-in-powai-2026": "/location/powai",
  "wix-vs-real-website-bhandup-businesses": "/location/bhandup",
  "why-small-business-mulund-needs-website": "/location/mulund",
  "beyond-aesthetics-building-lightning-fast-experiences-with-sitenova": "/blog/pagespeed-score-95-mumbai-case-study",
  "why-mumbai-businesses-need-fast-mobile-websites": "/blog/pagespeed-score-95-mumbai-case-study",
  "why-ultra-fast-websites-win-local-seo": "/blog/pagespeed-score-95-mumbai-case-study",
  "how-local-seo-doubles-foot-traffic-mulund": "/blog/local-seo-mumbai-businesses-guide-2026",
  "5-signs-your-website-is-losing-customers": "/blog/small-business-website-mistakes-losing-customers",
  "how-much-does-a-website-cost-in-india-2026": "/blog/website-cost-mumbai-2026",
  "ecommerce-website-cost-mumbai-2026": "/blog/ecommerce-website-cost-mumbai",
  "is-your-website-ready-for-diwali-2026-checklist": "/blog/website-ready-navratri-diwali-2026-mumbai",
  "why-business-needs-a-website-2026": "/blog/google-business-profile-vs-website-do-you-need-both",
  "why-diy-website-builders-cost-you-customers": "/blog/wordpress-vs-custom-website-mumbai-business",
  "optimize-google-business-profile-2026-update": "/blog/local-seo-mumbai-businesses-guide-2026",
  "google-business-profile-verification-harder-2026": "/blog/local-seo-mumbai-businesses-guide-2026",
  "openai-agent-medicare-breach-disclosure-delay": "/blog/openai-agent-medicare-portal-breach",
};

/** Readable words only: block boundaries must not join adjacent words. */
export function articleText(content: string = ""): string {
  return content.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ").replace(/<[^>]*>/g, " ")
    .replace(/&(?:nbsp|#160|#xA0);/gi, " ").replace(/&[a-z0-9#]+;/gi, " ")
    .replace(/\s+/g, " ").trim();
}

export function readingStats(content: string = "") {
  const text = articleText(content);
  const wordCount = text ? text.split(/\s+/).length : 0;
  return { wordCount, reading_time_minutes: Math.max(1, Math.ceil(wordCount / 200)) };
}

/** Only absolute public HTTPS URLs; never emit credentials or script schemes. */
export function validCanonicalUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || url.username || url.password || url.port || url.hash || url.search) return null;
    if (!url.hostname.includes(".") || /^(localhost|127\.|0\.|192\.168\.|10\.)/.test(url.hostname)) return null;
    return url.href;
  } catch { return null; }
}

export function postCanonical(post: { slug: string; canonical_url?: string | null }) {
  return validCanonicalUrl(post.canonical_url) ?? `${SITE_URL}/blog/${post.slug}`;
}

export function isOriginalPost(post: { slug: string; canonical_url?: string | null }) {
  return !legacyLocalArticles[post.slug] && postCanonical(post) === `${SITE_URL}/blog/${post.slug}`;
}

/** Compute on the server, then omit article bodies from listing/related payloads. */
export function summarizePost<T extends { content?: string; excerpt?: string | null }>(post: T) {
  const { content, ...summary } = post;
  return { ...summary, excerpt: post.excerpt?.trim() || articleText(content).slice(0, 190), ...readingStats(content) };
}
