import { clientReviews } from "@/lib/client-reviews";
import PortfolioPageTemplate from "@/components/PortfolioPageTemplate";
import {
  Home,
  Building2,
  TrendingUp,
  ShieldCheck,
  MessageCircle,
  Smartphone,
  Search,
  Zap,
} from "lucide-react";

export default function JupiterFastFinance() {
  return (
    <PortfolioPageTemplate
      backSlug="jupiter-fast-finance"
      client={{
        name: "Jupiter Fast Finance",
        role: "Finance Advisory & Loan Consultancy · Mulund, Mumbai",
        liveUrl: "https://jupiterfastfinance.com",
        review: clientReviews["jupiter-finance"],
      }}
      project={{
        headline:
          "A finance advisory site that builds trust before the first phone call",
        summary:
          "Jupiter Finance is based in Mulund and presents lending, insurance and investment-related services. SiteNova's website work organises service information and contact routes. The client's maintained site is the reference for current offerings; the case study does not verify product suitability or regulatory eligibility.",
        stats: [
          { label: "Contact", value: "Enquiry and WhatsApp" },
          { label: "Design", value: "Mobile responsive" },
          { label: "Content", value: "Service information" },
          { label: "Location", value: "Mulund, Mumbai" },
        ],
        features: [
          {
            icon: Home,
            title: "Home Loan Section",
            description:
              "Dedicated content for Mumbai home loan seekers — eligibility, documentation, and a direct inquiry CTA that feeds into the WhatsApp funnel.",
          },
          {
            icon: Building2,
            title: "Loan Against Property (LAP)",
            description:
              "Clear service page explaining LAP options, interest structure, and use cases — written to convert commercial property owners in Mulund and Thane.",
          },
          {
            icon: TrendingUp,
            title: "Mutual Funds & SIP Planning",
            description:
              "Investment advisory section covering mutual fund products and SIP planning with trust signals that differentiate Jupiter from generic digital platforms.",
          },
          {
            icon: ShieldCheck,
            title: "Health Insurance Advisory",
            description:
              "A dedicated health insurance page targeting Mulund families and businesses looking for an advisor they can meet in person.",
          },
          {
            icon: MessageCircle,
            title: "WhatsApp Lead Capture",
            description:
              "WhatsApp is one contact route alongside the site's enquiry options. Opening the messaging app is not proof that an enquiry was sent or a service accepted.",
          },
          {
            icon: Search,
            title: "Geo-Targeted SEO",
            description:
              "Canonical URLs, meta geo tags (IN-MH), structured data, and keyword targeting for searches like 'home loan Mulund' and 'loan consultant Mumbai'.",
          },
          {
            icon: Zap,
            title: "Premium Dark UI",
            description:
              "A professional dark theme with Space Grotesk headings and Inter body — conveying the credibility and modernity that finance clients expect before picking up the phone.",
          },
          {
            icon: Smartphone,
            title: "GA4 Analytics Integration",
            description:
              "Analytics can describe configured website events. Attribution depends on the implementation and available observations; robots metadata and geographic tags do not themselves track or locate leads.",
          },
        ],
        techStack: [
          "React",
          "Vite",
          "Tailwind CSS",
          "Framer Motion",
          "Cloudflare Pages",
          "Google Analytics 4",
          "Schema.org",
        ],
        industry: "Finance & Loans",
        location: "Mulund, Mumbai",
      }}
    />
  );
}
