import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import PortfolioSection from "@/components/PortfolioSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import { setPageSeo } from "@/lib/seo";

const Index = () => {
  useEffect(() => {
    setPageSeo({
      title: "Custom Web Development Services | SiteNova",
      description:
        "SiteNova offers professional web development and design services to help your business grow. Contact Kavish Ganatra for custom website solutions.",
      canonicalPath: "/",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: "SiteNova",
        url: "https://sitenova.dev/",
        image: "https://sitenova.dev/seo-preview.svg",
        description:
          "SiteNova offers professional web development and design services to help businesses in Mumbai and Mulund grow.",
        founder: {
          "@type": "Person",
          name: "Kavish Ganatra",
        },
        telephone: "+91-9326060621",
        email: "kavish@sitenova.dev",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Mulund",
          addressRegion: "Maharashtra",
          addressCountry: "IN",
        },
        areaServed: [
          {
            "@type": "City",
            name: "Mumbai",
          },
          {
            "@type": "City",
            name: "Mulund",
          },
          {
            "@type": "Country",
            name: "India",
          },
        ],
        serviceType: ["Web Development", "Website Design", "Landing Page Design"],
      },
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a href="#main-content" className="sr-only focus:not-sr-only">
        Skip to main content
      </a>
      <header>
        <Navbar />
      </header>
      <main id="main-content">
        <HeroSection />
        <FeaturesSection />
        <PortfolioSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
