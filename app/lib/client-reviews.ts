export interface ClientReview {
  name: string;
  role: string;
  website: string;
  caseStudyPath: string;
  rating: number;
  source?: "Google";
  content?: string;
}

// Existing client wording is preserved. Corporatezone supplied only a Google
// star rating, confirmed by the owner; do not invent a written testimonial.
export const clientReviews: Record<string, ClientReview> = {
  "jupiter-finance": {
    name: "Jupiter Fast Finance",
    role: "Finance Advisory · Mulund, Mumbai",
    website: "https://jupiterfastfinance.com",
    caseStudyPath: "/portfolio/jupiter-fast-finance",
    rating: 5,
    content:
      "Truly impressed with the fantastic work done by Site Nova's team on JupiterFinance.com. The website is exceptionally well-designed — modern, sleek, and highly professional in appearance. Every element feels thoughtfully placed, creating a smooth and engaging user experience. Their attention to detail and design aesthetics really stand out. Highly appreciative of the quality and finesse they bring to their work!",
  },
  "dr-dipti-ganatra": {
    name: "Dr. Dipti Ganatra",
    role: "MD (Homeopathy) · Mulund West, Mumbai",
    website: "https://drdiptiganatra.com",
    caseStudyPath: "/portfolio/dr-dipti-ganatra",
    rating: 5,
    content:
      "Absolutely thrilled with my website www.drdiptiganatra.com! Site Nova's team built it beautifully in a very short span of time, with complete database integration and seamless functionality. The design is clean, professional, and perfectly reflects my practice. Since its launch, I've seen improved patient engagement and steady growth in my business. Highly recommend their team for anyone looking for a powerful and well-executed website!",
  },
  "corporate-zone": {
    name: "Corporatezone",
    role: "Stationery & Business Essentials · Lower Parel, Mumbai",
    website: "https://corporatezone.in",
    caseStudyPath: "/portfolio/corporate-zone",
    rating: 5,
    source: "Google",
  },
};
