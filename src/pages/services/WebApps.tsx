import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { m as motion } from "framer-motion";
import {
  Code2,
  Check,
  ArrowRight,
  Sparkles,
  Zap,
  Users,
  Database,
  LineChart,
  MessageSquare,
  Lock,
  Boxes,
  HelpCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";
import PortfolioSection from "@/components/PortfolioSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaSection from "@/components/CtaSection";
export default function WebApps() {
  const navigate = useNavigate();


  // Tech Stack & Blueprint Modules State
  const [selectedModules, setSelectedModules] = useState<string[]>(["database", "accounts"]);

  const modulesList = [
    {
      id: "accounts",
      label: "User Accounts & Authentication",
      desc: "Secure login, registration, user profiles, and role-based permissions.",
      cost: 8000,
      icon: Users,
    },
    {
      id: "database",
      label: "Custom Database Integration",
      desc: "Structured data storage (PostgreSQL/MongoDB) with secure APIs.",
      cost: 10000,
      icon: Database,
    },
    {
      id: "dashboard",
      label: "Interactive Admin Dashboard",
      desc: "Beautiful graphs, data exports (CSV/PDF), and system analytics.",
      cost: 10000,
      icon: LineChart,
    },
    {
      id: "payments",
      label: "Subscription & Payment Setup",
      desc: "Stripe/Razorpay subscription billing, invoicing, and webhooks.",
      cost: 6000,
      icon: Lock,
    },
    {
      id: "chat",
      label: "Real-time Messaging / Chat",
      desc: "Instant customer support chat or web sockets user communication.",
      cost: 8000,
      icon: MessageSquare,
    },
    {
      id: "api",
      label: "Third-party API Integrations",
      desc: "Connection to external services like CRM, SMS gateways, or ERPs.",
      cost: 10000,
      icon: Boxes,
    },
  ];

  const toggleModule = (id: string) => {
    if (selectedModules.includes(id)) {
      setSelectedModules(selectedModules.filter((m) => m !== id));
    } else {
      setSelectedModules([...selectedModules, id]);
    }
  };

  const calculateTotalCost = () => {
    const baseCost = 30000; // Base React/Node development
    const modulesCost = selectedModules.reduce((acc, currentId) => {
      const found = modulesList.find((m) => m.id === currentId);
      return acc + (found ? found.cost : 0);
    }, 0);
    return baseCost + modulesCost;
  };

  const handleStartQuote = () => {
    const activeNames = selectedModules.map((id) => {
      return modulesList.find((m) => m.id === id)?.label || id;
    });

    const specsSummary = `Custom Web Application Project Details:
- Modules Included: ${activeNames.join(", ")}
- Blueprint Estimate: Rs. ${calculateTotalCost().toLocaleString("en-IN")}`;

    navigate("/quote", {
      state: {
        projectType: "Custom Web App",
        requirements: specsSummary,
        budget: "Rs. 30,000+",
      },
    });
  };

  return (
    <PageTransition>
      <SEO 
        title="Custom Web Application Development Services in Mumbai | SiteNova"
        description="Build custom web applications with React, Next.js, Node.js, and Databases. SiteNova designs secure, scalable dashboard and web systems in Mumbai."
        canonicalUrl="/services/web-applications"
        keywords={["custom web application developer Mumbai", "React developer Mumbai", "Nextjs developer Mumbai", "web software developer Mumbai", "dashboard development Mumbai"]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Custom Web Application Development",
            "provider": { "@type": "ProfessionalService", "name": "SiteNova", "url": "https://sitenova.dev" },
            "areaServed": { "@type": "City", "name": "Mumbai" },
            "description": "Custom web application development in Mumbai using React, Next.js, and Node.js. Dashboards, user authentication, APIs, and scalable web software.",
            "url": "https://sitenova.dev/services/web-applications",
            "serviceType": "Web Application Development"
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sitenova.dev/" },
              { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://sitenova.dev/" },
              { "@type": "ListItem", "position": 3, "name": "Web Application Development", "item": "https://sitenova.dev/services/web-applications" }
            ]
          }
        ]}
      />
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="mx-auto max-w-7xl px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Bespoke Web Software
          </div>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-6xl max-w-4xl mx-auto">
            Scale Your Business in Mumbai with a <span className="gradient-text">Custom Web Application</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Stop forcing off-the-shelf templates to work for you. We design custom SaaS platforms, admin hubs, and custom-database applications from scratch.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              onClick={handleStartQuote}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors glow-effect"
            >
              Build Blueprint <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <a
              href="#scoper"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-secondary px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors"
            >
              Interactive Scoper
            </a>
          </div>
        </div>
      </section>

      {/* Main Content & Tech Stack Scoper */}
      <section id="scoper" className="py-16 bg-card/10 border-t border-border/20">
        <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-start">
          
          {/* Left Column: Tech Stack description */}
          <div>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Clean Code, Scalable Architecture
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We design web software with future scaling in mind. Our applications load instantly, run securely, and use industry-standard web tech stacks.
            </p>

            <div className="mt-8 space-y-6">
              {[
                {
                  title: "Modern Tech Stacks",
                  desc: "We build using React, Next.js, Node.js, and TypeScript, backed by PostgreSQL, Supabase, or MongoDB databases.",
                  icon: Code2,
                },
                {
                  title: "Ironclad Security",
                  desc: "Security is non-negotiable. We integrate secure user authorization, data encryption, and protected APIs.",
                  icon: Lock,
                },
                {
                  title: "API-First Architecture",
                  desc: "We structure codebases around scalable REST or GraphQL APIs, allowing you to connect mobile apps later easily.",
                  icon: Boxes,
                },
                {
                  title: "Interactive UX/UI Designs",
                  desc: "We make complex software feel light and intuitive with tailored admin tables, searchable dashboards, and responsive interfaces.",
                  icon: LineChart,
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

          {/* Right Column: Tech Blueprint Builder */}
          <div className="rounded-3xl border border-border bg-card/60 p-8 shadow-xl backdrop-blur-md relative">
            <div className="absolute top-0 right-8 -translate-y-1/2 rounded-full bg-primary/15 border border-primary/20 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur">
              System Builder
            </div>
            
            <h3 className="font-heading text-2xl font-bold tracking-tight">
              App Blueprint Builder
            </h3>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Select modules below to scope your application layout and calculate estimated costs.
            </p>

            <div className="mt-6 space-y-4">
              
              {/* Modules selection */}
              {modulesList.map((m) => {
                const active = selectedModules.includes(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => toggleModule(m.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-4 ${
                      active
                        ? "border-primary bg-primary/5 text-foreground shadow-sm"
                        : "border-border/60 bg-background/50 hover:bg-background/80"
                    }`}
                  >
                    <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      active ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      <m.icon className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{m.label}</span>
                        <span className="text-xs font-medium text-primary">+Rs. {m.cost.toLocaleString("en-IN")}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
                    </div>
                  </button>
                );
              })}

              {/* Estimate Output */}
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 mt-6 text-center">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Estimated Setup Cost</span>
                <div className="mt-1 font-heading text-4xl font-extrabold text-foreground">
                  Rs. {calculateTotalCost().toLocaleString("en-IN")}
                  <span className="text-sm font-normal text-muted-foreground"> onwards</span>
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground leading-relaxed">
                  Includes UI/UX layout, API construction, database schema setup, hosting wiring, and 1 month development support.
                </p>
              </div>

              {/* Submit CTA */}
              <button
                onClick={handleStartQuote}
                className="w-full inline-flex items-center justify-center rounded-xl bg-primary py-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors glow-effect-sm"
              >
                Create App Blueprint <ArrowRight className="ml-2 h-4 w-4" />
              </button>

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
