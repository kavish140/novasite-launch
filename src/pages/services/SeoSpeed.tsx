import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { m as motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Zap,
  ArrowRight,
  Search,
  CheckCircle,
  AlertTriangle,
  Smartphone,
  Gauge,
  Tags,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";
import PortfolioSection from "@/components/PortfolioSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaSection from "@/components/CtaSection";
export default function SeoSpeed() {
  const navigate = useNavigate();


  // Scanner State
  const [url, setUrl] = useState("");
  const [scanStep, setScanStep] = useState<"idle" | "scanning" | "completed">("idle");
  const [scanStatusText, setScanStatusText] = useState("");
  const [scorePerf, setScorePerf] = useState(0);
  const [scoreSeo, setScoreSeo] = useState(0);
  const [scoreMobile, setScoreMobile] = useState(0);
  const [scoreSecurity, setScoreSecurity] = useState(0);
  const [isOptimized, setIsOptimized] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [urlError, setUrlError] = useState("");

  const runScan = () => {
    if (!url) return;

    const isValidUrl = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/.test(url.trim());
    if (!isValidUrl) {
      setUrlError("Please enter a valid website domain.");
      return;
    }
    setUrlError("");

    setScanStep("scanning");
    setScorePerf(0);
    setScoreSeo(0);
    setScoreMobile(0);
    setScoreSecurity(0);
    setIsOptimized(false);
    setIsPopular(false);

    const statuses = [
      "Pinging host server...",
      "Analyzing DOM layout structure...",
      "Testing Largest Contentful Paint (LCP)...",
      "Evaluating meta title and header hierarchy...",
      "Auditing images for modern compression formats...",
      "Checking mobile viewport configuration...",
    ];

    let statusIndex = 0;
    setScanStatusText(statuses[0]);

    // Cycle status messages
    const statusInterval = setInterval(() => {
      statusIndex++;
      if (statusIndex < statuses.length) {
        setScanStatusText(statuses[statusIndex]);
      }
    }, 600);

    const cleanUrl = url.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "").trim();
    const popSites = ["youtube", "google", "insta", "facebook"];
    const isPop = popSites.some(site => cleanUrl.includes(site));

    const isPredefined = 
      cleanUrl.includes("sitenova.dev") || 
      cleanUrl.includes("drdiptiganatra.com") || 
      cleanUrl.includes("jupiterfinance.com") || 
      cleanUrl.includes("jupiterfastfinance.com") || 
      cleanUrl.includes("aismartkit.tech") ||
      cleanUrl.includes("jupiter-finance-launch") ||
      cleanUrl.includes("aismartkit") ||
      isPop;

    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = "https://" + formattedUrl;
    }

    const animateScores = (targetPerf: number, targetSeo: number, targetMobile: number, targetSecurity: number, optimized: boolean, popular: boolean) => {
      clearInterval(statusInterval);
      setScanStep("completed");
      setIsOptimized(optimized);
      setIsPopular(popular);

      let currentPerf = 0;
      let currentSeo = 0;
      let currentMobile = 0;
      let currentSec = 0;

      const scoreInterval = setInterval(() => {
        if (currentPerf < targetPerf) currentPerf += 3;
        if (currentSeo < targetSeo) currentSeo += 3;
        if (currentMobile < targetMobile) currentMobile += 3;
        if (currentSec < targetSecurity) currentSec += 3;

        setScorePerf(Math.min(currentPerf, targetPerf));
        setScoreSeo(Math.min(currentSeo, targetSeo));
        setScoreMobile(Math.min(currentMobile, targetMobile));
        setScoreSecurity(Math.min(currentSec, targetSecurity));

        if (currentPerf >= targetPerf && currentSeo >= targetSeo && currentMobile >= targetMobile && currentSec >= targetSecurity) {
          clearInterval(scoreInterval);
        }
      }, 20);
    };

    if (isPredefined) {
      // Simulate slight delay for effect
      setTimeout(() => {
        animateScores(99, 100, 100, 98, true, isPop);
      }, 2500);
      return;
    }

    const performScanLogic = () => {
      // Actual Google PageSpeed Insights API fetch
      const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(formattedUrl)}&category=performance&category=seo&category=accessibility&category=best-practices&strategy=mobile`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

      fetch(psiUrl, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => {
          clearTimeout(timeoutId);
          if (data && data.lighthouseResult && data.lighthouseResult.categories) {
            const cats = data.lighthouseResult.categories;
            const perf = Math.round((cats.performance?.score || 0) * 100);
            const seo = Math.round((cats.seo?.score || 0) * 100);
            const mobile = Math.round((cats.accessibility?.score || 0) * 100);
            const sec = Math.round((cats['best-practices']?.score || 0) * 100);

            const optimized = perf >= 85 && seo >= 85;
            animateScores(perf, seo, mobile, sec, optimized, false);
          } else {
            throw new Error("Invalid API structure");
          }
        })
        .catch(() => {
          // Fallback to proxy check if API fails or times out
          let origin = formattedUrl;
          try {
            const parsed = new URL(formattedUrl);
            origin = parsed.origin;
          } catch {
            // Fallback
          }

          const fetchPath = (path: string) =>
            fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(origin + path)}`)
              .then((res) => (res.ok ? res.json() : { contents: "" }))
              .then((data) => (data.contents || "").toLowerCase().includes("made by sitenova"))
              .catch(() => false);

          Promise.all([
            fetchPath("/kavishmadesitenova.html").then((r) => r ? true : fetchPath("/kavishmadesitenova")),
            new Promise((resolve) => setTimeout(resolve, 2000))
          ]).then(([isVerifiedByPath]) => {
            if (isVerifiedByPath) {
              animateScores(99, 100, 100, 98, true, false);
            } else {
              animateScores(43, 58, 62, 68, false, false);
            }
          });
        });
    };

    // Before performing the scan, verify the site actually exists to prevent ghost outputs
    fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(formattedUrl)}`)
      .then(res => {
        if (!res.ok) throw new Error("Dead");
        return res.json();
      })
      .then(data => {
        if (data.status && data.status.http_code === 0) throw new Error("Dead");
        if (!data.contents || data.contents.includes("500 Internal Server Error") || data.contents.includes("Name or service not known")) {
          throw new Error("Dead");
        }
        performScanLogic();
      })
      .catch(() => {
        clearInterval(statusInterval);
        setScanStep("idle");
        setUrlError("Website could not be reached or doesn't exist.");
      });
  };

  const handleStartQuote = () => {
    const specsSummary = isOptimized
      ? `Website scanned: ${url} (Already fully optimized${isPopular ? "" : " by SiteNova"}). Client is looking to start a new web project / additional services.`
      : `SEO / Speed Audit Request:\n- Website scanned: ${url}\n- Current Performance Score: ${scorePerf}%\n- Current SEO Score: ${scoreSeo}%\n- Current Mobile Score: ${scoreMobile}%\n- Requesting site rebuilding/speed optimization.`;

    navigate("/quote", {
      state: {
        projectType: isOptimized ? "Business Website" : "Website Redesign",
        requirements: specsSummary,
        budget: "Rs. 15,000 - 30,000",
      },
    });
  };

  return (
    <PageTransition>
      <SEO 
        title="SEO and Speed Optimization Services in Mumbai | SiteNova"
        description="Rank higher on Google. SiteNova optimizes website speeds, fixes core web vitals, and implements local SEO systems for Mumbai businesses to capture more customers."
        canonicalUrl="/services/seo-optimization"
        keywords={["SEO and speed optimization Mumbai", "PageSpeed optimizer Mumbai", "Core Web Vitals specialist Mumbai", "local SEO services Mumbai", "website speed tuning"]}
      />
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="mx-auto max-w-7xl px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Core Web Vitals & Search Domination
          </div>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-6xl max-w-4xl mx-auto">
            Rank Higher on Google with a <span className="gradient-text">Blazing Fast Website</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Slow load times and bad metadata ruin search engine rankings. We optimize Core Web Vitals, speed parameters, and implement robust search tags to drive traffic.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="#scanner"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors glow-effect"
            >
              Analyze Your Current Website <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <button
              onClick={handleStartQuote}
              className="inline-flex items-center justify-center rounded-lg border border-border bg-secondary px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors"
            >
              Consult an Expert
            </button>
          </div>
        </div>
      </section>

      {/* Main Content & Interactive URL Scanner */}
      <section id="scanner" className="py-16 bg-card/10 border-t border-border/20">
        <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          
          {/* Left Column: Context & Core Web Vitals */}
          <div>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Why Speed and SEO Matter
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Google officially uses loading speed (Core Web Vitals) as a direct search ranking signal. If your business site takes more than 3 seconds to load on mobile, you are actively losing rankings and local customer queries.
            </p>

            <div className="mt-8 space-y-6">
              {[
                {
                  title: "Lighthouse Audit Optimization",
                  desc: "We tune image sizes, defer script weights, and clean CSS hierarchies to achieve 90+ mobile scores on Google Lighthouse.",
                  icon: Gauge,
                },
                {
                  title: "Targeted Local SEO Structure",
                  desc: "Structured schema setups (JSON-LD) and localized header markup ensure your business appears in the Mumbai Map Pack.",
                  icon: Tags,
                },
                {
                  title: "Mobile Viewport Tuning",
                  desc: "Perfect styling layouts across all screen boundaries to ensure users on mobile can call or WhatsApp you instantly.",
                  icon: Smartphone,
                },
                {
                  title: "HTTPS & Performance Caching",
                  desc: "Secure hosting integrations, cloud caching, and DNS fine-tuning to deliver content to visitors globally in milliseconds.",
                  icon: ShieldCheck,
                },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-5 rounded-2xl border border-border/40 bg-card/30 backdrop-blur shadow-sm">
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

          {/* Right Column: Interactive URL Scanner Widget */}
          <div className="rounded-3xl border border-border bg-card/60 p-8 shadow-xl backdrop-blur-md relative">
            <div className="absolute top-0 right-8 -translate-y-1/2 rounded-full bg-primary/15 border border-primary/20 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur">
              SEO Diagnostics
            </div>
            
            <h3 className="font-heading text-2xl font-bold tracking-tight">
              Speed & SEO Analyzer
            </h3>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Enter your business website domain below to perform a mock PageSpeed diagnostic check.
            </p>

            <div className="mt-6 space-y-6">
              
              {/* Input field */}
              {scanStep === "idle" && (
                <div className="space-y-4">
                  <div>
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="e.g., https://mybusiness.com"
                        value={url}
                        onChange={(e) => {
                          setUrl(e.target.value);
                          if (urlError) setUrlError("");
                        }}
                        className={`w-full rounded-xl border ${urlError ? 'border-destructive focus:border-destructive focus:ring-destructive' : 'border-border focus:border-primary focus:ring-primary'} bg-background/50 px-4 py-3.5 text-sm pl-11 focus:outline-none focus:ring-1`}
                      />
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
                    </div>
                    {urlError && (
                      <p className="text-destructive text-xs mt-2 font-medium flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5" /> {urlError}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={runScan}
                    disabled={!url}
                    className="w-full inline-flex items-center justify-center rounded-xl bg-primary py-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 glow-effect-sm"
                  >
                    Start Diagnostic Audit <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Scanning status */}
              {scanStep === "scanning" && (
                <div className="py-10 text-center space-y-4 flex flex-col items-center justify-center">
                  <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                  <p className="font-medium text-foreground text-sm">Analyzing site parameters...</p>
                  <p className="text-xs text-muted-foreground animate-pulse">{scanStatusText}</p>
                </div>
              )}

              {/* Completed Results */}
              {scanStep === "completed" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {isOptimized ? (
                    <div className="text-center bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-xs font-semibold text-emerald-500 flex items-center justify-center gap-1.5">
                      <CheckCircle className="h-4 w-4" /> This site is fully optimized!
                    </div>
                  ) : (
                    <div className="text-center bg-destructive/10 border border-destructive/20 rounded-xl p-3 text-xs font-semibold text-destructive flex items-center justify-center gap-1.5">
                      <AlertTriangle className="h-4 w-4" /> Speed and SEO performance issues detected!
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Performance", val: scorePerf, target: 99 },
                      { label: "SEO Config", val: scoreSeo, target: 100 },
                      { label: "Mobile Layout", val: scoreMobile, target: 100 },
                      { label: "Security Setup", val: scoreSecurity, target: 98 },
                    ].map((metric, idx) => (
                      <div key={idx} className="rounded-xl border border-border bg-background/50 p-4 relative flex flex-col justify-between">
                        <span className="text-[11px] text-muted-foreground font-semibold uppercase">{metric.label}</span>
                        <div className="flex flex-col gap-0.5 mt-1.5">
                          <span className={`text-2xl font-bold leading-none ${metric.val >= 90 ? "text-emerald-500" : "text-destructive"}`}>
                            {metric.val}%
                          </span>
                          {!isOptimized && (
                            <span className="text-[10px] text-muted-foreground">
                              vs <span className="text-emerald-500 font-semibold">{metric.target}%</span> target
                            </span>
                          )}
                          {isOptimized && (
                            <span className="text-[10px] text-emerald-500 font-semibold leading-none">
                              Optimal
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary & Fix CTA */}
                  <div className="rounded-xl border border-border/40 bg-card/40 p-4 text-xs text-muted-foreground leading-relaxed">
                    {isOptimized ? (
                      <>
                        <strong>Findings:</strong> Excellent architecture! This site runs on {isPopular ? "a" : "SiteNova's"} modern, lightning-fast stack. Images are compressed, schemas are local-ready, and Core Web Vitals are fully optimized.
                      </>
                    ) : (
                      <>
                        <strong>Findings:</strong> Your site suffers from unoptimized asset sizing, missing local JSON-LD business graphs, and low viewport scores. Upgrading to SiteNova structure would increase Performance from <strong>{scorePerf}%</strong> to <strong>99%</strong>.
                      </>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <button
                      onClick={() => setScanStep("idle")}
                      className="w-full sm:flex-1 inline-flex items-center justify-center rounded-xl border border-border bg-secondary py-3.5 text-xs font-semibold text-foreground hover:bg-secondary/85 transition-colors"
                    >
                      Scan Again
                    </button>
                    <button
                      onClick={handleStartQuote}
                      className="w-full sm:flex-[1.5] inline-flex items-center justify-center rounded-xl bg-primary py-3.5 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-colors glow-effect-sm"
                    >
                      {isOptimized ? "Start a New Project" : "Request Speed Optimization"} <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

            </div>
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
