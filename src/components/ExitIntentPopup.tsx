import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { m as motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { trackExitPopupSubmit } from "@/lib/analytics";

const STORAGE_KEY = "sitenova_exit_popup_shown";

// Validation helpers
const isValidIndianMobile = (num: string): boolean => /^[6-9]\d{9}$/.test(num.replace(/\s+/g, ""));
const isValidName = (n: string): boolean => /^[a-zA-Z\s]{2,}$/.test(n.trim());
const isValidEmail = (e: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [industry, setIndustry] = useState("");
  const [errors, setErrors] = useState<{name?: string; email?: string; whatsapp?: string}>({});
  const location = useLocation();
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const showPopup = useCallback(() => {
    // Don't show if already shown in this session
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    previousFocusRef.current = document.activeElement as HTMLElement;
    setIsVisible(true);
    sessionStorage.setItem(STORAGE_KEY, "true");
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    // Restore focus to the element that was focused before the popup opened
    previousFocusRef.current?.focus();
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

  // Focus trap and Escape key handling
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
        return;
      }

      // Focus trap
      if (e.key === "Tab" && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Auto-focus the dialog when it opens
    setTimeout(() => {
      const firstInput = dialogRef.current?.querySelector<HTMLElement>("input, button, select");
      firstInput?.focus();
    }, 100);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, handleClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Strict validation before submitting
    const newErrors: {name?: string; email?: string; whatsapp?: string} = {};
    if (!isValidName(name)) newErrors.name = "Please enter your real name (letters only, min 2 characters)";
    if (!isValidEmail(email)) newErrors.email = "Please enter a valid email address";
    const cleanPhone = whatsapp.replace(/\s+/g, "");
    if (!isValidIndianMobile(cleanPhone)) newErrors.whatsapp = "Please enter a valid 10-digit Indian mobile number";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setSubmitError(false);

    try {
      await supabase.from("audit_requests").insert([
        {
          name: name.trim(),
          mobile: cleanPhone,
          website_url: `Exit popup lead — Industry: ${industry || "Not specified"}`,
          email: email.trim().toLowerCase(),
        },
      ]);

      trackExitPopupSubmit();
      handleClose();
      navigate("/thank-you", {
        state: {
          name: name.trim(),
          projectType: `Quote Request (Exit Popup - ${industry || "Not specified"})`,
          email: email.trim(),
        },
      });
    } catch (err) {
      console.error("Exit popup submit error:", err);
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Do not render the popup on any admin pages
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-popup-title"
        >
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
            ref={dialogRef}
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
                    <h3 id="exit-popup-title" className="font-heading text-xl font-bold tracking-tight sm:text-2xl">
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
                        placeholder="Your full name"
                        required
                        aria-label="Your full name"
                        className={`w-full rounded-xl border bg-secondary/20 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 transition-all ${
                          errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-border/80 focus:border-primary focus:ring-primary"
                        }`}
                      />
                      {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                    </div>
                    <div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your business email"
                        required
                        aria-label="Your business email"
                        className={`w-full rounded-xl border bg-secondary/20 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 transition-all ${
                          errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-border/80 focus:border-primary focus:ring-primary"
                        }`}
                      />
                      {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                    </div>
                    <div>
                      <input
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value.replace(/[^0-9\s]/g, ""))}
                        placeholder="10-digit WhatsApp number (e.g. 9820012345)"
                        required
                        maxLength={10}
                        aria-label="WhatsApp number"
                        className={`w-full rounded-xl border bg-secondary/20 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 transition-all ${
                          errors.whatsapp ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-border/80 focus:border-primary focus:ring-primary"
                        }`}
                      />
                      {errors.whatsapp && <p className="mt-1 text-xs text-red-400">{errors.whatsapp}</p>}
                    </div>
                    <div>
                      <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        aria-label="Select your industry"
                        className="w-full rounded-xl border border-border/80 bg-secondary/20 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all appearance-none"
                      >
                        <option value="" className="bg-background text-foreground">Select your industry (optional)</option>
                        <option value="Healthcare" className="bg-background text-foreground">Healthcare / Clinic</option>
                        <option value="Finance" className="bg-background text-foreground">Finance / CA / Insurance</option>
                        <option value="Real Estate" className="bg-background text-foreground">Real Estate / Property</option>
                        <option value="Retail" className="bg-background text-foreground">Retail / E-commerce</option>
                        <option value="Restaurant" className="bg-background text-foreground">Restaurant / Food & Beverage</option>
                        <option value="Manufacturing" className="bg-background text-foreground">Manufacturing / Industrial</option>
                        <option value="Legal" className="bg-background text-foreground">Legal / Law Firm</option>
                        <option value="Other" className="bg-background text-foreground">Other</option>
                      </select>
                    </div>

                    {submitError && (
                      <p className="text-sm text-destructive text-center">
                        Something went wrong. Please try again.
                      </p>
                    )}

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
