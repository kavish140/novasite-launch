import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { m as motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Smartphone,
  Zap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Star,
  TrendingDown,
  Clock,
  Phone,
  ChevronDown,
  MessageCircle,
  Monitor,
  Globe,
  ShoppingCart,
  Code2,
  RefreshCw,
  Building,
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
import {
  trackAuditSubmit,
} from "@/lib/analytics";
import { PHONE_TEL_LINK, PHONE_NUMBER, WHATSAPP_URL } from "@/lib/constants";

// ── Constants ─────────────────────────────────────────────────────────────────

const projectTypes = [
  {
    id: "Landing Page",
    title: "Landing Page",
    description: "One-page site built for conversion, single product, or event.",
    icon: Monitor,
  },
  {
    id: "Business Website",
    title: "Business Website",
    description: "Multi-page site showcasing services, team, and building authority.",
    icon: Globe,
  },
  {
    id: "E-commerce Store",
    title: "E-commerce Store",
    description: "Online shop equipped with checkout, products, and payments.",
    icon: ShoppingCart,
  },
  {
    id: "Custom Web App",
    title: "Custom Web App",
    description: "Advanced application with custom dashboard, logic, and database.",
    icon: Code2,
  },
  {
    id: "Website Redesign",
    title: "Website Redesign",
    description: "Modernize styling, improve SEO, and speed up your existing website.",
    icon: RefreshCw,
  },
];

const budgetOptions = [
  "Rs. 10,000 - 15,000",
  "Rs. 15,000 - 30,000",
  "Rs. 30,000+",
  "Flexible / Custom",
];

const timelineOptions = [
  "Urgent (< 2 weeks)",
  "Normal (2-4 weeks)",
  "Flexible (1+ months)",
];

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

function QuoteWizard({ className }: { className?: string }) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState("");
  const [requirements, setRequirements] = useState("");
  const [budget, setBudget] = useState("Rs. 15,000 - 30,000");
  const [timeline, setTimeline] = useState("Normal (2-4 weeks)");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const isStep3Valid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      name.trim().length > 0 &&
      emailRegex.test(email) &&
      phone.trim().replace(/\D/g, "").length >= 10
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStep3Valid()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // 1. Save to Supabase quote_requests — non-fatal, always continue
      const { error: dbError } = await supabase.from("quote_requests").insert([
        {
          name,
          email,
          phone,
          business_name: businessName || null,
          project_type: projectType,
          requirements,
          budget,
          timeline,
          source: "paid_ad",
        },
      ]);
      if (dbError) {
        // Log but do NOT block — Web3Forms email is the primary data capture.
        // Common cause: RLS policy missing on quote_requests table.
        // Fix: run in Supabase SQL Editor:
        //   CREATE POLICY "anon_insert" ON quote_requests FOR INSERT TO anon WITH CHECK (true);
        console.warn("Supabase quote_requests insert warning (non-fatal):", dbError.message);
      }

      // 2. Send email via Web3Forms (primary lead capture)
      const formData = new FormData();
      formData.append("access_key", "671591b9-2925-44ba-ba00-12e0e092bb34");
      formData.append("subject", `New LP Quote Lead — ${name} (${projectType})`);
      formData.append("from_name", "SiteNova LP Quote Form");
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("business_name", businessName || "Not specified");
      formData.append("project_type", projectType);
      formData.append("requirements", requirements);
      formData.append("budget", budget);
      formData.append("timeline", timeline);
      formData.append("source", "paid_ad — /lp/web-design");

      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!data.success) {
          console.warn("Web3Forms warning:", data.message);
        }
      } catch {
        // CORS fallback — request is still delivered to Web3Forms
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData,
          mode: "no-cors",
        }).catch((err) => console.warn("Web3Forms network error:", err));
      }

      navigate("/lp/thank-you-quote", {
        state: { name, projectType, email },
      });
    } catch (err) {
      console.error("Quote submit error:", err);
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again or contact us via WhatsApp.";
      setSubmitError(message);
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectChips = [
    { id: "Landing Page",     label: "Landing Page",  icon: Monitor },
    { id: "Business Website", label: "Business Site", icon: Globe },
    { id: "E-commerce Store", label: "E-commerce",    icon: ShoppingCart },
    { id: "Custom Web App",   label: "Web App",       icon: Code2 },
    { id: "Website Redesign", label: "Redesign",      icon: RefreshCw },
  ];

  return (
    <div className={className}>
      <div className="relative">
        {/* Glow border */}
        <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/40 to-accent/30 rounded-3xl blur opacity-60" />
        <div className="relative bg-card/90 backdrop-blur-xl border border-border/60 rounded-3xl p-6 shadow-2xl">

          {/* Header + slim animated dot progress */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold font-heading leading-tight">
                Get a Free Quote
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Reply within{" "}
                <span className="text-foreground font-semibold">24 hours</span>
              </p>
            </div>
            <div className="flex items-center gap-1.5 mt-1 shrink-0">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`rounded-full transition-all duration-300 ${
                    s === step
                      ? "w-5 h-2 bg-primary"
                      : s < step
                      ? "w-2 h-2 bg-primary/60"
                      : "w-2 h-2 bg-border"
                  }`}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">

            {/* ── STEP 1: Compact 2-col chip grid ── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.18 }}
              >
                <p className="text-xs font-semibold text-muted-foreground mb-3">
                  What type of website do you need?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {projectChips.map(({ id, label, icon: Icon }) => (
                    <button
                      type="button"
                      key={id}
                      onClick={() => { setProjectType(id); setStep(2); }}
                      className="group flex items-center gap-2.5 px-3 py-3 rounded-xl border border-border/60 bg-secondary/20 hover:border-primary/60 hover:bg-primary/5 transition-all duration-150 text-left"
                    >
                      <div className="p-1.5 rounded-lg bg-secondary/60 group-hover:bg-primary/10 transition-colors shrink-0">
                        <Icon size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-xs font-semibold leading-tight group-hover:text-primary transition-colors">
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground/60 text-center mt-3">
                  Tap to select and continue →
                </p>
              </motion.div>
            )}

            {/* ── STEP 2: Requirements + Budget + Timeline ── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.18 }}
                className="space-y-3.5"
              >
                {/* Selected type badge + change link */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5 font-semibold">
                    {projectType}
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                  >
                    change
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Briefly describe your project{" "}
                    <span className="opacity-50">(10+ chars)</span>
                  </label>
                  <textarea
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="e.g., Dental clinic in Mulund — hero, services section, enquiry form."
                    className="w-full h-20 bg-background/50 border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-3 text-xs text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none transition-all"
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className={`text-[11px] transition-colors ${requirements.trim().length < 10 ? "text-destructive/70" : "text-primary/70"}`}>
                      {requirements.trim().length < 10
                        ? `${10 - requirements.trim().length} more character${10 - requirements.trim().length !== 1 ? "s" : ""} needed`
                        : "✓ Looks good"}
                    </span>
                    <span className="text-[11px] text-muted-foreground/50">
                      {requirements.trim().length}/10+
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-muted-foreground block">Budget</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {budgetOptions.map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setBudget(opt)}
                        className={`py-2 px-2 text-[11px] font-semibold rounded-lg border text-center transition-all duration-150 ${
                          budget === opt
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-secondary/30 border-border/60 hover:border-primary/40 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-muted-foreground block">Timeline</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {timelineOptions.map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setTimeline(opt)}
                        className={`py-2 px-1 text-[11px] font-semibold rounded-lg border text-center transition-all duration-150 ${
                          timeline === opt
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-secondary/30 border-border/60 hover:border-primary/40 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={requirements.trim().length < 10}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/95 transition-all disabled:opacity-40 disabled:pointer-events-none"
                >
                  Next: Contact Details
                  <ArrowRight size={14} />
                </button>
              </motion.div>
            )}

            {/* ── STEP 3: Contact Details ── */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.18 }}
              >
                {/* Summary chips + edit link */}
                <div className="flex flex-wrap items-center gap-1.5 mb-4">
                  <span className="text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5 font-semibold">
                    {projectType}
                  </span>
                  <span className="text-xs bg-secondary text-muted-foreground rounded-full px-2.5 py-0.5 border border-border/50">
                    {budget}
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                  >
                    edit
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1 text-left">
                      <Label htmlFor="qw-name" className="text-xs">
                        Full Name <span className="text-primary">*</span>
                      </Label>
                      <Input
                        id="qw-name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="bg-background/50 focus:bg-background h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1 text-left">
                      <Label htmlFor="qw-phone" className="text-xs">
                        Phone <span className="text-primary">*</span>
                      </Label>
                      <Input
                        id="qw-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="9876543210"
                        className="bg-background/50 focus:bg-background h-9 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <Label htmlFor="qw-email" className="text-xs">
                      Email <span className="text-primary">*</span>
                    </Label>
                    <Input
                      id="qw-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="bg-background/50 focus:bg-background h-9 text-sm"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <Label htmlFor="qw-biz" className="text-xs text-muted-foreground">
                      Business Name <span className="opacity-50">(optional)</span>
                    </Label>
                    <div className="relative">
                      <Building size={13} className="absolute left-3 top-2.5 text-muted-foreground/50" />
                      <Input
                        id="qw-biz"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Acme Corp"
                        className="bg-background/50 focus:bg-background h-9 text-sm pl-8"
                      />
                    </div>
                  </div>

                  {submitError && (
                    <div className="p-2.5 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-xs font-semibold">
                      {submitError}
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex items-center gap-1 px-3 py-2.5 rounded-xl border border-border/60 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-colors"
                    >
                      <ArrowLeft size={13} />
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !isStep3Valid()}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/95 transition-all disabled:opacity-40 disabled:pointer-events-none button-shimmer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Get My Quote
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trust strip */}
          <div className="mt-4 pt-4 border-t border-border/20 flex items-center justify-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
              <span>Free</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Lock className="w-3.5 h-3.5 text-primary" />
              <span>No Spam</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Clock className="w-3.5 h-3.5 text-accent" />
              <span>24h Reply</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Free Audit Form (Bottom) ──────────────────────────────────────────────────

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

      trackAuditSubmit();

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
    desc: "53% of mobile visitors abandon a site that takes more than 3 seconds to load. A slow site silently kills your conversion rate.",
  },
  {
    icon: Smartphone,
    color: "text-accent",
    bg: "bg-accent/10",
    title: "Poor Mobile Experience",
    desc: "65% of local searches happen on phones. If your site breaks or looks bad on mobile, you are handing leads to your competitors.",
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

const TESTIMONIALS = [
  {
    quote:
      "The free audit from SiteNova showed us exactly why our competitors were ranking above us. After implementing their suggestions, our leads increased by 40% in two months.",
    name: "Rahul D.",
    role: "Local Business Owner, Mumbai",
  },
  {
    quote:
      "I was skeptical at first, but their audit was genuinely detailed, not a generic report. They found 11 issues I had no idea about. The new site they built has completely changed how patients find us.",
    name: "Dr. Dipti Ganatra",
    role: "Dermatologist, Mulund",
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
      .then(() => {}) // fire-and-forget — never block or alert on failure
      .catch(() => {});
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
                Free Quotes — No Obligation, No Hidden Fees
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] font-heading">
              Build a Website That{" "}
              <span className="gradient-text animated-gradient">
                Actually Wins Customers
              </span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              Tell us about your project in 3 quick steps and get a{" "}
              <strong className="text-foreground">free, transparent quote</strong>{" "}
              from Mumbai's top web studio — delivered within 24 hours.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {[
                "Custom design, no templates",
                "Fast-loading, mobile-first",
                "SEO-ready from day one",
                "Transparent, fixed pricing",
                "Direct developer access",
                "Lifetime support available",
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

            <div className="pt-4 border-t border-border/30">
              <div className="flex items-center gap-1 mb-1.5 text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
                <span className="text-xs text-muted-foreground ml-1">
                  5.0 by Mumbai businesses
                </span>
              </div>
              <p className="text-sm italic text-muted-foreground">
                "Their audit showed us exactly why competitors ranked above us.
                Leads up 40% in 2 months."
              </p>
              <p className="text-xs font-semibold mt-1.5">
                Rahul D., Local Business Owner
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <QuoteWizard />
          </motion.div>
        </div>
      </section>

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

      {/* TESTIMONIALS */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-4">
              What Our Clients Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="glass-card p-7 space-y-4"
              >
                <div className="flex items-center gap-1 text-yellow-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  "{t.quote}"
                </p>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
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

      {/* STICKY MOBILE CTA BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border/40 bg-background/95 backdrop-blur-md p-3 flex gap-3">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-bold text-white"
        >
          <MessageCircle size={16} />
          WhatsApp
        </a>
        <button
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground button-shimmer"
          onClick={() => {
            document
              .getElementById("qw-name")
              ?.scrollIntoView({ behavior: "smooth" });
            document.getElementById("qw-name")?.focus();
          }}
        >
          <Zap size={16} />
          Get a Quote
        </button>
      </div>

      {/* Bottom padding for sticky bar on mobile */}
      <div className="h-16 md:hidden" />
    </div>
  );
}
