import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BookCallWidget from "./components/BookCallWidget";
import ErrorBoundary from "./components/ErrorBoundary";

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Quote = lazy(() => import("./pages/Quote"));
const Ecommerce = lazy(() => import("./pages/services/Ecommerce"));
const WebApps = lazy(() => import("./pages/services/WebApps"));
const SeoSpeed = lazy(() => import("./pages/services/SeoSpeed"));
const Thane = lazy(() => import("./pages/locations/Thane"));
const Powai = lazy(() => import("./pages/locations/Powai"));
const Andheri = lazy(() => import("./pages/locations/Andheri"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Suspense fallback={<div className="min-h-screen bg-background" aria-hidden="true" />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/quote" element={<Quote />} />
              <Route path="/services/ecommerce" element={<Ecommerce />} />
              <Route path="/services/web-applications" element={<WebApps />} />
              <Route path="/services/seo-optimization" element={<SeoSpeed />} />
              <Route path="/location/thane" element={<Thane />} />
              <Route path="/location/powai" element={<Powai />} />
              <Route path="/location/andheri" element={<Andheri />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BookCallWidget />
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
