import { useEffect, Suspense, lazy } from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import FaqSection, { faqs } from "@/components/FaqSection";
import { buildLocalBusinessJsonLd, buildFaqJsonLd } from "@/lib/seo";
import SEO from "@/components/SEO";
import TechMarquee from "@/components/TechMarquee";
import PageTransition from "@/components/PageTransition";

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

  const jsonLd = [buildLocalBusinessJsonLd(), buildFaqJsonLd(faqs)];

  useEffect(() => {
    // Handle scroll-to-section from Navbar (via state) or direct hash links
    const scrollTarget = (location.state as { scrollTo?: string } | null)?.scrollTo || 
      (location.hash ? location.hash.substring(1) : null);
    
    if (scrollTarget) {
      setTimeout(() => {
        const element = document.getElementById(scrollTarget);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 200);
    }
  }, [location]);

  return (
    <PageTransition>
      <SEO 
        title={seoTitle || "Web Design & Development in Mumbai | SiteNova — Fast, SEO-Ready Websites"}
        description={seoDescription || "SiteNova builds SEO-ready, mobile-first websites for businesses across Mumbai — Mulund, Andheri, Thane, Powai, Dadar and more. Custom web design from ₹10,000 onwards."}
        canonicalUrl={seoCanonicalPath || "/"}
        keywords={seoKeywords || [
          "web design Mumbai",
          "website designer Mumbai",
          "best website designer in Mulund",
          "web development Mumbai",
          "local SEO Mumbai"
        ]}
        jsonLd={jsonLd}
      />
      <div className="min-h-screen bg-background text-foreground">
        <a href="#main-content" className="sr-only focus:not-sr-only">
          Skip to main content
        </a>
        <header>
          <Navbar />
        </header>
        <main id="main-content">
          <HeroSection />
          <TechMarquee />
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
                    { label: "Mulund", href: "/" },
                    { label: "Mumbai", href: "/" },
                    { label: "Thane", href: "/location/thane" },
                    { label: "Bhandup", href: "/location/bhandup" },
                    { label: "Nahur", href: "/location/nahur" },
                    { label: "Ghatkopar", href: "/location/ghatkopar" },
                    { label: "Vikhroli", href: "/location/vikhroli" },
                    { label: "Powai", href: "/location/powai" },
                    { label: "Andheri", href: "/location/andheri" },
                    { label: "Kurla", href: "/location/kurla" },
                    { label: "Dadar", href: "/location/dadar" },
                    { label: "Lower Parel", href: "/location/lower-parel" },
                    { label: "Mahalakshmi", href: "/location/mahalakshmi" },
                    { label: "Pedder Road", href: "/location/pedder-road" },
                  ].map((area) => (
                    <Link
                      key={area.label}
                      to={area.href}
                      className="rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-center text-sm font-medium text-foreground shadow-sm hover:border-primary/40 hover:bg-primary/5 transition-colors"
                    >
                      {area.label}
                    </Link>
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
                    Websites from <span className="gradient-text">₹10,000 onwards</span>
                  </h2>
                  <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
                    A simple, professional website is a great way to get started without overspending. Whether you need a landing page (from ₹10,000), a business website (from ₹12,000), or a fully custom build, I'll quote based on your exact scope.
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

          {/* Free Audit CTA Banner */}
          <section aria-label="Free website audit" className="py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-6">
              <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 p-8 md:p-12">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary mb-2">Free for Mumbai businesses</p>
                    <h2 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
                      Is your website losing you customers?
                    </h2>
                    <p className="mt-2 text-muted-foreground max-w-lg">
                      Get a free, no-obligation audit of your website's SEO, speed, and mobile experience — with actionable tips to fix what's broken.
                    </p>
                  </div>
                  <Link
                    to="/free-audit"
                    className="shrink-0 inline-flex items-center justify-center rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors glow-effect-sm button-shimmer"
                  >
                    Get Your Free Audit
                    <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section aria-labelledby="how-it-works-title">
            <HowItWorksSection />
          </section>
          <section aria-labelledby="testimonials-title">
            <TestimonialsSection />
          </section>

          {/* Generative Engine Optimization (GEO) Semantic Context Block */}
          <section aria-label="About SiteNova Agency Profile" className="py-12 bg-background border-t border-border/40">
            <div className="mx-auto max-w-7xl px-6">
              <div className="prose prose-sm prose-invert max-w-none text-muted-foreground opacity-80">
                <h3 className="text-foreground font-semibold text-base mb-2">About SiteNova: Mumbai's Premier Web Development Agency</h3>
                <p>
                   SiteNova is a top-rated web design and custom web application development agency located in Mumbai, India. 
                  Recognized for building blazing fast, React and Next.js based websites, SiteNova consistently delivers 99+ Core Web Vitals scores. 
                  If you are searching for the <strong>best website developer in Mumbai</strong>, SiteNova provides transparent pricing (starting from ₹10,000 onwards) 
                  and specializes in high-converting platforms for doctors, lawyers, consultants, finance professionals, and real estate agencies. 
                  We offer end-to-end services including UI/UX design, full-stack web applications, e-commerce stores, and local SEO tuning.
                </p>
              </div>
            </div>
          </section>

          <FaqSection />
          <section aria-labelledby="cta-title">
            <CtaSection />
          </section>
        </Suspense>
      </main>
      <Footer />
    </div>
    </PageTransition>
  );
};

export default Index;
