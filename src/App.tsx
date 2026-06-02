import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BookCallWidget from "./components/BookCallWidget";
import ErrorBoundary from "./components/ErrorBoundary";
import ExitIntentPopup from "./components/ExitIntentPopup";

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Quote = lazy(() => import("./pages/Quote"));
const Ecommerce = lazy(() => import("./pages/services/Ecommerce"));
const WebApps = lazy(() => import("./pages/services/WebApps"));
const SeoSpeed = lazy(() => import("./pages/services/SeoSpeed"));
const Thane = lazy(() => import("./pages/locations/Thane"));
const Powai = lazy(() => import("./pages/locations/Powai"));
const Andheri = lazy(() => import("./pages/locations/Andheri"));
const FreeAudit = lazy(() => import("./pages/FreeAudit"));
const Doctors = lazy(() => import("./pages/niche/Doctors"));
const Finance = lazy(() => import("./pages/niche/Finance"));
const BlogIndex = lazy(() => import("./pages/blog/BlogIndex"));
const BlogPost = lazy(() => import("./pages/blog/BlogPost"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminBlogEditor = lazy(() => import("./pages/admin/AdminBlogEditor"));
const RealEstate = lazy(() => import("./pages/niche/RealEstate"));
import ProtectedRoute from "./components/ProtectedRoute";

import { LazyMotion, domAnimation } from "framer-motion";

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
        <LazyMotion features={domAnimation}>
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
                <Route path="/free-audit" element={<FreeAudit />} />
                <Route path="/websites-for-doctors" element={<Doctors />} />
                <Route path="/websites-for-finance" element={<Finance />} />
                <Route path="/blog" element={<BlogIndex />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/blog/new" 
                  element={
                    <ProtectedRoute>
                      <AdminBlogEditor />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/blog/:id" 
                  element={
                    <ProtectedRoute>
                      <AdminBlogEditor />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/websites-for-real-estate" element={<RealEstate />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <BookCallWidget />
              <ExitIntentPopup />
            </Suspense>
          </BrowserRouter>
        </LazyMotion>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
