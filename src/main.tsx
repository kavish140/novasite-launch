import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";
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

createRoot(document.getElementById("root")!).render(
	<ThemeProvider
		attribute="class"
		defaultTheme="dark"
		enableSystem={false}
		storageKey="novasite-theme"
		themes={["dark", "light"]}
		disableTransitionOnChange
	>
		<App />
	</ThemeProvider>,
);
