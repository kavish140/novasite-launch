import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://2159c483e3c50155f15c45caf6fb3667@o4511547708997632.ingest.us.sentry.io/4511547730690048",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

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
