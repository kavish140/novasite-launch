import { useState } from "react";
import { Phone, X } from "lucide-react";
import { m as motion, AnimatePresence } from "framer-motion";
import { PHONE_TEL_LINK, WHATSAPP_URL } from "@/lib/constants";
import { trackWhatsAppClick } from "@/lib/analytics";

const BookCallWidget = () => {
  const [showQualifier, setShowQualifier] = useState(false);

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowQualifier(true);
  };

  const handleQualifierYes = () => {
    trackWhatsAppClick();
    setShowQualifier(false);
    window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
  };

  const handleQualifierNo = () => {
    setShowQualifier(false);
  };

  return (
    <>
      {/* Persistent floating buttons — always visible */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {/* WhatsApp Button — opens qualifier first */}
        <button
          onClick={handleWhatsAppClick}
          className="flex items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1ebd56] px-4 py-3 sm:px-5 text-sm font-semibold text-white shadow-lg hover:shadow-[#25D366]/40 transition-all hover:-translate-y-1 active:scale-95"
          aria-label="Chat on WhatsApp"
        >
          <svg className="h-5 w-5 fill-current" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
          </svg>
          <span className="hidden sm:inline">WhatsApp</span>
        </button>

        {/* Call Now Button */}
        <div className="relative flex items-center justify-center">
          <div
            className="absolute inset-0 -z-10 rounded-full animate-ping bg-primary/40 opacity-75"
            style={{ animationDuration: "3s", willChange: "transform, opacity" }}
            aria-hidden="true"
          />
          <a
            href={PHONE_TEL_LINK}
            className="flex items-center gap-2 rounded-full bg-primary px-4 py-3 sm:px-5 text-sm font-semibold text-primary-foreground shadow-lg hover:shadow-primary/50 transition-all hover:-translate-y-1 active:scale-95"
            aria-label="Call Now"
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
            <span className="hidden sm:inline">Call Now</span>
          </a>
        </div>
      </div>

      {/* WhatsApp Qualifier Modal */}
      <AnimatePresence>
        {showQualifier && (
          <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleQualifierNo}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative z-[201] w-full max-w-sm rounded-2xl border border-border/60 bg-card p-6 shadow-2xl"
            >
              {/* Close */}
              <button
                onClick={handleQualifierNo}
                className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>

              {/* WhatsApp icon */}
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#25D366]/10">
                <svg className="h-6 w-6 fill-[#25D366]" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                </svg>
              </div>

              <h3 className="font-heading text-base font-bold text-foreground leading-snug">
                Before we connect on WhatsApp...
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                Are you a <span className="font-semibold text-foreground">business owner</span> looking to get a professional website built?
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={handleQualifierYes}
                  className="flex-1 rounded-xl bg-[#25D366] py-2.5 text-sm font-semibold text-white hover:bg-[#1ebd56] transition-colors"
                >
                  Yes, I am 👍
                </button>
                <button
                  onClick={handleQualifierNo}
                  className="flex-1 rounded-xl border border-border bg-secondary/30 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  No, thanks
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BookCallWidget;
