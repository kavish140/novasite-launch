import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { m as motion } from "framer-motion";
import {
  ShoppingCart,
  Check,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Zap,
  CreditCard,
  Package,
  Layers,
  Percent,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { setPageSeo } from "@/lib/seo";

export default function Ecommerce() {
  const navigate = useNavigate();

  // SEO
  useEffect(() => {
    setPageSeo({
      title: "E-commerce Website Design Services in Mumbai | SiteNova",
      description:
        "Build a high-converting online shop. SiteNova designs custom e-commerce stores in Mumbai with Razorpay/Stripe, coupon systems, and fast checkout workflows.",
      canonicalPath: "/services/ecommerce",
      keywords: [
        "e-commerce web design Mumbai",
        "online store developer Mumbai",
        "Shopify developer Mumbai",
        "WooCommerce website designer",
        "custom e-commerce development",
      ],
    });
  }, []);

  // Estimator State
  const [platform, setPlatform] = useState<"woocommerce" | "shopify" | "custom">("woocommerce");
  const [productsCount, setProductsCount] = useState<"small" | "medium" | "large">("small");
  const [gateways, setGateways] = useState<string[]>(["razorpay"]);
  const [features, setFeatures] = useState<string[]>(["coupons"]);

  // Calculate Price
  const calculatePrice = () => {
    let base = 15000;

    // Platform
    if (platform === "shopify") base += 5000;
    if (platform === "custom") base += 20000;

    // Products
    if (productsCount === "medium") base += 8000;
    if (productsCount === "large") base += 15000;

    // Gateways
    gateways.forEach((gw) => {
      if (gw === "stripe") base += 3000;
      if (gw === "razorpay") base += 2000;
      if (gw === "cod") base += 1000;
    });

    // Features
    features.forEach((feat) => {
      if (feat === "coupons") base += 1500;
      if (feat === "inventory") base += 3000;
      if (feat === "accounts") base += 2500;
      if (feat === "multicurrency") base += 3000;
    });

    return base;
  };

  const toggleGateway = (gw: string) => {
    if (gateways.includes(gw)) {
      setGateways(gateways.filter((item) => item !== gw));
    } else {
      setGateways([...gateways, gw]);
    }
  };

  const toggleFeature = (feat: string) => {
    if (features.includes(feat)) {
      setFeatures(features.filter((item) => item !== feat));
    } else {
      setFeatures([...features, feat]);
    }
  };

  const handleStartQuote = () => {
    const specsSummary = `E-commerce Project Details:
- Platform: ${platform === "woocommerce" ? "WooCommerce/WordPress" : platform === "shopify" ? "Shopify" : "Custom React/Next.js"}
- Product Range: ${productsCount === "small" ? "Under 50 products" : productsCount === "medium" ? "50 - 500 products" : "500+ products"}
- Gateways: ${gateways.join(", ")}
- Features: ${features.join(", ")}
- Mock Estimate: Rs. ${calculatePrice().toLocaleString("en-IN")}`;

    navigate("/quote", {
      state: {
        projectType: "E-commerce Store",
        requirements: specsSummary,
        budget: calculatePrice() > 30000 ? "Rs. 30,000+" : "Rs. 15,000 - 30,000",
      },
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="mx-auto max-w-7xl px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            High-Performance E-commerce
          </div>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-6xl max-w-4xl mx-auto">
            Launch Your Brand in Mumbai with an Online <span className="gradient-text">Store That Sells</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Turn visitors into buyers. SiteNova builds super-fast, conversion-focused e-commerce storefronts tailored to capture customers across Mumbai and globally.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              onClick={handleStartQuote}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors glow-effect"
            >
              Get Custom Quote <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <a
              href="#estimator"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-secondary px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors"
            >
              Price Calculator
            </a>
          </div>
        </div>
      </section>

      {/* Main Content & Estimator */}
      <section id="estimator" className="py-16 bg-card/10 border-t border-border/20">
        <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-start">
          
          {/* Left Column: Context & Benefits */}
          <div>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Why SiteNova for E-commerce?
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Most online shops lose 70% of potential buyers due to slow page loads and complex checkouts. We custom engineer websites to resolve those bottlenecks.
            </p>

            <div className="mt-8 space-y-6">
              {[
                {
                  title: "Instant Loading & SEO Power",
                  desc: "Google ranks fast stores higher. Our code setup optimizes every layout for max speed and local search ranking.",
                  icon: Zap,
                },
                {
                  title: "Secure Payment Integrations",
                  desc: "Easy configuration of secure payment gateways like Razorpay, PayU, Paytm, and Stripe for global credit card acceptance.",
                  icon: CreditCard,
                },
                {
                  title: "Admin-Friendly Catalog",
                  desc: "Add items, update stock details, change pricing, and handle discount codes yourself with zero coding knowledge required.",
                  icon: Package,
                },
                {
                  title: "Mobile First Checkout",
                  desc: "Over 80% of local Mumbai traffic buys via smartphones. Our checkout process is built to load instantly on any mobile device.",
                  icon: ShoppingCart,
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

          {/* Right Column: Interactive Estimator Widget */}
          <div className="rounded-3xl border border-border bg-card/60 p-8 shadow-xl backdrop-blur-md relative">
            <div className="absolute top-0 right-8 -translate-y-1/2 rounded-full bg-primary/15 border border-primary/20 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur">
              Real-time Quote
            </div>
            
            <h3 className="font-heading text-2xl font-bold tracking-tight">
              Project Cost Estimator
            </h3>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Select your specifications below for an instant custom estimate.
            </p>

            <div className="mt-6 space-y-6">
              
              {/* Platforms */}
              <div>
                <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-primary" /> E-commerce Platform
                </label>
                <div className="mt-2.5 grid grid-cols-3 gap-2">
                  {[
                    { id: "woocommerce" as const, label: "WordPress" },
                    { id: "shopify" as const, label: "Shopify" },
                    { id: "custom" as const, label: "Custom App" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPlatform(p.id)}
                      className={`rounded-xl border px-3 py-3 text-xs font-medium transition-all ${
                        platform === p.id
                          ? "border-primary bg-primary/5 text-primary shadow-sm"
                          : "border-border/60 bg-background/50 hover:bg-background/80"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products range */}
              <div>
                <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <Package className="h-4 w-4 text-primary" /> Product Catalog Size
                </label>
                <div className="mt-2.5 grid grid-cols-3 gap-2">
                  {[
                    { id: "small" as const, label: "< 50 products" },
                    { id: "medium" as const, label: "50 - 500" },
                    { id: "large" as const, label: "500+" },
                  ].map((pr) => (
                    <button
                      key={pr.id}
                      onClick={() => setProductsCount(pr.id)}
                      className={`rounded-xl border px-3 py-3 text-xs font-medium transition-all ${
                        productsCount === pr.id
                          ? "border-primary bg-primary/5 text-primary shadow-sm"
                          : "border-border/60 bg-background/50 hover:bg-background/80"
                      }`}
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gateways */}
              <div>
                <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4 text-primary" /> Payment Gateways
                </label>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {[
                    { id: "razorpay", label: "Razorpay / Paytm" },
                    { id: "stripe", label: "Stripe (International)" },
                    { id: "cod", label: "Cash on Delivery" },
                  ].map((gw) => {
                    const active = gateways.includes(gw.id);
                    return (
                      <button
                        key={gw.id}
                        onClick={() => toggleGateway(gw.id)}
                        className={`rounded-full border px-4 py-2 text-xs font-medium transition-all flex items-center gap-1.5 ${
                          active
                            ? "border-primary bg-primary/5 text-primary shadow-sm"
                            : "border-border/60 bg-background/50 hover:bg-background/80"
                        }`}
                      >
                        {active && <Check className="h-3 w-3" />}
                        {gw.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Advanced Features */}
              <div>
                <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-primary" /> Features & Modules
                </label>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {[
                    { id: "coupons", label: "Coupons & Discounts", icon: Percent },
                    { id: "inventory", label: "Stock Management", icon: Package },
                    { id: "accounts", label: "Customer Portals", icon: ShieldCheck },
                    { id: "multicurrency", label: "Multi-currency Support", icon: CreditCard },
                  ].map((feat) => {
                    const active = features.includes(feat.id);
                    return (
                      <button
                        key={feat.id}
                        onClick={() => toggleFeature(feat.id)}
                        className={`rounded-xl border px-3.5 py-2.5 text-xs font-medium transition-all flex items-center gap-2 ${
                          active
                            ? "border-primary bg-primary/5 text-primary shadow-sm"
                            : "border-border/60 bg-background/50 hover:bg-background/80"
                        }`}
                      >
                        <feat.icon className={`h-3.5 w-3.5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                        <span>{feat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Estimate Output */}
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 mt-6 text-center">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Estimated Setup Cost</span>
                <div className="mt-1 font-heading text-4xl font-extrabold text-foreground">
                  Rs. {calculatePrice().toLocaleString("en-IN")}
                  <span className="text-sm font-normal text-muted-foreground"> onwards</span>
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground leading-relaxed">
                  Includes development, theme layout setup, database/checkout wiring, and 1 month support. Excludes platform hosting (e.g. Shopify plan).
                </p>
              </div>

              {/* Submit CTA */}
              <button
                onClick={handleStartQuote}
                className="w-full inline-flex items-center justify-center rounded-xl bg-primary py-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors glow-effect-sm"
              >
                Send These Specs to Developer <ArrowRight className="ml-2 h-4 w-4" />
              </button>

            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
