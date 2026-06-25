import { Link, useLocation, useNavigate } from "react-router-dom";
import { setPageSeo } from "@/lib/seo";
import { useEffect } from "react";
import { m as motion } from "framer-motion";
import { CheckCircle2, Phone, MessageCircle, ShieldCheck, Globe } from "lucide-react";
import { trackGoogleAdsConversion } from "@/lib/analytics";


const ThankYou = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { name?: string; projectType?: string; email?: string } | null;

  // Guard: block direct URL access to prevent phantom conversions.
  // /thank-you is only valid when reached via a form submission (state is populated by React Router).
  useEffect(() => {
    if (!state) {
      navigate("/", { replace: true });
    }
  }, [state, navigate]);

  if (!state) return null; // Render nothing while redirecting

  const name = state?.name || "there";
  const projectType = state?.projectType || "project";
  const email = state?.email || "your email";

  useEffect(() => {
    setPageSeo({
      title: "Request Received | SiteNova",
      description: "Thank you for your request. We will get back to you shortly.",
      canonicalPath: "/thank-you",
    });

    // Single, canonical Google Ads conversion fire — only Quote form leads reach this page
    trackGoogleAdsConversion("FLS8CJvM3LscEJy2kd5D");
  }, []);

  const whatsappMessage = encodeURIComponent(
    `Hi Kavish, I just filled out the intake form on SiteNova!`
  );
  const whatsappUrl = `https://wa.me/919326060621?text=${whatsappMessage}`;

  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-8 sm:px-6 md:py-16 relative overflow-hidden flex flex-col justify-center">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-primary/10 blur-[150px] animate-pulse-glow pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[120px] pointer-events-none -z-10" />

      <div className="mx-auto w-full max-w-3xl z-10 flex-1 flex flex-col justify-center">
        <div className="glass-card p-6 sm:p-10 rounded-3xl border border-border/60 bg-card/40 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-4 space-y-6"
          >
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-md animate-ping" />
                <CheckCircle2 size={64} className="text-[#25D366] relative z-10" />
              </div>
            </div>

            <div className="max-w-xl mx-auto space-y-2">
              <h1 className="font-heading text-3xl font-bold tracking-tight">
                Inquiry Submitted!
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Thank you, <span className="text-foreground font-semibold">{name}</span>! We have
                received your {projectType === "Free Audit" ? "request" : "scoping details"} for your <span className="text-foreground font-semibold">{projectType}</span>. 
                {projectType === "Free Audit" ? " Our team will review your site and get back" : " A quote summary is being sent"} to <span className="text-foreground font-semibold">{email}</span>.
              </p>
              <p className="text-muted-foreground text-xs">
                We typically respond within 24 hours. For the fastest booking, choose an option below:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto pt-4">
              <a
                href="tel:+919326060621"
                className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-all glow-effect button-shimmer"
              >
                <Phone size={18} />
                Call Now
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#1ebe57] transition-all"
              >
                <MessageCircle size={18} />
                Chat on WhatsApp
              </a>
            </div>

            <div className="pt-6 border-t border-border/40 max-w-md mx-auto">
              <Link
                to="/"
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Return to Home Page
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-6 sm:gap-10 text-muted-foreground/80">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider">Secure Form</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider">Fast Response</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider">No Commitments</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ThankYou;
