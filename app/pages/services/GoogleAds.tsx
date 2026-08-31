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
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { JsonLd } from "@/components/JsonLd";
import PageTransition from "@/components/PageTransition";
import PortfolioSection from "@/components/PortfolioSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaSection from "@/components/CtaSection";

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

// Simple estimator: goal + industry + monthly spend → estimated leads
const INDUSTRY_CPC: Record<string, number> = {
  doctors: 18,
  lawyers: 32,
  realestate: 25,
  finance: 28,
  restaurants: 10,
  general: 15,
};

const CTR = 0.06; // 6% average CTR on search

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

  const handleStartQuote = () => {
    const specsSummary = `Google Ads Campaign Request:
- Campaign Goal: ${goal === "leads" ? "Lead Generation" : goal === "calls" ? "Phone Calls" : "Website Traffic"}
- Industry: ${industry}
- Monthly Ad Spend Budget: ₹${spend.toLocaleString("en-IN")}
- Estimated Clicks/Month: ~${estimatedClicks}
- Estimated Leads/Month: ${goal === "traffic" ? estimatedClicks + " visits" : "~" + estimatedLeads}`;

    navigate("/quote", {
      state: {
        projectType: "Google Ads Management",
        requirements: specsSummary,
        budget: "Custom pricing based on ad spend",
      },
    });
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
            provider: {
              "@type": "ProfessionalService",
              name: "SiteNova",
              url: "https://sitenova.dev",
            },
            areaServed: { "@type": "City", name: "Mumbai" },
            description:
              "Google Ads (PPC) campaign setup and management for Mumbai businesses. Keyword research, ad copy, bid optimisation, conversion tracking, and monthly reporting.",
            url: "https://sitenova.dev/services/google-ads",
            serviceType: "Google Ads Management",
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://sitenova.dev/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Services",
                item: "https://sitenova.dev/",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "Google Ads Management",
                item: "https://sitenova.dev/services/google-ads",
              },
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

        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.12),transparent_50%)]" />
          <div className="mx-auto max-w-7xl px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-6">
              <Target className="h-3.5 w-3.5" />
              Google Search & Display Ads
            </div>
            <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-6xl max-w-4xl mx-auto">
              Get Instant Leads from Google with{" "}
              <span className="gradient-text">Ads That Actually Convert</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Stop guessing on Google Ads. SiteNova manages every aspect of your campaign — from keyword research to
              monthly reporting — so you get real leads at a predictable cost.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-sm font-semibold text-emerald-500">
              <CheckCircle className="h-4 w-4" />
              Recommended ad spend: ₹10,000–₹15,000/month · Contact us for management pricing
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                onClick={handleStartQuote}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors glow-effect"
              >
                Start a Campaign <ArrowRight className="ml-2 h-4 w-4" />
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

        {/* Main Content + Estimator */}
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
                  <div
                    key={idx}
                    className="flex gap-4 p-5 rounded-2xl border border-border/40 bg-card/30 backdrop-blur shadow-sm"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
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
            <div className="rounded-3xl border border-border bg-card/60 p-8 shadow-xl backdrop-blur-md relative">
              <div className="absolute top-0 right-8 -translate-y-1/2 rounded-full bg-primary/15 border border-primary/20 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur">
                Results Estimator
              </div>

              <h3 className="font-heading text-2xl font-bold tracking-tight">
                Estimate Your Monthly Results
              </h3>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Select your campaign goal, industry, and ad budget to see projected results.
              </p>

              <div className="mt-6 space-y-6" id="estimator-widget">

                {/* Goal */}
                <div>
                  <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Target className="h-4 w-4 text-primary" /> Campaign Goal
                  </label>
                  <div className="mt-2.5 grid grid-cols-3 gap-2">
                    {([
                      { id: "leads", label: "Lead Forms" },
                      { id: "calls", label: "Phone Calls" },
                      { id: "traffic", label: "Website Traffic" },
                    ] as const).map((g) => (
                      <button
                        key={g.id}
                        onClick={() => setGoal(g.id)}
                        className={`rounded-xl border px-3 py-3 text-xs font-medium transition-all ${
                          goal === g.id
                            ? "border-primary bg-primary/5 text-primary shadow-sm"
                            : "border-border/60 bg-background/50 hover:bg-background/80"
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Industry */}
                <div>
                  <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-primary" /> Your Industry
                  </label>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {[
                      { id: "general", label: "General Business" },
                      { id: "doctors", label: "Healthcare / Clinics" },
                      { id: "lawyers", label: "Legal Services" },
                      { id: "realestate", label: "Real Estate" },
                      { id: "finance", label: "Finance / CA" },
                      { id: "restaurants", label: "Restaurant / F&B" },
                    ].map((ind) => (
                      <button
                        key={ind.id}
                        onClick={() => setIndustry(ind.id)}
                        className={`rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                          industry === ind.id
                            ? "border-primary bg-primary/5 text-primary shadow-sm"
                            : "border-border/60 bg-background/50 hover:bg-background/80"
                        }`}
                      >
                        {ind.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Monthly Ad Spend */}
                <div>
                  <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-primary" /> Monthly Ad Spend (your budget to Google)
                  </label>
                  <div className="mt-2.5 grid grid-cols-3 gap-2">
                    {([10000, 15000, 25000] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSpend(s)}
                        className={`rounded-xl border px-3 py-3 text-xs font-medium transition-all ${
                          spend === s
                            ? "border-primary bg-primary/5 text-primary shadow-sm"
                            : "border-border/60 bg-background/50 hover:bg-background/80"
                        }`}
                      >
                        ₹{s.toLocaleString("en-IN")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Output */}
                <motion.div
                  key={`${goal}-${industry}-${spend}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-primary/20 bg-primary/5 p-5"
                >
                  <p className="text-xs uppercase tracking-wider text-muted-foreground text-center mb-4">
                    Estimated Monthly Results
                  </p>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="font-heading text-2xl font-extrabold text-foreground">
                        {estimatedClicks.toLocaleString("en-IN")}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Clicks</p>
                    </div>
                    <div>
                      <div className="font-heading text-2xl font-extrabold text-foreground">
                        {goal === "traffic" ? "—" : `~${estimatedLeads}`}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {goal === "calls" ? "Calls" : goal === "leads" ? "Leads" : "Visits"}
                      </p>
                    </div>
                    <div>
                      <div className="font-heading text-2xl font-extrabold text-foreground">{cpl}</div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Cost / Lead</p>
                    </div>
                  </div>
                  <p className="mt-3 text-[10px] text-muted-foreground text-center leading-relaxed">
                    Estimates based on average Mumbai CPCs. Actual results vary by campaign quality, landing page, and competition.
                  </p>
                </motion.div>

                <button
                  onClick={handleStartQuote}
                  className="w-full inline-flex items-center justify-center rounded-xl bg-primary py-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors glow-effect-sm"
                >
                  Start My Google Ads Campaign <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Pain Points */}
        <section className="py-20 border-t border-border/20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Why Google Ads Fail Without an Expert
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Most business owners set up their own campaigns and burn through budget with nothing to show for it. Here's why.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Broad match keywords bleed budget",
                  desc: "Without tight match types and negative keywords, your ad shows for 'free doctor near me' and 'doctor salary' — and you pay for every irrelevant click.",
                },
                {
                  title: "No conversion tracking",
                  desc: "If you don't know which keyword drove a lead, you can't scale what works. Most DIY campaigns fly completely blind.",
                },
                {
                  title: "Weak landing pages kill conversions",
                  desc: "Sending paid traffic to a slow, generic homepage is like pouring water into a leaking bucket. We ensure your page is built to convert.",
                },
                {
                  title: "No A/B testing on ad copy",
                  desc: "One set of ads running for months with zero variation is a missed opportunity. Small copy changes can double your click-through rate.",
                },
                {
                  title: "Ignoring search term reports",
                  desc: "Google shows exactly what people are typing before clicking your ad. Not reviewing this weekly costs you thousands in wasted clicks.",
                },
                {
                  title: "Wrong bidding strategy",
                  desc: "Using manual CPC when you should be on Target CPA — or vice versa — sends your costs skyrocketing. Strategy matters from day one.",
                },
              ].map((point, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-border/40 bg-card/30 backdrop-blur interactive-card"
                >
                  <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                    <span className="text-destructive font-bold text-sm">!</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{point.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{point.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 border-t border-border/20 bg-card/10">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-center mb-10">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="rounded-2xl border border-border/40 bg-card/30 p-6">
                  <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <p className="text-muted-foreground mb-4 text-sm">Have a question not listed here?</p>
              <Link
                to="/contact-us"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-secondary px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors"
              >
                Ask Us Directly <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <PortfolioSection />
        <TestimonialsSection />
        <CtaSection />

        <Footer />
      </div>
    </PageTransition>
  );
}
