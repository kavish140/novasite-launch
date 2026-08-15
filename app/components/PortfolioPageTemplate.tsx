import { m as motion } from "framer-motion";
import { ExternalLink, ArrowRight, type LucideIcon } from "lucide-react";
import { Link } from "react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import IframePreview from "@/components/IframePreview";
import { WHATSAPP_URL } from "@/lib/constants";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: "easeOut" },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const staggerChild = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export interface PortfolioStat {
  label: string;
  value: string;
}

export interface PortfolioFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface PortfolioPageTemplateProps {
  client: {
    name: string;
    role: string;
    liveUrl: string;
    testimonialQuote?: string;
    testimonialAuthor?: string;
    testimonialRole?: string;
  };
  project: {
    headline: string;
    summary: string;
    stats: PortfolioStat[];
    features: PortfolioFeature[];
    techStack: string[];
    industry: string;
    location: string;
  };
  backSlug: string; // e.g. "dr-dipti-ganatra"
}

export default function PortfolioPageTemplate({
  client,
  project,
  backSlug,
}: PortfolioPageTemplateProps) {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />

        <main id="main-content" className="flex-1">

          {/* ── Hero ───────────────────────────────────────────── */}
          <section className="pt-28 pb-10 sm:pt-36 sm:pb-14 relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full bg-primary/6 blur-[120px]" />
            </div>

            <div className="relative mx-auto max-w-7xl px-6">
              {/* Back link */}
              <motion.div {...fadeUp} className="mb-8">
                <Link
                  to="/#portfolio"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors link-minimal"
                >
                  ← Back to Portfolio
                </Link>
              </motion.div>

              <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center">
                {/* Left — text */}
                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary mb-3">
                    Case Study
                  </p>
                  <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] mb-4">
                    {project.headline}
                  </h1>
                  <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg">
                    {project.summary}
                  </p>

                  {/* Client pill */}
                  <div className="flex flex-wrap items-center gap-3 mb-8">
                    <div className="inline-flex flex-col rounded-xl border border-border/60 bg-card/60 px-5 py-3">
                      <span className="text-xs text-muted-foreground mb-0.5">Client</span>
                      <span className="font-heading text-sm font-semibold">{client.name}</span>
                      <span className="text-xs text-muted-foreground">{client.role}</span>
                    </div>
                    <div className="inline-flex flex-col rounded-xl border border-border/60 bg-card/60 px-5 py-3">
                      <span className="text-xs text-muted-foreground mb-0.5">Industry</span>
                      <span className="font-heading text-sm font-semibold">{project.industry}</span>
                      <span className="text-xs text-muted-foreground">{project.location}</span>
                    </div>
                  </div>

                  <a
                    href={client.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all glow-effect-sm button-shimmer interactive-card"
                  >
                    Open Live Website
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </motion.div>

                {/* Right — iframe preview */}
                <motion.div
                  initial={{ opacity: 0, y: 32, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                  className="gradient-border rounded-2xl overflow-hidden interactive-card hover-glow"
                >
                  <div className="aspect-[16/10] rounded-2xl overflow-hidden border border-border/30 bg-background/40 p-2">
                    <IframePreview src={client.liveUrl} title={client.name} />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* ── Stats bar ──────────────────────────────────────── */}
          <section className="border-t border-border/40 bg-card/20 py-8">
            <div className="mx-auto max-w-7xl px-6">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-wrap justify-center gap-x-12 gap-y-6"
              >
                {project.stats.map((stat) => (
                  <motion.div
                    key={stat.label}
                    variants={staggerChild}
                    className="text-center"
                  >
                    <p className="font-heading text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wider">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* ── Testimonial (optional) ─────────────────────────── */}
          {client.testimonialQuote && (
            <section className="py-16 sm:py-20 border-t border-border/40">
              <div className="mx-auto max-w-3xl px-6">
                <motion.div
                  {...fadeUp}
                  className="glass-card rounded-2xl p-8 sm:p-10 text-center"
                >
                  <div className="flex justify-center gap-1 mb-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className="h-4 w-4 fill-accent text-accent" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-foreground/90 leading-relaxed text-base sm:text-lg mb-6 italic">
                    "{client.testimonialQuote}"
                  </p>
                  <div>
                    <p className="font-heading font-semibold text-sm">{client.testimonialAuthor}</p>
                    {client.testimonialRole && (
                      <p className="text-xs text-muted-foreground mt-0.5">{client.testimonialRole}</p>
                    )}
                  </div>
                </motion.div>
              </div>
            </section>
          )}

          {/* ── Features ───────────────────────────────────────── */}
          <section className="py-16 sm:py-20 border-t border-border/40">
            <div className="mx-auto max-w-7xl px-6">
              <motion.div {...fadeUp} className="mb-12">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary mb-3">
                  What we built
                </p>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight">
                  Features delivered
                </h2>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {project.features.map((feature) => (
                  <motion.div
                    key={feature.title}
                    variants={staggerChild}
                    className="glass-card rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 hover-glow"
                  >
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <feature.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="font-heading text-base font-semibold mb-1.5">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* ── Tech Stack ─────────────────────────────────────── */}
          <section className="py-12 border-t border-border/40 bg-card/20">
            <div className="mx-auto max-w-7xl px-6">
              <motion.div
                {...fadeUp}
                className="flex flex-wrap items-center gap-4"
              >
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider shrink-0">
                  Built with:
                </span>
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-border/60 bg-background/80 px-4 py-1.5 text-xs font-medium text-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </motion.div>
            </div>
          </section>

          {/* ── CTA ────────────────────────────────────────────── */}
          <section className="py-20 sm:py-28 border-t border-border/40">
            <div className="mx-auto max-w-3xl px-6 text-center">
              <motion.div {...fadeUp}>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary mb-4">
                  Ready to build?
                </p>
                <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mb-5">
                  Want a website like{" "}
                  <span className="gradient-text">{client.name.split(" ")[0]}'s?</span>
                </h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  Get a fixed-price quote within 24 hours. No templates, no middlemen — just Kavish and a clear plan for your website.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to="/quote"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all glow-effect-sm button-shimmer btn-quote-pulse"
                  >
                    Get a Free Quote
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-card/50 px-8 py-3.5 text-sm font-semibold hover:border-[#25D366]/40 hover:bg-[#25D366]/5 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-[#25D366]" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Chat on WhatsApp
                  </a>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
