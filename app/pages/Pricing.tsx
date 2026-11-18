import BookingCTA from "@/components/BookingCTA";
import { m as motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link, useLoaderData } from "react-router";
import { formatINR, type PackageCatalog, type PaymentPackage } from "@/lib/payments";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import PageTransition from "@/components/PageTransition";
import {usePackagePricing} from "@/lib/package-pricing";

const pricingTiers = [
  {
    name: "Starter",
    priceLabel: "onwards",
    description: "Perfect for single-page landing pages and simple portfolios.",
    features: [
      "Custom Design (No Templates)",
      "Mobile-First Responsive Design",
      "Basic SEO Optimization",
      "Fast Load Times",
      "Contact Form Integration",
      "1 Revision Included",
    ],
    ctaText: "Discuss this package",
    popular: false,
  },
  {
    name: "Business",
    priceLabel: "onwards",
    description: "Ideal for local businesses needing a multi-page presence.",
    features: [
      "Up to 5 Pages (Home, About, Services, etc.)",
      "Advanced SEO Setup",
      "CMS Integration (Easy Updates)",
      "Google Business Profile Sync",
      "WhatsApp Chat Widget",
      "Priority Email Support",
      "3 Revisions Included",
    ],
    ctaText: "Discuss this package",
    popular: true,
  },
  {
    name: "Premium",
    price: "Custom Quote",
    priceLabel: "",
    description: "For e-commerce, web apps, and complex requirements.",
    features: [
      "Unlimited Pages",
      "E-Commerce / Payment Gateway",
      "User Authentication & Dashboards",
      "Advanced Animations & Interactions",
      "Custom API Integrations",
      "Support scope agreed upfront",
      "Unlimited Revisions during dev",
    ],
    ctaText: "Request Quote",
    popular: false,
  },
];

const Pricing = () => {
  const {checkoutOrigin}=usePackagePricing();
  const { paymentsEnabled, packages,pricingAvailable=true } = useLoaderData<{ paymentsEnabled: boolean; packages: PackageCatalog;pricingAvailable?:boolean }>();

  return (
    <PageTransition>
      <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "name": "SiteNova",
          "url": "https://sitenova.dev/pricing",
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Website Design Packages",
            "itemListElement": [
              {
                "@type": "Offer",
                "name": "Starter Website",
                "description": "Single-page landing page or portfolio",
                ...(pricingAvailable?{"price":String(packages.starter.startingPrice/100)}:{}),
                "priceCurrency": "INR",
                ...(pricingAvailable?{"priceSpecification": { "@type": "PriceSpecification", "minPrice": String(packages.starter.startingPrice/100), "priceCurrency": "INR" }}:{})
              },
              {
                "@type": "Offer",
                "name": "Business Website",
                "description": "Multi-page business website with SEO and CMS",
                ...(pricingAvailable?{"price":String(packages.business.startingPrice/100)}:{}),
                "priceCurrency": "INR",
                ...(pricingAvailable?{"priceSpecification": { "@type": "PriceSpecification", "minPrice": String(packages.business.startingPrice/100), "priceCurrency": "INR" }}:{})
              }
            ]
          }
        }} />
      <div className="studio-page studio-pricing min-h-screen bg-background text-foreground flex flex-col">
        <header>
          <Navbar />
        </header>
        <main className="flex-1 pt-24 pb-20">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="studio-pricing-intro mb-16"
            >
            <span className="text-sm font-medium text-primary uppercase tracking-widest">
              The right starting point
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mt-3 mb-6 tracking-tight">
              A clear investment.<br /><span className="gradient-text">A better website.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-muted-foreground text-lg leading-relaxed">
              Start with the package that fits your business. We agree the scope, final price, and delivery schedule before the build begins.
            </p>
          </motion.div>

          <div className="studio-pricing-grid grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={`studio-price-card relative flex flex-col glass-card p-8 rounded-3xl ${
                  tier.popular ? "studio-price-card-featured" : ""
                }`}
              >
                {tier.popular && (
                  <div className="studio-price-recommendation">
                    <span>
                      Recommended for growing businesses
                    </span>
                  </div>
                )}
                
                <div className="mb-6">
                  <p className="studio-price-number">0{i + 1} / {tier.name === "Premium" ? "Made to measure" : "Website package"}</p>
                  <h2 className="font-heading text-2xl font-bold mb-2">{tier.name}</h2>
                  <p className="text-muted-foreground text-sm min-h-[40px]">{tier.description}</p>
                </div>
                
                <div className="mb-8 pb-8 border-b border-border/50">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-4xl font-bold font-heading">{tier.name==="Premium"?tier.price:pricingAvailable?formatINR(packages[tier.name.toLowerCase() as PaymentPackage].startingPrice):"Request a quote"}</span>
                    {tier.priceLabel && pricingAvailable && (
                      <span className="text-base font-semibold text-primary">{tier.priceLabel}</span>
                    )}
                  </div>
                  {tier.price === "Custom Quote" && (
                    <p className="text-xs text-muted-foreground mt-1">Scoped to your project</p>
                  )}
                </div>
                
                <ul className="flex-1 space-y-4 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/90 leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  to="/quote"
                  state={{ packageName: tier.name, projectType: tier.name === "Starter" ? "Landing Page" : tier.name === "Business" ? "Business Website" : undefined }}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all button-shimmer ${
                    tier.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 glow-effect btn-quote-pulse"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {tier.ctaText}
                  <ArrowRight size={16} />
                </Link>
                {paymentsEnabled && tier.name !== "Premium" && (
                  <Link reloadDocument to={`${checkoutOrigin}/pay?package=${tier.name.toLowerCase()}`} className="mt-4 text-center text-sm font-semibold text-primary underline underline-offset-4">
                    Ready to proceed? Pay {formatINR(packages[tier.name.toLowerCase() as PaymentPackage].advance)} advance
                  </Link>
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8"><BookingCTA source="pricing" /></div>
          <section className="mx-auto mt-8 max-w-4xl rounded-xl border border-border p-5 text-sm" aria-labelledby="payment-plan"><h2 id="payment-plan" className="font-semibold">How payment fits into your project</h2><p className="mt-2 text-muted-foreground">Discuss your needs → agree the proposal and scope → pay your advance → follow project progress → pay the remaining balance. Your advance counts toward the agreed total. Payment and project links let you check status and recover an interrupted checkout.</p><div className="mt-4 flex flex-wrap gap-5"><Link to="/payments" className="underline">Payment options & recovery</Link><Link to="/free-audit" className="underline">Have a website already? Get a free audit</Link></div></section>
          {/* FAQ Teaser */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-24 max-w-3xl mx-auto text-center p-8 rounded-3xl border border-border/50 bg-secondary/20 backdrop-blur-sm"
          >
            <h3 className="font-heading text-2xl font-bold mb-3">Have specific requirements?</h3>
            <p className="text-muted-foreground mb-6">
              We understand that every project is unique. If you need a custom package or have questions about what's included, let's talk.
            </p>
            <Link
              to="/quote"
              className="inline-flex items-center gap-2 rounded-lg bg-background border border-border px-6 py-2.5 text-sm font-medium hover:bg-secondary transition-colors"
            >
              Contact for details
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
      </div>
    </PageTransition>
  );
};

export default Pricing;
