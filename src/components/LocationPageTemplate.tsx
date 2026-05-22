import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  CheckCircle,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  TrendingUp,
  Globe,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { setPageSeo } from "@/lib/seo";

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

  useEffect(() => {
    setPageSeo({
      title: `Best Website Designer in ${locationName}, Mumbai | SiteNova`,
      description: `SiteNova builds premium, SEO-ready, mobile-first websites in ${locationName}, Mumbai. Grow your business with fast load times and Google Map Pack optimization.`,
      canonicalPath: `/location/${locationName.toLowerCase()}`,
      keywords: keywords,
    });
  }, [locationName, keywords]);

  const handleStartQuote = () => {
    navigate("/quote", {
      state: {
        projectType: "Business Website",
        requirements: `Client located near: ${locationName}. Interested in building a local business website.`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="mx-auto max-w-7xl px-6 relative z-10 text-center">
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
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors glow-effect"
            >
              Get Local Quote <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <a
              href="#local-seo"
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
              className="mt-8 w-full inline-flex items-center justify-center rounded-xl bg-primary py-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors glow-effect-sm"
            >
              Discuss Your {locationName} Project <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
