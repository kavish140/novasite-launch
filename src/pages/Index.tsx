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
      title: "Best Website Designer in Mulund, Mumbai & Nearby Areas | SiteNova",
      description:
        "SiteNova builds SEO-ready, mobile-first websites for businesses in Mulund, Mumbai, and nearby areas like Bhandup, Nahur, Thane, Ghatkopar, and Powai.",
      canonicalPath: "/",
      keywords: [
        "best website designer in Mulund",
        "website designer in Mumbai",
        "website design Mulund",
        "web development Mulund",
        "SEO friendly website designer",
        "website designer in nearby areas",
      ],
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
        <section aria-labelledby="service-areas-title" className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-8 rounded-3xl border border-border/60 bg-card/40 p-8 shadow-sm backdrop-blur md:p-12 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">
                  Local SEO focus
                </p>
                <h2 id="service-areas-title" className="mt-3 font-heading text-3xl font-bold tracking-tight md:text-4xl">
                  Website design for Mulund, Mumbai, and nearby areas
                </h2>
                <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
                  SiteNova helps businesses that want to rank for searches like best website designer in Mulund, website designer in Mumbai, and related local terms. We combine fast, mobile-first design with content that speaks to the neighborhoods your customers actually search from.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  "Mulund",
                  "Mumbai",
                  "Bhandup",
                  "Nahur",
                  "Thane",
                  "Ghatkopar",
                  "Powai",
                  "Central Mumbai",
                ].map((area) => (
                  <div
                    key={area}
                    className="rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-center text-sm font-medium text-foreground shadow-sm"
                  >
                    {area}
                  </div>
                ))}
              </div>
            </div>
          </div>
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
