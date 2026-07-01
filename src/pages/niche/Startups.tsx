import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { m as motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Rocket,
  ShieldCheck,
  Zap,
  Code,
  MessageCircle,
  Smartphone,
  Phone,
  Mail,
  CheckCircle,
  TrendingUp,
  Quote,
  Star,
  ExternalLink,
  BadgeCheck,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { trackNichePageView, trackWhatsAppClick, trackPhoneClick } from "@/lib/analytics";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";

const emailComposeLink =
  "https://mail.google.com/mail/?view=cm&fs=1&to=kavishganatra5@gmail.com&su=Startup%20Website%20Inquiry%20from%20SiteNova";

const features = [
  {
    icon: Rocket,
    title: "High-Converting Landing Pages",
    description:
      "Pitch your product perfectly with stunning hero sections, clear value propositions, and interactive elements designed to convert visitors into early adopters.",
  },
  {
    icon: Zap,
    title: "Blazing Fast Performance",
    description:
      "Vite & React-powered architecture ensures your startup's website loads in milliseconds, providing a seamless user experience that impresses investors.",
  },
  {
    icon: Code,
    title: "Scalable Architecture",
    description:
      "We build your frontend with scalable, modern technologies so you can easily integrate APIs, user authentication, and databases as you grow.",
  },
  {
    icon: ShieldCheck,
    title: "Investor-Ready Aesthetics",
    description:
      "First impressions matter. We implement pixel-perfect, modern UI/UX design that communicates trust, innovation, and technological maturity.",
  },
  {
    icon: MessageCircle,
    title: "Lead Generation Forms",
    description:
      "Capture beta signups, waitlists, and investor inquiries with beautifully integrated forms synced directly to your CRM or email.",
  },
  {
    icon: Smartphone,
    title: "Responsive & SEO-First",
    description:
      "Built mobile-first and optimized for Generative Engine Optimization (GEO) so your startup gets discovered organically.",
  },
];

const problemPoints = [
  {
    title: "Investors Judge by Your Website",
    description:
      "Before a VC or angel investor takes a meeting, they check your website. A generic template screams 'unprofessional' or 'lack of technical capability'.",
  },
  {
    title: "High Bounce Rates Kill Traction",
    description:
      "If your site takes more than 3 seconds to load, 53% of users leave. Startups can't afford to lose early adopters to poor performance.",
  },
  {
    title: "Templates Don't Stand Out",
    description:
      "Your product is innovative. Your website shouldn't look like every other generic SaaS template. You need custom code to truly reflect your unique value.",
  },
];

export default function Startups() {
  const navigate = useNavigate();

  useEffect(() => {
    trackNichePageView("startups");
  }, []);

  const handleGetMockup = () => {
    navigate("/quote", {
      state: {
        projectType: "Business Website",
        requirements: "Startup/SaaS website for my company",
      },
    });
  };

  return (
    <PageTransition>
      <SEO 
        title="Custom Website Development for Startups & SaaS in Mumbai | SiteNova"
        description="SiteNova builds high-performance, investor-ready React websites for tech startups and SaaS companies in Mumbai. Launch fast, scale easily, and impress users."
        canonicalUrl="/websites-for-startups"
        keywords={["startup website design Mumbai", "SaaS website development", "React developer for startups", "tech startup web design", "investor ready website"]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Websites for Startups and SaaS",
            "provider": { "@type": "ProfessionalService", "name": "SiteNova", "url": "https://sitenova.dev" },
            "areaServed": { "@type": "City", "name": "Mumbai" },
            "audience": { "@type": "Audience", "audienceType": "Tech Startups, SaaS Companies, Founders" },
            "description": "High-performance, custom-coded React websites for tech startups in Mumbai. Built for speed, conversions, and scalable growth.",
            "url": "https://sitenova.dev/websites-for-startups",
            "serviceType": "Startup Web Development"
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sitenova.dev/" },
              { "@type": "ListItem", "position": 2, "name": "Websites for Startups", "item": "https://sitenova.dev/websites-for-startups" }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Why should a startup hire a custom web development agency?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Templates are restrictive and slow. A custom-coded React website by SiteNova gives your startup complete flexibility, lightning-fast load times, and a unique, professional design that instills confidence in early adopters and investors."
                }
              },
              {
                "@type": "Question",
                "name": "Can you build a waitlist or beta signup page?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, we specialize in high-converting landing pages for pre-launch startups, complete with lead capture forms synced to your database or CRM."
                }
              },
              {
                "@type": "Question",
                "name": "What technologies do you use for startup websites?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We build fast, modern Single Page Applications (SPAs) using React, Vite, Tailwind CSS, and Framer Motion, ensuring your site is highly performant and easy to scale into a full web app."
                }
              }
            ]
          }
        ]}
      />
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

      {/* ───────────────── Hero Section ───────────────── */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.12),transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[300px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="mb-6 flex justify-start">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-secondary/20 px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              <ArrowLeft size={14} />
              Back to Main Site
            </Link>
          </div>

          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/5 px-4 py-1.5 text-xs font-medium text-purple-400 mb-6"
            >
              <Rocket className="h-3.5 w-3.5" />
              Built for Tech Startups & SaaS
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading text-4xl font-extrabold tracking-tight sm:text-6xl max-w-4xl mx-auto"
            >
              Launch Faster. Scale Better.{" "}
              <span className="gradient-text">Impress Investors.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Custom-coded React websites for startups in Mumbai — engineered for speed, designed for conversions, and built to scale alongside your product.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              <button
                onClick={handleGetMockup}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors glow-effect button-shimmer"
              >
                Get a Free Startup Mockup
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───────────────── Problem / Agitate Section ───────────────── */}
      <section className="py-20 bg-card/10 border-t border-border/20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl max-w-3xl mx-auto">
              Your Product is Innovative.{" "}
              <span className="gradient-text">Stop Using Generic Templates.</span>
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {problemPoints.map((point, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card rounded-2xl p-6 border border-border/40 hover-glow"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 mb-4">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-2">
                  {point.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {point.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── Features Section ───────────────── */}
      <section className="py-20 border-t border-border/20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-4">
              <TrendingUp className="h-3.5 w-3.5" />
              Startup-Ready Features
            </div>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              What Your Startup Website{" "}
              <span className="gradient-text">Will Include</span>
            </h2>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="interactive-card rounded-2xl border border-border/40 bg-card/30 backdrop-blur p-6 hover-glow"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 mb-4">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── CTA Section ───────────────── */}
      <section className="section-padding relative overflow-hidden border-t border-border/20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-purple-500/8 blur-[140px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-3xl text-center"
        >
          <p className="mx-auto mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Custom Startup Sites starting from ₹15,000
          </p>

          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">
            Let's Build Your Startup's{" "}
            <span className="gradient-text">Growth Engine</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-4 max-w-xl mx-auto">
            Get a free mockup of your startup's landing page. No commitment, no payment until you're absolutely happy.
          </p>

          <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/5 px-4 py-1.5 text-xs font-medium text-green-400 mb-10">
            <ShieldCheck className="h-3.5 w-3.5" />
            Not happy? Full refund within 7 days
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <a
              href="tel:+919326060621"
              onClick={() => trackPhoneClick("/websites-for-startups")}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-all glow-effect button-shimmer interactive-card"
            >
              <Phone size={20} />
              9326060621
            </a>
            <a
              href="https://wa.me/919326060621?text=Hi%2C%20I%20have%20a%20startup%20and%20I%27m%20interested%20in%20getting%20a%20custom%20website."
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("/websites-for-startups")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-8 py-4 text-lg font-semibold text-white hover:bg-[#1ebe57] transition-all button-shimmer interactive-card"
            >
              <MessageCircle size={20} />
              WhatsApp
            </a>
          </div>

          <a
            href={emailComposeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-secondary px-8 py-4 text-lg font-semibold text-foreground hover:bg-secondary/80 transition-all button-shimmer interactive-card"
          >
            <Mail size={20} />
            kavishganatra5@gmail.com
          </a>

          <div className="mt-8 pt-8 border-t border-border/30">
            <button
              onClick={handleGetMockup}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors glow-effect button-shimmer"
            >
              Or Fill the Quote Form Instead
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </section>

      <Footer />
      </div>
    </PageTransition>
  );
}
