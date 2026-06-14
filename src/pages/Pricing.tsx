import { useEffect } from "react";
import { m as motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";

const pricingTiers = [
  {
    name: "Starter",
    price: "₹10,000",
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
    ctaText: "Get Started",
    popular: false,
  },
  {
    name: "Business",
    price: "₹12,000",
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
    ctaText: "Choose Business",
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
      "Dedicated 24/7 Support",
      "Unlimited Revisions during dev",
    ],
    ctaText: "Request Quote",
    popular: false,
  },
];

const Pricing = () => {
  useEffect(() => {
    // any jsonLd can be added here
  }, []);

  return (
    <PageTransition>
      <SEO 
        title="Website Design Pricing in Mumbai | SiteNova — Plans Starting ₹10,000 Onwards"
        description="Transparent website design pricing in Mumbai. SiteNova plans start from ₹10,000 onwards for landing pages, ₹12,000 onwards for business sites, and custom quotes for e-commerce and web apps."
        canonicalUrl="/pricing"
        keywords={["website pricing Mumbai", "web design cost Mumbai", "affordable web design Mumbai", "website package India", "web design 10000 onwards"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "name": "SiteNova",
          "url": "https://sitenova.dev/pricing",
          "priceRange": "₹10,000+",
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Website Design Packages",
            "itemListElement": [
              {
                "@type": "Offer",
                "name": "Starter Website",
                "description": "Single-page landing page or portfolio",
                "price": "10000",
                "priceCurrency": "INR",
                "priceSpecification": { "@type": "PriceSpecification", "minPrice": "10000", "priceCurrency": "INR" }
              },
              {
                "@type": "Offer",
                "name": "Business Website",
                "description": "Multi-page business website with SEO and CMS",
                "price": "12000",
                "priceCurrency": "INR",
                "priceSpecification": { "@type": "PriceSpecification", "minPrice": "12000", "priceCurrency": "INR" }
              }
            ]
          }
        }}
      />
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <header>
          <Navbar />
        </header>
        <main className="flex-1 pt-24 pb-20">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
            <span className="text-sm font-medium text-primary uppercase tracking-widest">
              Simple Pricing
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mt-3 mb-6 tracking-tight">
              Honest pricing for <span className="gradient-text">every business</span>
            </h1>
            <p className="max-w-2xl mx-auto text-muted-foreground text-lg leading-relaxed">
              No hidden fees, no surprises. Choose the plan that fits your goals, and let’s build something incredible together.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={`relative flex flex-col glass-card p-8 rounded-3xl interactive-card ${
                  tier.popular ? "border-primary/50 shadow-[0_0_30px_-15px_hsl(var(--primary))]" : ""
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="font-heading text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-muted-foreground text-sm min-h-[40px]">{tier.description}</p>
                </div>
                
                <div className="mb-8 pb-8 border-b border-border/50">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-4xl font-bold font-heading">{tier.price}</span>
                    {tier.priceLabel && (
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
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all button-shimmer ${
                    tier.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 glow-effect"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {tier.ctaText}
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            ))}
          </div>

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
