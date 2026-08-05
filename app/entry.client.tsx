import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

hydrateRoot(
  document,
  <QueryClientProvider client={queryClient}>
    <HydratedRouter />
  </QueryClientProvider>
);

// Sentry — delayed init (preserves existing pattern from main.tsx)
if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
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
