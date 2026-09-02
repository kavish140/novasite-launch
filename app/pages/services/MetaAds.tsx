import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { m as motion } from "framer-motion";
import {
  Megaphone,
  ArrowRight,
  Sparkles,
  Zap,
  BarChart3,
  Image,
  Users,
  RefreshCw,
  Heart,
  MousePointerClick,
  TrendingUp,
  CheckCircle,
  ShieldCheck,
  ClipboardList,
  Rocket,
  Settings,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import PageTransition from "@/components/PageTransition";
import TestimonialsSection from "@/components/TestimonialsSection";

const faqs = [
  {
    q: "How much should I spend on Meta Ads per month?",
    a: "We recommend a minimum ad spend of ₹10,000–₹15,000/month on Facebook and Instagram to see consistent results. This goes directly to Meta — contact us to discuss our management pricing based on your budget.",
  },
  {
    q: "What's the difference between boosting a post and running a real Meta Ads campaign?",
    a: "Boosting a post is the most expensive and least effective way to advertise on Meta. Professional campaigns use the Ads Manager with precise audience targeting, pixel events, retargeting, and A/B-tested creatives — getting you 3–5x the results for the same budget.",
  },
  {
    q: "Do you design the ad creatives and write the copy?",
    a: "Yes — we design all static image and carousel ad creatives, write ad copy, and manage the full campaign inside Meta Ads Manager. You don't need to be involved in the day-to-day.",
  },
  {
    q: "Can you run ads on both Facebook and Instagram?",
    a: "Absolutely. Meta's Ads Manager runs campaigns across Facebook, Instagram, Messenger, and the Audience Network simultaneously. We optimise placements based on where your audience is most active.",
  },
  {
    q: "What is retargeting and why does it matter?",
    a: "Retargeting shows ads specifically to people who have already visited your website or engaged with your posts. These audiences convert at 3–5x the rate of cold audiences because they already know your brand — and we set this up using Meta Pixel.",
  },
  {
    q: "Is there a minimum contract?",
    a: "No lock-in. We work month-to-month. That said, Meta Ads typically need 4–8 weeks for the algorithm to fully optimise, so we recommend at least 3 months for best results.",
  },
];

const whatWeHandle = [
  { icon: Image, title: "Ad Creative Design", desc: "Static images, carousels, and story ads designed to stop the scroll — built to your brand's look and feel." },
  { icon: Users, title: "Audience Segmentation", desc: "Precise targeting by age, gender, location (down to Mumbai pin codes), interests, and behaviours." },
  { icon: ShieldCheck, title: "Meta Pixel Setup", desc: "We install and configure the Meta Pixel on your website to track page views, leads, purchases, and build custom audiences." },
  { icon: RefreshCw, title: "Retargeting Campaigns", desc: "We serve ads to people who visited your site but didn't convert — recovering lost leads at a fraction of cold audience cost." },
  { icon: MousePointerClick, title: "Lookalike Audiences", desc: "We build audiences that 'look like' your existing best customers so Meta finds you more people just like them." },
  { icon: BarChart3, title: "A/B Creative Testing", desc: "Multiple ad versions tested simultaneously — we identify winning creatives quickly and scale what works." },
  { icon: TrendingUp, title: "Campaign Scaling", desc: "Once a campaign is profitable, we scale spend in a controlled manner so leads increase without destroying cost-per-lead." },
  { icon: Megaphone, title: "Monthly Reporting", desc: "Clear reports covering reach, impressions, clicks, leads, cost-per-lead, and our strategy for the next month." },
];

const processSteps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Audit",
    desc: "We audit your target audience, competitor ads, and existing Meta presence. Pixel health check included.",
  },
  {
    icon: Megaphone,
    step: "02",
    title: "Strategy",
    desc: "Audience segments, creative brief, campaign objective, and budget split — all mapped before a single rupee is spent.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Launch",
    desc: "Campaigns go live with Pixel tracking verified. We watch the first 48–72 hours closely as Meta learns your audience.",
  },
  {
    icon: Settings,
    step: "04",
    title: "Optimise & Report",
    desc: "Weekly creative rotations, audience refinements, and scaling winners. Monthly report delivered to your inbox.",
  },
];

const MUMBAI_AUDIENCE: Record<string, number> = {
  "18-24": 2_100_000,
  "25-34": 3_800_000,
  "35-44": 2_500_000,
  "45-54": 1_200_000,
};

const INTEREST_MULTIPLIER: Record<string, number> = {
  general: 1,
  healthcare: 0.15,
  realestate: 0.18,
  finance: 0.12,
  food: 0.25,
  fashion: 0.22,
};

const CPM = 120;

export default function MetaAds() {
  const navigate = useNavigate();

  const [ageGroup, setAgeGroup] = useState("25-34");
  const [interest, setInterest] = useState("general");
  const [spend, setSpend] = useState<10000 | 15000 | 25000>(10000);

  const baseAudience = MUMBAI_AUDIENCE[ageGroup];
  const targetAudience = Math.floor(baseAudience * INTEREST_MULTIPLIER[interest]);
  const estimatedImpressions = Math.floor((spend / CPM) * 1000);
  const estimatedReach = Math.floor(estimatedImpressions * 0.6);
  const estimatedLeads = Math.floor(estimatedReach * 0.008);

  const handleStartCampaign = () => {
    navigate("/ads-contact", { state: { platform: "Meta Ads" } });
  };

  return (
    <PageTransition>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Meta Ads Management (Facebook & Instagram)",
            provider: {
              "@type": "LocalBusiness",
              name: "SiteNova",
              url: "https://sitenova.dev",
              telephone: "+919326060621",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Mulund",
                addressLocality: "Mumbai",
                addressRegion: "Maharashtra",
                postalCode: "400080",
                addressCountry: "IN",
              },
            },
            areaServed: [
              { "@type": "City", name: "Mumbai" },
              { "@type": "City", name: "Thane" },
            ],
            description:
              "Facebook and Instagram ad campaign management for Mumbai businesses. Audience targeting, creative design, pixel setup, retargeting, and monthly reporting.",
            url: "https://sitenova.dev/services/meta-ads",
            serviceType: "Meta Ads Management",
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Meta Ads Management Plans",
              itemListElement: [
                {
                  "@type": "Offer",
                  name: "Meta Ads Management",
                  description:
                    "Full-service Facebook and Instagram ad campaign management including audience research, creative design, pixel setup, retargeting, A/B testing, and monthly reporting.",
                  priceCurrency: "INR",
                  eligibleRegion: { "@type": "City", name: "Mumbai" },
                },
              ],
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://sitenova.dev/" },
              { "@type": "ListItem", position: 2, name: "Services", item: "https://sitenova.dev/services/meta-ads" },
              { "@type": "ListItem", position: 3, name: "Meta Ads Management", item: "https://sitenova.dev/services/meta-ads" },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How SiteNova Runs Your Meta Ads Campaign",
            description:
              "A structured 4-step process for Mumbai businesses to grow on Facebook and Instagram with measurable results from month one.",
            step: processSteps.map((s, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              name: s.title,
              text: s.desc,
            })),
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
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(249,115,22,0.12),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(249,115,22,0.06),transparent_50%)]" />
          <div className="mx-auto max-w-7xl px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/25 bg-orange-500/8 px-3 py-1 text-xs font-medium text-orange-500 mb-6">
              <Megaphone className="h-3.5 w-3.5" />
              Facebook &amp; Instagram Ads
            </div>
            <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-6xl max-w-4xl mx-auto">
              Reach Your Ideal Customers on{" "}
              <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                Facebook &amp; Instagram
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Mumbai has over 8 million active Meta users. We put your business in front of exactly the right people —
              the right age, area, and interests — so every rupee of ad spend works harder.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 text-sm font-semibold text-orange-500">
              <CheckCircle className="h-4 w-4" />
              Recommended ad spend: ₹10,000–₹15,000/month · Contact us for management pricing
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button onClick={handleStartCampaign}
                className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-sm font-medium text-white hover:bg-orange-500/90 transition-colors shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                Book a Free Strategy Call <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <a href="#estimator"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-secondary px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors">
                Estimate My Reach
              </a>
            </div>
          </div>
        </section>

        {/* ── Estimator + What We Handle ── */}
        <section id="estimator" className="py-16 bg-card/10 border-t border-border/20">
          <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-start">

            {/* Left */}
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">Full-Service Meta Ads Management</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Running a profitable Meta Ads campaign isn't just hitting "Boost Post". It requires pixel setup,
                audience strategy, creative testing, and weekly optimisation. We handle all of it.
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
                Reach Estimator
              </div>
              <h3 className="font-heading text-2xl font-bold tracking-tight">Estimate Your Audience Reach</h3>
              <p className="mt-1.5 text-xs text-muted-foreground">Select your target audience and budget for Mumbai.</p>

              <div className="mt-6 space-y-6">
                {/* Age */}
                <div>
                  <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-orange-500" /> Target Age Group
                  </label>
                  <div className="mt-2.5 grid grid-cols-2 gap-2">
                    {Object.keys(MUMBAI_AUDIENCE).map((age) => (
                      <button key={age} onClick={() => setAgeGroup(age)}
                        className={`rounded-xl border px-3 py-3 text-xs font-medium transition-all ${ageGroup === age ? "border-orange-500 bg-orange-500/10 text-orange-500 shadow-sm" : "border-border/60 bg-background/50 hover:bg-background/80"}`}>
                        Age {age}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interest */}
                <div>
                  <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Heart className="h-4 w-4 text-orange-500" /> Interest Category
                  </label>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {[
                      { id: "general", label: "General / Broad" },
                      { id: "healthcare", label: "Healthcare" },
                      { id: "realestate", label: "Real Estate" },
                      { id: "finance", label: "Finance" },
                      { id: "food", label: "Food & Dining" },
                      { id: "fashion", label: "Fashion & Lifestyle" },
                    ].map((int) => (
                      <button key={int.id} onClick={() => setInterest(int.id)}
                        className={`rounded-full border px-4 py-2 text-xs font-medium transition-all ${interest === int.id ? "border-orange-500 bg-orange-500/10 text-orange-500 shadow-sm" : "border-border/60 bg-background/50 hover:bg-background/80"}`}>
                        {int.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spend */}
                <div>
                  <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-orange-500" /> Monthly Ad Spend (goes directly to Meta)
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
                <motion.div key={`${ageGroup}-${interest}-${spend}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground text-center mb-4">Estimated Monthly Results</p>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="font-heading text-xl font-extrabold text-foreground">{targetAudience.toLocaleString("en-IN")}</div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Mumbai Audience Size</p>
                    </div>
                    <div>
                      <div className="font-heading text-xl font-extrabold text-foreground">~{estimatedReach.toLocaleString("en-IN")}</div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Est. Reach</p>
                    </div>
                    <div>
                      <div className="font-heading text-xl font-extrabold text-foreground">~{estimatedLeads}</div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Est. Leads</p>
                    </div>
                  </div>
                  <p className="mt-3 text-[10px] text-muted-foreground text-center leading-relaxed">
                    Estimates based on Mumbai Meta CPMs. Actual results depend on creative quality and audience match.
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
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">A structured process that eliminates guesswork and delivers results from month one.</p>
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
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">Why Most Boosted Posts Waste Money</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Clicking "Boost Post" is not Meta Ads. Here's what you're missing.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "No pixel tracking", desc: "Without the Meta Pixel, you can't track website visits, leads, or purchases — so you can't optimise for what matters." },
                { title: "Audience is too broad", desc: "Boosted posts target your followers and their friends — not the specific income group or interest segment that will actually buy." },
                { title: "No retargeting", desc: "People who visited your website but didn't convert are your warmest leads. Without retargeting, you'll never reach them again." },
                { title: "Single creative, no testing", desc: "Running one image ad for weeks with zero variation is a missed optimisation. The right creative can halve your cost-per-lead." },
                { title: "Wrong campaign objective", desc: "Boosting for 'engagement' optimises for likes. You want 'leads' or 'conversions'. The wrong objective sends budget to wrong people." },
                { title: "No lookalike audiences", desc: "Meta can find people who 'look like' your best customers — but only if your pixel has enough data and you know how to set it up." },
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

        {/* ── Geo Entity Block (GEO crawler targeting) ── */}
        <section className="geo-entity-block py-10 border-t border-border/10 bg-card/5">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="text-sm text-muted-foreground leading-relaxed">
              SiteNova provides <strong>Facebook and Instagram Ads management</strong> for businesses across{" "}
              <strong>Mumbai, Thane, Mulund, Bhandup, Andheri, Bandra, Ghatkopar, Vikhroli, Kurla, Dadar, Lower Parel, Powai</strong>,
              and surrounding areas. We run targeted Meta Ads campaigns for doctors, restaurants, fashion brands,
              real estate agents, finance professionals, and service businesses — helping Mumbai companies grow
              their audience and generate consistent leads through Facebook and Instagram advertising.
            </p>
          </div>
        </section>

        {/* ── Ads CTA ── */}
        <section className="py-24 border-t border-orange-500/20 bg-gradient-to-br from-orange-500/8 via-transparent to-amber-500/5">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/25 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-500 mb-6">
              <Megaphone className="h-3.5 w-3.5" /> Free Strategy Call
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight">
              Ready to Grow on <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">Facebook &amp; Instagram?</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Book a free 30-minute strategy call. We'll map your audience, review your current social presence, and show you exactly what a Meta Ads campaign would deliver for your business.
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
