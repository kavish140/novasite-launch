import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  MapPin,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";
import PortfolioSection from "@/components/PortfolioSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaSection from "@/components/CtaSection";

interface LocationPageProps {
  locationName: string;
  subTitle: string;
  description: string;
  regionalFocusText: string;
  nearbySuburbs: string[];
  keywords: string[];
}

export default function LocationPageTemplate({
  locationName,
  subTitle,
  description,
  regionalFocusText,
  nearbySuburbs,
  keywords,
}: LocationPageProps) {
  const navigate = useNavigate();


  const handleStartQuote = () => {
    navigate("/quote", {
      state: {
        projectType: "Business Website",
        requirements: `Client located near: ${locationName}. Interested in building a local business website.`,
      },
    });
  };

  return (
    <PageTransition>
      <SEO 
        title={`Best Website Designer in ${locationName}, Mumbai | SiteNova`}
        description={`SiteNova builds premium, SEO-ready, mobile-first websites in ${locationName}, Mumbai. Grow your business with fast load times and Google Map Pack optimization.`}
        canonicalUrl={`/location/${locationName.toLowerCase().replace(/\s+/g, '-')}`}
        keywords={keywords}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": ["ProfessionalService", "LocalBusiness"],
            "name": "SiteNova",
            "url": "https://sitenova.dev",
            "sameAs": [
              "https://share.google/Y6mq6VLzTQj9zN4kr",
              "https://www.clutch.co/profile/sitenova",
              "https://techbehemoths.com/company/sitenova"
            ],
            "telephone": "+91-9326060621",
            "email": "kavishganatra5@gmail.com",
            "priceRange": "₹₹",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Mulund",
              "addressRegion": "Maharashtra",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 19.1726,
              "longitude": 72.9570
            },
            "hasMap": "https://share.google/Y6mq6VLzTQj9zN4kr",
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                "opens": "09:00",
                "closes": "21:00"
              }
            ],
            "areaServed": {
              "@type": "City",
              "name": locationName
            },
            "serviceType": "Web Design and Development"
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": `How much does a website cost in ${locationName}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `SiteNova offers website design in ${locationName} starting from ₹10,000 onwards for single-page landing sites, and ₹15,000 onwards for multi-page business websites. Premium and e-commerce projects are quoted based on scope.`
                }
              },
              {
                "@type": "Question",
                "name": `Do you provide local SEO for businesses in ${locationName}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `Yes. Every website SiteNova builds for ${locationName} includes on-page SEO, Google Business Profile setup, local schema markup, and mobile-first optimization so your business ranks for searches in ${locationName} and nearby Mumbai areas.`
                }
              },
              {
                "@type": "Question",
                "name": "How long does it take to build a website?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most business websites are delivered within 7–14 working days. Landing pages take 3–5 days. Timeline depends on content readiness and revision rounds."
                }
              }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sitenova.dev/" },
              { "@type": "ListItem", "position": 2, "name": `Web Design in ${locationName}`, "item": `https://sitenova.dev/location/${locationName.toLowerCase().replace(/\s+/g, '-')}` }
            ]
          }
        ]}
      />
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="mx-auto max-w-7xl px-6 relative z-10 text-center">
          <div className="mb-6 flex justify-start">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-secondary/20 px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              <ArrowLeft size={14} />
              Back to Main Site
            </Link>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-6">
            <MapPin className="h-3.5 w-3.5" />
            Local Web Design & SEO Expert
          </div>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-6xl max-w-4xl mx-auto">
            Premium Web Development & SEO in <span className="gradient-text">{locationName}</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {subTitle}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              onClick={handleStartQuote}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors glow-effect btn-quote-pulse"
            >
              Get Local Quote <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <a
              href="#local-seo"
              onClick={(e) => { e.preventDefault(); document.getElementById('local-seo')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
              className="inline-flex items-center justify-center rounded-lg border border-border bg-secondary px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Info & Local SEO Section */}
      <section id="local-seo" className="py-16 bg-card/10 border-t border-border/20">
        <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          
          {/* Left Column: Local targeting copy */}
          <div>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Dominating Local Search Results
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {description}
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {regionalFocusText}
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground">Google Map Pack Optimization</span>
                  <p className="text-xs text-muted-foreground mt-0.5">We link your website directly with your local Google Business Profile to index higher in the local Map Pack results.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground">Mobile-First Schema Markup</span>
                  <p className="text-xs text-muted-foreground mt-0.5">We write rich LocalBusiness schema code templates so Google maps your correct phone, address, and ratings.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground">Hyper-Targeted Local Pages</span>
                  <p className="text-xs text-muted-foreground mt-0.5">We ensure your website captures customers looking for designers directly in your area.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Local Map/SEO Card representation */}
          <div className="rounded-3xl border border-border bg-card/60 p-8 shadow-xl backdrop-blur-md relative">
            <h3 className="font-heading text-2xl font-bold tracking-tight">
              Service Suburbs
            </h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              SiteNova provides premium website setups and support to businesses across {locationName} and these nearby locations:
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {nearbySuburbs.map((area, idx) => (
                <div key={idx} className="rounded-xl border border-border bg-background/50 p-4 flex items-center gap-2.5">
                  <MapPin className="h-4.5 w-4.5 text-primary shrink-0" />
                  <span className="text-xs font-semibold text-foreground">{area}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-border/60 pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Increase Your Inquiry Rates</h4>
                  <p className="text-xs text-muted-foreground">Having a fast site localized to {locationName} reduces visitor bounce rate by up to 50%.</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleStartQuote}
              className="mt-8 w-full inline-flex items-center justify-center rounded-xl bg-primary py-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors glow-effect-sm btn-quote-pulse"
            >
              Discuss Your {locationName} Project <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 border-t border-border/20" id="faq">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="font-heading text-2xl font-bold tracking-tight mb-8">
            Common Questions About Web Design in {locationName}
          </h2>
          <div className="space-y-4 max-w-3xl">
            {[
              {
                q: `How much does a website cost in ${locationName}?`,
                a: `SiteNova's website design in ${locationName} starts from ₹10,000 onwards for a single-page landing site, and ₹15,000 onwards for a multi-page business website. Premium and e-commerce builds are quoted based on project scope.`
              },
              {
                q: `Do you provide local SEO for businesses in ${locationName}?`,
                a: `Yes — every website we build includes on-page SEO, Google Business Profile sync, local schema markup, and mobile-first optimization, ensuring you rank for searches in ${locationName} and nearby Mumbai areas.`
              },
              {
                q: `How long does it take to build a website?`,
                a: `Most business websites are delivered within 7–14 working days. Landing pages take 3–5 days. Timeline depends on content readiness and revision rounds.`
              },
              {
                q: `Do I need to be physically in ${locationName} to work with SiteNova?`,
                a: `Not at all. SiteNova works with clients across all of Mumbai and remotely. All project communication, reviews, and handoffs are done digitally via email, WhatsApp, and video calls.`
              },
            ].map((item, idx) => (
              <details key={idx} className="rounded-2xl border border-border/60 bg-card/40 px-6 py-4 group cursor-pointer open:bg-card/60 transition-colors">
                <summary className="font-semibold text-foreground list-none flex justify-between items-center gap-4 select-none">
                  {item.q}
                  <span className="text-primary text-xl font-light shrink-0 group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-linking: Other locations */}
      <section className="py-16 border-t border-border/20">
        <div className="mx-auto max-w-7xl px-6">
          <h3 className="font-heading text-xl font-bold tracking-tight mb-6">
            Other Areas We Serve
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {[
              { name: "Mulund", path: "/location/mulund" },
              { name: "Thane", path: "/location/thane" },
              { name: "Powai", path: "/location/powai" },
              { name: "Andheri", path: "/location/andheri" },
              { name: "Bhandup", path: "/location/bhandup" },
              { name: "Nahur", path: "/location/nahur" },
              { name: "Ghatkopar", path: "/location/ghatkopar" },
              { name: "Vikhroli", path: "/location/vikhroli" },
              { name: "Kurla", path: "/location/kurla" },
              { name: "Dadar", path: "/location/dadar" },
              { name: "Lower Parel", path: "/location/lower-parel" },
              { name: "Mahalakshmi", path: "/location/mahalakshmi" },
              { name: "Pedder Road", path: "/location/pedder-road" },
            ]
              .filter((loc) => loc.name !== locationName)
              .map((loc) => (
                <Link
                  key={loc.name}
                  to={loc.path}
                  className="rounded-xl border border-border/60 bg-secondary/20 px-4 py-3 text-center text-sm font-medium text-foreground hover:bg-secondary hover:border-primary/30 transition-all"
                >
                  {loc.name}
                </Link>
              ))}
          </div>
        </div>
      </section>

      <PortfolioSection />
      <TestimonialsSection />
      <CtaSection />

      <Footer />
      </div>
    </PageTransition>
  );
}
