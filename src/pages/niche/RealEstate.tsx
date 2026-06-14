import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { m as motion } from "framer-motion";
import {
  Building2,
  Image,
  UserPlus,
  MapPin,
  MessageCircle,
  Smartphone,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Search,
  ShieldCheck,
  Phone,
  Mail,
  BadgePercent,
  TrendingUp,
  Globe,
  CheckCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trackNichePageView, trackWhatsAppClick, trackPhoneClick } from "@/lib/analytics";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: "easeOut" },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true, margin: "-60px" },
};

const staggerChild = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  viewport: { once: true },
};

const features = [
  {
    icon: Building2,
    title: "Property Listing Pages",
    desc: "Beautifully organized listings with filters for BHK type, price range, location, and availability — so buyers find exactly what they need.",
  },
  {
    icon: Image,
    title: "High-Quality Image Galleries",
    desc: "Full-screen photo galleries and floor plan views that let buyers experience properties before scheduling a visit.",
  },
  {
    icon: UserPlus,
    title: "Lead Capture Forms",
    desc: "Smart inquiry forms on every listing that capture buyer details and send you instant WhatsApp and email notifications.",
  },
  {
    icon: MapPin,
    title: "Location & Area Pages",
    desc: "Dedicated pages for each area you serve — Andheri, Thane, Mulund, Powai — boosting your local SEO and Google Maps visibility.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Quick Contact",
    desc: "One-tap WhatsApp buttons on every page so buyers can message you instantly — no friction, no forms to fill.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First, SEO-Optimized",
    desc: "Built for the 85% of buyers who browse on their phones. Lightning-fast loading, Google-friendly code, and responsive layouts.",
  },
];

const problemPoints = [
  {
    icon: Search,
    stat: "90%",
    text: "of home buyers start their search online — if you're not there, you're invisible.",
  },
  {
    icon: Globe,
    stat: "Not enough",
    text: "Posting on MagicBricks and 99acres isn't enough — you need your own platform to build trust and brand.",
  },
  {
    icon: TrendingUp,
    stat: "Stand out",
    text: "A professional website sets you apart from agents who only use WhatsApp forwards and PDF brochures.",
  },
];
export default function RealEstate() {
  const navigate = useNavigate();

  useEffect(() => {
    trackNichePageView("real-estate");
  }, []);

  const handleGetMockup = () => {
    navigate("/quote", {
      state: {
        projectType: "Business Website",
        requirements: "Real estate/property website for my agency",
      },
    });
  };

  return (
    <PageTransition>
      <SEO 
        title="Professional Websites for Real Estate Agents & Builders in Mumbai | SiteNova"
        description="SiteNova builds lead-generating websites for real estate agents, builders, and property dealers in Mumbai. Property listings, virtual tours, and lead capture forms."
        canonicalUrl="/websites-for-real-estate"
        keywords={["real estate website design Mumbai", "property dealer website", "builder website design", "real estate agent website", "property listing website Mumbai"]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Websites for Real Estate Agents and Builders",
            "provider": { "@type": "ProfessionalService", "name": "SiteNova", "url": "https://sitenova.dev" },
            "areaServed": { "@type": "City", "name": "Mumbai" },
            "audience": { "@type": "Audience", "audienceType": "Real Estate Agents, Property Dealers, Builders, Developers" },
            "description": "Lead-generating websites for real estate agents, builders, and property dealers in Mumbai. Property listings, virtual tours, enquiry forms, and WhatsApp integration.",
            "url": "https://sitenova.dev/websites-for-real-estate",
            "serviceType": "Real Estate Website Design"
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sitenova.dev/" },
              { "@type": "ListItem", "position": 2, "name": "Websites for Real Estate", "item": "https://sitenova.dev/websites-for-real-estate" }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Why does a real estate agent need a website?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Over 90% of property buyers start their search online. A professional website lets you showcase listings with photos and virtual tours, capture buyer and seller leads 24/7, and build trust with professional branding — giving you a major edge over agents who rely only on referrals."
                }
              },
              {
                "@type": "Question",
                "name": "How much does a real estate website cost in Mumbai?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "SiteNova builds real estate websites starting from ₹10,000 for a landing page and ₹12,000 onwards for property listing sites with enquiry forms, WhatsApp integration, and photo galleries."
                }
              },
              {
                "@type": "Question",
                "name": "Can I list multiple properties on my website?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. We build dynamic property listing pages with filters for BHK type, price range, and location — so buyers can find exactly what they need, and you can easily add new listings."
                }
              },
              {
                "@type": "Question",
                "name": "How long does it take to build a real estate website?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most real estate websites are delivered within 7–10 working days. We provide a free mockup first so you can see the design before any commitment."
                }
              }
            ]
          }
        ]}
      />
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pb-28">
        {/* Ambient background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(120,119,198,0.06),transparent_50%)]" />

        <div className="mx-auto max-w-7xl px-6 relative z-10 text-center">
          <motion.div {...fadeUp}>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 px-3.5 py-1 text-xs font-medium text-amber-500 mb-6">
              <Building2 className="h-3.5 w-3.5" />
              Built for Real Estate Professionals
            </div>
          </motion.div>

          <motion.h1
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl max-w-4xl mx-auto"
          >
            Property Websites That{" "}
            <span className="gradient-text">Generate Leads 24/7</span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.2 }}
            className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Professional websites for real estate agents, builders, and property dealers
            — showcase listings, capture leads, and close deals faster with a website
            that works while you sleep.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.3 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <button
              onClick={handleGetMockup}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors glow-effect button-shimmer"
            >
              Get a Free Website Mockup <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <Link
              to="/#portfolio"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-secondary px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors"
            >
              View Our Portfolio
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── Problem / Agitate Section ─── */}
      <section className="py-20 lg:py-28 border-t border-border/20 bg-card/10">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Buyers Browse Online First.{" "}
              <span className="gradient-text">Are Your Properties Visible?</span>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              The real estate game has moved online. If buyers can't find your
              properties on Google, they'll find your competitor's instead.
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="mt-14 grid gap-6 md:grid-cols-3"
          >
            {problemPoints.map((point, idx) => (
              <motion.div
                key={idx}
                {...staggerChild}
                className="glass-card p-6 interactive-card hover-glow"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                  <point.icon className="h-6 w-6" />
                </div>
                <div className="mt-4 font-heading text-2xl font-bold text-foreground">
                  {point.stat}
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {point.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section className="py-20 lg:py-28 border-t border-border/20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Everything You Need
            </div>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              What Your Property Website Will Include
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Every feature is designed to turn website visitors into genuine buyer inquiries.
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                {...staggerChild}
                className="glass-card p-6 interactive-card hover-glow group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Special Offer Section (instead of case study) ─── */}
      <section className="py-20 lg:py-28 border-t border-border/20 bg-card/10 relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-4xl px-6 relative z-10">
          <motion.div
            {...fadeUp}
            className="rounded-3xl border border-amber-500/20 bg-card/60 backdrop-blur-xl p-8 md:p-12 text-center relative"
          >
            {/* Floating badge */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/15 border border-amber-500/25 px-4 py-1.5 text-xs font-semibold text-amber-500 backdrop-blur">
              <BadgePercent className="inline h-3.5 w-3.5 mr-1.5 -mt-0.5" />
              Launch Offer
            </div>

            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl mt-4">
              Be One of Our First{" "}
              <span className="gradient-text">Real Estate Clients</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed">
              We're expanding into real estate websites. Book now and get a special
              introductory rate.
            </p>

            {/* Offer card */}
            <div className="mt-8 rounded-2xl border border-amber-500/15 bg-amber-500/5 p-6 md:p-8 max-w-lg mx-auto">
              <div className="font-heading text-4xl font-extrabold text-foreground">
                ₹10,000
                <span className="text-lg font-normal text-muted-foreground ml-1">
                  onwards
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Your property website starting from ₹10,000 — includes property
                listings, lead forms, and SEO setup. Limited introductory pricing.
              </p>
              <ul className="mt-4 space-y-2 text-left max-w-xs mx-auto">
                {[
                  "Property listing pages",
                  "Lead capture forms with WhatsApp alerts",
                  "Mobile-first responsive design",
                  "Basic SEO setup & Google indexing",
                  "1 month of free support",
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                onClick={handleGetMockup}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors glow-effect button-shimmer"
              >
                Claim This Offer <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <a
                href="https://wa.me/919326060621?text=Hi%2C%20I%27m%20a%20real%20estate%20professional%20and%20I%27m%20interested%20in%20getting%20a%20property%20website."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-secondary px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA / Contact Section ─── */}
      <section className="py-20 lg:py-28 border-t border-border/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,119,198,0.06),transparent_60%)]" />

        <div className="mx-auto max-w-4xl px-6 text-center relative z-10">
          <motion.div {...fadeUp}>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Let's Build Your{" "}
              <span className="gradient-text">Property Empire Online</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Get a free mockup of what your real estate website could look like. No
              commitment, no payment until you're happy.
            </p>
          </motion.div>

          {/* Guarantee badge */}
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.15 }}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs font-medium text-emerald-500"
          >
            <ShieldCheck className="h-4 w-4" />
            Not happy? Full refund within 7 days
          </motion.div>

          {/* Contact buttons */}
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.25 }}
            className="mt-10 grid gap-4 sm:grid-cols-3 max-w-xl mx-auto"
          >
            <a
              href="tel:+919326060621"
              onClick={() => trackPhoneClick("/websites-for-real-estate")}
              className="flex flex-col items-center gap-2 rounded-2xl border border-border/50 bg-card/40 backdrop-blur p-6 hover:bg-card/60 transition-colors interactive-card hover-glow"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Phone className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-foreground">Call Us</span>
              <span className="text-xs text-muted-foreground">+91 93260 60621</span>
            </a>

            <a
              href="https://wa.me/919326060621?text=Hi%2C%20I%27m%20a%20real%20estate%20professional%20and%20I%27m%20interested%20in%20getting%20a%20property%20website."
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("/websites-for-real-estate")}
              className="flex flex-col items-center gap-2 rounded-2xl border border-border/50 bg-card/40 backdrop-blur p-6 hover:bg-card/60 transition-colors interactive-card hover-glow"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <MessageCircle className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-foreground">WhatsApp</span>
              <span className="text-xs text-muted-foreground">Quick Response</span>
            </a>

            <a
              href="mailto:kavishganatra5@gmail.com"
              className="flex flex-col items-center gap-2 rounded-2xl border border-border/50 bg-card/40 backdrop-blur p-6 hover:bg-card/60 transition-colors interactive-card hover-glow"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                <Mail className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-foreground">Email</span>
              <span className="text-xs text-muted-foreground">kavishganatra5@gmail.com</span>
            </a>
          </motion.div>

          {/* Final CTA button */}
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.35 }}
            className="mt-10"
          >
            <button
              onClick={handleGetMockup}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-4 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-colors glow-effect button-shimmer"
            >
              Get Your Free Mockup Now <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
      </div>
    </PageTransition>
  );
}
