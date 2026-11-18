import { clientReviews } from "@/lib/client-reviews";
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
        review: clientReviews["corporate-zone"],
      }}
      project={{
        headline:
          "A B2B wholesale catalog with a consolidated enquiry basket",
        summary:
          "Corporatezone is a B2B wholesale stationery and business essentials distributor based in Lower Parel, Mumbai, supplying corporate buyers across India. SiteNova built a full product catalog with 9 categories, a quote-basket inquiry system, real-time search and filter, and a WhatsApp CTA — all on Cloudflare Workers for fast load times for pan-India buyers.",
        stats: [
          { label: "Product Categories", value: "9" },
          { label: "Hosting", value: "Cloudflare Workers" },
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
              "Structured data describes the organisation and catalog information. Schema validation and search-feature eligibility are separate checks; a particular result presentation is not guaranteed.",
          },
          {
            icon: MessageCircle,
            title: "WhatsApp Inquiry CTA",
            description:
              "A persistent WhatsApp button links directly to the Corporatezone sales team — the primary channel for Indian B2B buyers to negotiate bulk pricing quickly.",
          },
          {
            icon: ShoppingBag,
            title: "Category Carousel",
            description:
              "A category carousel introduces the catalog, with browsing and search providing routes to product information and the quote basket.",
          },
          {
            icon: Zap,
            title: "Cloudflare Edge Delivery",
            description:
              "Deployed on Cloudflare Workers. Delivery and cache behaviour still need testing for the actual page and visitor conditions; hosting alone does not guarantee a load time.",
          },
          {
            icon: Package,
            title: "Cloudflare Web Analytics",
            description:
              "Cloudflare Web Analytics provides site-usage observations. Enquiry attribution needs an appropriately configured event and business-record process; a visitor count alone does not identify which category generated a sale.",
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
    />
  );
}
