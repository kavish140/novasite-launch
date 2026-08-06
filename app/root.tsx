import { Suspense, lazy } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ClientOnly } from "@/components/ClientOnly";
import { LazyMotion, domAnimation } from "framer-motion";

import "@/index.css";

const ScrollProgress = lazy(() => import("@/components/ScrollProgress"));
const BookCallWidget = lazy(() => import("@/components/BookCallWidget"));
const ExitIntentPopup = lazy(() => import("@/components/ExitIntentPopup"));
const MobileAuditBar = lazy(() => import("@/components/MobileAuditBar"));

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="theme-color"
          content="#0a0e1a"
          media="(prefers-color-scheme: dark)"
        />
        <meta
          name="theme-color"
          content="#f8fafc"
          media="(prefers-color-scheme: light)"
        />

        {/* RR7 injects route-level meta() and links() here */}
        <Meta />
        <Links />

        {/* Favicons */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Hreflang */}
        <link rel="alternate" href="https://sitenova.dev/" hrefLang="en-IN" />
        <link rel="alternate" href="https://sitenova.dev/" hrefLang="x-default" />

        {/* Google Fonts — preload + async load */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500;600&display=swap"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
          media="print"
          onLoad={(e) => { (e.currentTarget as HTMLLinkElement).media = "all"; }}
        />
        <noscript>
          <link
            href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500;600&display=swap"
            rel="stylesheet"
          />
        </noscript>

        {/* Theme flash prevention — runs before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('novasite-theme')||'dark';document.documentElement.classList.add(t==='light'?'light':'dark')}catch(e){document.documentElement.classList.add('dark')}`,
          }}
        />

        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-P587639R');`,
          }}
        />

        {/* Google Analytics 4 (Deferred) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.addEventListener("load",function(){setTimeout(function(){var s=document.createElement('script');s.src='https://www.googletagmanager.com/gtag/js?id=G-EBZGS65QQH';s.async=true;document.head.appendChild(s);window.dataLayer=window.dataLayer||[];function g(){dataLayer.push(arguments)}g('js',new Date());g('config','G-EBZGS65QQH')},2000)});`,
          }}
        />

        {/* Google Ads */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-18182593308"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){window.dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','AW-18182593308');gtag('config','AW-18182593308/SzalCITh_skcEJy2kd5D',{'phone_conversion_number':'9326060621'});`,
          }}
        />

        {/* Microsoft Clarity */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","xaxjnw6ykd");`,
          }}
        />

        {/* Site-wide JSON-LD (Organization + WebSite + ProfessionalService) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://sitenova.dev/#website",
                  name: "SiteNova",
                  url: "https://sitenova.dev/",
                  description:
                    "Custom web design and development agency in Mulund, Mumbai. Founded by Kavish Ganatra. Not affiliated with sitenovaagency.com.",
                  inLanguage: "en-IN",
                  potentialAction: {
                    "@type": "SearchAction",
                    target: "https://sitenova.dev/?s={search_term_string}",
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": "Organization",
                  "@id": "https://sitenova.dev/#organization",
                  name: "SiteNova",
                  alternateName: "SiteNova Web Design",
                  url: "https://sitenova.dev/",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://sitenova.dev/favicon-32x32.png",
                    width: 32,
                    height: 32,
                  },
                  image: "https://sitenova.dev/seo-preview.png",
                  description:
                    "SiteNova is a custom web design and development agency based in Mulund, Mumbai, India. Founded by Kavish Ganatra, SiteNova builds high-performance React and Next.js websites with 90+ PageSpeed scores. Not to be confused with sitenovaagency.com, which is a separate, unaffiliated business.",
                  foundingDate: "2024",
                  founder: {
                    "@type": "Person",
                    "@id": "https://sitenova.dev/#founder",
                    name: "Kavish Ganatra",
                    jobTitle: "Founder & Lead Developer",
                    url: "https://sitenova.dev/",
                    sameAs: [
                      "https://www.crunchbase.com/organization/sitenova-web-design",
                    ],
                  },
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "Mulund",
                    addressLocality: "Mumbai",
                    addressRegion: "Maharashtra",
                    postalCode: "400080",
                    addressCountry: "IN",
                  },
                  contactPoint: {
                    "@type": "ContactPoint",
                    telephone: "+91-9326060621",
                    contactType: "customer service",
                    areaServed: "IN",
                    availableLanguage: ["English", "Hindi", "Gujarati"],
                  },
                  sameAs: [
                    "https://www.crunchbase.com/organization/sitenova-web-design",
                    "https://www.clutch.co/profile/sitenova",
                    "https://techbehemoths.com/company/sitenova",
                    "https://share.google/Y6mq6VLzTQj9zN4kr",
                  ],
                  knowsAbout: [
                    "Web Design",
                    "Web Development",
                    "React.js",
                    "Next.js",
                    "TypeScript",
                    "Tailwind CSS",
                    "Local SEO",
                    "Core Web Vitals",
                    "Generative Engine Optimisation",
                    "Schema.org Structured Data",
                    "E-Commerce Development",
                    "Custom Web Applications",
                  ],
                  areaServed: [
                    "Mulund", "Mumbai", "Bhandup", "Nahur", "Thane",
                    "Ghatkopar", "Powai", "Central Mumbai", "Vikhroli",
                    "Kurla", "Dadar", "Andheri", "Lower Parel",
                    "Mahalakshmi", "Pedder Road",
                  ],
                  priceRange: "Rs. 10,000+",
                  telephone: "+91-9326060621",
                  email: "kavishganatra5@gmail.com",
                  openingHours: "Mo-Sa 10:00-19:00",
                },
                {
                  "@type": "ProfessionalService",
                  "@id": "https://sitenova.dev/#business",
                  name: "SiteNova",
                  url: "https://sitenova.dev/",
                  description:
                    "SiteNova builds high-performance websites, SEO systems, and conversion-focused digital experiences for businesses in Mumbai.",
                  sameAs: [
                    "https://www.crunchbase.com/organization/sitenova-web-design",
                    "https://www.clutch.co/profile/sitenova",
                    "https://techbehemoths.com/company/sitenova",
                    "https://share.google/Y6mq6VLzTQj9zN4kr",
                  ],
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Mulund",
                    addressRegion: "Maharashtra",
                    addressCountry: "IN",
                  },
                  areaServed: [
                    "Mulund", "Mumbai", "Bhandup", "Nahur", "Thane",
                    "Ghatkopar", "Powai", "Central Mumbai", "Vikhroli",
                    "Kurla", "Dadar", "Andheri", "Lower Parel",
                    "Mahalakshmi", "Pedder Road",
                  ],
                  serviceType: "Website design and web development",
                  priceRange: "Rs. 10,000+",
                  telephone: "+91-9326060621",
                  email: "kavishganatra5@gmail.com",
                },
              ],
            }).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P587639R"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {children}

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="novasite-theme"
      themes={["dark", "light"]}
      disableTransitionOnChange
    >
      <ErrorBoundary>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <LazyMotion features={domAnimation}>
            <Outlet />
            <Suspense fallback={null}>
              <ClientOnly>
                <ScrollProgress />
                <BookCallWidget />
                <ExitIntentPopup />
                <MobileAuditBar />
              </ClientOnly>
            </Suspense>
          </LazyMotion>
        </TooltipProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
