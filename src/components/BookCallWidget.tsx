import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BookCallWidget = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show widget after a small delay so it doesn't distract immediately on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
        >
          {/* WhatsApp Button */}
          <a
            href="https://wa.me/919326060621?text=Hi%2C%20I%27m%20interested%20in%20getting%20a%20website%20built."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1ebd56] px-4 py-3 sm:px-5 text-sm font-semibold text-white shadow-lg hover:shadow-[#25D366]/40 transition-all hover:-translate-y-1 active:scale-95"
            aria-label="Chat on WhatsApp"
          >
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.062 5.282 5.348-.002 11.83.003c3.137.001 6.086 1.222 8.303 3.442a11.636 11.636 0 0 1 3.438 8.3c-.004 6.55-5.29 11.832-11.77 11.832h-.005c-1.996-.001-3.957-.507-5.701-1.468L0 24zm6.59-4.846c1.66.986 3.284 1.48 4.961 1.482 5.39.002 9.778-4.382 9.782-9.77a9.71 9.71 0 0 0-2.87-6.936A9.713 9.713 0 0 0 11.826 1.18c-5.39 0-9.78 4.384-9.785 9.77-.001 1.76.46 3.478 1.334 5.006L2.35 21.614l5.297-1.389zM15.86 13.06c-.32-.16-1.895-.935-2.188-1.042-.294-.108-.508-.16-.723.16-.215.32-.83.83-1.018 1.042-.189.213-.377.24-.697.08-3.216-1.612-4.14-2.61-4.757-3.67-.32-.547-.034-.842.241-1.116.247-.247.546-.638.82-.958.08-.093.133-.187.186-.28.18-.32.09-.598-.046-.867-.136-.27-.723-1.745-.99-2.385-.26-.628-.546-.54-.723-.55-.18-.01-.387-.01-.594-.01-.207 0-.546.078-.83.39-.286.31-1.096 1.07-1.096 2.612s1.114 3.03 1.268 3.24c.154.21 2.19 3.348 5.31 4.7 1.758.762 3.125 1.22 4.195 1.56.883.28 1.686.24 2.32.145.71-.106 1.896-.775 2.164-1.484.27-.71.27-1.317.189-1.484-.08-.166-.294-.27-.614-.43z"/>
            </svg>
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          {/* Book Call Button Container */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 -z-10 rounded-full animate-ping bg-primary/40 opacity-75" style={{ animationDuration: '3s' }}></div>
            <a
              href="https://calendly.com/kavishganatra5/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-primary px-4 py-3 sm:px-5 text-sm font-semibold text-primary-foreground shadow-lg hover:shadow-primary/50 transition-all hover:-translate-y-1 active:scale-95"
              aria-label="Book a Call"
            >
              <Calendar className="h-5 w-5" />
              <span className="hidden sm:inline">Book a Call</span>
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookCallWidget;
