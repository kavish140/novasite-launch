import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { m as motion } from "framer-motion";
import {
  Briefcase,
  BookOpen,
  Star,
  Calendar,
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
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { trackNichePageView, trackWhatsAppClick, trackPhoneClick } from "@/lib/analytics";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";
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
    icon: Briefcase,
    title: "Service & Expertise Pages",
    description:
      "Dedicated pages for each consulting service — strategy, operations, HR, IT advisory — so potential clients instantly understand your value.",
  },
  {
    icon: BookOpen,
    title: "Blog & Thought Leadership",
    description:
      "Publish insights, case frameworks, and industry perspectives that position you as the go-to authority in your niche. Content that converts readers to clients.",
  },
  {
    icon: Star,
    title: "Client Success Stories",
    description:
      "Showcase measurable results and client testimonials that prove your impact. Social proof is the fastest way to convert a prospect into a paying client.",
  },
  {
    icon: Calendar,
    title: "Online Booking Integration",
    description:
      "Let clients schedule discovery calls and consultations directly from your website — 24/7, without back-and-forth emails or phone tag.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Quick Connect",
    description:
      "One-tap WhatsApp button lets prospects reach you instantly. Perfect for quick inquiries, booking confirmations, and follow-ups.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First, SEO-Optimized",
    description:
      "Over 70% of decision-makers research on mobile. Your website will load fast, look stunning on every device, and rank high on Google for consulting searches.",
  },
];

const problemPoints = [
  {
    icon: Search,
    title: "Premium Clients Research Before Hiring",
    description:
      "High-value clients always vet consultants online before reaching out. They check your website, read your content, and assess your professionalism — all before making first contact.",
  },
  {
    icon: UserX,
    title: "No Website = Missed Opportunities Every Day",
    description:
      "Every day without a professional website, potential clients are choosing competitors who look more credible online. A polished digital presence is no longer optional — it's expected.",
  },
  {
    icon: Award,
    title: "Your Knowledge Deserves a World-Class Platform",
    description:
      "You've spent years mastering your craft and building expertise. Your website should reflect that same level of excellence — a digital showcase worthy of your reputation.",
  },
];

const faqs = [
  {
    question: "Why does a consultant need a professional website?",
    answer:
      "A professional website is your 24/7 digital storefront. It establishes instant credibility, showcases your expertise, and makes it easy for potential clients to understand your services and reach out. In consulting, trust is everything — and a polished website builds that trust before you ever speak to a prospect.",
  },
  {
    question: "How much does a consulting website cost?",
    answer:
      "Our consulting websites start from ₹10,000. This includes a fully custom design, mobile optimization, SEO setup, contact forms, and WhatsApp integration. The exact cost depends on the number of pages and specific features you need — we'll give you a transparent quote after understanding your requirements.",
  },
  {
    question: "Can I add a blog to my consulting website?",
    answer:
      "Absolutely! A blog is one of the most powerful tools for consultants. Publishing thought leadership content — industry insights, frameworks, and case analyses — positions you as an authority in your field. It also drives organic traffic from Google, bringing potential clients directly to your website.",
  },
  {
    question: "Will my website help me get more consulting clients?",
    answer:
      "Yes. A well-designed, SEO-optimized website acts as a lead generation engine. It ranks for searches like 'business consultant in Mumbai,' captures inquiries through contact forms and WhatsApp, and pre-sells your expertise through service pages and testimonials — so prospects are already convinced before they call.",
  },
  {
    question: "How quickly can my website be ready?",
    answer:
      "Most consulting websites are delivered within 5–7 days from the day you approve the design mockup. We move fast without cutting corners — you'll get a professional, fully functional website ready to start attracting clients within a week.",
  },
];

export default function Consultants() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    trackNichePageView("consultants");
  }, []);

  const handleGetMockup = () => {
    navigate("/quote", {
      state: {
        projectType: "Business Website",
        requirements: "Consulting/advisory website for my practice",
      },
    });
  };

  return (
    <PageTransition>
      <SEO 
        title="Professional Websites for Consultants, Coaches & Advisors in Mumbai | SiteNova"
        description="SiteNova builds authority-building, SEO-optimized websites for consultants, business coaches, and advisors in Mumbai. Showcase your expertise, attract premium clients, and book consultations online."
        canonicalUrl="/websites-for-consultants"
        keywords={["website for consultants in Mumbai", "consultant portfolio website India", "business coach website design", "consultant website designer Mumbai", "professional consulting website"]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Websites for Consultants and Advisors",
            "provider": { "@type": "ProfessionalService", "name": "SiteNova", "url": "https://sitenova.dev" },
            "areaServed": { "@type": "City", "name": "Mumbai" },
            "audience": { "@type": "Audience", "audienceType": "Consultants, Business Coaches, Advisors, Strategy Professionals" },
            "description": "Authority-building, lead-generating websites for consultants, business coaches, and advisors in Mumbai with expertise pages, booking integration, and thought leadership blogs.",
            "url": "https://sitenova.dev/websites-for-consultants",
            "serviceType": "Consulting Website Design"
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sitenova.dev/" },
              { "@type": "ListItem", "position": 2, "name": "Websites for Consultants", "item": "https://sitenova.dev/websites-for-consultants" }
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(120,119,198,0.06),transparent_50%)]" />

        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-4 py-1.5 text-xs font-medium text-violet-400 mb-8"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Built for Consulting Professionals
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Your Next Client Is Searching Online.{" "}
              <span className="gradient-text">Will They Find You?</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Professional websites for consultants, coaches, and advisors in
              Mumbai — built to showcase your expertise, attract premium clients,
              and book consultations 24/7.
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
                Get a Free Consulting Website Mockup
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <a
                href={buildWhatsAppUrl("Hi, I'm a consultant and I'm interested in getting a website for my practice.")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick("/websites-for-consultants")}
                className="inline-flex items-center justify-center rounded-lg bg-[#25D366] px-7 py-3.5 text-sm font-semibold text-white hover:bg-[#1ebe57] transition-colors"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp Us
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
                <CheckCircle2 className="h-3.5 w-3.5 text-violet-400" />
                Professional & trustworthy design
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-violet-400" />
                Delivered in 5–7 days
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-violet-400" />
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
              Your Competitor Already Has a Website.{" "}
              <span className="gradient-text">Do You?</span>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              In today's world, your online presence is often a client's first
              impression of your expertise. Here's what happens when it's
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
              What Your Consulting Website{" "}
              <span className="gradient-text">Will Include</span>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Every feature is carefully chosen to help you attract premium
              clients, establish authority, and grow your consulting practice
              online.
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
        <div className="mx-auto max-w-3xl px-6">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Common Questions
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently Asked{" "}
              <span className="gradient-text">Questions</span>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Everything you need to know about getting a professional consulting
              website.
            </p>
          </motion.div>

          <motion.div {...staggerContainer} className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                {...staggerChild}
                className="rounded-2xl border border-border/40 bg-card/30 backdrop-blur overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-card/50"
                >
                  <span className="font-heading text-sm font-semibold text-foreground pr-4">
                    {faq.question}
                  </span>
                  <span
                    className={`shrink-0 ml-2 flex h-7 w-7 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-transform duration-300 ${
                      openFaq === idx ? "rotate-45 bg-primary/10 text-primary border-primary/30" : ""
                    }`}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 1V11M1 6H11"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    openFaq === idx
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FINAL CTA SECTION
      ══════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 border-t border-border/20 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.06),transparent_60%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="mx-auto max-w-4xl px-6 relative z-10">
          <motion.div {...fadeUp} className="text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Let's Build Your Consulting{" "}
              <span className="gradient-text">Digital Presence</span>
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Get a free mockup of what your consulting website could look like.
              No commitment, no payment until you're happy.
            </p>

            {/* Guarantee badge */}
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-5 py-2 text-sm font-medium text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              Not happy? Full refund within 7 days
            </div>

            {/* Price mention */}
            <div className="mt-6">
              <span className="text-sm text-muted-foreground">
                Consulting websites starting from{" "}
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
                href={buildWhatsAppUrl("Hi, I'm a consultant and I'm interested in getting a website for my practice.")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick("/websites-for-consultants")}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-[#25D366] px-8 py-4 text-sm font-semibold text-white hover:bg-[#1ebe57] transition-colors"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp Us
              </a>
            </div>

            {/* Secondary contact options */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <a
                href={PHONE_TEL_LINK}
                onClick={() => trackPhoneClick("/websites-for-consultants")}
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
