import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { m as motion } from "framer-motion";
import {
  Target,
  ArrowRight,
  Sparkles,
  Zap,
  BarChart3,
  MousePointerClick,
  Search,
  TrendingUp,
  PhoneCall,
  ShieldCheck,
  CheckCircle,
  Users,
  RefreshCw,
  ClipboardList,
  Rocket,
  Settings,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { JsonLd } from "@/components/JsonLd";
import PageTransition from "@/components/PageTransition";
import TestimonialsSection from "@/components/TestimonialsSection";

const faqs = [
  {
    q: "How much should I spend on Google Ads per month?",
    a: "We recommend a minimum ad spend of ₹10,000–₹15,000/month for Google Ads to see meaningful results in Mumbai. This goes directly to Google — contact us to discuss our management pricing based on your budget.",
  },
  {
    q: "How long before I start getting leads from Google Ads?",
    a: "Most campaigns see their first leads within the first 3–7 days of going live. Campaigns are optimised weekly, and usually reach peak performance within 4–6 weeks of running.",
  },
  {
    q: "Do you handle ad creative design too?",
    a: "Yes — we write all ad copy, create responsive display ad creatives, and A/B test multiple headline and description variations to maximise your click-through rate.",
  },
  {
    q: "What industries does Google Ads work best for?",
    a: "Google Search Ads work for almost any service-based business: doctors, lawyers, real estate, finance, consultants, restaurants, home services, and more. If people are searching for your service, Google Ads can put you at the top.",
  },
  {
    q: "Is there a minimum contract period?",
    a: "We work on a monthly rolling basis — no lock-in contracts. However, we recommend at least 3 months to see the full impact of campaign optimisations.",
  },
  {
    q: "Do you provide monthly reports?",
    a: "Yes — every month you receive a clear report covering impressions, clicks, cost-per-click, leads generated, cost-per-lead, and our recommendations for the next month.",
  },
];

const whatWeHandle = [
  {
    icon: Search,
    title: "Keyword Research",
    desc: "We find high-intent keywords your Mumbai customers are actively searching, filtering out irrelevant traffic with negative keywords.",
  },
  {
    icon: MousePointerClick,
    title: "Ad Copywriting",
    desc: "Compelling headlines and descriptions written to maximise click-through rates and attract serious buyers — not casual browsers.",
  },
  {
    icon: Users,
    title: "Audience & Location Targeting",
    desc: "We target specific pin codes, areas, and audience segments in Mumbai so your budget reaches only the most relevant people.",
  },
  {
    icon: BarChart3,
    title: "A/B Testing",
    desc: "We constantly test different ad variations against each other and shift budget to whichever performs best.",
  },
  {
    icon: TrendingUp,
    title: "Bid Optimisation",
    desc: "Smart bidding strategies adjusted weekly to get you the lowest possible cost-per-click and cost-per-lead.",
  },
  {
    icon: ShieldCheck,
    title: "Conversion Tracking",
    desc: "We set up call tracking, form submission tracking, and Google Tag Manager so every lead is attributed back to the exact ad that drove it.",
  },
  {
    icon: PhoneCall,
    title: "Call & WhatsApp Extensions",
    desc: "Ad extensions that let users call or WhatsApp you directly from the search results — before even clicking through to your website.",
  },
  {
    icon: RefreshCw,
    title: "Monthly Reporting",
    desc: "Clear, no-jargon reports every month: impressions, clicks, leads, cost-per-lead, and what we're doing next to improve results.",
  },
];

const processSteps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Audit",
    desc: "We audit your business, competitors, and high-intent keywords. No campaign goes live until we know exactly what will win.",
  },
  {
    icon: Target,
    step: "02",
    title: "Strategy",
    desc: "Campaign structure, match types, ad copy variants, and bidding strategy — all planned before a single rupee is spent.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Launch",
    desc: "Campaigns go live with full conversion tracking verified. We monitor the first 48 hours closely to catch any early issues.",
  },
  {
    icon: Settings,
    step: "04",
    title: "Optimise & Report",
    desc: "Weekly bid adjustments, negative keyword additions, and A/B test rotations. Monthly report delivered to your inbox.",
  },
];

const INDUSTRY_CPC: Record<string, number> = {
  doctors: 18,
  lawyers: 32,
  realestate: 25,
  finance: 28,
  restaurants: 10,
  general: 15,
};

export default function GoogleAds() {
  const navigate = useNavigate();

  const [goal, setGoal] = useState<"leads" | "calls" | "traffic">("leads");
  const [industry, setIndustry] = useState("general");
  const [spend, setSpend] = useState<10000 | 15000 | 25000>(10000);

  const cpc = INDUSTRY_CPC[industry];
  const estimatedClicks = Math.floor(spend / cpc);
  const conversionRate = goal === "traffic" ? 0 : goal === "calls" ? 0.12 : 0.08;
  const estimatedLeads =
    goal === "traffic" ? estimatedClicks : Math.floor(estimatedClicks * conversionRate);
  const cpl = goal === "traffic" ? "N/A" : `₹${Math.ceil(spend / estimatedLeads).toLocaleString("en-IN")}`;

  const handleStartCampaign = () => {
    navigate("/ads-contact", { state: { platform: "Google Ads" } });
  };

  return (
    <PageTransition>
      <SEO
        title="Google Ads Management in Mumbai | Get More Leads | SiteNova"
        description="Run Google Ads that actually convert. SiteNova manages keyword targeting, ad copy, bidding & conversion tracking for Mumbai businesses. Recommended ad spend: ₹10,000–₹15,000/month."
        canonicalUrl="/services/google-ads"
        keywords={[
          "Google Ads Mumbai",
          "PPC management Mumbai",
          "Google Ads agency Mumbai",
          "pay per click Mumbai",
          "Google search ads Mumbai",
          "lead generation Google Ads Mumbai",
        ]}
      />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Google Ads Management",
            provider: { "@type": "ProfessionalService", name: "SiteNova", url: "https://sitenova.dev" },
            areaServed: { "@type": "City", name: "Mumbai" },
            description: "Google Ads (PPC) campaign setup and management for Mumbai businesses. Keyword research, ad copy, bid optimisation, conversion tracking, and monthly reporting.",
            url: "https://sitenova.dev/services/google-ads",
            serviceType: "Google Ads Management",
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://sitenova.dev/" },
              { "@type": "ListItem", position: 2, name: "Marketing", item: "https://sitenova.dev/" },
              { "@type": "ListItem", position: 3, name: "Google Ads Management", item: "https://sitenova.dev/services/google-ads" },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          },
        ]}
      />

      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        {/* ── Hero ── */}
        <section className="relative overflow-hidden pt-32 pb-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.12),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(249,115,22,0.06),transparent_50%)]" />
          <div className="mx-auto max-w-7xl px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/25 bg-orange-500/8 px-3 py-1 text-xs font-medium text-orange-500 mb-6">
              <Target className="h-3.5 w-3.5" />
              Google Search &amp; Display Ads
            </div>
            <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-6xl max-w-4xl mx-auto">
              Get Instant Leads from Google with{" "}
              <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                Ads That Actually Convert
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Stop guessing on Google Ads. SiteNova manages every aspect of your campaign — from keyword research to
              monthly reporting — so you get real leads at a predictable cost.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 text-sm font-semibold text-orange-500">
              <CheckCircle className="h-4 w-4" />
              Recommended ad spend: ₹10,000–₹15,000/month · Contact us for management pricing
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                onClick={handleStartCampaign}
                className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-sm font-medium text-white hover:bg-orange-500/90 transition-colors shadow-[0_0_20px_rgba(249,115,22,0.3)]"
              >
                Book a Free Strategy Call <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <a
                href="#estimator"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-secondary px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors"
              >
                Estimate My Results
              </a>
            </div>
          </div>
        </section>

        {/* ── Estimator + What We Handle ── */}
        <section id="estimator" className="py-16 bg-card/10 border-t border-border/20">
          <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-start">

            {/* Left: What We Handle */}
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Everything Managed for You
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Most businesses waste 60–70% of their Google Ads budget on irrelevant clicks. We fix that from day
                one — with tight keyword targeting, compelling ad copy, and weekly bid adjustments.
              </p>
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                {whatWeHandle.map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-5 rounded-2xl border border-orange-500/15 bg-orange-500/5 backdrop-blur shadow-sm">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Estimator */}
            <div className="rounded-3xl border border-orange-500/20 bg-card/60 p-8 shadow-xl backdrop-blur-md relative">
              <div className="absolute top-0 right-8 -translate-y-1/2 rounded-full bg-orange-500/15 border border-orange-500/25 px-3.5 py-1 text-xs font-semibold text-orange-500 backdrop-blur">
                Results Estimator
              </div>
              <h3 className="font-heading text-2xl font-bold tracking-tight">Estimate Your Monthly Results</h3>
              <p className="mt-1.5 text-xs text-muted-foreground">Select your campaign goal, industry, and ad budget.</p>

              <div className="mt-6 space-y-6">
                {/* Goal */}
                <div>
                  <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Target className="h-4 w-4 text-orange-500" /> Campaign Goal
                  </label>
                  <div className="mt-2.5 grid grid-cols-3 gap-2">
                    {([
                      { id: "leads", label: "Lead Forms" },
                      { id: "calls", label: "Phone Calls" },
                      { id: "traffic", label: "Website Traffic" },
                    ] as const).map((g) => (
                      <button key={g.id} onClick={() => setGoal(g.id)}
                        className={`rounded-xl border px-3 py-3 text-xs font-medium transition-all ${goal === g.id ? "border-orange-500 bg-orange-500/10 text-orange-500 shadow-sm" : "border-border/60 bg-background/50 hover:bg-background/80"}`}>
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Industry */}
                <div>
                  <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-orange-500" /> Your Industry
                  </label>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {[
                      { id: "general", label: "General Business" },
                      { id: "doctors", label: "Healthcare" },
                      { id: "lawyers", label: "Legal Services" },
                      { id: "realestate", label: "Real Estate" },
                      { id: "finance", label: "Finance / CA" },
                      { id: "restaurants", label: "Restaurant" },
                    ].map((ind) => (
                      <button key={ind.id} onClick={() => setIndustry(ind.id)}
                        className={`rounded-full border px-4 py-2 text-xs font-medium transition-all ${industry === ind.id ? "border-orange-500 bg-orange-500/10 text-orange-500 shadow-sm" : "border-border/60 bg-background/50 hover:bg-background/80"}`}>
                        {ind.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spend */}
                <div>
                  <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-orange-500" /> Monthly Ad Spend (goes directly to Google)
                  </label>
                  <div className="mt-2.5 grid grid-cols-3 gap-2">
                    {([10000, 15000, 25000] as const).map((s) => (
                      <button key={s} onClick={() => setSpend(s)}
                        className={`rounded-xl border px-3 py-3 text-xs font-medium transition-all ${spend === s ? "border-orange-500 bg-orange-500/10 text-orange-500 shadow-sm" : "border-border/60 bg-background/50 hover:bg-background/80"}`}>
                        ₹{s.toLocaleString("en-IN")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Output */}
                <motion.div key={`${goal}-${industry}-${spend}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground text-center mb-4">Estimated Monthly Results</p>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="font-heading text-2xl font-extrabold text-foreground">{estimatedClicks.toLocaleString("en-IN")}</div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Clicks</p>
                    </div>
                    <div>
                      <div className="font-heading text-2xl font-extrabold text-foreground">{goal === "traffic" ? "—" : `~${estimatedLeads}`}</div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{goal === "calls" ? "Calls" : goal === "leads" ? "Leads" : "Visits"}</p>
                    </div>
                    <div>
                      <div className="font-heading text-2xl font-extrabold text-foreground">{cpl}</div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Cost / Lead</p>
                    </div>
                  </div>
                  <p className="mt-3 text-[10px] text-muted-foreground text-center leading-relaxed">
                    Estimates based on average Mumbai CPCs. Actual results vary by campaign quality and competition.
                  </p>
                </motion.div>

                <button onClick={handleStartCampaign}
                  className="w-full inline-flex items-center justify-center rounded-xl bg-orange-500 py-4 text-sm font-semibold text-white hover:bg-orange-500/90 transition-colors shadow-[0_0_20px_rgba(249,115,22,0.25)]">
                  Book a Free Strategy Call <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4-Step Process ── */}
        <section className="py-20 border-t border-border/20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-14">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">How We Run Your Campaign</h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                A structured process that eliminates guesswork and gets measurable results from month one.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step, idx) => (
                <div key={idx} className="relative p-6 rounded-2xl border border-orange-500/15 bg-orange-500/5 backdrop-blur">
                  <div className="text-5xl font-black text-orange-500/10 font-heading leading-none mb-4">{step.step}</div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-500 mb-3">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  {idx < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 text-orange-500/30 text-xl font-bold">›</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pain Points ── */}
        <section className="py-20 border-t border-border/20 bg-card/10">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">Why Google Ads Fail Without an Expert</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Most business owners burn through budget with nothing to show for it. Here's why.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Broad match keywords bleed budget", desc: "Without tight match types and negative keywords, your ad shows for irrelevant queries — and you pay for every click." },
                { title: "No conversion tracking", desc: "If you don't know which keyword drove a lead, you can't scale what works. Most DIY campaigns fly completely blind." },
                { title: "Weak landing pages kill conversions", desc: "Sending paid traffic to a slow, generic homepage is like pouring water into a leaking bucket." },
                { title: "No A/B testing on ad copy", desc: "One set of ads running for months with zero variation is a missed opportunity. Small changes can double your CTR." },
                { title: "Ignoring search term reports", desc: "Google shows exactly what people typed before clicking. Not reviewing this weekly costs thousands in wasted clicks." },
                { title: "Wrong bidding strategy", desc: "Using manual CPC when you should be on Target CPA — or vice versa — sends your costs skyrocketing." },
              ].map((point, idx) => (
                <div key={idx} className="p-6 rounded-2xl border border-border/40 bg-card/30 backdrop-blur interactive-card">
                  <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
                    <span className="text-orange-500 font-bold text-sm">!</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{point.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{point.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-20 border-t border-border/20">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-center mb-10">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="rounded-2xl border border-orange-500/15 bg-orange-500/5 p-6">
                  <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <TestimonialsSection />

        {/* ── Ads CTA ── */}
        <section className="py-24 border-t border-orange-500/20 bg-gradient-to-br from-orange-500/8 via-transparent to-amber-500/5">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/25 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-500 mb-6">
              <Target className="h-3.5 w-3.5" /> Free Strategy Call
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight">
              Ready to Get Real Leads <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">from Google?</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Book a free 30-minute strategy call. We'll audit your market, identify your highest-intent keywords, and tell you exactly what a campaign would cost and deliver.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button onClick={handleStartCampaign}
                className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-8 py-4 text-base font-semibold text-white hover:bg-orange-500/90 transition-colors shadow-[0_0_30px_rgba(249,115,22,0.35)]">
                Book Free Strategy Call <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <Link to="/contact-us"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-secondary px-8 py-4 text-base font-medium text-foreground hover:bg-secondary/80 transition-colors">
                Ask a Question
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
}
