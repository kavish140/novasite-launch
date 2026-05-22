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
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center"
        >
          {/* Subtle ping animation behind the button */}
          <div className="absolute inset-0 -z-10 rounded-full animate-ping bg-primary/40 opacity-75" style={{ animationDuration: '3s' }}></div>
          
          <a
            href="https://calendly.com/kavishganatra5/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg hover:shadow-primary/50 transition-all hover:-translate-y-1 active:scale-95"
            aria-label="Book a Call"
          >
            <Calendar className="h-5 w-5" />
            <span>Book a Call</span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookCallWidget;
