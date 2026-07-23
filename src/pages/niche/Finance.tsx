import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { m as motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Briefcase,
  ShieldCheck,
  FileText,
  BookOpen,
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
import jupiterFinanceImage from "@/assets/jupiterfastfinance.webp";
import { buildWhatsAppUrl, PHONE_TEL_LINK, EMAIL_COMPOSE_LINK, EMAIL, PHONE_NUMBER } from "@/lib/constants";

const emailComposeLink =
  `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}&su=Finance%20Website%20Inquiry%20from%20SiteNova`;

const features = [
  {
    icon: Briefcase,
    title: "Service & Expertise Pages",
    description:
      "Dedicated pages for each service — tax filing, audit, advisory, insurance — so clients find exactly what they need.",
  },
  {
    icon: ShieldCheck,
    title: "Client Testimonials & Trust Signals",
    description:
      "Showcase client reviews, certifications, and professional affiliations that build credibility at first glance.",
  },
  {
    icon: FileText,
    title: "Contact Forms & Lead Capture",
    description:
      "Smart inquiry forms that capture client details, service interest, and preferred contact method for instant follow-up.",
  },
  {
    icon: BookOpen,
    title: "Blog / Knowledge Center",
    description:
      "Publish tax tips, financial guides, and regulatory updates that position you as the go-to expert in your field.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Quick Contact",
    description:
      "One-tap WhatsApp integration so clients can reach you instantly — no friction, no missed leads.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First, SEO-Optimized",
    description:
      "Blazing-fast on every device. Built with structured data so Google surfaces your firm for local finance searches.",
  },
];

const problemPoints = [
  {
    title: "Clients Research Online First",
    description:
      "87% of people Google a financial professional before making contact. If they can't find you, they find your competitor.",
  },
  {
    title: "A Dated Website Signals Risk",
    description:
      "In finance, perception is everything. A missing or outdated website tells clients you're behind the times — a red flag for someone handling their money.",
  },
  {
    title: "Your Expertise Deserves Visibility",
    description:
      "You've spent years building knowledge and trust. A professional website is the digital extension of that reputation.",
  },
];

export default function Finance() {
  const navigate = useNavigate();

  useEffect(() => {
    trackNichePageView("finance");
  }, []);

  const handleGetMockup = () => {
    navigate("/quote", {
      state: {
        projectType: "Business Website",
        requirements: "Finance/CA firm website for my practice",
      },
    });
  };

  return (
    <PageTransition>
      <SEO 
        title="Professional Websites for CAs, Financial Advisors & Insurance Agents | SiteNova"
        description="SiteNova builds trust-building, SEO-optimized websites for CAs, financial advisors, and insurance agents in Mumbai. Showcase your expertise and generate leads online."
        canonicalUrl="/websites-for-finance"
        keywords={["website for CA firms", "financial advisor website design Mumbai", "insurance agent website", "CA firm website design", "finance website Mumbai"]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Websites for CAs and Financial Advisors",
            "provider": { "@type": "ProfessionalService", "name": "SiteNova", "url": "https://sitenova.dev" },
            "areaServed": { "@type": "City", "name": "Mumbai" },
            "audience": { "@type": "Audience", "audienceType": "Chartered Accountants, Financial Advisors, Insurance Agents" },
            "description": "Trust-building, lead-generating websites for CAs, financial advisors, and insurance agents in Mumbai with expertise pages, testimonials, and contact forms.",
            "url": "https://sitenova.dev/websites-for-finance",
            "serviceType": "Financial Services Website Design"
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sitenova.dev/" },
              { "@type": "ListItem", "position": 2, "name": "Websites for Finance Professionals", "item": "https://sitenova.dev/websites-for-finance" }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Why does a CA or financial advisor need a website?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A professional website establishes credibility, showcases your services and certifications, and generates leads 24/7. Clients increasingly research financial professionals online before making contact — a strong web presence sets you apart from competitors."
                }
              },
              {
                "@type": "Question",
                "name": "How much does a finance professional website cost?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "SiteNova builds websites for CAs, insurance agents, and financial advisors starting from ₹10,000 for a landing page and ₹15,000 onwards for multi-page sites with service pages, lead capture forms, and blog functionality."
                }
              },
              {
                "@type": "Question",
                "name": "Can I publish tax tips and financial articles on my website?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Every finance website includes a built-in blog or knowledge center where you can publish tax tips, regulatory updates, and financial guides — positioning you as a thought leader and boosting your Google rankings."
                }
              },
              {
                "@type": "Question",
                "name": "How long does it take to build a finance website?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most finance professional websites are delivered within 5–7 working days. We provide a free mockup first so you can see the design before any commitment."
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
        {/* Background gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,89,160,0.12),transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[300px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 relative z-10">
          {/* Back link */}
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
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-1.5 text-xs font-medium text-blue-400 mb-6"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Built for Financial Professionals
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading text-4xl font-extrabold tracking-tight sm:text-6xl max-w-4xl mx-auto"
            >
              Your Clients Google You Before They Call.{" "}
              <span className="gradient-text">What Do They Find?</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Professional websites for CAs, financial advisors, and insurance
              agents — built to establish trust, showcase expertise, and generate
              qualified leads.
            </motion.p>

            {/* CTAs */}
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
                Get a Free Website Mockup
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <a
                href="https://jupiterfastfinance.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-secondary px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors"
              >
                See Jupiter Finance
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
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
              In Finance, Trust Is Everything.{" "}
              <span className="gradient-text">Your Website Builds It.</span>
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
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 mb-4">
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
              Everything You Need
            </div>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              What Your Finance Website{" "}
              <span className="gradient-text">Will Include</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Every feature is designed to build trust, capture leads, and
              position your firm as the authority in your space.
            </p>
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
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 mb-4">
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

      {/* ───────────────── Case Study Section ───────────────── */}
      <section className="py-20 bg-card/10 border-t border-border/20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-4">
              <Star className="h-3.5 w-3.5" />
              Case Study
            </div>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              See What We Built for{" "}
              <span className="gradient-text">Jupiter Fast Finance</span>
            </h2>
          </motion.div>

          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
            {/* Screenshot */}
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-primary/20 to-blue-500/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative rounded-2xl border border-border/60 overflow-hidden shadow-2xl">
                <img
                  src={jupiterFinanceImage}
                  alt="Jupiter Fast Finance website designed by SiteNova — a sleek, modern finance landing page"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 left-6 rounded-full bg-background border border-border px-4 py-2 text-xs font-semibold text-foreground shadow-lg flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-blue-400" />
                jupiterfastfinance.com
              </div>
            </motion.div>

            {/* Testimonial & Details */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="space-y-6"
            >
              {/* Project highlights */}
              <div className="glass-card rounded-2xl border border-border/40 p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                  Project Highlights
                </h3>
                <ul className="space-y-3">
                  {[
                    "Sleek, modern UI with professional finance aesthetic",
                    "Clear call-to-actions driving lead generation",
                    "Fully responsive design across all devices",
                    "Fast-loading pages optimized for SEO",
                    "Trust-building layout with prominent credentials",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"
                    >
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Testimonial */}
              <div className="glass-card rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">
                <Quote className="h-8 w-8 text-blue-400/40 mb-3" />
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  "Truly impressed with the fantastic work done by Site Nova's
                  team on JupiterFinance.com. The website is exceptionally
                  well-designed — modern, sleek, and highly professional in
                  appearance. Every element feels thoughtfully placed, creating a
                  smooth and engaging user experience. Their attention to detail
                  and design aesthetics really stand out. Highly appreciative of
                  the quality and finesse they bring to their work!"
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/15 text-blue-400 text-sm font-bold">
                    JF
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Jupiter Fast Finance
                    </p>
                    <div className="flex gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA to view live */}
              <a
                href="https://jupiterfastfinance.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary px-5 py-3 text-sm font-medium text-foreground hover:bg-secondary/80 transition-all"
              >
                Visit Live Site
                <ExternalLink className="h-4 w-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───────────────── CTA Section ───────────────── */}
      <section className="section-padding relative overflow-hidden border-t border-border/20">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-blue-500/8 blur-[140px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-3xl text-center"
        >
          {/* Price badge */}
          <p className="mx-auto mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Professional websites starting from ₹10,000
          </p>

          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">
            Let's Build Your Firm's{" "}
            <span className="gradient-text">Digital Presence</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-4 max-w-xl mx-auto">
            Get a free mockup of what your firm's website could look like. No
            commitment, no payment until you're happy.
          </p>

          {/* Guarantee badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/5 px-4 py-1.5 text-xs font-medium text-green-400 mb-10">
            <ShieldCheck className="h-3.5 w-3.5" />
            Not happy? Full refund within 7 days
          </div>

          {/* Contact buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <a
              href={PHONE_TEL_LINK}
              onClick={() => trackPhoneClick("/websites-for-finance")}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-all glow-effect button-shimmer interactive-card"
            >
              <Phone size={20} />
              {PHONE_NUMBER}
            </a>
            <a
              href={buildWhatsAppUrl("Hi, I'm a financial professional and I'm interested in getting a website.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("/websites-for-finance")}
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
            {EMAIL}
          </a>

          <p className="mt-5 text-sm text-muted-foreground">
            We typically respond within 24 hours
          </p>

          {/* Quote form CTA */}
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
