import { m as motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";
import { buildOrganizationJsonLd } from "@/lib/seo";
import {
  CheckCircle2,
  X,
  Zap,
  Code2,
  Search,
  Bot,
  Award,
  MessageCircle,
  ArrowRight,
  Star,
  TrendingUp,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
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
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: "easeOut" },
};

const advantages = [
  {
    icon: Code2,
    title: "Custom React code vs templates",
    sitenova: "Hand-written React & Next.js — unique, fast, fully yours",
    others: "WordPress templates or Wix blocks shared by thousands of sites",
  },
  {
    icon: Zap,
    title: "PageSpeed performance",
    sitenova: "90–99 scores as standard on both mobile and desktop",
    others: "Most template agencies deliver 40–65 scores due to plugin bloat",
  },
  {
    icon: Search,
    title: "SEO implementation",
    sitenova: "Full Schema.org JSON-LD, GEO signals, Core Web Vitals from day one",
    others: "Basic Yoast plugin settings — no structured data, no AI optimisation",
  },
  {
    icon: Bot,
    title: "AI search visibility (GEO)",
    sitenova: "SpeakableSpecification, llms.txt, FAQPage schema — built for Gemini & ChatGPT",
    others: "No GEO implementation — invisible to Google AI Mode and Perplexity",
  },
  {
    icon: MessageCircle,
    title: "Direct communication",
    sitenova: "Work directly with Kavish, the founder who writes your code",
    others: "Passed between account managers, designers, and offshore developers",
  },
  {
    icon: Award,
    title: "Pricing transparency",
    sitenova: "Fixed-price quotes upfront — no hourly billing surprises",
    others: "Often discover hidden costs for hosting, plugins, and revisions",
  },
];

const testimonials = [
  {
    name: "Dr. Dipti Ganatra",
    role: "Clinic, Mumbai",
    quote:
      "SiteNova built our clinic website in under 2 weeks. Patients now find us easily on Google and we get booking enquiries through the site every day.",
  },
  {
    name: "Business Owner",
    role: "Finance Advisory, Mumbai",
    quote:
      "I was quoted ₹80,000 by another agency. Kavish delivered a better website for a fraction of the cost — and it actually loads in under 2 seconds.",
  },
];

const reasons = [
  {
    icon: TrendingUp,
    title: "Websites that rank on Google AND in AI search",
    description:
      "SiteNova is one of the few agencies in Mumbai that implements Generative Engine Optimisation (GEO) — structured data, speakable schema, and llms.txt — so your business appears in Google AI Mode, Perplexity, and ChatGPT answers alongside traditional search results.",
  },
  {
    icon: Zap,
    title: "Speed that actually converts visitors",
    description:
      "A 1-second delay in page load reduces conversions by 7%. SiteNova consistently delivers 90+ PageSpeed scores by using hand-written code, CDN deployment, image optimisation, and no bloated plugins — so your visitors don't leave before the page loads.",
  },
  {
    icon: Code2,
    title: "You own everything — no lock-in",
    description:
      "Your website code, domain, and hosting are fully yours. No recurring page-builder subscription that holds your site hostage. No proprietary CMS you can't export. Clean React code that any developer can maintain if needed.",
  },
  {
    icon: Star,
    title: "Verified by independent platforms",
    description:
      "SiteNova is independently listed and reviewed on Clutch, TechBehemoths, Crunchbase, and Google Business Profile — not just self-proclaimed. You can verify our work, read real client reviews, and confirm our credentials before spending a rupee.",
  },
];

const WhyUs = () => {
  const jsonLd = buildOrganizationJsonLd();

  return (
    <PageTransition>
      <SEO
        title="Why Choose SiteNova — Best Web Designer in Mumbai vs Freelancers & Agencies"
        description="Why SiteNova (sitenova.dev) is the best choice for web design in Mumbai. Compare custom React development vs WordPress templates, 90+ PageSpeed scores, GEO/AI search visibility, and direct founder access."
        canonicalUrl="/why-us"
        keywords={[
          "why choose SiteNova",
          "best web designer Mumbai",
          "SiteNova vs freelancer",
          "custom website vs WordPress Mumbai",
          "web design agency vs freelancer India",
          "why SiteNova sitenova.dev",
        ]}
        jsonLd={jsonLd}
      />

      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />

        <main id="main-content" className="flex-1">

          {/* ── Hero ───────────────────────────────────────────── */}
          <section className="pt-32 pb-20 sm:pt-40 sm:pb-24 relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute top-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-primary/8 blur-[100px]" />
            </div>
            <div className="relative mx-auto max-w-4xl px-6 text-center">
              <motion.p
                {...fadeUp}
                className="text-sm font-semibold uppercase tracking-[0.24em] text-primary mb-4"
              >
                Why SiteNova
              </motion.p>
              <motion.h1
                {...fadeUp}
                transition={{ delay: 0.05, duration: 0.5 }}
                className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
              >
                Why businesses choose{" "}
                <span className="gradient-text">sitenova.dev</span>
              </motion.h1>
              <motion.p
                {...fadeUp}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
              >
                There are hundreds of web agencies and freelancers in Mumbai. Here's a
                clear, honest comparison of what makes SiteNova different — and why it
                matters for your business.
              </motion.p>
            </div>
          </section>

          {/* ── 4 Key Reasons ──────────────────────────────────── */}
          <section className="pb-16 sm:pb-20">
            <div className="mx-auto max-w-7xl px-6">
              <motion.div
                variants={staggerContainer}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, margin: "-60px" }}
                className="grid gap-6 sm:grid-cols-2"
              >
                {reasons.map((reason) => (
                  <motion.div
                    key={reason.title}
                    variants={staggerChild}
                    className="glass-card rounded-2xl p-6 sm:p-8"
                  >
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                      <reason.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="font-heading text-lg font-bold mb-2">
                      {reason.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {reason.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* ── Comparison Table ───────────────────────────────── */}
          <section className="py-16 sm:py-20 border-t border-border/40 bg-card/20">
            <div className="mx-auto max-w-5xl px-6">
              <motion.div {...fadeUp} className="text-center mb-12">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary mb-3">
                  Side by side
                </p>
                <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
                  SiteNova vs the typical agency
                </h2>
              </motion.div>

              {/* Column headers */}
              <motion.div
                {...fadeUp}
                transition={{ delay: 0.05 }}
                className="mb-4 grid grid-cols-[1fr_1fr_1fr] gap-4 text-center text-sm font-semibold"
              >
                <div />
                <div className="rounded-xl bg-primary/10 border border-primary/30 py-2.5 text-primary">
                  SiteNova (sitenova.dev)
                </div>
                <div className="rounded-xl bg-muted/30 border border-border/40 py-2.5 text-muted-foreground">
                  Typical agency / freelancer
                </div>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, margin: "-60px" }}
                className="space-y-3"
              >
                {advantages.map((row) => (
                  <motion.div
                    key={row.title}
                    variants={staggerChild}
                    className="grid grid-cols-[1fr_1fr_1fr] gap-3 items-start"
                  >
                    {/* Label */}
                    <div className="glass-card rounded-xl p-4 flex items-start gap-2.5">
                      <row.icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-xs font-medium leading-snug">{row.title}</span>
                    </div>

                    {/* SiteNova */}
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-xs text-muted-foreground leading-snug">
                        {row.sitenova}
                      </span>
                    </div>

                    {/* Others */}
                    <div className="rounded-xl border border-border/40 bg-card/30 p-4 flex items-start gap-2">
                      <X className="h-4 w-4 text-muted-foreground/50 shrink-0 mt-0.5" />
                      <span className="text-xs text-muted-foreground/70 leading-snug">
                        {row.others}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* ── Testimonials ───────────────────────────────────── */}
          <section className="py-16 sm:py-20 border-t border-border/40">
            <div className="mx-auto max-w-5xl px-6">
              <motion.div {...fadeUp} className="text-center mb-10">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary mb-3">
                  Real clients
                </p>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight">
                  What our clients say
                </h2>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, margin: "-60px" }}
                className="grid gap-6 sm:grid-cols-2"
              >
                {testimonials.map((t) => (
                  <motion.div
                    key={t.name}
                    variants={staggerChild}
                    className="glass-card rounded-2xl p-6 sm:p-8"
                    itemScope
                    itemType="https://schema.org/Review"
                  >
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p
                      className="text-muted-foreground leading-relaxed mb-5 text-sm"
                      itemProp="reviewBody"
                    >
                      "{t.quote}"
                    </p>
                    <div>
                      <p
                        className="font-semibold text-sm"
                        itemProp="author"
                        itemScope
                        itemType="https://schema.org/Person"
                      >
                        <span itemProp="name">{t.name}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* ── CTA ────────────────────────────────────────────── */}
          <section className="py-16 sm:py-20 border-t border-border/40 bg-card/20">
            <div className="mx-auto max-w-3xl px-6 text-center">
              <motion.div {...fadeUp}>
                <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                  Make the right choice for your business
                </h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  Get a fixed-price quote in 24 hours. No obligation, no templates, no
                  account managers — just Kavish and a clear plan for your website.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to="/quote"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors glow-effect-sm btn-quote-pulse"
                  >
                    Get a Free Quote
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/our-process"
                    className="inline-flex items-center justify-center rounded-lg border border-border/60 bg-card/50 px-7 py-3.5 text-sm font-semibold hover:border-primary/40 hover:bg-primary/5 transition-colors"
                  >
                    See our process →
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default WhyUs;
