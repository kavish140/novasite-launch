import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import dashboardPreview from "@/assets/dashboard-preview.jpg";
import BlurImage from "./BlurImage";

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 90]);
  const orbY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 160]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -24]);
  const previewY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -42]);
  const previewRotate = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -1.5]);

  const scrollToPortfolio = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0 will-change-transform">
        <img src={heroBg} alt="Abstract modern web development background" className="w-full h-full object-cover opacity-30 scale-105" loading="eager" fetchPriority="high" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
      </motion.div>

      {/* Glow orbs */}
      <motion.div style={{ y: orbY }} className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/10 blur-[120px] animate-pulse-glow pointer-events-none will-change-transform" />
      <motion.div style={{ y: contentY }} className="absolute top-[30%] right-[10%] w-[300px] h-[300px] rounded-full bg-accent/20 blur-[100px] animate-pulse-glow pointer-events-none" />
      <motion.div style={{ y: contentY }} className="absolute top-[18%] right-[8%] w-[240px] h-[240px] rounded-full bg-secondary/30 blur-[90px] pointer-events-none" />

      <motion.div style={{ y: contentY }} className="relative z-10 mx-auto max-w-7xl px-6 text-center will-change-transform">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-4 py-1.5 mb-8 interactive-card hover-glow">
            <Sparkles size={14} className="text-accent" />
            <span className="text-xs font-medium text-muted-foreground">
              Website design for Mulund, Mumbai, and nearby suburbs
            </span>
          </div>

          <motion.h1 
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-balance flex flex-wrap justify-center gap-x-3 sm:gap-x-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.1 },
              },
            }}
          >
            {"Best Website Designer in Mulund, Mumbai & Nearby Areas".split(" ").map((word, idx) => (
              <motion.span
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 100 } }
                }}
              >
                {word}
              </motion.span>
            ))}
            <motion.span
              className="block w-full gradient-text animated-gradient mt-2"
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1, transition: { type: "spring", delay: 0.8 } }
              }}
            >
              SiteNova
            </motion.span>
          </motion.h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 text-balance">
            We deliver web development and landing page design for businesses in Mulund,
            Mumbai, Bhandup, Thane, Ghatkopar, Powai, and beyond with fast, SEO-ready,
            mobile-first websites built to grow your brand.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
            <Link
              to="/quote"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-all glow-effect group button-shimmer interactive-card"
            >
              Get a Free Quote
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#portfolio"
              onClick={scrollToPortfolio}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-3.5 text-base font-medium text-foreground hover:bg-secondary transition-colors interactive-card"
            >
              View Our Work
            </a>
          </div>

          {/* Trust bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex flex-col items-center gap-4"
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/60">
              Trusted by doctors, financial firms &amp; local businesses in Mumbai
            </p>
            <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
              {[
                { label: "Trusted by Doctors & Finance Firms", sublabel: "in Mumbai" },
                { label: "5-Star Rated on Google", sublabel: "by our clients" },
                { label: "Fast Delivery", sublabel: "days, not weeks" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-sm font-bold text-foreground">{stat.label}</p>
                  <p className="text-[11px] text-muted-foreground">{stat.sublabel}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-1 rounded-full border border-[#25D366]/20 bg-[#25D366]/5 px-4 py-1.5">
              <ShieldCheck size={14} className="text-[#25D366]" />
              <span className="text-[11px] font-medium text-[#25D366]">
                7-day money-back guarantee on all projects
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ y: previewY, rotateX: previewRotate }}
          className="mt-16 md:mt-20"
        >
          <div className="relative mx-auto max-w-5xl gradient-border rounded-2xl overflow-hidden interactive-card hover-glow">
            <div className="rounded-2xl overflow-hidden border border-border/30">
              <BlurImage
                src={dashboardPreview}
                alt="SiteNova web development and landing page design dashboard preview"
                className="w-full h-auto"
                width={1024}
                height={640}
              />
            </div>
            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
