import { Link } from "react-router";
import { ArrowRight, Zap, Shield, Clock } from "lucide-react";

interface BlogCTAProps {
  variant?: "mid" | "end";
}

export default function BlogCTA({ variant = "end" }: BlogCTAProps) {
  const utmLink = "/free-audit?utm_source=blog&utm_medium=inline_cta&utm_campaign=blog_conversion";

  if (variant === "mid") {
    return (
      <aside
        className="my-10 rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/8 via-background to-accent/5 p-6 sm:p-8 not-prose"
        aria-label="Free website audit offer"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Zap className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
              Free for Mumbai businesses
            </p>
            <h3 className="text-lg font-bold text-foreground leading-snug">
              Is your website losing you customers?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Get a free, no-obligation SEO + speed audit — with actionable fixes delivered within 24 hours.
            </p>
          </div>
          <Link
            to={utmLink}
            className="shrink-0 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            Get Free Audit <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </aside>
    );
  }

  // "end" variant — full-width card at the bottom of the article
  return (
    <section
      className="mt-14 not-prose rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/8 via-background to-accent/8 p-8 sm:p-10"
      aria-label="Work with SiteNova"
    >
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
          SiteNova · Web Design &amp; SEO · Mumbai
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
          Ready to get a fast, SEO-ready website for your business?
        </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          SiteNova builds high-performance, mobile-first websites for businesses in Mulund, Mumbai, and across Maharashtra — delivered in 7–14 days, from ₹10,000.
        </p>

        {/* Trust signals */}
        <div className="mt-5 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary" />
            Response within 24 hrs
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-primary" />
            No commitment required
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-primary" />
            90+ PageSpeed score guaranteed
          </span>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to={utmLink}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Get Your Free Website Audit <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/quote?utm_source=blog&utm_medium=inline_cta&utm_campaign=blog_conversion"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary/80 transition-colors"
          >
            Get an Instant Quote
          </Link>
        </div>
      </div>
    </section>
  );
}
