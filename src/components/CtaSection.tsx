import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CtaSection = () => {
  return (
    <section id="cta" className="section-padding relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-primary/8 blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-3xl text-center"
      >
        <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">
          Ready to build something{" "}
          <span className="gradient-text">extraordinary?</span>
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
          Join thousands of creators, founders, and agencies building the future of the web with SiteNova.
        </p>
        <a
          href="#"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-10 py-4 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-all glow-effect group"
        >
          Get Started — It's Free
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </a>
        <p className="mt-5 text-sm text-muted-foreground">No credit card required · Free forever plan</p>
      </motion.div>
    </section>
  );
};

export default CtaSection;
