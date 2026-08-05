import { buildMeta, SITE_URL } from "./meta";

interface LocationMetaOptions {
  locationName: string;
  keywords?: string[];
}

/**
 * Builds meta tags for location pages.
 * Follows the exact same title/description pattern as the current LocationPageTemplate.
 */
export function buildLocationMeta({ locationName, keywords = [] }: LocationMetaOptions) {
  const slug = locationName.toLowerCase().replace(/\s+/g, "-");

  return buildMeta({
    title: `Website Designer in ${locationName}, Mumbai | 7-Day Delivery | SiteNova`,
    description: `Looking for a website designer in ${locationName}? SiteNova builds fast, SEO-ready websites for businesses in ${locationName} — delivered in 7–14 days, from ₹10,000. Free audit included.`,
    canonicalPath: `/location/${slug}`,
    keywords,
  });
}

/**
 * Builds the JSON-LD structured data for location pages.
 * Matches the current LocationPageTemplate's jsonLd prop exactly.
 */
export function buildLocationJsonLd(locationName: string) {
  return [
    {
      "@context": "https://schema.org",
      "@type": ["ProfessionalService", "LocalBusiness"],
      name: "SiteNova",
      url: SITE_URL,
      sameAs: [
        "https://share.google/Y6mq6VLzTQj9zN4kr",
        "https://www.clutch.co/profile/sitenova",
        "https://techbehemoths.com/company/sitenova",
      ],
      telephone: "+91-9326060621",
      email: "kavishganatra5@gmail.com",
      priceRange: "₹₹",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Mulund",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 19.1726,
        longitude: 72.957,
      },
      hasMap: "https://share.google/Y6mq6VLzTQj9zN4kr",
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday", "Tuesday", "Wednesday",
            "Thursday", "Friday", "Saturday",
          ],
          opens: "09:00",
          closes: "21:00",
        },
      ],
      areaServed: {
        "@type": "City",
        name: locationName,
      },
      serviceType: "Web Design and Development",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `How much does a website cost in ${locationName}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `SiteNova offers professional website design starting from ₹10,000 for businesses in ${locationName}. Final pricing depends on pages, features, and complexity.`,
          },
        },
        {
          "@type": "Question",
          name: `How long does it take to build a website for a business in ${locationName}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `Most websites for businesses in ${locationName} are delivered within 7–14 days. Complex projects may take up to 21 days.`,
          },
        },
        {
          "@type": "Question",
          name: `Do you offer SEO for businesses in ${locationName}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `Yes. Every SiteNova website comes with on-page SEO, Schema.org structured data, and Core Web Vitals optimisation built in — helping businesses in ${locationName} rank higher on Google.`,
          },
        },
      ],
    },
  ];
}
