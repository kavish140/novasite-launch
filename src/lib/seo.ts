type SeoConfig = {
  title: string;
  description: string;
  canonicalPath?: string;
  robots?: string;
  ogType?: "website" | "article";
  ogImage?: string;
  locale?: string;
  twitterCard?: "summary" | "summary_large_image";
  jsonLd?: Record<string, unknown>;
};

const SITE_NAME = "SiteNova";
const SITE_URL = "https://sitenova.dev";
const DEFAULT_OG_IMAGE = `${SITE_URL}/seo-preview.svg`;
const TWITTER_HANDLE = "@kavish140";

const upsertMeta = (selector: string, attributes: Record<string, string>) => {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element!.setAttribute(key, value);
  });
};

const upsertLink = (selector: string, attributes: Record<string, string>) => {
  let element = document.head.querySelector(selector) as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element!.setAttribute(key, value);
  });
};

const setJsonLd = (schema: Record<string, unknown>) => {
  const scriptId = "route-jsonld";
  let script = document.getElementById(scriptId) as HTMLScriptElement | null;

  if (!script) {
    script = document.createElement("script");
    script.id = scriptId;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }

  script.text = JSON.stringify(schema);
};

const getCanonicalUrl = (path: string = "/") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (normalizedPath === "/") {
    return `${SITE_URL}/`;
  }

  return `${SITE_URL}${normalizedPath}`;
};

export const buildLocalBusinessJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#business`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  image: DEFAULT_OG_IMAGE,
  description:
    "SiteNova builds high-performance websites, SEO systems, and conversion-focused digital experiences for local Mumbai businesses and global clients.",
  telephone: "+91-9326060621",
  email: "kavish@sitenova.dev",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Mulund",
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },
  areaServed: [
    { "@type": "City", name: "Mumbai" },
    { "@type": "Place", name: "India" },
    { "@type": "Place", name: "Worldwide" },
  ],
  priceRange: "$$",
});

export const setPageSeo = ({
  title,
  description,
  canonicalPath = "/",
  robots = "index, follow",
  ogType = "website",
  ogImage,
  locale = "en_IN",
  twitterCard = "summary_large_image",
  jsonLd,
}: SeoConfig) => {
  const canonicalUrl = getCanonicalUrl(canonicalPath);
  const ogImageUrl = ogImage?.startsWith("http") ? ogImage : ogImage ? `${SITE_URL}${ogImage}` : DEFAULT_OG_IMAGE;

  document.title = title;

  upsertMeta('meta[name="description"]', {
    name: "description",
    content: description,
  });

  upsertMeta('meta[name="robots"]', {
    name: "robots",
    content: robots,
  });

  upsertLink('link[rel="canonical"]', {
    rel: "canonical",
    href: canonicalUrl,
  });

  upsertMeta('meta[property="og:title"]', {
    property: "og:title",
    content: title,
  });

  upsertMeta('meta[property="og:description"]', {
    property: "og:description",
    content: description,
  });

  upsertMeta('meta[property="og:type"]', {
    property: "og:type",
    content: ogType,
  });

  upsertMeta('meta[property="og:site_name"]', {
    property: "og:site_name",
    content: SITE_NAME,
  });

  upsertMeta('meta[property="og:url"]', {
    property: "og:url",
    content: canonicalUrl,
  });

  upsertMeta('meta[property="og:image"]', {
    property: "og:image",
    content: ogImageUrl,
  });

  upsertMeta('meta[property="og:locale"]', {
    property: "og:locale",
    content: locale,
  });

  upsertMeta('meta[name="twitter:card"]', {
    name: "twitter:card",
    content: twitterCard,
  });

  upsertMeta('meta[name="twitter:title"]', {
    name: "twitter:title",
    content: title,
  });

  upsertMeta('meta[name="twitter:description"]', {
    name: "twitter:description",
    content: description,
  });

  upsertMeta('meta[name="twitter:image"]', {
    name: "twitter:image",
    content: ogImageUrl,
  });

  upsertMeta('meta[name="twitter:site"]', {
    name: "twitter:site",
    content: TWITTER_HANDLE,
  });

  if (jsonLd) {
    setJsonLd(jsonLd);
  }
};
