/**
 * buildMeta() — single source of truth for all page-level <head> tags.
 *
 * Replaces three legacy SEO systems:
 *   1. <SEO> component (react-helmet-async)
 *   2. setPageSeo() imperative DOM manipulation
 *   3. seoRoutes.js build-time regex injection
 *
 * Usage in any route file:
 *   export function meta() {
 *     return buildMeta({ title: "...", description: "...", canonicalPath: "/..." });
 *   }
 *
 * Returns an array compatible with RR7's MetaDescriptor[].
 */

const SITE_NAME = "SiteNova";
const SITE_URL = "https://sitenova.dev";
const DEFAULT_OG_IMAGE = `${SITE_URL}/seo-preview.png`;
const TWITTER_HANDLE = "@kavish140";

interface MetaOptions {
  title: string;
  description: string;
  canonicalPath?: string;
  image?: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  robots?: string;
  locale?: string;
  noindex?: boolean;
}

export function buildMeta({
  title,
  description,
  canonicalPath = "/",
  image,
  keywords = [],
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  robots,
  locale = "en_IN",
  noindex = false,
}: MetaOptions) {
  const canonicalUrl =
    canonicalPath === "/"
      ? `${SITE_URL}/`
      : `${SITE_URL}${canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`}`;
  const ogImage = image?.startsWith("http")
    ? image
    : image
      ? `${SITE_URL}${image}`
      : DEFAULT_OG_IMAGE;

  const meta: Record<string, string>[] = [
    // Standard
    { title },
    { name: "description", content: description },
    { name: "robots", content: noindex ? "noindex, nofollow" : (robots || "index, follow") },
    { name: "author", content: author || "Kavish Ganatra" },

    // Open Graph
    { property: "og:type", content: type },
    { property: "og:url", content: canonicalUrl },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: ogImage },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:locale", content: locale },

    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:url", content: canonicalUrl },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
    { name: "twitter:site", content: TWITTER_HANDLE },
    { name: "twitter:creator", content: TWITTER_HANDLE },
  ];

  // Keywords
  if (keywords.length > 0) {
    meta.push({ name: "keywords", content: keywords.join(", ") });
  }

  // Article-specific
  if (type === "article") {
    if (publishedTime) {
      meta.push({ property: "article:published_time", content: publishedTime });
    }
    if (modifiedTime) {
      meta.push({ property: "article:modified_time", content: modifiedTime });
    }
    if (author) {
      meta.push({ property: "article:author", content: author });
    }
  }

  // Canonical link (RR7 supports tagName: "link" in meta())
  meta.push({
    tagName: "link",
    rel: "canonical",
    href: canonicalUrl,
  } as any);

  return meta;
}

export { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE, TWITTER_HANDLE };
