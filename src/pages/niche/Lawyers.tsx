import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { m as motion } from "framer-motion";
import {
  Briefcase,
  FileText,
  Star,
  MapPin,
  MessageCircle,
  Smartphone,
  ArrowRight,
  Phone,
  Mail,
  ShieldCheck,
  AlertTriangle,
  Search,
  UserX,
  Award,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { trackNichePageView, trackWhatsAppClick, trackPhoneClick } from "@/lib/analytics";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";

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
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: "easeOut" },
};

const features = [
  {
    icon: Briefcase,
    title: "Practice Area Pages",
    description:
      "Dedicated pages for each area of law you practice — criminal, civil, family, corporate, property — so potential clients instantly see your expertise and find what they need.",
  },
  {
    icon: FileText,
    title: "Case Results & Track Record",
    description:
      "Showcase your experience, notable case outcomes, and years of practice. A strong track record page builds the confidence clients need before making that first call.",
  },
  {
    icon: Star,
    title: "Client Testimonials",
    description:
      "Display genuine client reviews and success stories prominently. In legal services, word-of-mouth trust transferred online is the most powerful conversion tool.",
  },
  {
    icon: MapPin,
    title: "Google Maps & Local SEO",
    description:
      "Get found when people search 'lawyer near me' or 'advocate in Mumbai.' Embedded maps, local schema markup, and optimized listings put your practice on the map — literally.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Quick Consultation",
    description:
      "One-tap WhatsApp button lets potential clients reach you instantly for initial queries. Reduce friction between 'I need a lawyer' and 'I found my lawyer.'",
  },
  {
    icon: Smartphone,
    title: "Mobile-First, SEO-Optimized",
    description:
      "Over 75% of legal searches happen on mobile. Your website will load fast, look professional on every device, and rank high on Google for relevant legal keywords.",
  },
];

const problemPoints = [
  {
    icon: Search,
    title: "Clients Research Lawyers Online Before Hiring",
    description:
      "9 out of 10 people search online before contacting a lawyer. They're comparing credentials, reading reviews, and checking websites. If you're invisible online, you're invisible to them.",
  },
  {
    icon: UserX,
    title: "No Website = No Credibility in 2026",
    description:
      "When a potential client searches your name and finds nothing — no website, no professional presence — it's a red flag. They move on to the lawyer who looks established online.",
  },
  {
    icon: Award,
    title: "Your Expertise Deserves a Professional Platform",
    description:
      "You've spent years earning your degree, building courtroom experience, and winning cases. That expertise deserves a professional online platform that reflects your caliber.",
  },
];

const faqs = [
  {
    question: "Why does a lawyer need a professional website?",
    answer:
      "A professional website establishes credibility and trust — the two most important factors when someone is choosing legal representation. It lets potential clients verify your credentials, understand your practice areas, read testimonials, and contact you instantly. In 2026, not having a website is the equivalent of not having a business card in the 1990s.",
  },
  {
    question: "How much does a law firm website cost in Mumbai?",
    answer:
      "Our law firm websites start from ₹10,000 for a fully designed, mobile-responsive, SEO-optimized website. This includes practice area pages, contact forms, WhatsApp integration, Google Maps, and a professional design that reflects the authority of your practice. We offer transparent pricing with no hidden fees.",
  },
  {
    question: "Can I update my website content myself?",
    answer:
      "Absolutely. We build websites with easy content management in mind. You'll be able to update text, add new practice areas, upload images, and modify your bio without any technical knowledge. We also provide free training and support to get you comfortable with managing your site.",
  },
  {
    question: "Will my website rank on Google for legal searches?",
    answer:
      "Yes — every website we build is SEO-optimized from the ground up. We implement proper heading structures, meta tags, schema markup, fast loading speeds, mobile responsiveness, and local SEO strategies so you rank for searches like 'lawyer in Mumbai,' 'advocate near me,' and your specific practice areas.",
  },
  {
    question: "How long does it take to build a lawyer website?",
    answer:
      "We deliver most lawyer websites within 5–7 working days from the day we receive your content and requirements. For more complex sites with custom features, it may take 10–12 days. We prioritize speed without compromising quality, and you'll see progress updates throughout the process.",
  },
];

export default function Lawyers() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    trackNichePageView("lawyers");
  }, []);

  const handleGetMockup = () => {
    navigate("/quote", {
      state: {
        projectType: "Business Website",
        requirements: "Legal/law firm website for my practice",
      },
    });
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <PageTransition>
      <SEO 
        title="Professional Websites for Lawyers & Law Firms in Mumbai | SiteNova"
        description="SiteNova builds authority-driven, SEO-optimized websites for lawyers, advocates, and law firms in Mumbai. Showcase expertise, build credibility, and generate client inquiries 24/7."
        canonicalUrl="/websites-for-lawyers"
        keywords={["website for lawyers in Mumbai", "law firm website design India", "advocate website Mumbai", "lawyer website designer Mulund", "legal website development"]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Websites for Lawyers and Law Firms",
            "provider": { "@type": "ProfessionalService", "name": "SiteNova", "url": "https://sitenova.dev" },
            "areaServed": { "@type": "City", "name": "Mumbai" },
            "audience": { "@type": "Audience", "audienceType": "Lawyers, Advocates, Law Firms, Legal Professionals" },
            "description": "Authority-driven, SEO-optimized websites for lawyers, advocates, and law firms in Mumbai. Practice area pages, client testimonials, and mobile-first design.",
            "url": "https://sitenova.dev/websites-for-lawyers",
            "serviceType": "Legal Website Design"
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sitenova.dev/" },
              { "@type": "ListItem", "position": 2, "name": "Websites for Lawyers", "item": "https://sitenova.dev/websites-for-lawyers" }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map((faq) => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer,
              },
            })),
          }
        ]}
      />
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

      {/* ══════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pb-28">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(120,119,198,0.06),transparent_50%)]" />

        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-1.5 text-xs font-medium text-blue-400 mb-8"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Built for Legal Professionals
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Your Clients Search Online Before Hiring.{" "}
              <span className="gradient-text">Are You Visible?</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Professional websites for lawyers, advocates, and law firms in Mumbai
              — built to establish authority, showcase expertise, and generate
              client inquiries 24/7.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={handleGetMockup}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors glow-effect button-shimmer"
              >
                Get a Free Law Firm Website Mockup
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <a
                href="https://wa.me/919326060621?text=Hi%2C%20I%27m%20a%20lawyer%20and%20I%27m%20interested%20in%20getting%20a%20website%20for%20my%20practice."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick("/websites-for-lawyers")}
                className="inline-flex items-center justify-center rounded-lg border border-border bg-secondary px-7 py-3.5 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat on WhatsApp
              </a>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
                Bar Council compliant design
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
                Delivered in 5–7 days
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
                Starting from ₹10,000
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PROBLEM / AGITATE SECTION
      ══════════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 border-t border-border/20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1 text-xs font-medium text-amber-400 mb-6">
              <AlertTriangle className="h-3.5 w-3.5" />
              The Hard Truth
            </div>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              The Lawyer Down the Road Has a Website.{" "}
              <span className="gradient-text">Do You?</span>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              In today's world, your online presence is often a client's first
              impression of your practice. Here's what happens when it's
              missing.
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
                className="group relative rounded-2xl border border-border/40 bg-card/30 p-7 backdrop-blur transition-all duration-300 hover:border-border/60 hover:bg-card/50 interactive-card"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 mb-5">
                  <point.icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {point.title}
                </h3>
                <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">
                  {point.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURES SECTION
      ══════════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 bg-card/10 border-t border-border/20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Everything Your Practice Needs
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              What Your Law Firm Website{" "}
              <span className="gradient-text">Will Include</span>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Every feature is carefully chosen to help you attract new clients,
              build authority, and convert website visitors into paying clients.
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
                className="group glass-card p-7 hover-glow interactive-card"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-5 group-hover:bg-primary/15 transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FAQ SECTION
      ══════════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 border-t border-border/20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Common Questions
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently Asked{" "}
              <span className="gradient-text">Questions</span>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Everything you need to know about getting a professional website
              for your legal practice.
            </p>
          </motion.div>

          <motion.div
            {...fadeUp}
            className="mt-14 max-w-3xl mx-auto space-y-4"
          >
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border/40 bg-card/30 backdrop-blur overflow-hidden transition-all duration-300 hover:border-border/60"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <h3 className="font-heading text-base font-semibold text-foreground pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === idx ? "max-h-96 pb-6" : "max-h-0"
                  }`}
                >
                  <p className="px-6 text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FINAL CTA SECTION
      ══════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 border-t border-border/20 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.06),transparent_60%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="mx-auto max-w-4xl px-6 relative z-10">
          <motion.div {...fadeUp} className="text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Let's Build Your Practice's{" "}
              <span className="gradient-text">Online Presence</span>
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Get a free mockup of what your law firm website could look like. No
              commitment, no payment until you're happy.
            </p>

            {/* Guarantee badge */}
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-5 py-2 text-sm font-medium text-blue-400">
              <ShieldCheck className="h-4 w-4" />
              Not happy? Full refund within 7 days
            </div>

            {/* Price mention */}
            <div className="mt-6">
              <span className="text-sm text-muted-foreground">
                Law firm websites starting from{" "}
              </span>
              <span className="font-heading text-2xl font-bold text-foreground">
                ₹10,000
              </span>
            </div>

            {/* Contact buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleGetMockup}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors glow-effect button-shimmer"
              >
                Get Your Free Mockup
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <a
                href="https://wa.me/919326060621?text=Hi%2C%20I%27m%20a%20lawyer%20and%20I%27m%20interested%20in%20getting%20a%20website%20for%20my%20practice."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick("/websites-for-lawyers")}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-emerald-600 px-8 py-4 text-sm font-semibold text-white hover:bg-emerald-600/90 transition-colors"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp Us
              </a>
            </div>

            {/* Secondary contact options */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <a
                href="tel:+919326060621"
                onClick={() => trackPhoneClick("/websites-for-lawyers")}
                className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Phone className="h-4 w-4" />
                +91 93260 60621
              </a>
              <a
                href="mailto:kavishganatra5@gmail.com"
                className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
                kavishganatra5@gmail.com
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      </div>
    </PageTransition>
  );
}
