import { Link } from "react-router";
import { Zap } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * MobileAuditBar — sticky bottom bar shown on mobile only after 4 seconds.
 * Designed to capture blog readers and page visitors who haven't converted.
 * Hidden after user dismisses or on desktop (lg+ screens).
 */
export default function MobileAuditBar() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed it in this session
    if (sessionStorage.getItem("audit-bar-dismissed")) {
      return;
    }
    const timer = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("audit-bar-dismissed", "1");
  };

  if (!visible || dismissed) return null;

  return (
    <div
      role="complementary"
      aria-label="Free website audit offer"
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
    >
      <div className="m-3 mb-safe flex items-center gap-3 rounded-2xl border border-primary/30 bg-background/95 px-4 py-3 shadow-2xl shadow-primary/10 backdrop-blur-md">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Zap className="h-4.5 w-4.5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-foreground leading-tight">
            Free Website Audit
          </p>
          <p className="text-xs text-muted-foreground truncate">
            Is your site losing leads? We'll check — free.
          </p>
        </div>
        <Link
          to="/free-audit?utm_source=mobile_bar&utm_medium=sticky_cta&utm_campaign=mobile_audit_bar"
          className="shrink-0 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          aria-label="Get a free website audit from SiteNova"
        >
          Get Audit
        </Link>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss audit offer"
          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
