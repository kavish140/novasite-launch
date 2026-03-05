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
        url: "https://kavish140.github.io/novasite-launch/",
        description:
          "SiteNova offers professional web development and design services to help your business grow.",
        founder: {
          "@type": "Person",
          name: "Kavish Ganatra",
        },
        areaServed: "India",
        serviceType: ["Web Development", "Website Design", "Landing Page Design"],
      },
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <PortfolioSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default Index;
