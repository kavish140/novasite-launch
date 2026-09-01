import { useState } from "react";
import { useLocation } from "react-router";
import { m as motion } from "framer-motion";
import { Target, Megaphone, CheckCircle2, ArrowRight, Phone, Building2, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { JsonLd } from "@/components/JsonLd";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

type Platform = "Google Ads" | "Meta Ads" | "Both";
type Budget = "No budget yet" | "₹10,000–₹15,000" | "₹15,000–₹30,000" | "₹30,000+";
type Goal = "Leads" | "Calls" | "Sales" | "Brand Awareness";

const GOALS: Goal[] = ["Leads", "Calls", "Sales", "Brand Awareness"];
const BUDGETS: Budget[] = ["No budget yet", "₹10,000–₹15,000", "₹15,000–₹30,000", "₹30,000+"];

export default function AdsContact() {
  const location = useLocation();
  const { toast } = useToast();

  // Pre-fill platform from navigation state (from GoogleAds / MetaAds CTAs)
  const preselectedPlatform = (location.state as { platform?: Platform } | null)?.platform;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [platform, setPlatform] = useState<Platform>(preselectedPlatform ?? "Both");
  const [budget, setBudget] = useState<Budget | "">("");
  const [industry, setIndustry] = useState("");
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleGoal = (g: Goal) => {
    setGoals((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!budget) { toast({ title: "Please select a monthly ad budget", variant: "destructive" }); return; }
    if (goals.length === 0) { toast({ title: "Please select at least one campaign goal", variant: "destructive" }); return; }

    const rawPhone = phone.replace(/\D/g, "");
    if (rawPhone.length < 10) {
      toast({ title: "Invalid phone number", description: "Please enter at least 10 digits.", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      // 1. Save to Supabase ads_inquiries table
      const { error: dbError } = await supabase.from("ads_inquiries").insert([{
        name: name.trim(),
        phone: phone.trim(),
        business_name: businessName.trim(),
        platform: platform.toLowerCase().replace(" ", "_"),
        monthly_budget: budget,
        industry: industry.trim(),
        goals: goals.join(", "),
        status: "new",
      }]);

      if (dbError) {
        console.error("Supabase insert error:", dbError);
        // Don't block — try email anyway
      }

      // 2. Send email via Web3Forms
      const formData = new FormData();
      formData.append("access_key", "671591b9-2925-44ba-ba00-12e0e092bb34");
      formData.append("subject", `New Ads Inquiry: ${platform} — ${businessName || name}`);
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("business_name", businessName || "Not provided");
      formData.append("platform", platform);
      formData.append("monthly_budget", budget);
      formData.append("industry", industry || "Not specified");
      formData.append("goals", goals.join(", "));
      formData.append("from_page", "/ads-contact");

      try {
        const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: formData });
        const data = await res.json();
        if (!data.success) console.warn("Web3Forms warning:", data.message);
      } catch {
        // CORS fallback — request still delivered to Web3Forms
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData,
          mode: "no-cors",
        }).catch((err) => console.warn("Web3Forms network error:", err));
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);
      toast({ title: "Something went wrong", description: "Please try again or WhatsApp us directly.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <SEO
        title="Book a Free Ad Strategy Call | Google & Meta Ads | SiteNova"
        description="Tell us about your business and ad goals. SiteNova will analyse your market and create a custom Google Ads or Meta Ads strategy — completely free, no obligation."
        canonicalUrl="/ads-contact"
        keywords={["Google Ads Mumbai", "Meta Ads Mumbai", "Facebook Ads consultation", "Google Ads strategy call Mumbai"]}
      />
      <JsonLd data={[{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://sitenova.dev/" },
          { "@type": "ListItem", position: 2, name: "Book Ad Strategy Call", item: "https://sitenova.dev/ads-contact" },
        ],
      }]} />

      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />

        <main className="flex-1 relative pt-28 pb-20 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.1),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(249,115,22,0.06),transparent_50%)]" />

          <div className="mx-auto max-w-2xl px-6 relative z-10">

            {submitted ? (
              /* ── Success State ── */
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 px-8 rounded-3xl border border-orange-500/20 bg-orange-500/5">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/15 mx-auto mb-6">
                  <CheckCircle2 className="h-8 w-8 text-orange-500" />
                </div>
                <h2 className="font-heading text-3xl font-bold mb-3">We'll be in touch within 24 hours!</h2>
                <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  Thanks <strong>{name}</strong> — your inquiry has been received. Kavish will review your details and reach out to you on <strong>{phone}</strong> to schedule your free strategy call.
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  Need to reach us faster?{" "}
                  <a href="https://wa.me/919326060621" target="_blank" rel="noopener noreferrer"
                    className="text-orange-500 font-semibold hover:underline">WhatsApp us directly →</a>
                </p>
              </motion.div>
            ) : (
              /* ── Form ── */
              <>
                {/* Header */}
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/8 px-3 py-1 text-xs font-medium text-orange-500 mb-5">
                    {platform === "Google Ads" ? <Target className="h-3.5 w-3.5" /> : platform === "Meta Ads" ? <Megaphone className="h-3.5 w-3.5" /> : <Zap className="h-3.5 w-3.5" />}
                    Free Ad Strategy Call
                  </div>
                  <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
                    Let's Plan Your{" "}
                    <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                      Ad Campaign
                    </span>
                  </h1>
                  <p className="mt-4 text-muted-foreground max-w-md mx-auto">
                    Fill in a few quick details. Kavish will personally review them and reach out within 24 hours to discuss your strategy — completely free.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-orange-500/15 bg-card/50 backdrop-blur-md p-8 shadow-xl">

                  {/* Name + Phone */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name <span className="text-orange-500">*</span></Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Rahul Sharma" required className="bg-background/50 border-border/60 focus:border-orange-500/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-orange-500" /> Phone / WhatsApp <span className="text-orange-500">*</span>
                      </Label>
                      <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9326060621" required className="bg-background/50 border-border/60 focus:border-orange-500/50" />
                    </div>
                  </div>

                  {/* Business Name */}
                  <div className="space-y-2">
                    <Label htmlFor="business" className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-orange-500" /> Business Name <span className="text-orange-500">*</span>
                    </Label>
                    <Input id="business" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. Sharma Dental Clinic" required className="bg-background/50 border-border/60 focus:border-orange-500/50" />
                  </div>

                  {/* Industry */}
                  <div className="space-y-2">
                    <Label htmlFor="industry">Your Industry / Niche <span className="text-orange-500">*</span></Label>
                    <Input id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. Dentist, Real Estate Agent, Restaurant..." required className="bg-background/50 border-border/60 focus:border-orange-500/50" />
                  </div>

                  {/* Platform */}
                  <div className="space-y-3">
                    <Label>Which platform are you interested in? <span className="text-orange-500">*</span></Label>
                    <div className="grid grid-cols-3 gap-3">
                      {(["Google Ads", "Meta Ads", "Both"] as Platform[]).map((p) => (
                        <button key={p} type="button" onClick={() => setPlatform(p)}
                          className={`rounded-xl border px-3 py-3.5 text-sm font-medium transition-all flex flex-col items-center gap-1.5 ${platform === p ? "border-orange-500 bg-orange-500/10 text-orange-500 shadow-sm" : "border-border/60 bg-background/50 hover:bg-background/80"}`}>
                          {p === "Google Ads" ? <Target className="h-4 w-4" /> : p === "Meta Ads" ? <Megaphone className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="space-y-3">
                    <Label>Monthly Ad Budget (goes to Google / Meta) <span className="text-orange-500">*</span></Label>
                    <div className="grid grid-cols-2 gap-3">
                      {BUDGETS.map((b) => (
                        <button key={b} type="button" onClick={() => setBudget(b)}
                          className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${budget === b ? "border-orange-500 bg-orange-500/10 text-orange-500 shadow-sm" : "border-border/60 bg-background/50 hover:bg-background/80"}`}>
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Goals */}
                  <div className="space-y-3">
                    <Label>What do you want to achieve? <span className="text-orange-500">*</span> <span className="text-xs text-muted-foreground font-normal">(select all that apply)</span></Label>
                    <div className="flex flex-wrap gap-3">
                      {GOALS.map((g) => (
                        <button key={g} type="button" onClick={() => toggleGoal(g)}
                          className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${goals.includes(g) ? "border-orange-500 bg-orange-500/10 text-orange-500 shadow-sm" : "border-border/60 bg-background/50 hover:bg-background/80"}`}>
                          {goals.includes(g) && <CheckCircle2 className="inline h-3.5 w-3.5 mr-1.5" />}{g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-500/90 text-white py-6 text-base font-semibold rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all">
                    {loading ? "Sending..." : <><span>Submit — Book My Free Strategy Call</span> <ArrowRight className="ml-2 h-4 w-4" /></>}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    No spam, no obligations. Kavish personally reviews every inquiry.
                  </p>
                </form>
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
