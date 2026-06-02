import { useEffect, Suspense, lazy } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import FaqSection, { faqs } from "@/components/FaqSection";
import { buildLocalBusinessJsonLd, buildFaqJsonLd, setPageSeo } from "@/lib/seo";

const FeaturesSection = lazy(() => import("@/components/FeaturesSection"));
const PortfolioSection = lazy(() => import("@/components/PortfolioSection"));
const HowItWorksSection = lazy(() => import("@/components/HowItWorksSection"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const CtaSection = lazy(() => import("@/components/CtaSection"));

interface IndexProps {
  seoTitle?: string;
  seoDescription?: string;
  seoCanonicalPath?: string;
  seoKeywords?: string[];
}

const Index = ({ seoTitle, seoDescription, seoCanonicalPath, seoKeywords }: IndexProps) => {
  const location = useLocation();

  useEffect(() => {
    setPageSeo({
      title: seoTitle || "Best Website Designer in Mulund, Mumbai & Nearby Areas | SiteNova",
      description:
        seoDescription || "SiteNova builds SEO-ready, mobile-first websites for businesses in Mulund, Mumbai, and nearby areas like Bhandup, Nahur, Thane, Ghatkopar, and Powai.",
      canonicalPath: seoCanonicalPath || "/",
      keywords: seoKeywords || [
        "best website designer in Mulund",
        "website designer in Mumbai",
        "website design Mulund",
        "web development Mulund",
        "SEO friendly website designer",
        "website designer in nearby areas",
      ],
      jsonLd: [buildLocalBusinessJsonLd(), buildFaqJsonLd(faqs)],
    });
  }, [seoTitle, seoDescription, seoCanonicalPath, seoKeywords]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 200);
    }
  }, [location]);

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
        <Suspense fallback={<div className="min-h-screen bg-background" aria-hidden="true" />}>
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
                    <strong className="font-semibold text-foreground">SiteNova is a professional web development agency based in Mulund, Mumbai, specializing in custom, high-performance websites.</strong> We help local businesses rank for searches like best website designer in Mulund and Mumbai. We combine fast, mobile-first design with content that speaks to the neighborhoods your customers actually search from.
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
          <section aria-labelledby="pricing-title" className="pb-20 sm:pb-24">
            <div className="mx-auto max-w-7xl px-6">
              <div className="grid gap-6 rounded-3xl border border-primary/20 bg-primary/5 p-8 shadow-sm md:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                    Starting price
                  </p>
                  <h2 id="pricing-title" className="mt-3 font-heading text-3xl font-bold tracking-tight md:text-4xl">
                    Websites starting from Rs. 5,000
                  </h2>
                  <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
                    A simple, professional website is a great way to get started without overspending. If you need a landing page, business website, or a more tailored build, I’ll quote based on scope and features.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    "Starter websites",
                    "Business websites",
                    "Custom quotes",
                  ].map((item) => (
                    <div key={item} className="rounded-2xl border border-border/60 bg-background/80 px-4 py-4 text-center text-sm font-medium text-foreground shadow-sm">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <PortfolioSection />
          <section aria-labelledby="how-it-works-title">
            <HowItWorksSection />
          </section>
          <section aria-labelledby="testimonials-title">
            <TestimonialsSection />
          </section>
          <FaqSection />
          <section aria-labelledby="cta-title">
            <CtaSection />
          </section>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
