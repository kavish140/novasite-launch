import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { m as motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { trackExitPopupSubmit } from "@/lib/analytics";

const STORAGE_KEY = "sitenova_exit_popup_shown";

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [industry, setIndustry] = useState("");
  const location = useLocation();

  // Do not render the popup on any admin pages
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  const showPopup = useCallback(() => {
    // Don't show if already shown in this session
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    setIsVisible(true);
    sessionStorage.setItem(STORAGE_KEY, "true");
  }, []);

  useEffect(() => {
    // Desktop: detect mouse leaving viewport (exit intent)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        showPopup();
      }
    };

    // Mobile: show after 45 seconds of engagement
    const mobileTimer = setTimeout(() => {
      if (window.innerWidth < 768) {
        showPopup();
      }
    }, 45000);

    document.addEventListener("mouseout", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseout", handleMouseLeave);
      clearTimeout(mobileTimer);
    };
  }, [showPopup]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !whatsapp.trim()) return;

    setIsSubmitting(true);

    try {
      await supabase.from("audit_requests").insert([
        {
          name: name.trim(),
          mobile: whatsapp.trim(),
          website_url: `Exit popup lead — Industry: ${industry || "Not specified"}`,
          email: "exit-popup-lead@sitenova.dev",
        },
      ]);

      trackExitPopupSubmit();
      setSubmitted(true);
    } catch (err) {
      console.error("Exit popup submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => setIsVisible(false);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-[101] w-full max-w-md"
          >
            <div className="relative rounded-3xl border border-border/60 bg-card/95 p-8 shadow-2xl backdrop-blur-xl">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                aria-label="Close popup"
              >
                <X size={18} />
              </button>

              {!submitted ? (
                <>
                  {/* Header */}
                  <div className="mb-6 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-heading text-xl font-bold tracking-tight sm:text-2xl">
                      Before you go...
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      Get a <span className="font-semibold text-primary">free mockup</span> of what
                      your website could look like. No strings attached.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        required
                        className="w-full rounded-xl border border-border/80 bg-secondary/20 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="WhatsApp number"
                        required
                        className="w-full rounded-xl border border-border/80 bg-secondary/20 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                    <div>
                      <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full rounded-xl border border-border/80 bg-secondary/20 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all appearance-none"
                      >
                        <option value="" className="bg-background text-foreground">Select your industry (optional)</option>
                        <option value="Healthcare" className="bg-background text-foreground">Healthcare / Clinic</option>
                        <option value="Finance" className="bg-background text-foreground">Finance / CA / Insurance</option>
                        <option value="Real Estate" className="bg-background text-foreground">Real Estate / Property</option>
                        <option value="Retail" className="bg-background text-foreground">Retail / E-commerce</option>
                        <option value="Education" className="bg-background text-foreground">Education / Coaching</option>
                        <option value="Other" className="bg-background text-foreground">Other</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all glow-effect button-shimmer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          Get My Free Mockup
                          <ArrowRight
                            size={16}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </>
                      )}
                    </button>
                  </form>

                  <p className="mt-4 text-center text-[11px] text-muted-foreground/60">
                    100% free. No spam. We'll reach out on WhatsApp within 24 hours.
                  </p>
                </>
              ) : (
                /* Success state */
                <div className="py-4 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366]/10">
                    <svg className="h-7 w-7 fill-[#25D366]" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157z" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-xl font-bold">We'll be in touch!</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Expect a WhatsApp message within 24 hours with your free website mockup
                    concept.
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-6 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    Close this popup
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
