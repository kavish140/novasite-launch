import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, useLocation, useOutlet, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ErrorBoundary from "./components/ErrorBoundary";
import DeferredWrapper from "./components/DeferredWrapper";
import { blogIndexLoader, blogPostLoader } from "./pages/blog/loaders";

const ScrollProgress = lazy(() => import("./components/ScrollProgress"));
const BookCallWidget = lazy(() => import("./components/BookCallWidget"));
const ExitIntentPopup = lazy(() => import("./components/ExitIntentPopup"));
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Quote = lazy(() => import("./pages/Quote"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Ecommerce = lazy(() => import("./pages/services/Ecommerce"));
const WebApps = lazy(() => import("./pages/services/WebApps"));
const SeoSpeed = lazy(() => import("./pages/services/SeoSpeed"));
const Thane = lazy(() => import("./pages/locations/Thane"));
const Powai = lazy(() => import("./pages/locations/Powai"));
const Andheri = lazy(() => import("./pages/locations/Andheri"));
const Bhandup = lazy(() => import("./pages/locations/Bhandup"));
const Nahur = lazy(() => import("./pages/locations/Nahur"));
const Ghatkopar = lazy(() => import("./pages/locations/Ghatkopar"));
const Vikhroli = lazy(() => import("./pages/locations/Vikhroli"));
const Kurla = lazy(() => import("./pages/locations/Kurla"));
const Dadar = lazy(() => import("./pages/locations/Dadar"));
const LowerParel = lazy(() => import("./pages/locations/LowerParel"));
const Mahalakshmi = lazy(() => import("./pages/locations/Mahalakshmi"));
const PedderRoad = lazy(() => import("./pages/locations/PedderRoad"));
const FreeAudit = lazy(() => import("./pages/FreeAudit"));
const Doctors = lazy(() => import("./pages/niche/Doctors"));
const Finance = lazy(() => import("./pages/niche/Finance"));
const BlogIndex = lazy(() => import("./pages/blog/BlogIndex"));
const BlogPost = lazy(() => import("./pages/blog/BlogPost"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminBlogEditor = lazy(() => import("./pages/admin/AdminBlogEditor"));
const RealEstate = lazy(() => import("./pages/niche/RealEstate"));
const Consultants = lazy(() => import("./pages/niche/Consultants"));
const Lawyers = lazy(() => import("./pages/niche/Lawyers"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));

import { LazyMotion, domAnimation, AnimatePresence } from "framer-motion";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

const AnimatedOutlet = () => {
  const location = useLocation();
  const element = useOutlet();

  return (
    <AnimatePresence mode="wait">
      {element && React.cloneElement(element as React.ReactElement, { key: location.pathname })}
    </AnimatePresence>
  );
};

const RootLayout = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" aria-hidden="true" />}>
      <DeferredWrapper delay={500}>
        <ScrollProgress />
      </DeferredWrapper>
      <AnimatedOutlet />
      <DeferredWrapper delay={2000}>
        <BookCallWidget />
      </DeferredWrapper>
      <DeferredWrapper delay={45000}>
        <ExitIntentPopup />
      </DeferredWrapper>
    </Suspense>
  );
};

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Index /> },
      { path: "/quote", element: <Quote /> },
      { path: "/thank-you", element: <ThankYou /> },
      { path: "/pricing", element: <Pricing /> },
      { path: "/services/ecommerce", element: <Ecommerce /> },
      { path: "/services/web-applications", element: <WebApps /> },
      { path: "/services/seo-optimization", element: <SeoSpeed /> },
      { path: "/location/thane", element: <Thane /> },
      { path: "/location/powai", element: <Powai /> },
      { path: "/location/andheri", element: <Andheri /> },
      { path: "/location/bhandup", element: <Bhandup /> },
      { path: "/location/nahur", element: <Nahur /> },
      { path: "/location/ghatkopar", element: <Ghatkopar /> },
      { path: "/location/vikhroli", element: <Vikhroli /> },
      { path: "/location/kurla", element: <Kurla /> },
      { path: "/location/dadar", element: <Dadar /> },
      { path: "/location/lower-parel", element: <LowerParel /> },
      { path: "/location/mahalakshmi", element: <Mahalakshmi /> },
      { path: "/location/pedder-road", element: <PedderRoad /> },
      { path: "/free-audit", element: <FreeAudit /> },
      { path: "/websites-for-doctors", element: <Doctors /> },
      { path: "/websites-for-finance", element: <Finance /> },
      { path: "/blog", element: <BlogIndex />, loader: blogIndexLoader },
      { path: "/blog/:slug", element: <BlogPost />, loader: blogPostLoader },
      { path: "/admin", element: <AdminLogin /> },
      { path: "/admin/dashboard", element: <ProtectedRoute><AdminDashboard /></ProtectedRoute> },
      { path: "/admin/blog/new", element: <ProtectedRoute><AdminBlogEditor /></ProtectedRoute> },
      { path: "/admin/blog/:id", element: <ProtectedRoute><AdminBlogEditor /></ProtectedRoute> },
      { path: "/websites-for-real-estate", element: <RealEstate /> },
      { path: "/websites-for-consultants", element: <Consultants /> },
      { path: "/websites-for-lawyers", element: <Lawyers /> },
      { path: "/location/peddar-road", element: <Navigate to="/location/pedder-road" replace /> },
      { path: "*", element: <NotFound /> }
    ]
  }
], {
  basename: import.meta.env.BASE_URL
});

const App = () => (
  <HelmetProvider>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <LazyMotion features={domAnimation}>
            <RouterProvider router={router} />
          </LazyMotion>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </HelmetProvider>
);

export default App;
