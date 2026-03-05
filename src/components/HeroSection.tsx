import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import dashboardPreview from "@/assets/dashboard-preview.jpg";

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

      {/* Glow orb */}
      <motion.div style={{ y: orbY }} className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/10 blur-[120px] animate-pulse-glow pointer-events-none will-change-transform" />
      <motion.div style={{ y: contentY }} className="absolute top-[18%] right-[8%] w-[240px] h-[240px] rounded-full bg-accent/10 blur-[90px] pointer-events-none" />

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
              Professional websites, delivered fast
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-balance">
            Custom Web Development Services{" "}
            <span className="gradient-text animated-gradient">| SiteNova</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 text-balance">
            We deliver web development and landing page design for businesses in Mumbai
            and beyond — fast, SEO-ready, mobile-first websites built to grow your brand.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/quote"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-all glow-effect group button-shimmer interactive-card"
            >
              Get a Free Quote
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#/"
              onClick={scrollToPortfolio}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-3.5 text-base font-medium text-foreground hover:bg-secondary transition-colors interactive-card"
            >
              View Our Work
            </a>
          </div>
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
              <img
                src={dashboardPreview}
                alt="SiteNova web development and landing page design dashboard preview"
                className="w-full h-auto"
                loading="eager"
                decoding="async"
                width="1024"
                height="640"
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
