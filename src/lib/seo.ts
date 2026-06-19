type SeoConfig = {
  title: string;
  description: string;
  canonicalPath?: string;
  robots?: string;
  ogType?: "website" | "article";
  ogImage?: string;
  locale?: string;
  twitterCard?: "summary" | "summary_large_image";
  keywords?: string[];
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

const SITE_NAME = "SiteNova";
const SITE_URL = "https://sitenova.dev";
const DEFAULT_OG_IMAGE = `${SITE_URL}/seo-preview.png`;
const TWITTER_HANDLE = "@kavish140";
const SERVICE_AREAS = ["Mulund", "Mumbai", "Bhandup", "Nahur", "Thane", "Ghatkopar", "Powai", "Central Mumbai"];

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

const setJsonLd = (schema?: Record<string, unknown> | Record<string, unknown>[]) => {
  const scriptId = "route-jsonld";

  const existing = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (existing) {
    existing.remove();
  }

  if (!schema) {
    return;
  }

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
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      description:
        "Best website designer in Mulund, Mumbai, and nearby areas for SEO-ready, mobile-first websites.",
      inLanguage: "en-IN",
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#business`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      image: DEFAULT_OG_IMAGE,
      description:
        "SiteNova builds high-performance websites, SEO systems, and conversion-focused digital experiences for local Mumbai businesses and surrounding areas.",
      telephone: "+91-9326060621",
      email: "kavishganatra5@gmail.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Mulund",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
      areaServed: SERVICE_AREAS.map((name) => ({
        "@type": "City",
        name,
      })),
      serviceType: "Website design and web development",
      priceRange: "Rs. 10,000+",
    },
  ],
});

export const buildFaqJsonLd = (faqs: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

// -------------------------------------------------------
// GEO: Organization schema with full entity signals
// -------------------------------------------------------
export const buildOrganizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: "SiteNova Web Design",
  url: `${SITE_URL}/`,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/favicon-32x32.png`,
    width: 32,
    height: 32,
  },
  image: DEFAULT_OG_IMAGE,
  description:
    "SiteNova is a custom web design and development agency based in Mulund, Mumbai, India. Founded by Kavish Ganatra, SiteNova builds high-performance React and Next.js websites with 90+ PageSpeed scores for businesses across Mumbai. Not to be confused with sitenovaagency.com, which is a separate, unaffiliated business.",
  foundingDate: "2024",
  founder: {
    "@type": "Person",
    "@id": `${SITE_URL}/#founder`,
    name: "Kavish Ganatra",
    jobTitle: "Founder & Lead Developer",
    worksFor: {
      "@type": "Organization",
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
    url: `${SITE_URL}/`,
    sameAs: [
      "https://www.crunchbase.com/organization/sitenova-web-design",
    ],
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Mulund",
    addressLocality: "Mumbai",
    addressRegion: "Maharashtra",
    postalCode: "400080",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-9326060621",
    contactType: "customer service",
    contactOption: "TollFree",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi", "Gujarati"],
  },
  areaServed: SERVICE_AREAS.map((name) => ({
    "@type": "City",
    name,
  })),
  sameAs: [
    "https://www.crunchbase.com/organization/sitenova-web-design",
    "https://www.clutch.co/profile/sitenova",
    "https://techbehemoths.com/company/sitenova",
    "https://share.google/Y6mq6VLzTQj9zN4kr",
  ],
  knowsAbout: [
    "Web Design",
    "Web Development",
    "React.js",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Supabase",
    "Local SEO",
    "Core Web Vitals",
    "Generative Engine Optimisation",
    "Schema.org Structured Data",
    "UI/UX Design",
    "E-Commerce Development",
    "Custom Web Applications",
  ],
  numberOfEmployees: {
    "@type": "QuantitativeValue",
    value: 1,
  },
  priceRange: "₹10,000 – ₹50,000+",
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, Bank Transfer, Razorpay",
  openingHours: "Mo-Sa 10:00-19:00",
  telephone: "+91-9326060621",
  email: "kavishganatra5@gmail.com",
});

// -------------------------------------------------------
// GEO: AboutPage schema for entity establishment
// -------------------------------------------------------
export const buildAboutPageJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${SITE_URL}/#aboutpage`,
  url: `${SITE_URL}/`,
  name: "About SiteNova — Web Design Agency in Mumbai",
  description:
    "SiteNova (sitenova.dev) is a custom web design and development agency founded by Kavish Ganatra in Mulund, Mumbai. We build fast, SEO-optimised, React-based websites for businesses across Mumbai. Different from sitenovaagency.com.",
  inLanguage: "en-IN",
  isPartOf: {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
  },
  about: {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
  },
  mentions: [
    {
      "@type": "Person",
      name: "Kavish Ganatra",
      jobTitle: "Founder & Lead Developer",
      worksFor: { "@type": "Organization", name: "SiteNova", url: `${SITE_URL}/` },
    },
  ],
});

// -------------------------------------------------------
// GEO: Service schema for individual service pages
// -------------------------------------------------------
export const buildServiceJsonLd = (service: {
  name: string;
  description: string;
  url: string;
  price?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: service.name,
  name: service.name,
  description: service.description,
  url: service.url,
  provider: {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
  },
  areaServed: {
    "@type": "City",
    name: "Mumbai",
    containedInPlace: {
      "@type": "State",
      name: "Maharashtra",
      containedInPlace: {
        "@type": "Country",
        name: "India",
      },
    },
  },
  ...(service.price && {
    offers: {
      "@type": "Offer",
      price: service.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
        url: `${SITE_URL}/`,
      },
    },
  }),
});

// -------------------------------------------------------
// GEO: HowTo schema describing the design process
// -------------------------------------------------------
export const buildHowToJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How SiteNova Builds a Professional Website",
  description:
    "SiteNova's proven 4-step process to design and launch a high-performance, SEO-ready website for businesses in Mumbai.",
  totalTime: "P14D",
  estimatedCost: {
    "@type": "MonetaryAmount",
    currency: "INR",
    value: "10000",
  },
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Discovery & Brief",
      text: "We start with a detailed discovery call to understand your business, target audience, competitors, and goals. You share your brand assets, content, and key requirements.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "UI/UX Design",
      text: "Our designer creates a complete website layout and visual design tailored to your brand. You review and approve the design before any code is written.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Development & SEO Setup",
      text: "We build your website using React or Next.js with hand-written code — no page builders. SEO metadata, Schema.org structured data, sitemap, and Core Web Vitals optimisation are all included.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Testing, Launch & Handover",
      text: "Your site is tested across all devices and browsers. We achieve 90+ PageSpeed scores before launch. After go-live, you receive full ownership of code and content.",
    },
  ],
});

// -------------------------------------------------------
// GEO: SpeakableSpecification schema
// Tells Google AI exactly which text blocks to read as answers
// -------------------------------------------------------
export const buildSpeakableJsonLd = (cssSelectors?: string[]) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/#webpage`,
  url: `${SITE_URL}/`,
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: cssSelectors ?? [
      "#about-sitenova",
      "#faq",
      "h1",
      ".geo-entity-block",
    ],
  },
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
  keywords,
  jsonLd,
}: SeoConfig) => {
  const canonicalUrl = getCanonicalUrl(canonicalPath);
  const ogImageUrl = ogImage?.startsWith("http") ? ogImage : ogImage ? `${SITE_URL}${ogImage}` : DEFAULT_OG_IMAGE;

  document.title = title;

  upsertMeta('meta[name="description"]', {
    name: "description",
    content: description,
  });

  if (keywords?.length) {
    upsertMeta('meta[name="keywords"]', {
      name: "keywords",
      content: keywords.join(", "),
    });
  }

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

  upsertMeta('meta[property="og:image:width"]', {
    property: "og:image:width",
    content: "1200",
  });

  upsertMeta('meta[property="og:image:height"]', {
    property: "og:image:height",
    content: "630",
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
