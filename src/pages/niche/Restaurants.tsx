import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { m as motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  UtensilsCrossed,
  ShieldCheck,
  CalendarDays,
  MenuSquare,
  MessageCircle,
  Smartphone,
  Phone,
  Mail,
  CheckCircle,
  TrendingUp,
  Quote,
  Star,
  ExternalLink,
  BadgeCheck,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { trackNichePageView, trackWhatsAppClick, trackPhoneClick } from "@/lib/analytics";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";
import { buildWhatsAppUrl, PHONE_TEL_LINK, EMAIL_COMPOSE_LINK, EMAIL, PHONE_NUMBER } from "@/lib/constants";

const emailComposeLink =
  `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}&su=Restaurant%20Website%20Inquiry%20from%20SiteNova`;

const features = [
  {
    icon: MenuSquare,
    title: "Digital Menu Integration",
    description:
      "Beautiful, mobile-friendly digital menus that are easy to read and update without uploading clunky PDFs.",
  },
  {
    icon: CalendarDays,
    title: "Table Reservation Forms",
    description:
      "Allow guests to book a table directly on your website. Synced seamlessly to your email or WhatsApp.",
  },
  {
    icon: UtensilsCrossed,
    title: "Stunning Food Galleries",
    description:
      "People eat with their eyes first. We design immersive image galleries that showcase your best dishes in high resolution.",
  },
  {
    icon: ShieldCheck,
    title: "Local SEO & Google Maps",
    description:
      "Integrated directly with Google Business Profile so when locals search for 'best restaurant near me', they find you.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp & Swiggy/Zomato Links",
    description:
      "Direct your customers to order via WhatsApp, Swiggy, or Zomato with clear, sticky call-to-action buttons.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description:
      "Over 90% of restaurant searches happen on mobile devices on the go. Your site will load instantly and look perfect on every screen.",
  },
];

const problemPoints = [
  {
    title: "PDF Menus Frustrate Customers",
    description:
      "Making hungry customers pinch and zoom on a PDF menu on their phone is a bad experience. You need a native digital menu.",
  },
  {
    title: "Losing Control to Aggregators",
    description:
      "Relying solely on Zomato or Swiggy means giving up massive commissions. Your own website helps you drive direct orders and reservations.",
  },
  {
    title: "Poor First Impressions",
    description:
      "If your website looks outdated, customers might assume your restaurant is too. A stunning website reflects the quality of your food.",
  },
];

export default function Restaurants() {
  const navigate = useNavigate();

  useEffect(() => {
    trackNichePageView("restaurants");
  }, []);

  const handleGetMockup = () => {
    navigate("/quote", {
      state: {
        projectType: "Business Website",
        requirements: "Restaurant/Cafe website for my business",
      },
    });
  };

  return (
    <PageTransition>
      <SEO 
        title="Professional Websites for Restaurants & Cafes in Mumbai | SiteNova"
        description="SiteNova builds stunning, mouth-watering websites for restaurants, cafes, and cloud kitchens in Mumbai. Digital menus, reservations, and local SEO."
        canonicalUrl="/websites-for-restaurants"
        keywords={["restaurant website design Mumbai", "cafe website developer", "cloud kitchen website", "digital menu website", "food business web design"]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Websites for Restaurants and Cafes",
            "provider": { "@type": "ProfessionalService", "name": "SiteNova", "url": "https://sitenova.dev" },
            "areaServed": { "@type": "City", "name": "Mumbai" },
            "audience": { "@type": "Audience", "audienceType": "Restaurants, Cafes, Cloud Kitchens, Food Businesses" },
            "description": "Appetizing, mobile-optimized websites for restaurants in Mumbai featuring digital menus, table reservations, and local SEO.",
            "url": "https://sitenova.dev/websites-for-restaurants",
            "serviceType": "Restaurant Web Design"
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sitenova.dev/" },
              { "@type": "ListItem", "position": 2, "name": "Websites for Restaurants", "item": "https://sitenova.dev/websites-for-restaurants" }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Why does a restaurant need its own website?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Having your own website reduces reliance on third-party aggregators, allows you to take direct reservations without commission, presents a beautiful mobile menu, and drastically improves your local SEO ranking."
                }
              },
              {
                "@type": "Question",
                "name": "Can I update the digital menu myself?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, we can build your website with a simple Content Management System (CMS) so you can update prices, add seasonal dishes, or change specials without any coding knowledge."
                }
              },
              {
                "@type": "Question",
                "name": "Do you integrate table reservations?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, we can add custom reservation forms that send booking details directly to your email or WhatsApp, making table management effortless."
                }
              }
            ]
          }
        ]}
      />
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

      {/* ───────────────── Hero Section ───────────────── */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(239,68,68,0.12),transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[300px] rounded-full bg-red-500/5 blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="mb-6 flex justify-start">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-secondary/20 px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              <ArrowLeft size={14} />
              Back to Main Site
            </Link>
          </div>

          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-1.5 text-xs font-medium text-red-400 mb-6"
            >
              <UtensilsCrossed className="h-3.5 w-3.5" />
              Built for Restaurants & Cafes
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading text-4xl font-extrabold tracking-tight sm:text-6xl max-w-4xl mx-auto"
            >
              Turn Hungry Searchers Into{" "}
              <span className="gradient-text">Happy Diners.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Mouth-watering, mobile-first websites for restaurants in Mumbai — featuring fast-loading digital menus, direct reservations, and local SEO.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              <button
                onClick={handleGetMockup}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors glow-effect button-shimmer"
              >
                Get a Free Website Mockup
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───────────────── Problem / Agitate Section ───────────────── */}
      <section className="py-20 bg-card/10 border-t border-border/20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl max-w-3xl mx-auto">
              Food Apps Take 30% Cuts.{" "}
              <span className="gradient-text">Take Back Control.</span>
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {problemPoints.map((point, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card rounded-2xl p-6 border border-border/40 hover-glow"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400 mb-4">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-2">
                  {point.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {point.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── Features Section ───────────────── */}
      <section className="py-20 border-t border-border/20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-4">
              <TrendingUp className="h-3.5 w-3.5" />
              Everything You Need
            </div>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              What Your Restaurant Website{" "}
              <span className="gradient-text">Will Include</span>
            </h2>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="interactive-card rounded-2xl border border-border/40 bg-card/30 backdrop-blur p-6 hover-glow"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400 mb-4">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── CTA Section ───────────────── */}
      <section className="section-padding relative overflow-hidden border-t border-border/20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-red-500/8 blur-[140px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-3xl text-center"
        >
          <p className="mx-auto mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Custom Restaurant Sites starting from ₹10,000
          </p>

          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">
            Ready to Get More{" "}
            <span className="gradient-text">Direct Bookings?</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-4 max-w-xl mx-auto">
            Get a free mockup of your restaurant's website. No commitment, no payment until you're absolutely happy.
          </p>

          <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/5 px-4 py-1.5 text-xs font-medium text-green-400 mb-10">
            <ShieldCheck className="h-3.5 w-3.5" />
            Not happy? Full refund within 7 days
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <a
              href={PHONE_TEL_LINK}
              onClick={() => trackPhoneClick("/websites-for-restaurants")}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-all glow-effect button-shimmer interactive-card"
            >
              <Phone size={20} />
              {PHONE_NUMBER}
            </a>
            <a
              href={buildWhatsAppUrl("Hi, I have a restaurant and I'm interested in getting a custom website.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("/websites-for-restaurants")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-8 py-4 text-lg font-semibold text-white hover:bg-[#1ebe57] transition-all button-shimmer interactive-card"
            >
              <MessageCircle size={20} />
              WhatsApp
            </a>
          </div>

          <a
            href={emailComposeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-secondary px-8 py-4 text-lg font-semibold text-foreground hover:bg-secondary/80 transition-all button-shimmer interactive-card"
          >
            <Mail size={20} />
            {EMAIL}
          </a>

          <div className="mt-8 pt-8 border-t border-border/30">
            <button
              onClick={handleGetMockup}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors glow-effect button-shimmer"
            >
              Or Fill the Quote Form Instead
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </section>

      <Footer />
      </div>
    </PageTransition>
  );
}
