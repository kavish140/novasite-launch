import QuoteForm from "@/components/QuoteForm";
import BookingCTA from "@/components/BookingCTA";
import PortfolioSection from "@/components/PortfolioSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { m as motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Smartphone,
  Zap,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Star,
  TrendingDown,
  Clock,
  Phone,
  ChevronDown,
  MessageCircle,
  Globe,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { PHONE_TEL_LINK, PHONE_NUMBER, WHATSAPP_URL } from "@/lib/constants";

// ── Constants ─────────────────────────────────────────────────────────────────

// ── Sub-components ────────────────────────────────────────────────────────────

function MinimalHeader() {
  return (
    <header className="w-full px-6 py-4 flex items-center justify-between border-b border-border/30 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
          SN
        </div>
        <span className="font-bold text-base tracking-tight">SiteNova</span>
      </Link>
      <a
        href={PHONE_TEL_LINK}
        className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
      >
        <Phone size={14} />
        {PHONE_NUMBER}
      </a>
    </header>
  );
}

// ── Inline Quote Wizard (Hero form) ──────────────────────────────────────────

function LeadForm({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const countryCode = formData.get("countryCode") as string;
    let rawMobile = formData.get("mobile") as string;
    let website = formData.get("website") as string;

    rawMobile = rawMobile.replace(/\D/g, "");
    if (rawMobile.length !== 10) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter exactly 10 digits.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    const mobile = `${countryCode} ${rawMobile}`;

    website = website.trim();
    if (!/^https?:\/\//i.test(website)) {
      website = `https://${website}`;
    }

    try {
      const domainWithoutProtocol = website.replace(/^https?:\/\//i, "");
      if (!/^[^\s]+\.[^\s]+$/.test(domainWithoutProtocol)) {
        throw new Error(
          "Please enter a valid website address (e.g. example.com)."
        );
      }

      const { error } = await supabase.from("audit_requests").insert([
        {
          name,
          email,
          mobile,
          website_url: website,
          source: "paid_ad",
        },
      ]);

      if (error) throw error;

      // trackAuditSubmit() fires in LpThankYouAudit on mount — don't double-fire here.
      navigate("/lp/thank-you-audit", {
        state: { name, email, website },
      });
    } catch (error: unknown) {
      console.error(error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to submit request. Please try again later.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <div className="relative">
        {/* Glow border */}
        <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/40 to-accent/30 rounded-3xl blur opacity-60" />
        <div className="relative bg-card/90 backdrop-blur-xl border border-border/60 rounded-3xl p-7 shadow-2xl">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold font-heading mb-1">
              Get Your Free Audit
            </h2>
            <p className="text-sm text-muted-foreground">
              We will review your site and get back to you in{" "}
              <span className="text-foreground font-semibold">24-48 hours</span>
              .
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <Label htmlFor="lp-audit-name">Full Name</Label>
              <Input
                id="lp-audit-name"
                name="name"
                required
                placeholder="John Doe"
                className="bg-background/50 focus:bg-background transition-colors"
              />
            </div>
            <div className="space-y-1.5 text-left">
              <Label htmlFor="lp-audit-email">Email Address</Label>
              <Input
                id="lp-audit-email"
                name="email"
                type="email"
                required
                placeholder="john@example.com"
                className="bg-background/50 focus:bg-background transition-colors"
              />
            </div>
            <div className="space-y-1.5 text-left">
              <Label htmlFor="lp-audit-mobile">WhatsApp Number</Label>
              <div className="flex gap-2">
                <Select name="countryCode" defaultValue="+91">
                  <SelectTrigger className="w-[110px] bg-background/50 focus:bg-background transition-colors">
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91">IN (+91)</SelectItem>
                    <SelectItem value="+1">US (+1)</SelectItem>
                    <SelectItem value="+44">UK (+44)</SelectItem>
                    <SelectItem value="+61">AU (+61)</SelectItem>
                    <SelectItem value="+971">AE (+971)</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="lp-audit-mobile"
                  name="mobile"
                  type="tel"
                  required
                  placeholder="9876543210"
                  pattern="[0-9]{10}"
                  title="Please enter exactly 10 digits"
                  maxLength={10}
                  className="flex-1 bg-background/50 focus:bg-background transition-colors"
                />
              </div>
            </div>
            <div className="space-y-1.5 text-left">
              <Label htmlFor="lp-audit-website">Your Website URL</Label>
              <Input
                id="lp-audit-website"
                name="website"
                type="text"
                required
                placeholder="example.com"
                className="bg-background/50 focus:bg-background transition-colors"
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-2 button-shimmer shadow-lg shadow-primary/20 btn-quote-pulse text-base h-12"
              size="lg"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Get My Free Audit"}
              {!loading && (
                <ArrowRight
                  size={18}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              )}
            </Button>
          </form>

          {/* Trust badges */}
          <div className="mt-5 flex items-center justify-center gap-5 text-muted-foreground">
            <div className="flex items-center gap-1.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Lock className="w-4 h-4 text-primary" />
              <span>No Spam</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Clock className="w-4 h-4 text-accent" />
              <span>24h Turnaround</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Static data ───────────────────────────────────────────────────────────────

const PAIN_POINTS = [
  {
    icon: Search,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    title: "Invisible on Google",
    desc: "While you wait, competitors rank above you and pocket your customers. Every day without SEO is revenue left on the table.",
  },
  {
    icon: TrendingDown,
    color: "text-red-500",
    bg: "bg-red-500/10",
    title: "Slow and Outdated Site",
    desc: "A slow website makes it harder for visitors to explore your services and get in touch.",
  },
  {
    icon: Smartphone,
    color: "text-accent",
    bg: "bg-accent/10",
    title: "Poor Mobile Experience",
    desc: "Your customers need to read your services and contact you easily from their phones.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Submit Your Details",
    desc: "Fill out the quote form with your project needs. Takes less than 2 minutes.",
  },
  {
    step: "02",
    title: "We Review & Plan",
    desc: "Our team reviews your requirements and prepares a custom scope with a clear timeline.",
  },
  {
    step: "03",
    title: "You Get a Quote",
    desc: "Within 24 hours, you will receive a detailed, transparent quote — no hidden fees, no pressure.",
  },
];

const FAQS = [
  {
    q: "Is this audit really free?",
    a: "Yes, 100% free, no hidden fees, no obligation. We provide the audit to demonstrate our expertise. If you would like us to fix the issues, we will discuss a project. But there is zero pressure.",
  },
  {
    q: "What exactly does the audit cover?",
    a: "Google PageSpeed scores, Core Web Vitals, on-page SEO (title tags, meta descriptions, headings, schema), mobile responsiveness, local SEO signals, and a prioritised list of improvements.",
  },
  {
    q: "How long does the quote process take?",
    a: "We respond to all quote requests within 24 hours. The quote itself is free, transparent, and comes with a clear scope and timeline.",
  },
  {
    q: "Do I need to buy anything afterwards?",
    a: "Absolutely not. The audit and quote are yours to keep. We only work with you further if you choose to, and only when it makes sense for your business.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/40 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-sm hover:bg-secondary/30 transition-colors"
      >
        {q}
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground flex-shrink-0 ml-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function WebDesignLP() {
  // Track page view for analytics — fires once on mount, client-side only
  useEffect(() => {
    supabase
      .from("page_views")
      .insert([{ page: "/lp/web-design", referrer: document.referrer || null }])
      .then(() => {}, () => {}); // Analytics must never block the page.
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <MinimalHeader />

      {/* HERO — Quote Wizard */}
      <section className="relative flex-1 overflow-hidden py-16 md:py-24">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[130px] pointer-events-none -z-0" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full bg-accent/10 blur-[120px] pointer-events-none -z-0" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-7"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold text-primary">
                Website design for business owners
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] font-heading">
              Custom Websites for{" "}
              <span className="gradient-text animated-gradient">
                Mumbai Businesses
              </span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              Tell us about your project in 3 quick steps and get a{" "}
              <strong className="text-foreground">free, transparent quote</strong>{" "}
              from Kavish, your developer in Mumbai — delivered within 24 hours.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {[
                "Custom design, no templates",
                "Fast-loading, mobile-first",
                "SEO-ready from day one",
                "Transparent, fixed pricing",
                "Direct developer access",
                "Support scope agreed upfront",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border/30 space-y-4">
              <p className="font-semibold">Landing pages from ₹10,000 · Business websites from ₹15,000</p>
              <BookingCTA source="paid-landing-hero" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <QuoteForm source="paid_ad" />
          </motion.div>
        </div>
      </section>

      <PortfolioSection mode="customers" />
      <TestimonialsSection />
      {/* SOCIAL PROOF STRIP */}
      <section className="border-y border-border/30 bg-secondary/10 py-8">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-5">
            Trusted by Mumbai Businesses
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
            {[
              "Dr. Dipti Ganatra Clinic",
              "Jupiter Fast Finance",
              "Corporate Zone",
            ].map((name) => (
              <span
                key={name}
                className="text-sm font-semibold text-muted-foreground/70"
              >
                {name}
              </span>
            ))}
            <div className="flex items-center gap-1 text-yellow-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
              <span className="text-sm font-semibold text-muted-foreground ml-1">
                5.0 Google Rating
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-4">
              Why Most Business Websites{" "}
              <span className="gradient-text">Fail to Convert</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              These three problems silently bleed revenue from thousands of
              Mumbai businesses every day.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PAIN_POINTS.map((p) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="glass-card p-6 space-y-4"
                >
                  <div
                    className={`w-11 h-11 rounded-xl ${p.bg} flex items-center justify-center`}
                  >
                    <Icon className={`w-5 h-5 ${p.color}`} />
                  </div>
                  <h3 className="font-semibold text-base">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {p.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 md:py-28 bg-secondary/5 border-y border-border/20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground">
              Three simple steps. Zero risk. Quote in 24 hours.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center space-y-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary font-heading">
                    {s.step}
                  </span>
                </div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-secondary/5 border-y border-border/20">
        <div className="mx-auto max-w-2xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA — Free Audit Form */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-5">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold text-primary">
                100% Free, No Obligation
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-4">
              Not Ready for a Quote Yet?
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Get a free audit of your existing website instead. We'll identify
              exactly what's holding you back — delivered within 48 hours.
            </p>
          </div>
          <LeadForm className="max-w-md mx-auto" />
        </div>
      </section>

      {/* MINIMAL FOOTER */}
      <footer className="border-t border-border/30 py-6 text-center text-xs text-muted-foreground px-6">
        <p>
          {new Date().getFullYear()} SiteNova, Web Design and Development,
          Mumbai.{" "}
          <Link to="/" className="hover:text-foreground transition-colors">
            Visit Homepage
          </Link>
        </p>
      </footer>

    </div>
  );
}
