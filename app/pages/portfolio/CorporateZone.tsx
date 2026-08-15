import PortfolioPageTemplate from "@/components/PortfolioPageTemplate";
import {
  Search,
  ClipboardList,
  Layers,
  ShoppingBag,
  MessageCircle,
  Zap,
  Globe,
  Package,
} from "lucide-react";

export default function CorporateZone() {
  return (
    <PortfolioPageTemplate
      backSlug="corporate-zone"
      client={{
        name: "Corporatezone",
        role: "Wholesale Stationery & Business Essentials · Lower Parel, Mumbai",
        liveUrl: "https://corporatezone.in",
        // No testimonial — review pending
      }}
      project={{
        headline:
          "A B2B wholesale catalog that turns bulk inquiries into bulk orders",
        summary:
          "Corporatezone is a B2B wholesale stationery and business essentials distributor based in Lower Parel, Mumbai, supplying corporate buyers across India. SiteNova built a full product catalog with 9 categories, a quote-basket inquiry system, real-time search and filter, and a WhatsApp CTA — all on Cloudflare Workers for fast load times for pan-India buyers.",
        stats: [
          { label: "Product Categories", value: "9" },
          { label: "PageSpeed Score", value: "90+" },
          { label: "Industry", value: "B2B Wholesale" },
          { label: "Location", value: "Lower Parel, Mumbai" },
        ],
        features: [
          {
            icon: Layers,
            title: "9-Category Product Catalog",
            description:
              "Stationery, Housekeeping, Pantry, Computer Peripherals, Printing, Food Packaging, Road Safety, Promotional & Gifting, and Decoration — all browsable from a single unified catalog interface.",
          },
          {
            icon: ClipboardList,
            title: "Quote Basket System",
            description:
              "Corporate buyers add products to a quote basket and submit a single bulk inquiry — streamlining the B2B procurement workflow instead of sending individual WhatsApp messages for each item.",
          },
          {
            icon: Search,
            title: "Real-Time Search & Filter Sidebar",
            description:
              "Instant product search with a category filter sidebar lets distributors and procurement managers find exactly what they need across hundreds of SKUs without scrolling.",
          },
          {
            icon: Globe,
            title: "Schema.org OfferCatalog",
            description:
              "Full structured data — Organization, LocalBusiness, and OfferCatalog schema — helps Corporatezone appear in Google's product results and knowledge panel for B2B searches.",
          },
          {
            icon: MessageCircle,
            title: "WhatsApp Inquiry CTA",
            description:
              "A persistent WhatsApp button links directly to the Corporatezone sales team — the primary channel for Indian B2B buyers to negotiate bulk pricing quickly.",
          },
          {
            icon: ShoppingBag,
            title: "Hero Carousel (6 Categories)",
            description:
              "A full-width carousel with 6 category slides — Office Supplies, Housekeeping, Pantry, Printing, IT Gear — gives buyers an immediate visual overview of the full catalog range.",
          },
          {
            icon: Zap,
            title: "Cloudflare Edge Delivery",
            description:
              "Deployed on Cloudflare Workers with edge caching — ensuring fast load times for corporate buyers across Mumbai, Delhi, Bangalore, and other pan-India locations.",
          },
          {
            icon: Package,
            title: "Cloudflare Web Analytics",
            description:
              "Privacy-respecting Cloudflare Insights tracks catalog traffic and buyer behaviour — giving the Corporatezone team data to understand which product categories drive the most inquiries.",
          },
        ],
        techStack: [
          "React Router v7",
          "Cloudflare Workers",
          "Tailwind CSS",
          "Framer Motion",
          "Supabase",
          "Cloudflare Insights",
          "Schema.org",
        ],
        industry: "B2B Wholesale · Stationery & Office Supplies",
        location: "Lower Parel, Mumbai",
      }}
      projectImage=""
    />
  );
}
