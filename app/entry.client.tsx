import { startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

startTransition(() => {
  hydrateRoot(document, <HydratedRouter />);
});

// Sentry — delayed init (preserves existing pattern from main.tsx)
if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN && window.location.pathname !== "/pay" && window.location.pathname !== "/receipt" && window.location.pathname !== "/project" && window.location.pathname !== "/payment-thank-you" && !window.location.pathname.startsWith("/admin")) {
  setTimeout(() => {
    import("@sentry/react").then((Sentry) => {
      Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        integrations: [
          Sentry.browserTracingIntegration(),
          Sentry.replayIntegration(),
        ],
        tracesSampleRate: 1.0,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
      });
    });
  }, 10000);
}
