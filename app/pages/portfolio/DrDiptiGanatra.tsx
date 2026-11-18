import { clientReviews } from "@/lib/client-reviews";
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
        role: "Homeopathy practice · Mulund West",
        liveUrl: "https://drdiptiganatra.com",
        review: clientReviews["dr-dipti-ganatra"],
      }}
      project={{
        headline:
          "A Mulund clinic website organised around patient information",
        summary:
          "SiteNova built a clinic website for Dr. Dipti Ganatra in Mulund West, with treatment information and a consultation enquiry journey. The practice is responsible for approving its current credentials, service claims and consultation arrangements.",
        stats: [
          { label: "Journey", value: "Consultation enquiry" },
          { label: "Design", value: "Mobile responsive" },
          { label: "Content", value: "Treatment information" },
          { label: "Location", value: "Mulund West" },
        ],
        features: [
          {
            icon: ClipboardList,
            title: "Treatment Information Pages",
            description:
              "Treatment pages organise the practice's approved information so visitors can understand its services before making an enquiry. Published descriptions require review by the practitioner.",
          },
          {
            icon: Calendar,
            title: "Patient Inquiry & Booking Flow",
            description:
              "A consultation enquiry form collects information for the practice to review. An enquiry is distinct from a confirmed appointment; storage, access and notification delivery need ongoing oversight.",
          },
          {
            icon: Search,
            title: "Local SEO for Mumbai Suburbs",
            description:
              "Service and location information describes the clinic's actual Mulund practice and surrounding catchment. Content and markup do not guarantee a search position.",
          },
          {
            icon: Smartphone,
            title: "Mobile-First Design",
            description:
              "Patients can search for doctors on mobile. Every page and form is optimised for thumb-friendly navigation and fast load on 4G connections.",
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
              "Healthcare structured data describes practitioner and clinic information. Its facts must match the visible content; validation does not guarantee a knowledge panel or AI citation.",
          },
          {
            icon: MapPin,
            title: "Catchment and Access Information",
            description:
              "Content describes the clinic's actual location and nearby service catchment without implying that each neighbourhood has a separate clinic branch.",
          },
          {
            icon: Database,
            title: "Supabase Database Integration",
            description:
              "The build uses Supabase for enquiry records and administrative access. Privacy and access controls require their own implementation checks; a managed database is not a blanket security guarantee.",
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
    />
  );
}
