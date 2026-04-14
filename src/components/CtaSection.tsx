import { motion } from "framer-motion";
import { Phone, Mail, MessageCircle } from "lucide-react";

const emailComposeLink =
  "https://mail.google.com/mail/?view=cm&fs=1&to=kavish@sitenova.dev&su=Website%20Inquiry%20from%20SiteNova";

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
        <p className="mx-auto mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          Projects starting from Rs. 5,000
        </p>
        <h2 id="cta-title" className="font-heading text-3xl md:text-5xl font-bold mb-6">
          Ready to build something{" "}
          <span className="gradient-text">affordable and effective?</span>
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
          Get in touch today for a clean, modern website that fits your budget. Share your requirements and I’ll reply with a clear quote.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <a
            href="tel:+919326060621"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-all glow-effect button-shimmer interactive-card"
          >
            <Phone size={20} />
            9326060621
          </a>
          <a
            href="https://wa.me/919326060621?text=Hi%2C%20I%27m%20interested%20in%20getting%20a%20website%20built."
            target="_blank"
            rel="noopener noreferrer"
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
          kavish@sitenova.dev
        </a>
        <p className="mt-5 text-sm text-muted-foreground">We typically respond within 24 hours</p>
      </motion.div>
    </section>
  );
};

export default CtaSection;
