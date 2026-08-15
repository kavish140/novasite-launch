import PortfolioPageTemplate from "@/components/PortfolioPageTemplate";
import {
  Calendar,
  ClipboardList,
  Star,
  MapPin,
  Smartphone,
  Search,
  Database,
  Users,
} from "lucide-react";

export default function DrDiptiGanatra() {
  return (
    <PortfolioPageTemplate
      backSlug="dr-dipti-ganatra"
      client={{
        name: "Dr. Dipti Ganatra",
        role: "MD (Homeopathy) · Maharashtra CET Rank 1 · Mulund West",
        liveUrl: "https://drdiptiganatra.com",
        testimonialQuote:
          "Absolutely thrilled with my website www.drdiptiganatra.com! Site Nova's team built it beautifully in a very short span of time, with complete database integration and seamless functionality. The design is clean, professional, and perfectly reflects my practice. Since its launch, I've seen improved patient engagement and steady growth in my business. Highly recommend their team for anyone looking for a powerful and well-executed website!",
        testimonialAuthor: "Dr. Dipti Ganatra",
        testimonialRole: "MD (Homeopathy), Mulund West, Mumbai",
      }}
      project={{
        headline:
          "A homeopathic clinic website that ranks for every Mumbai patient search",
        summary:
          "Dr. Dipti Ganatra is a Maharashtra CET Rank 1 homeopath based in Mulund West, Mumbai. SiteNova built a clean, fast clinic website that surfaces her 12 specialty areas to patients searching across Mulund, Bhandup, Thane, and Vikhroli — with an inquiry flow that works while the clinic is closed.",
        stats: [
          { label: "Delivery", value: "12 Days" },
          { label: "PageSpeed Score", value: "97 / 100" },
          { label: "Specialties Covered", value: "12" },
          { label: "Location", value: "Mulund West" },
        ],
        features: [
          {
            icon: ClipboardList,
            title: "12 Treatment-Specific Pages",
            description:
              "Each of Dr. Dipti's specialties — from chronic disease to pediatric care — has its own dedicated page, capturing long-tail patient searches across Mumbai.",
          },
          {
            icon: Calendar,
            title: "Patient Inquiry & Booking Flow",
            description:
              "A streamlined consultation inquiry form that captures name, condition, and contact details — stored securely in Supabase so no lead is ever missed.",
          },
          {
            icon: Search,
            title: "Local SEO for Mumbai Suburbs",
            description:
              "Geo-targeted content and Schema.org markup rank the clinic for searches in Mulund, Bhandup, Vikhroli, Thane, and Nahur — beyond just the clinic's street address.",
          },
          {
            icon: Smartphone,
            title: "Mobile-First Design",
            description:
              "Over 80% of patients search for doctors on mobile. Every page and form is optimised for thumb-friendly navigation and fast load on 4G connections.",
          },
          {
            icon: Star,
            title: "Patient Testimonials Section",
            description:
              "Real patient reviews displayed prominently to build trust with first-time visitors considering homeopathic treatment — critical for a healthcare audience.",
          },
          {
            icon: Users,
            title: "MedicalOrganization Schema",
            description:
              "Full Schema.org MedicalOrganization and Physician structured data help the clinic appear in Google's knowledge panel and AI search results.",
          },
          {
            icon: MapPin,
            title: "Multi-Area Coverage Signals",
            description:
              "Location pages and geo-meta targeting Mulund West, Thane, Bhandup, Vikhroli, and Nahur extend organic reach to patients across a 10 km radius.",
          },
          {
            icon: Database,
            title: "Supabase Database Integration",
            description:
              "Patient inquiry submissions are stored in a managed Supabase database — exportable, secure, and accessible via the admin dashboard.",
          },
        ],
        techStack: [
          "React",
          "Vite",
          "Tailwind CSS",
          "Framer Motion",
          "Supabase",
          "Cloudflare Workers",
          "Schema.org",
        ],
        industry: "Healthcare · Homeopathy",
        location: "Mulund West, Mumbai",
      }}
      projectImage=""
    />
  );
}
