import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { m as motion } from "framer-motion";
import {
  Calendar,
  ClipboardList,
  Star,
  MapPin,
  MessageCircle,
  Smartphone,
  ArrowRight,
  ExternalLink,
  Phone,
  Mail,
  ShieldCheck,
  AlertTriangle,
  Search,
  UserX,
  Award,
  Quote,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { trackNichePageView, trackWhatsAppClick, trackPhoneClick } from "@/lib/analytics";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";
import drDiptiImage from "@/assets/Drdiptiganatra.webp";
import { buildWhatsAppUrl, PHONE_TEL_LINK, EMAIL } from "@/lib/constants";

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
    icon: Calendar,
    title: "Online Appointment Booking",
    description:
      "Let patients book appointments 24/7 directly from your website — no phone calls needed. Reduce no-shows with automated reminders.",
  },
  {
    icon: ClipboardList,
    title: "Service & Treatment Pages",
    description:
      "Showcase every treatment you offer with dedicated pages — from dental implants to physiotherapy sessions — so patients find exactly what they need.",
  },
  {
    icon: Star,
    title: "Patient Testimonials Section",
    description:
      "Build trust instantly with genuine patient reviews displayed prominently. Social proof is the #1 factor in choosing a doctor online.",
  },
  {
    icon: MapPin,
    title: "Google Maps Integration",
    description:
      "Help patients find your clinic effortlessly with embedded Google Maps, directions, and your exact location pinned on the page.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Quick Contact",
    description:
      "One-tap WhatsApp button lets patients reach you instantly. Perfect for quick queries, appointment confirmations, and follow-ups.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First, SEO-Optimized",
    description:
      "Over 80% of patients search on their phones. Your website will load fast, look stunning on mobile, and rank high on Google.",
  },
];

const problemPoints = [
  {
    icon: Search,
    title: "Patients Google Before Choosing a Doctor",
    description:
      "8 out of 10 patients search online before booking. If you're not showing up, your competitor down the road is getting those patients.",
  },
  {
    icon: UserX,
    title: "A Poor or Missing Website = Lost Patients",
    description:
      "No website? Outdated website? Patients assume you're either not practicing or not keeping up. First impressions happen online now.",
  },
  {
    icon: Award,
    title: "Your Practice Deserves a Professional Online Presence",
    description:
      "You've spent years building expertise and trust in person. Your website should reflect that same level of professionalism.",
  },
];

export default function Doctors() {
  const navigate = useNavigate();

  useEffect(() => {
    trackNichePageView("doctors");
  }, []);

  const handleGetMockup = () => {
    navigate("/quote", {
      state: {
        projectType: "Business Website",
        requirements: "Healthcare/clinic website for my practice",
      },
    });
  };

  return (
    <PageTransition>
      <SEO 
        title="Professional Websites for Doctors & Clinics in Mumbai | SiteNova"
        description="SiteNova builds patient-friendly, SEO-optimized websites for doctors, dentists, and clinics in Mumbai. Online appointments, patient testimonials, and mobile-first design."
        canonicalUrl="/websites-for-doctors"
        keywords={["website for doctors Mumbai", "clinic website design", "doctor website designer Mulund", "healthcare website Mumbai", "medical practice website design"]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Websites for Doctors and Clinics",
            "provider": { "@type": "ProfessionalService", "name": "SiteNova", "url": "https://sitenova.dev" },
            "areaServed": { "@type": "City", "name": "Mumbai" },
            "audience": { "@type": "Audience", "audienceType": "Doctors, Dentists, Clinics, Healthcare Providers" },
            "description": "Patient-friendly, SEO-optimized websites for doctors, dentists, and clinics in Mumbai. Online appointments, mobile-first design, and Google Maps integration.",
            "url": "https://sitenova.dev/websites-for-doctors",
            "serviceType": "Healthcare Website Design"
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sitenova.dev/" },
              { "@type": "ListItem", "position": 2, "name": "Websites for Doctors", "item": "https://sitenova.dev/websites-for-doctors" }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Why does a doctor need a professional website?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Over 80% of patients search online before choosing a doctor. A professional website builds trust, showcases your expertise, displays patient reviews, and lets patients book appointments 24/7 — giving you a competitive edge over clinics without an online presence."
                }
              },
              {
                "@type": "Question",
                "name": "How much does a doctor website cost in Mumbai?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "SiteNova builds clinic and doctor websites starting from ₹10,000 for a landing page and ₹15,000 onwards for multi-page sites with appointment booking, Google Maps integration, and patient testimonial sections."
                }
              },
              {
                "@type": "Question",
                "name": "Will my clinic website rank on Google?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Every website we build includes on-page SEO, local schema markup, Google Business Profile optimization, and mobile-first design — all critical factors for ranking in local searches like 'dentist near me' or 'doctor in Mulund'."
                }
              },
              {
                "@type": "Question",
                "name": "How long does it take to build a doctor website?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most clinic websites are delivered within 5–7 working days. We provide a free mockup first so you can see the design before any commitment."
                }
              }
            ]
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(45,212,191,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(120,119,198,0.06),transparent_50%)]" />

        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs font-medium text-emerald-400 mb-8"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Built for Healthcare Professionals
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Your Patients Are Searching Online.{" "}
              <span className="gradient-text">Can They Find You?</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Professional websites for doctors, dentists, and clinics in Mumbai
              — built to attract patients, showcase your practice, and book
              appointments 24/7.
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
                Get a Free Clinic Website Mockup
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <a
                href="https://drdiptiganatra.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-secondary px-7 py-3.5 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors"
              >
                See Dr. Dipti's Website
                <ExternalLink className="ml-2 h-4 w-4" />
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
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                HIPAA-aware design practices
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Delivered in 5–7 days
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
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
              Your Competitor Down the Road Has a Website.{" "}
              <span className="gradient-text">Do You?</span>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              In today's world, your online presence is often a patient's first
              interaction with your practice. Here's what happens when it's
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
              What Your Clinic Website{" "}
              <span className="gradient-text">Will Include</span>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Every feature is carefully chosen to help you attract new patients,
              build trust, and streamline your practice operations online.
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
          CASE STUDY SECTION
      ══════════════════════════════════════════════ */}
      <section className="py-20 sm:py-24 border-t border-border/20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-14">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">
              Real Results
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              See What We Built for{" "}
              <span className="gradient-text">Dr. Dipti Ganatra</span>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              A professional clinic website with elegant branding, database
              integration, and a seamless patient appointment flow.
            </p>
          </motion.div>

          <motion.div
            {...fadeUp}
            className="grid gap-8 lg:grid-cols-[1fr_1.1fr] items-center"
          >
            {/* Screenshot */}
            <div className="relative group">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/20 via-emerald-500/10 to-primary/20 opacity-50 blur-xl group-hover:opacity-70 transition-opacity" />
              <div className="relative rounded-2xl border border-border/40 overflow-hidden shadow-2xl">
                <img
                  src={drDiptiImage}
                  alt="Dr. Dipti Ganatra's clinic website built by SiteNova — professional healthcare web design"
                  className="w-full h-auto"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <a
                    href="https://drdiptiganatra.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur-md border border-border/40 px-4 py-2 text-xs font-medium text-foreground hover:bg-background/90 transition-colors"
                  >
                    drdiptiganatra.com
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="space-y-6">
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Patient Engagement", value: "↑ Improved" },
                  { label: "Business Growth", value: "Steady" },
                  { label: "Delivery Time", value: "< 1 Week" },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-border/40 bg-card/30 p-4 text-center backdrop-blur"
                  >
                    <div className="font-heading text-lg font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quote card */}
              <div className="relative rounded-2xl border border-primary/15 bg-primary/5 p-8">
                <Quote className="absolute top-6 right-6 h-10 w-10 text-primary/10" />
                <div className="flex items-center gap-1.5 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <blockquote className="text-sm text-foreground/90 leading-relaxed italic">
                  "Absolutely thrilled with my website www.drdiptiganatra.com!
                  Site Nova's team built it beautifully in a very short span of
                  time, with complete database integration and seamless
                  functionality. The design is clean, professional, and perfectly
                  reflects my practice. Since its launch, I've seen improved
                  patient engagement and steady growth in my business. Highly
                  recommend their team for anyone looking for a powerful and
                  well-executed website!"
                </blockquote>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 font-heading font-bold text-sm">
                    DG
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground">
                      Dr. Dipti Ganatra
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Dental Surgeon, Mumbai
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA within case study */}
              <button
                onClick={handleGetMockup}
                className="w-full inline-flex items-center justify-center rounded-xl bg-primary py-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors glow-effect-sm button-shimmer"
              >
                I Want a Website Like This
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FINAL CTA SECTION
      ══════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 border-t border-border/20 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(45,212,191,0.06),transparent_60%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="mx-auto max-w-4xl px-6 relative z-10">
          <motion.div {...fadeUp} className="text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Let's Build Your Practice's{" "}
              <span className="gradient-text">Online Presence</span>
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Get a free mockup of what your clinic website could look like. No
              commitment, no payment until you're happy.
            </p>

            {/* Guarantee badge */}
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-5 py-2 text-sm font-medium text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              Not happy? Full refund within 7 days
            </div>

            {/* Price mention */}
            <div className="mt-6">
              <span className="text-sm text-muted-foreground">
                Clinic websites starting from{" "}
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
                href={buildWhatsAppUrl("Hi, I'm a doctor and I'm interested in getting a website for my clinic.")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick("/websites-for-doctors")}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-emerald-600 px-8 py-4 text-sm font-semibold text-white hover:bg-emerald-600/90 transition-colors"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp Us
              </a>
            </div>

            {/* Secondary contact options */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <a
                href={PHONE_TEL_LINK}
                onClick={() => trackPhoneClick("/websites-for-doctors")}
                className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Phone className="h-4 w-4" />
                +91 93260 60621
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
                {EMAIL}
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
