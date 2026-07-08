import { useEffect } from "react";
import { Phone, Mail, MessageCircle, MapPin, ShieldCheck, CheckCircle2, Globe } from "lucide-react";
import { setPageSeo } from "@/lib/seo";
import { Link } from "react-router-dom";
import { m as motion } from "framer-motion";
import { PHONE_TEL_LINK, EMAIL_COMPOSE_LINK, EMAIL, PHONE_NUMBER } from "@/lib/constants";

const emailComposeLink =
  `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}&su=Website%20Inquiry%20from%20SiteNova`;

const Contact = () => {
  useEffect(() => {
    setPageSeo({
      title: "Contact Us | SiteNova Web Development",
      description: "Get in touch with SiteNova for custom web development. Call us directly, send a WhatsApp message, or request a quote for your next project.",
      canonicalPath: "/contact-us",
    });
  }, []);

  const whatsappMessage = encodeURIComponent(
    `Hi Kavish, I'm interested in getting a website built.`
  );
  const whatsappUrl = `https://wa.me/919326060621?text=${whatsappMessage}`;

  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-8 sm:px-6 md:py-20 relative overflow-hidden flex flex-col">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-primary/10 blur-[150px] animate-pulse-glow pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[120px] pointer-events-none -z-10" />

      <div className="mx-auto w-full max-w-4xl z-10 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">
            Get in touch
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold mt-4 mb-4 tracking-tight">
            Let's build your <span className="gradient-text">dream website</span>
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg leading-relaxed">
            Ready to get started? Call us for instant answers, chat with us on WhatsApp, or send an email. We typically respond within minutes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Direct Contact Options */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            {/* Call Now Card - Highlighted */}
            <a
              href={PHONE_TEL_LINK}
              className="group glass-card p-6 md:p-8 rounded-3xl border-2 border-primary/40 hover:border-primary bg-card/40 hover:bg-card/60 transition-all duration-300 relative overflow-hidden interactive-card"
            >
              <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
              <div className="relative z-10 flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold mb-1">Call Now</h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    Fastest way to reach us for instant answers.
                  </p>
                  <span className="inline-block text-lg font-semibold text-primary">
                    +91 93260 60621
                  </span>
                </div>
              </div>
            </a>

            {/* WhatsApp Card */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group glass-card p-6 md:p-8 rounded-3xl border border-border/60 hover:border-[#25D366]/50 bg-card/40 hover:bg-card/60 transition-all duration-300 interactive-card"
            >
              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#25D366]/10 text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold mb-1">WhatsApp</h3>
                  <p className="text-muted-foreground text-sm">
                    Prefer texting? Drop a message anytime.
                  </p>
                </div>
              </div>
            </a>

            {/* Email Card */}
            <a
              href={emailComposeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group glass-card p-6 md:p-8 rounded-3xl border border-border/60 hover:border-accent/50 bg-card/40 hover:bg-card/60 transition-all duration-300 interactive-card"
            >
              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold mb-1">Email Us</h3>
                  <p className="text-muted-foreground text-sm">
                    Send your project details to our inbox.
                  </p>
                </div>
              </div>
            </a>
          </motion.div>

          {/* Detailed Inquiry & Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <div className="glass-card p-8 rounded-3xl border border-border/60 bg-card/40 relative overflow-hidden flex-1 flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] pointer-events-none rounded-full" />
              <h3 className="font-heading text-2xl font-bold mb-4">
                Need a detailed quote?
              </h3>
              <p className="text-muted-foreground mb-8 leading-relaxed text-sm md:text-base">
                If you have a clear idea of what you want, you can fill out our scoping form. It takes less than 2 minutes and helps us give you a precise timeline and budget.
              </p>
              <Link
                to="/quote"
                className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all glow-effect-sm button-shimmer shadow-lg shadow-primary/20 btn-quote-pulse"
              >
                Request a Custom Quote
              </Link>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-border/60 bg-secondary/30 flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background border border-border/50 text-muted-foreground">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Serving globally, based in</p>
                <p className="text-sm text-muted-foreground">Mulund, Mumbai, India</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust Badges */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 flex flex-wrap justify-center items-center gap-6 sm:gap-10 text-muted-foreground/80"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider">Fast Turnaround</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider">High Conversion Focus</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider">SEO Ready</span>
          </div>
        </motion.div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Contact;
