import { buildMeta, SITE_URL } from "./meta";
import { buildOrganizationJsonLd, buildFaqJsonLd } from "./seo";
import { locationContent } from "./location-content";

export function buildLocationMeta({ locationName, keywords = [] }: { locationName: string; keywords?: string[] }) {
  const market = locationContent[locationName];
  return buildMeta({
    title: `${locationName} Business Websites | ${market.heading} | SiteNova`,
    description: market.introduction,
    canonicalPath: `/location/${locationName.toLowerCase().replace(/\s+/g, "-")}`,
    keywords,
  });
}

export function buildLocationJsonLd(locationName: string) {
  const market = locationContent[locationName];
  return [
    { ...buildOrganizationJsonLd(), "@type": "ProfessionalService", "@id": `${SITE_URL}/#business`, areaServed: { "@type": "Place", name: locationName } },
    buildFaqJsonLd(market.suburbSpecificFAQs.map(({ q, a }) => ({ question: q, answer: a }))),
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: locationName, item: `${SITE_URL}/location/${locationName.toLowerCase().replace(/\s+/g, "-")}` }
    ] }
  ];
}
