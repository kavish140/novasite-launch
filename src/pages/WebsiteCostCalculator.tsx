import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { m as motion } from "framer-motion";
import {
  Calculator,
  ArrowRight,
  CheckCircle2,
  ShoppingCart,
  FileText,
  Globe,
  Smartphone,
  Zap,
  Search,
  ShieldCheck,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";

// ─── Pricing config ────────────────────────────────────────────────────────────
const PAGE_TIERS = [
  { id: "landing", label: "Landing Page", desc: "1 page · Great for campaigns or simple presence", base: 10000 },
  { id: "business", label: "Business Website", desc: "5–8 pages · Home, About, Services, Contact", base: 18000 },
  { id: "large", label: "Large Website", desc: "10+ pages · Multiple services, blog, team", base: 28000 },
  { id: "ecom", label: "E-Commerce Store", desc: "Product catalogue + Razorpay / Stripe checkout", base: 35000 },
  { id: "webapp", label: "Web Application", desc: "Custom dashboard, booking system, SaaS MVP", base: 50000 },
];

const ADD_ONS = [
  { id: "seo", label: "Local SEO Setup", desc: "Google Business Profile, schema markup, keyword targeting", price: 5000, icon: Search },
  { id: "speed", label: "Performance Optimisation", desc: "90+ PageSpeed score · Core Web Vitals tuning", price: 4000, icon: Zap },
  { id: "mobile", label: "Mobile-First Design", desc: "Dedicated mobile UX review and testing", price: 2000, icon: Smartphone },
  { id: "cms", label: "CMS / Blog", desc: "Admin panel to write and publish articles yourself", price: 6000, icon: FileText },
  { id: "multilang", label: "Multi-language", desc: "English + Hindi or Gujarati", price: 8000, icon: Globe },
  { id: "maintenance", label: "Maintenance (6 mo)", desc: "Updates, hosting support, minor changes", price: 9000, icon: ShieldCheck },
];

const TIMELINE = [
  { id: "rush", label: "Rush (3–5 days)", multiplier: 1.4, badge: "+40%" },
  { id: "standard", label: "Standard (7–14 days)", multiplier: 1.0, badge: "Included" },
  { id: "relaxed", label: "Flexible (3–4 weeks)", multiplier: 0.95, badge: "−5%" },
];

const FAQS = [
  {
    q: "How much does a website cost in Mumbai?",
    a: "A basic single-page website in Mumbai starts from ₹10,000. A multi-page business website typically costs ₹15,000–₹30,000. E-commerce and web applications range from ₹35,000 upwards depending on features. SiteNova provides transparent, fixed-price quotes.",
  },
  {
    q: "How much does a website cost in India in 2026?",
    a: "In 2026, a professional website in India costs anywhere from ₹8,000 for a simple landing page to ₹1,00,000+ for a complex web application. SiteNova's pricing starts at ₹10,000 for Mumbai small businesses.",
  },
  {
    q: "What is included in the website price?",
    a: "Every SiteNova website includes custom design, responsive mobile-first development, basic SEO setup (meta tags, sitemap, schema markup), deployment, and one round of revisions. Add-ons like local SEO setup, CMS, and performance optimisation are available at extra cost.",
  },
  {
    q: "Is there a monthly fee for a website?",
    a: "No mandatory monthly fee. Optional maintenance packages (₹1,500/mo) cover hosting support and minor updates. Domain and hosting costs (typically ₹2,000–₹5,000/year) are separate and paid to the hosting provider directly.",
  },
  {
    q: "How long does it take to build a website in India?",
    a: "SiteNova delivers most business websites in 7–14 working days. Landing pages take 3–5 days. Larger projects (e-commerce, web apps) take 3–6 weeks depending on scope and content readiness.",
  },
  {
    q: "Can I get a cheaper website elsewhere?",
    a: "Cheaper options exist (WordPress templates, DIY builders), but they often carry hidden costs: slow load times, poor SEO, limited customisation, and ongoing plugin fees. SiteNova builds fast, custom sites with 90+ PageSpeed scores that rank on Google — the ROI typically outweighs the cost difference within months.",
  },
];

export default function WebsiteCostCalculator() {
  const [selectedTier, setSelectedTier] = useState(PAGE_TIERS[1].id);
  const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set());
  const [selectedTimeline, setSelectedTimeline] = useState("standard");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const tier = PAGE_TIERS.find((t) => t.id === selectedTier)!;
  const timeline = TIMELINE.find((t) => t.id === selectedTimeline)!;

  const { baseTotal, addOnTotal, grandTotal, grandMin, grandMax } = useMemo(() => {
    const base = tier.base;
    const addOn = [...selectedAddOns].reduce((sum, id) => {
      const a = ADD_ONS.find((x) => x.id === id);
      return sum + (a?.price ?? 0);
    }, 0);
    const total = Math.round((base + addOn) * timeline.multiplier);
    return {
      baseTotal: base,
      addOnTotal: addOn,
      grandTotal: total,
      grandMin: Math.round(total * 0.9),
      grandMax: Math.round(total * 1.1),
    };
  }, [tier, selectedAddOns, timeline]);

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const formatINR = (n: number) =>
    "₹" + n.toLocaleString("en-IN");

  const quoteState = {
    projectType: tier.label,
    requirements: `Calculator estimate: ${formatINR(grandMin)}–${formatINR(grandMax)}. Add-ons: ${[...selectedAddOns].join(", ") || "none"}. Timeline: ${timeline.label}.`,
  };

  return (
    <PageTransition>
      <SEO
        title="Website Cost Calculator India 2026 | How Much Does a Website Cost in Mumbai?"
        description="Use our free website cost calculator to estimate how much a website costs in India in 2026. Prices from ₹10,000 for Mumbai small businesses. Instant estimate, no commitment."
        canonicalUrl="/website-cost-calculator"
        keywords={[
          "website cost calculator India",
          "how much does a website cost in India 2026",
          "website cost Mumbai",
          "website design price India",
          "web development cost Mumbai",
          "website price calculator",
          "how much does a website cost in Mumbai",
        ]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to estimate the cost of a website in India",
            description: "Use SiteNova's website cost calculator to get an instant price estimate for your project in India.",
            step: [
              { "@type": "HowToStep", name: "Choose your website type", text: "Select from landing page, business website, e-commerce, or web application." },
              { "@type": "HowToStep", name: "Add optional features", text: "Choose add-ons like local SEO, performance optimisation, or a CMS." },
              { "@type": "HowToStep", name: "Select your timeline", text: "Standard delivery is 7–14 days. Rush delivery is available for an additional fee." },
              { "@type": "HowToStep", name: "Get your estimate", text: "Your personalised price range is calculated instantly. Request an exact quote to proceed." },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://sitenova.dev/" },
              { "@type": "ListItem", position: 2, name: "Website Cost Calculator", item: "https://sitenova.dev/website-cost-calculator" },
            ],
          },
        ]}
      />

      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-12">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.08),transparent_60%)]" />
          <div className="mx-auto max-w-7xl px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-6">
              <Calculator className="h-3.5 w-3.5" />
              Free Estimate · No Login Required
            </div>
            <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-6xl max-w-4xl mx-auto">
              Website Cost Calculator{" "}
              <span className="gradient-text">India 2026</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Get an instant price estimate for your website project. Based on real SiteNova pricing for businesses in Mumbai and across India.
            </p>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-10 pb-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-8 lg:grid-cols-[1fr_380px] items-start">

              {/* Left: Inputs */}
              <div className="space-y-8">

                {/* Step 1: Website Type */}
                <div className="rounded-3xl border border-border/60 bg-card/50 p-6 sm:p-8">
                  <h2 className="text-lg font-bold text-foreground mb-1">Step 1 — Choose your website type</h2>
                  <p className="text-sm text-muted-foreground mb-5">What kind of website do you need?</p>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {PAGE_TIERS.map((t) => (
                      <button
                        key={t.id}
                        id={`tier-${t.id}`}
                        onClick={() => setSelectedTier(t.id)}
                        className={`text-left rounded-2xl border p-4 transition-all ${
                          selectedTier === t.id
                            ? "border-primary bg-primary/8 shadow-sm"
                            : "border-border/60 bg-background/60 hover:border-primary/30 hover:bg-card"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-foreground">{t.label}</span>
                          {selectedTier === t.id && (
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
                        <p className="mt-2 text-xs font-semibold text-primary">From {formatINR(t.base)}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Add-ons */}
                <div className="rounded-3xl border border-border/60 bg-card/50 p-6 sm:p-8">
                  <h2 className="text-lg font-bold text-foreground mb-1">Step 2 — Add optional features</h2>
                  <p className="text-sm text-muted-foreground mb-5">Select everything you need. Leave blank to keep it simple.</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {ADD_ONS.map((addon) => {
                      const Icon = addon.icon;
                      const active = selectedAddOns.has(addon.id);
                      return (
                        <button
                          key={addon.id}
                          id={`addon-${addon.id}`}
                          onClick={() => toggleAddOn(addon.id)}
                          className={`text-left rounded-2xl border p-4 flex gap-3 items-start transition-all ${
                            active
                              ? "border-primary bg-primary/8"
                              : "border-border/60 bg-background/60 hover:border-primary/30 hover:bg-card"
                          }`}
                        >
                          <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${active ? "bg-primary/15 text-primary" : "bg-secondary/50 text-muted-foreground"}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-semibold text-foreground">{addon.label}</span>
                              {active && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{addon.desc}</p>
                            <p className="mt-1 text-xs font-semibold text-primary">+{formatINR(addon.price)}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 3: Timeline */}
                <div className="rounded-3xl border border-border/60 bg-card/50 p-6 sm:p-8">
                  <h2 className="text-lg font-bold text-foreground mb-1">Step 3 — Choose your timeline</h2>
                  <p className="text-sm text-muted-foreground mb-5">Rush projects incur a priority fee. Flexible projects get a small discount.</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {TIMELINE.map((t) => (
                      <button
                        key={t.id}
                        id={`timeline-${t.id}`}
                        onClick={() => setSelectedTimeline(t.id)}
                        className={`text-left rounded-2xl border p-4 transition-all ${
                          selectedTimeline === t.id
                            ? "border-primary bg-primary/8"
                            : "border-border/60 bg-background/60 hover:border-primary/30 hover:bg-card"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-foreground">{t.label}</span>
                          {selectedTimeline === t.id && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                        </div>
                        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${t.id === "rush" ? "bg-orange-500/15 text-orange-400" : t.id === "relaxed" ? "bg-green-500/15 text-green-400" : "bg-primary/10 text-primary"}`}>
                          {t.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Live estimate (sticky) */}
              <div className="lg:sticky lg:top-28">
                <motion.div
                  key={grandTotal}
                  initial={{ scale: 0.97, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/8 via-background to-accent/5 p-7 shadow-lg"
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Your Estimate</p>
                  <div className="mt-2">
                    <p className="text-4xl font-extrabold tracking-tight text-foreground">
                      {formatINR(grandMin)} – {formatINR(grandMax)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Estimated range · Final quote may vary</p>
                  </div>

                  <div className="mt-6 space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>{tier.label}</span>
                      <span className="font-medium text-foreground">{formatINR(baseTotal)}</span>
                    </div>
                    {[...selectedAddOns].map((id) => {
                      const a = ADD_ONS.find((x) => x.id === id)!;
                      return (
                        <div key={id} className="flex justify-between text-muted-foreground">
                          <span>{a.label}</span>
                          <span className="font-medium text-foreground">+{formatINR(a.price)}</span>
                        </div>
                      );
                    })}
                    {timeline.id !== "standard" && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Timeline ({timeline.label})</span>
                        <span className={`font-medium ${timeline.id === "rush" ? "text-orange-400" : "text-green-400"}`}>
                          {timeline.badge}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-border/60 pt-3 flex justify-between font-bold text-foreground">
                      <span>Total estimate</span>
                      <span>{formatINR(grandTotal)}</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <Link
                      to="/quote"
                      state={quoteState}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Get Exact Quote <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      to="/free-audit?utm_source=calculator&utm_medium=cta"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-5 py-3 text-sm font-semibold text-foreground hover:bg-secondary/80 transition-colors"
                    >
                      Free Website Audit First
                    </Link>
                  </div>

                  <p className="mt-4 text-xs text-muted-foreground text-center">
                    No payment required · Response within 24 hrs
                  </p>
                </motion.div>

                {/* Trust signals below card */}
                <div className="mt-4 rounded-2xl border border-border/60 bg-card/40 p-4">
                  <p className="text-xs font-semibold text-foreground mb-3">Every SiteNova website includes:</p>
                  <ul className="space-y-1.5">
                    {[
                      "Custom design (no templates)",
                      "Mobile-first development",
                      "Basic SEO (meta, sitemap, schema)",
                      "1 round of revisions included",
                      "90+ PageSpeed score target",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 border-t border-border/20" id="faq" aria-labelledby="faq-title">
          <div className="mx-auto max-w-3xl px-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 text-center">Common Questions</p>
            <h2 id="faq-title" className="text-3xl font-bold tracking-tight text-center mb-10">
              Website Cost FAQs — India 2026
            </h2>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <details
                  key={i}
                  open={openFaq === i}
                  onToggle={(e) => setOpenFaq((e.target as HTMLDetailsElement).open ? i : null)}
                  className="rounded-2xl border border-border/60 bg-card/40 px-6 py-4 group cursor-pointer open:bg-card/60 transition-colors"
                >
                  <summary className="font-semibold text-foreground list-none flex justify-between items-center gap-4 select-none">
                    {faq.q}
                    <span className="text-primary text-xl font-light shrink-0 group-open:rotate-45 transition-transform duration-200">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 border-t border-border/20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <ShoppingCart className="h-10 w-10 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold tracking-tight mb-3">Ready to get started?</h2>
            <p className="text-muted-foreground mb-7 max-w-lg mx-auto">
              Use your estimate above and share the details with us. We'll send you a fixed-price quote — no surprises.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/quote"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Start My Quote <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://wa.me/919326060621?text=Hi%20Kavish%2C%20I%20used%20the%20website%20cost%20calculator%20on%20SiteNova%20and%20I%27d%20like%20to%20get%20a%20quote."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-7 py-3.5 text-sm font-semibold text-foreground hover:bg-secondary/80 transition-colors"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
}
