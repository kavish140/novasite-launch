import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import PortfolioSection from "@/components/PortfolioSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import CurrencyTimezoneToggle from "@/components/CurrencyTimezoneToggle";
import { buildLocalBusinessJsonLd, setPageSeo } from "@/lib/seo";

const Index = () => {
  useEffect(() => {
    setPageSeo({
      title: "Custom Web Development Services | SiteNova",
      description:
        "SiteNova offers professional web development and design services to help your business grow. Contact Kavish Ganatra for custom website solutions.",
      canonicalPath: "/",
      jsonLd: buildLocalBusinessJsonLd(),
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
        <section aria-labelledby="features-title">
          <FeaturesSection />
        </section>
        <PortfolioSection />
        <CurrencyTimezoneToggle />
        <section aria-labelledby="how-it-works-title">
          <HowItWorksSection />
        </section>
        <section aria-labelledby="testimonials-title">
          <TestimonialsSection />
        </section>
        <section aria-labelledby="cta-title">
          <CtaSection />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
