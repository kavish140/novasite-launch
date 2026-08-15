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
        testimonialQuote:
          "Truly impressed with the fantastic work done by Site Nova's team on JupiterFinance.com. The website is exceptionally well-designed — modern, sleek, and highly professional in appearance. Every element feels thoughtfully placed, creating a smooth and engaging user experience. Their attention to detail and design aesthetics really stand out. Highly appreciative of the quality and finesse they bring to their work!",
        testimonialAuthor: "Jupiter Fast Finance",
        testimonialRole: "Finance Advisory, Mulund, Mumbai",
      }}
      project={{
        headline:
          "A finance advisory site that builds trust before the first phone call",
        summary:
          "Jupiter Finance is a Mulund-based loan and investment advisory serving Mumbai, Thane, and nearby suburbs. SiteNova built a sleek, dark-themed website covering all five service verticals — home loans, LAP, mutual funds, SIP, and health insurance — with a WhatsApp lead funnel and fast load times that match the brand's own 'fast' promise.",
        stats: [
          { label: "Delivery", value: "10 Days" },
          { label: "PageSpeed Score", value: "95 / 100" },
          { label: "Service Verticals", value: "5" },
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
              "Primary CTA across every page routes prospects to WhatsApp — the preferred contact channel for Indian finance clients who want a real conversation, fast.",
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
              "Google Analytics 4 tracking with conversion events, geo-targeting, and max-image-preview robots meta — so Jupiter can see exactly where leads come from.",
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
      projectImage=""
    />
  );
}
