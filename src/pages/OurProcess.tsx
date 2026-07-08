import { m as motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";
import { buildHowToJsonLd } from "@/lib/seo";
import {
  MessageSquare,
  Palette,
  Code2,
  Rocket,
  Clock,
  CheckCircle2,
  ArrowRight,
  Banknote,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: "easeOut" },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.12 } },
  viewport: { once: true, margin: "-60px" },
};

const staggerChild = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: "easeOut" },
};

const steps = [
  {
    step: "01",
    icon: MessageSquare,
    title: "Discovery & Brief",
    duration: "Day 1",
    description:
      "We start with a detailed discovery call (30–60 min) to understand your business, target audience, competitors, and goals. You share your brand assets, content, and any specific requirements. After the call, we send you a clear project brief and fixed-price quote — no hourly billing surprises.",
    deliverables: [
      "Project scope document",
      "Fixed-price quote",
      "Timeline with milestones",
    ],
  },
  {
    step: "02",
    icon: Palette,
    title: "UI/UX Design",
    duration: "Days 2–5",
    description:
      "Our designer creates a complete website layout and visual identity tailored to your brand. This includes colour palette, typography, section layout, and mobile breakpoints. You review and approve the design in Figma before any code is written — we never build blind.",
    deliverables: [
      "Full Figma design mockup",
      "Mobile & desktop layouts",
      "Brand colour & type system",
    ],
  },
  {
    step: "03",
    icon: Code2,
    title: "Development & SEO Setup",
    duration: "Days 5–12",
    description:
      "We build your website from scratch using React or Next.js — hand-written code, no page builders. While developing, we also set up all technical SEO foundations: meta tags, Schema.org JSON-LD structured data, canonical URLs, XML sitemap, robots.txt, and Core Web Vitals optimisation. Generative Engine Optimisation (GEO) signals are embedded to help your site appear in Google AI Mode and other AI search engines.",
    deliverables: [
      "React/Next.js codebase",
      "Full Schema.org structured data",
      "GEO signals & llms.txt",
      "XML sitemap & robots.txt",
    ],
  },
  {
    step: "04",
    icon: Rocket,
    title: "Testing & Launch",
    duration: "Days 12–14",
    description:
      "We test your site across all major browsers (Chrome, Safari, Firefox) and devices (iPhone, Android, iPad, desktop). We run a Google PageSpeed audit and fix anything below 90. Once you're happy, we deploy to Vercel or Cloudflare Pages with a custom domain and SSL. You receive full code ownership and admin access.",
    deliverables: [
      "90+ PageSpeed score (mobile & desktop)",
      "Cross-browser & device testing",
      "Live deployment with SSL",
      "Full code ownership handover",
    ],
  },
];

const faqs = [
  {
    q: "Do I need to provide content or will you write it?",
    a: "We recommend you provide the core content (business info, services, key messages) as you know your business best. However, we can help refine and structure your copy, and we write all technical and SEO-optimised meta descriptions and structured data ourselves.",
  },
  {
    q: "Can you work with an existing design or brand?",
    a: "Yes. If you already have brand guidelines, a logo, or a Figma design, we can work directly from those. We can also adapt an existing website's visual style while rewriting it in clean React code.",
  },
  {
    q: "What happens after the website is launched?",
    a: "You get full code ownership. We offer optional monthly maintenance plans, or you can manage updates independently. We're always available for one-off changes, new page additions, or SEO improvements at transparent hourly rates.",
  },
  {
    q: "Will my website appear in Google AI Mode and AI search?",
    a: "Yes. Every SiteNova website includes Generative Engine Optimisation (GEO) — Schema.org structured data, speakable schema, llms.txt, FAQPage markup, and entity signals — all of which help AI search engines like Google AI Mode, Perplexity, and ChatGPT cite your business confidently.",
  },
];

const OurProcess = () => {
  const jsonLd = buildHowToJsonLd();

  return (
    <PageTransition>
      <SEO
        title="Our Web Design Process — How SiteNova Builds Websites | SiteNova"
        description="SiteNova's 4-step website design and development process: Discovery, UI/UX Design, React Development with GEO/SEO setup, and Launch. Websites delivered in 7–14 days from ₹10,000."
        canonicalUrl="/our-process"
        keywords={[
          "how SiteNova builds websites",
          "web design process Mumbai",
          "website development process India",
          "SiteNova process",
          "how long to build a website Mumbai",
        ]}
        jsonLd={jsonLd}
      />

      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />

        <main id="main-content" className="flex-1">

          {/* ── Hero ───────────────────────────────────────────── */}
          <section className="pt-32 pb-20 sm:pt-40 sm:pb-24 relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-primary/8 blur-[120px]" />
            </div>
            <div className="relative mx-auto max-w-4xl px-6 text-center">
              <motion.p
                {...fadeUp}
                className="text-sm font-semibold uppercase tracking-[0.24em] text-primary mb-4"
              >
                Our Process
              </motion.p>
              <motion.h1
                {...fadeUp}
                transition={{ delay: 0.05, duration: 0.5 }}
                className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
              >
                How SiteNova builds{" "}
                <span className="gradient-text">your website</span>
              </motion.h1>
              <motion.p
                {...fadeUp}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10"
              >
                A clear, structured 4-step process that takes you from initial idea
                to a live, SEO-optimised, AI-visible website in 7–14 working days.
              </motion.p>

              <motion.div
                {...fadeUp}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground"
              >
                {[
                  { icon: Clock, text: "7–14 day delivery" },
                  { icon: Banknote, text: "From ₹10,000" },
                  { icon: CheckCircle2, text: "90+ PageSpeed guaranteed" },
                ].map(({ icon: Icon, text }) => (
                  <span key={text} className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    {text}
                  </span>
                ))}
              </motion.div>
            </div>
          </section>

          {/* ── Steps ──────────────────────────────────────────── */}
          <section
            className="pb-20 sm:pb-24"
            itemScope
            itemType="https://schema.org/HowTo"
          >
            <meta itemProp="name" content="How SiteNova Builds a Professional Website" />
            <meta itemProp="totalTime" content="P14D" />
            <div className="mx-auto max-w-5xl px-6">
              <div className="space-y-8">
                {steps.map((step, i) => (
                  <motion.div
                    key={step.step}
                    {...fadeUp}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className="glass-card rounded-2xl p-7 sm:p-10 grid gap-8 md:grid-cols-[auto_1fr]"
                    itemScope
                    itemType="https://schema.org/HowToStep"
                    itemProp="step"
                  >
                    {/* Step number + icon */}
                    <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-3 min-w-[60px]">
                      <span
                        className="font-heading text-4xl font-bold gradient-text leading-none"
                        itemProp="position"
                      >
                        {step.step}
                      </span>
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                        <step.icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-xs text-muted-foreground font-medium bg-muted/40 rounded-full px-2.5 py-1">
                        {step.duration}
                      </span>
                    </div>

                    {/* Content */}
                    <div>
                      <h2
                        className="font-heading text-xl sm:text-2xl font-bold mb-3"
                        itemProp="name"
                      >
                        {step.title}
                      </h2>
                      <p
                        className="text-muted-foreground leading-relaxed mb-5"
                        itemProp="text"
                      >
                        {step.description}
                      </p>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
                          Deliverables
                        </p>
                        <ul className="grid sm:grid-cols-2 gap-1.5">
                          {step.deliverables.map((d) => (
                            <li
                              key={d}
                              className="flex items-center gap-2 text-sm text-muted-foreground"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── FAQ ────────────────────────────────────────────── */}
          <section
            className="py-16 sm:py-20 border-t border-border/40 bg-card/20"
            itemScope
            itemType="https://schema.org/FAQPage"
          >
            <div className="mx-auto max-w-3xl px-6">
              <motion.div {...fadeUp} className="text-center mb-10">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary mb-3">
                  Process FAQs
                </p>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight">
                  Questions about how we work
                </h2>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, margin: "-60px" }}
                className="space-y-4"
              >
                {faqs.map((faq) => (
                  <motion.div
                    key={faq.q}
                    variants={staggerChild}
                    className="glass-card rounded-2xl p-6"
                    itemScope
                    itemType="https://schema.org/Question"
                  >
                    <h3
                      className="font-heading font-semibold mb-2"
                      itemProp="name"
                    >
                      {faq.q}
                    </h3>
                    <div
                      itemScope
                      itemType="https://schema.org/Answer"
                      itemProp="acceptedAnswer"
                    >
                      <p
                        className="text-sm text-muted-foreground leading-relaxed"
                        itemProp="text"
                      >
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* ── CTA ────────────────────────────────────────────── */}
          <section className="py-16 sm:py-20 border-t border-border/40">
            <div className="mx-auto max-w-3xl px-6 text-center">
              <motion.div {...fadeUp}>
                <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                  Ready to start your project?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  Tell us about your business and we'll send a fixed-price quote within
                  24 hours — no obligation.
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
                    to="/about"
                    className="inline-flex items-center justify-center rounded-lg border border-border/60 bg-card/50 px-7 py-3.5 text-sm font-semibold hover:border-primary/40 hover:bg-primary/5 transition-colors"
                  >
                    About SiteNova
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

export default OurProcess;
