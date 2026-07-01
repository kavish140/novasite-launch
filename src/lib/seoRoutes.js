export const SITE_URL = "https://sitenova.dev";

export const routes = [
  {
    path: "",
    title: "Best Website Designer in Mulund, Mumbai & Nearby Areas | SiteNova",
    description: "Is your website losing you customers? SiteNova builds fast, custom websites for businesses in Mulund, Mumbai — SEO-ready, mobile-first, and delivered in 7–14 days. From ₹10,000.",
    keywords: "best website designer in Mulund, website designer in Mumbai, website design Mulund, web development Mulund, SEO friendly website designer",
    sitemapPriority: "1.0",
    sitemapChangefreq: "weekly",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${SITE_URL}/#website`,
          "name": "SiteNova",
          "url": `${SITE_URL}/`,
          "description": "Best website designer in Mulund, Mumbai, and nearby areas for SEO-ready, mobile-first websites.",
          "inLanguage": "en-IN"
        },
        {
          "@type": "ProfessionalService",
          "@id": `${SITE_URL}/#business`,
          "name": "SiteNova Web Design",
          "url": `${SITE_URL}/`,
          "image": `${SITE_URL}/seo-preview.png`,
          "description": "SiteNova builds high-performance websites, SEO systems, and conversion-focused digital experiences for local Mumbai businesses and surrounding areas.",
          "telephone": "+91-9326060621",
          "email": "kavishganatra5@gmail.com",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Mulund",
            "addressRegion": "Maharashtra",
            "addressCountry": "IN"
          },
          "areaServed": ["Mulund", "Mumbai", "Bhandup", "Nahur", "Thane", "Ghatkopar", "Powai", "Central Mumbai"],
          "serviceType": "Website design and web development",
          "priceRange": "Rs. 10,000+"
        }
      ]
    }
  },
  {
    path: "quote",
    title: "Website Quotes Starting from Rs. 10,000 | SiteNova",
    description: "Get a website quote starting from Rs. 10,000. Start our interactive scoping form or contact us via WhatsApp to discuss your web design project in Mumbai.",
    keywords: "website quote Mulund, website designer Mumbai, web development quote, website starting price",
    sitemapPriority: "0.8",
    sitemapChangefreq: "monthly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Get a Web Design Quote",
      "url": `${SITE_URL}/quote`,
      "description": "Get an instant scoping estimate and start your web development project with SiteNova."
    }
  },
  {
    path: "thank-you",
    title: "Request Received | SiteNova",
    description: "Thank you for your request. We have received your inquiry and will be in touch shortly.",
    keywords: "thank you, request received, website quote",
    sitemapPriority: "0.1",
    sitemapChangefreq: "yearly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Request Received",
      "url": `${SITE_URL}/thank-you`,
      "description": "Confirmation page for submitted inquiries."
    }
  },
  {
    path: "contact-us",
    title: "Contact SiteNova | Web Development Agency in Mumbai",
    description: "Get in touch with SiteNova for custom web development. Call us directly, send a WhatsApp message, or request a quote for your next project.",
    keywords: "contact web designer Mumbai, SiteNova contact, hire web developer Mumbai, website development inquiry",
    sitemapPriority: "0.8",
    sitemapChangefreq: "monthly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact SiteNova",
      "url": `${SITE_URL}/contact-us`,
      "description": "Get in touch with SiteNova for custom web development."
    }
  },
  {
    path: "services/ecommerce",
    title: "E-commerce Website Design Services in Mumbai | SiteNova",
    description: "Build a high-converting online shop. SiteNova designs custom e-commerce stores in Mumbai with Razorpay/Stripe, coupon systems, and fast checkout workflows.",
    keywords: "e-commerce web design Mumbai, online store developer Mumbai, Shopify developer Mumbai, WooCommerce website designer, custom e-commerce",
    sitemapPriority: "0.9",
    sitemapChangefreq: "monthly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "E-commerce Website Design & Development",
      "description": "Build high-converting online stores with custom cart, product search, inventory controls, and payment gateway setups.",
      "provider": {
        "@type": "ProfessionalService",
        "name": "SiteNova Web Design",
        "url": `${SITE_URL}/`
      },
      "areaServed": "Mumbai",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "price": "15000",
        "priceValuedOnly": "true"
      }
    }
  },
  {
    path: "services/web-applications",
    title: "Custom Web Application Development Services in Mumbai | SiteNova",
    description: "Build custom web applications with React, Next.js, Node.js, and Databases. SiteNova designs secure, scalable dashboard and web systems in Mumbai.",
    keywords: "custom web application developer Mumbai, React developer Mumbai, Nextjs developer Mumbai, web software developer Mumbai, dashboard development Mumbai",
    sitemapPriority: "0.9",
    sitemapChangefreq: "monthly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Custom Web Application Development",
      "description": "Build scalable, responsive web portals, custom admin panels, dashboards, and API setups using modern Node, React, and databases.",
      "provider": {
        "@type": "ProfessionalService",
        "name": "SiteNova Web Design",
        "url": `${SITE_URL}/`
      },
      "areaServed": "Mumbai",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "price": "30000",
        "priceValuedOnly": "true"
      }
    }
  },
  {
    path: "services/seo-optimization",
    title: "SEO and Speed Optimization Services in Mumbai | SiteNova",
    description: "Rank higher on Google. SiteNova optimizes website speeds, fixes core web vitals, and implements local SEO systems for Mumbai businesses to capture more customers.",
    keywords: "SEO and speed optimization Mumbai, PageSpeed optimizer Mumbai, Core Web Vitals specialist Mumbai, local SEO services Mumbai, website speed tuning",
    sitemapPriority: "0.9",
    sitemapChangefreq: "monthly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "SEO & Page Speed Optimization",
      "description": "Tune web speed metrics to pass Core Web Vitals audits and optimize search keywords and schemas for Google Maps and organic listings.",
      "provider": {
        "@type": "ProfessionalService",
        "name": "SiteNova Web Design",
        "url": `${SITE_URL}/`
      },
      "areaServed": "Mumbai"
    }
  },
  {
    path: "location/mulund",
    title: "Best Website Designer in Mulund, Mumbai | SiteNova",
    description: "SiteNova is based in Mulund, Mumbai — building fast, custom websites for local businesses on LBS Road, Mulund West, and Mulund East. SEO-ready, mobile-first, delivered in 7–14 days.",
    keywords: "website designer in Mulund, web design Mulund, best website designer in Mulund, website developer Mulund Mumbai, local SEO Mulund, web design agency Mulund",
    sitemapPriority: "0.95",
    sitemapChangefreq: "weekly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "ProfessionalService"],
      "name": "SiteNova Web Design - Mulund",
      "url": `${SITE_URL}/location/mulund`,
      "telephone": "+91-9326060621",
      "email": "kavishganatra5@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Mulund",
        "addressRegion": "Maharashtra",
        "postalCode": "400080",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 19.1726,
        "longitude": 72.9570
      },
      "hasMap": "https://share.google/Y6mq6VLzTQj9zN4kr",
      "areaServed": ["Mulund West", "Mulund East", "Nahur", "Bhandup", "Vikhroli", "LBS Road"],
      "serviceType": "Website design and web development",
      "priceRange": "₹10,000+",
      "sameAs": [
        "https://share.google/Y6mq6VLzTQj9zN4kr",
        "https://www.clutch.co/profile/sitenova",
        "https://techbehemoths.com/company/sitenova"
      ]
    }
  },
  {
    path: "location/thane",
    title: "Best Website Designer in Thane, Mumbai | SiteNova",
    description: "SiteNova builds premium, SEO-ready, mobile-first websites in Thane, Mumbai. Grow your business with fast load times and Google Map Pack optimization.",
    keywords: "web designer in Thane, website design Thane, Thane web developers, software development Thane, local SEO Thane",
    sitemapPriority: "0.85",
    sitemapChangefreq: "weekly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "SiteNova Web Design - Thane Service Division",
      "url": `${SITE_URL}/location/thane`,
      "telephone": "+91-9326060621",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Thane",
        "addressRegion": "Maharashtra",
        "addressCountry": "IN"
      },
      "areaServed": ["Wagle Estate", "Hiranandani Estate", "Ghodbunder Road", "Majiwada", "Vartak Nagar", "Kopri"],
      "serviceType": "Website design and web development"
    }
  },
  {
    path: "location/powai",
    title: "Best Website Designer in Powai, Mumbai | SiteNova",
    description: "SiteNova builds premium, SEO-ready, mobile-first websites in Powai, Mumbai. Grow your business with fast load times and Google Map Pack optimization.",
    keywords: "web developer in Powai, website design Powai, Powai web agency, SaaS development Powai, startup website Mumbai",
    sitemapPriority: "0.85",
    sitemapChangefreq: "weekly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "SiteNova Web Design - Powai Service Division",
      "url": `${SITE_URL}/location/powai`,
      "telephone": "+91-9326060621",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Powai",
        "addressRegion": "Maharashtra",
        "addressCountry": "IN"
      },
      "areaServed": ["Hiranandani Gardens", "Chandivali", "JVLR", "IIT Bombay area", "Saki Naka", "Vikhroli"],
      "serviceType": "Website design and web development"
    }
  },
  {
    path: "location/andheri",
    title: "Best Website Designer in Andheri, Mumbai | SiteNova",
    description: "SiteNova builds premium, SEO-ready, mobile-first websites in Andheri, Mumbai. Grow your business with fast load times and Google Map Pack optimization.",
    keywords: "web designer in Andheri, website design Andheri, Andheri web development, MIDC web company, business website Andheri",
    sitemapPriority: "0.85",
    sitemapChangefreq: "weekly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "SiteNova Web Design - Andheri Service Division",
      "url": `${SITE_URL}/location/andheri`,
      "telephone": "+91-9326060621",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Andheri",
        "addressRegion": "Maharashtra",
        "addressCountry": "IN"
      },
      "areaServed": ["Andheri East", "Andheri West", "Lokhandwala", "MIDC Andheri", "Versova", "Oshiwara"],
      "serviceType": "Website design and web development"
    }
  },
  {
    path: "location/bhandup",
    title: "Best Website Designer in Bhandup, Mumbai | SiteNova",
    description: "SiteNova builds premium, SEO-ready, mobile-first websites in Bhandup, Mumbai. Grow your business with fast load times and Google Map Pack optimization.",
    keywords: "web designer in Bhandup, website design Bhandup, Bhandup web developer, local business website Bhandup, website designer near LBS Marg",
    sitemapPriority: "0.85",
    sitemapChangefreq: "weekly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "SiteNova Web Design - Bhandup Service Division",
      "url": `${SITE_URL}/location/bhandup`,
      "telephone": "+91-9326060621",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Bhandup",
        "addressRegion": "Maharashtra",
        "addressCountry": "IN"
      },
      "areaServed": ["Bhandup West", "Bhandup East", "LBS Marg", "Nahur", "Mulund", "Kanjurmarg"],
      "serviceType": "Website design and web development"
    }
  },
  {
    path: "location/nahur",
    title: "Best Website Designer in Nahur, Mumbai | SiteNova",
    description: "SiteNova builds premium, SEO-ready, mobile-first websites in Nahur, Mumbai. Grow your business with fast load times and Google Map Pack optimization.",
    keywords: "web designer in Nahur, website design Nahur, Nahur web developer, affordable website Nahur, website designer near Nahur station",
    sitemapPriority: "0.85",
    sitemapChangefreq: "weekly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "SiteNova Web Design - Nahur Service Division",
      "url": `${SITE_URL}/location/nahur`,
      "telephone": "+91-9326060621",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Nahur",
        "addressRegion": "Maharashtra",
        "addressCountry": "IN"
      },
      "areaServed": ["Nahur East", "Nahur West", "Bhandup", "Mulund", "Kanjurmarg", "Airoli"],
      "serviceType": "Website design and web development"
    }
  },
  {
    path: "location/ghatkopar",
    title: "Best Website Designer in Ghatkopar, Mumbai | SiteNova",
    description: "SiteNova builds premium, SEO-ready, mobile-first websites in Ghatkopar, Mumbai. Grow your business with fast load times and Google Map Pack optimization.",
    keywords: "web designer in Ghatkopar, website design Ghatkopar, Ghatkopar web developer, business website Ghatkopar, website designer near R City Mall",
    sitemapPriority: "0.85",
    sitemapChangefreq: "weekly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "SiteNova Web Design - Ghatkopar Service Division",
      "url": `${SITE_URL}/location/ghatkopar`,
      "telephone": "+91-9326060621",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Ghatkopar",
        "addressRegion": "Maharashtra",
        "addressCountry": "IN"
      },
      "areaServed": ["Ghatkopar East", "Ghatkopar West", "Vikhroli", "Kurla", "LBS Road", "Tilak Nagar"],
      "serviceType": "Website design and web development"
    }
  },
  {
    path: "location/vikhroli",
    title: "Best Website Designer in Vikhroli, Mumbai | SiteNova",
    description: "SiteNova builds premium, SEO-ready, mobile-first websites in Vikhroli, Mumbai. Grow your business with fast load times and Google Map Pack optimization.",
    keywords: "web designer in Vikhroli, website design Vikhroli, Vikhroli web developer, Godrej Vikhroli web design, business website Vikhroli",
    sitemapPriority: "0.85",
    sitemapChangefreq: "weekly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "SiteNova Web Design - Vikhroli Service Division",
      "url": `${SITE_URL}/location/vikhroli`,
      "telephone": "+91-9326060621",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Vikhroli",
        "addressRegion": "Maharashtra",
        "addressCountry": "IN"
      },
      "areaServed": ["Vikhroli East", "Vikhroli West", "Godrej Campus", "Powai", "Kanjurmarg", "Bhandup"],
      "serviceType": "Website design and web development"
    }
  },
  {
    path: "location/kurla",
    title: "Best Website Designer in Kurla, Mumbai | SiteNova",
    description: "SiteNova builds premium, SEO-ready, mobile-first websites in Kurla, Mumbai. Grow your business with fast load times and Google Map Pack optimization.",
    keywords: "web designer in Kurla, website design Kurla, Kurla web developer, business website near BKC, website designer Kurla Mumbai",
    sitemapPriority: "0.85",
    sitemapChangefreq: "weekly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "SiteNova Web Design - Kurla Service Division",
      "url": `${SITE_URL}/location/kurla`,
      "telephone": "+91-9326060621",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Kurla",
        "addressRegion": "Maharashtra",
        "addressCountry": "IN"
      },
      "areaServed": ["Kurla East", "Kurla West", "BKC", "Vidyavihar", "Ghatkopar", "Chembur"],
      "serviceType": "Website design and web development"
    }
  },
  {
    path: "location/dadar",
    title: "Best Website Designer in Dadar, Mumbai | SiteNova",
    description: "SiteNova builds premium, SEO-ready, mobile-first websites in Dadar, Mumbai. Grow your business with fast load times and Google Map Pack optimization.",
    keywords: "web designer in Dadar, website design Dadar, Dadar web developer, business website Dadar Mumbai, website designer central Mumbai",
    sitemapPriority: "0.85",
    sitemapChangefreq: "weekly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "SiteNova Web Design - Dadar Service Division",
      "url": `${SITE_URL}/location/dadar`,
      "telephone": "+91-9326060621",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Dadar",
        "addressRegion": "Maharashtra",
        "addressCountry": "IN"
      },
      "areaServed": ["Dadar East", "Dadar West", "Shivaji Park", "Prabhadevi", "Matunga", "Mahim"],
      "serviceType": "Website design and web development"
    }
  },
  {
    path: "location/lower-parel",
    title: "Best Website Designer in Lower Parel, Mumbai | SiteNova",
    description: "SiteNova builds premium, SEO-ready, mobile-first websites in Lower Parel, Mumbai. Grow your business with fast load times and Google Map Pack optimization.",
    keywords: "web designer in Lower Parel, website design Lower Parel, Lower Parel web agency, business website Kamala Mills, premium web design Mumbai",
    sitemapPriority: "0.85",
    sitemapChangefreq: "weekly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "SiteNova Web Design - Lower Parel Service Division",
      "url": `${SITE_URL}/location/lower-parel`,
      "telephone": "+91-9326060621",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Lower Parel",
        "addressRegion": "Maharashtra",
        "addressCountry": "IN"
      },
      "areaServed": ["Lower Parel", "Worli", "Prabhadevi", "Kamala Mills", "Mahalakshmi"],
      "serviceType": "Website design and web development"
    }
  },
  {
    path: "location/mahalakshmi",
    title: "Best Website Designer in Mahalakshmi, Mumbai | SiteNova",
    description: "SiteNova builds premium, SEO-ready, mobile-first websites in Mahalakshmi, Mumbai. Grow your business with fast load times and Google Map Pack optimization.",
    keywords: "web designer in Mahalakshmi, website design Mahalakshmi, South Mumbai web developer, premium web design Mahalakshmi, luxury brand web design",
    sitemapPriority: "0.85",
    sitemapChangefreq: "weekly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "SiteNova Web Design - Mahalakshmi Service Division",
      "url": `${SITE_URL}/location/mahalakshmi`,
      "telephone": "+91-9326060621",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Mahalakshmi",
        "addressRegion": "Maharashtra",
        "addressCountry": "IN"
      },
      "areaServed": ["Mahalakshmi", "Breach Candy", "Pedder Road", "Tardeo", "Cumballa Hill"],
      "serviceType": "Website design and web development"
    }
  },
  {
    path: "location/pedder-road",
    title: "Best Website Designer in Pedder Road, Mumbai | SiteNova",
    description: "SiteNova builds premium, SEO-ready, mobile-first websites in Pedder Road, Mumbai. Grow your business with fast load times and Google Map Pack optimization.",
    keywords: "web designer in Pedder Road, website design Pedder Road, South Mumbai web design agency, clinic web design Mumbai, luxury web developer Mumbai",
    sitemapPriority: "0.85",
    sitemapChangefreq: "weekly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "SiteNova Web Design - Pedder Road Service Division",
      "url": `${SITE_URL}/location/pedder-road`,
      "telephone": "+91-9326060621",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Pedder Road",
        "addressRegion": "Maharashtra",
        "addressCountry": "IN"
      },
      "areaServed": ["Pedder Road", "Carmichael Road", "Altamount Road", "Malabar Hill", "Breach Candy"],
      "serviceType": "Website design and web development"
    }
  },
  {
    path: "free-audit",
    title: "Get a Free Website Audit in Mumbai | SiteNova",
    description: "Get a free expert review of your current website. We analyze performance, SEO, mobile responsiveness, and provide actionable conversion tips for your business.",
    keywords: "free website audit, website review, SEO check Mumbai, website performance report",
    sitemapPriority: "0.80",
    sitemapChangefreq: "monthly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Free Website Audit",
      "url": `${SITE_URL}/free-audit`,
      "description": "Get a free expert review of your current website's SEO and performance."
    }
  },
  {
    path: "blog",
    title: "Local Web Design Blog | SiteNova",
    description: "Read our latest articles on web design, SEO, and growing your local business in Mumbai.",
    keywords: "web design blog, SEO tips Mumbai, local business marketing, website advice",
    sitemapPriority: "0.90",
    sitemapChangefreq: "weekly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "SiteNova Web Design Blog",
      "url": `${SITE_URL}/blog`,
      "description": "Insights on web design, SEO, and business growth for local businesses."
    }
  },
  {
    path: "websites-for-doctors",
    title: "Professional Websites for Doctors & Clinics in Mumbai | SiteNova",
    description: "SiteNova builds patient-friendly, SEO-optimized websites for doctors, dentists, and clinics in Mumbai. Online appointments, patient testimonials, and mobile-first design.",
    keywords: "website for doctors Mumbai, clinic website design, doctor website designer Mulund, healthcare website Mumbai, medical practice website design",
    sitemapPriority: "0.90",
    sitemapChangefreq: "monthly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Healthcare Website Design for Doctors & Clinics",
      "provider": {
        "@type": "ProfessionalService",
        "name": "SiteNova",
        "url": `${SITE_URL}`
      },
      "description": "Professional website design for doctors, dentists, physiotherapists, and clinics in Mumbai. Includes online appointment booking, SEO optimization, and mobile-first design.",
      "areaServed": { "@type": "City", "name": "Mumbai" },
      "serviceType": "Website Design for Healthcare Professionals"
    }
  },
  {
    path: "websites-for-finance",
    title: "Professional Websites for CAs, Financial Advisors & Insurance Agents | SiteNova",
    description: "SiteNova builds trust-building, SEO-optimized websites for CAs, financial advisors, and insurance agents in Mumbai. Showcase your expertise and generate leads online.",
    keywords: "website for CA firms, financial advisor website design Mumbai, insurance agent website, CA firm website design, finance website Mumbai",
    sitemapPriority: "0.90",
    sitemapChangefreq: "monthly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Website Design for Financial Professionals",
      "provider": {
        "@type": "ProfessionalService",
        "name": "SiteNova",
        "url": `${SITE_URL}`
      },
      "description": "Professional website design for CAs, financial advisors, and insurance agents in Mumbai. Build trust, showcase expertise, and generate qualified leads.",
      "areaServed": { "@type": "City", "name": "Mumbai" },
      "serviceType": "Website Design for Financial Professionals"
    }
  },
  {
    path: "websites-for-real-estate",
    title: "Professional Websites for Real Estate Agents & Builders in Mumbai | SiteNova",
    description: "SiteNova builds lead-generating websites for real estate agents, builders, and property dealers in Mumbai. Property listings, virtual tours, and lead capture forms.",
    keywords: "real estate website design Mumbai, property dealer website, builder website design, real estate agent website, property listing website Mumbai",
    sitemapPriority: "0.90",
    sitemapChangefreq: "monthly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Website Design for Real Estate Professionals",
      "provider": {
        "@type": "ProfessionalService",
        "name": "SiteNova",
        "url": `${SITE_URL}`
      },
      "description": "Lead-generating websites for real estate agents, builders, and property dealers in Mumbai. Property listings, image galleries, and lead capture forms.",
      "areaServed": { "@type": "City", "name": "Mumbai" },
      "serviceType": "Website Design for Real Estate Professionals"
    }
  },
  {
    path: "pricing",
    title: "Transparent Website Pricing & Packages in Mumbai | SiteNova",
    description: "View our transparent pricing and packages for local business websites, e-commerce stores, and web applications in Mumbai. No hidden fees.",
    keywords: "website pricing Mumbai, web design packages, e-commerce website cost, custom web app pricing",
    sitemapPriority: "0.80",
    sitemapChangefreq: "monthly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Website Pricing and Packages",
      "url": `${SITE_URL}/pricing`,
      "description": "View our transparent web development and design pricing."
    }
  },
  {
    path: "websites-for-lawyers",
    title: "Professional Websites for Lawyers & Law Firms in Mumbai | SiteNova",
    description: "SiteNova builds authority-driven, SEO-optimized websites for lawyers, advocates, and law firms in Mumbai. Showcase expertise, build credibility, and generate client inquiries 24/7.",
    keywords: "website for lawyers in Mumbai, law firm website design India, advocate website Mumbai, lawyer website designer Mulund, legal website development",
    sitemapPriority: "0.90",
    sitemapChangefreq: "monthly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Websites for Lawyers and Law Firms",
      "provider": { "@type": "ProfessionalService", "name": "SiteNova", "url": `${SITE_URL}` },
      "areaServed": { "@type": "City", "name": "Mumbai" },
      "audience": { "@type": "Audience", "audienceType": "Lawyers, Advocates, Law Firms, Legal Professionals" },
      "description": "Authority-driven, SEO-optimized websites for lawyers, advocates, and law firms in Mumbai. Practice area pages, client testimonials, and mobile-first design.",
      "url": `${SITE_URL}/websites-for-lawyers`,
      "serviceType": "Legal Website Design"
    }
  },
  {
    path: "websites-for-consultants",
    title: "Professional Websites for Consultants, Coaches & Advisors in Mumbai | SiteNova",
    description: "SiteNova builds authority-building, SEO-optimized websites for consultants, business coaches, and advisors in Mumbai. Showcase your expertise, attract premium clients, and book consultations online.",
    keywords: "website for consultants in Mumbai, consultant portfolio website India, business coach website design, consultant website designer Mumbai, professional consulting website",
    sitemapPriority: "0.90",
    sitemapChangefreq: "monthly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Websites for Consultants and Advisors",
      "provider": { "@type": "ProfessionalService", "name": "SiteNova", "url": `${SITE_URL}` },
      "areaServed": { "@type": "City", "name": "Mumbai" },
      "audience": { "@type": "Audience", "audienceType": "Consultants, Business Coaches, Advisors, Strategy Professionals" },
      "description": "Authority-building, lead-generating websites for consultants, business coaches, and advisors in Mumbai with expertise pages, booking integration, and thought leadership blogs.",
      "url": `${SITE_URL}/websites-for-consultants`,
      "serviceType": "Consulting Website Design"
    }
  },
  {
    path: "about",
    title: "About SiteNova | Web Design Studio in Mumbai",
    description: "SiteNova is a custom web design and development studio founded by Kavish Ganatra in Mulund, Mumbai. We write bespoke React and Next.js code for high-performance websites.",
    keywords: "about SiteNova, Kavish Ganatra, web design agency Mumbai, custom web development Mumbai, SiteNova dev",
    sitemapPriority: "0.90",
    sitemapChangefreq: "monthly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About SiteNova",
      "url": `${SITE_URL}/about`,
      "description": "About SiteNova web design studio in Mumbai."
    }
  },
  {
    path: "our-process",
    title: "Our Web Design Process | SiteNova Mumbai",
    description: "Learn how SiteNova builds high-performance, custom-coded React websites. From discovery and UI design to development and SEO optimization.",
    keywords: "web design process, custom web development process, SiteNova process, website development phases",
    sitemapPriority: "0.85",
    sitemapChangefreq: "monthly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Our Web Design Process",
      "url": `${SITE_URL}/our-process`,
      "description": "Learn about our end-to-end custom web design process."
    }
  },
  {
    path: "why-us",
    title: "Why Choose SiteNova for Web Design in Mumbai? | SiteNova",
    description: "Why choose SiteNova? We hand-code our websites in React for 95+ PageSpeed scores, optimized for AI Search (GEO) and local SEO.",
    keywords: "why choose SiteNova, custom vs template website, best web development agency Mumbai, fast loading websites",
    sitemapPriority: "0.85",
    sitemapChangefreq: "monthly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Why Choose SiteNova",
      "url": `${SITE_URL}/why-us`,
      "description": "Why we are the best choice for custom web development in Mumbai."
    }
  },
  {
    path: "location/bandra",
    title: "Best Website Designer in Bandra, Mumbai | SiteNova",
    description: "SiteNova builds premium, SEO-ready, mobile-first websites in Bandra, Mumbai. Grow your business with fast load times and Google Map Pack optimization.",
    keywords: "web designer in Bandra, website design Bandra, Bandra web developers, startup website Bandra, local SEO Bandra Mumbai",
    sitemapPriority: "0.85",
    sitemapChangefreq: "weekly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "SiteNova Web Design - Bandra Service Division",
      "url": `${SITE_URL}/location/bandra`,
      "telephone": "+91-9326060621",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Bandra",
        "addressRegion": "Maharashtra",
        "addressCountry": "IN"
      },
      "areaServed": ["Bandra West", "Bandra East", "BKC", "Khar", "Santacruz", "Mahim"],
      "serviceType": "Website design and web development"
    }
  },
  {
    path: "websites-for-startups",
    title: "Custom Website Development for Startups & SaaS in Mumbai | SiteNova",
    description: "SiteNova builds high-performance, investor-ready React websites for tech startups and SaaS companies in Mumbai. Launch fast, scale easily, and impress users.",
    keywords: "startup website design Mumbai, SaaS website development, React developer for startups, tech startup web design, investor ready website",
    sitemapPriority: "0.90",
    sitemapChangefreq: "monthly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Websites for Startups and SaaS",
      "provider": { "@type": "ProfessionalService", "name": "SiteNova", "url": `${SITE_URL}` },
      "areaServed": { "@type": "City", "name": "Mumbai" },
      "audience": { "@type": "Audience", "audienceType": "Tech Startups, SaaS Companies, Founders" },
      "description": "High-performance, custom-coded React websites for tech startups in Mumbai. Built for speed, conversions, and scalable growth.",
      "url": `${SITE_URL}/websites-for-startups`,
      "serviceType": "Startup Web Development"
    }
  },
  {
    path: "websites-for-restaurants",
    title: "Professional Websites for Restaurants & Cafes in Mumbai | SiteNova",
    description: "SiteNova builds stunning, mouth-watering websites for restaurants, cafes, and cloud kitchens in Mumbai. Digital menus, reservations, and local SEO.",
    keywords: "restaurant website design Mumbai, cafe website developer, cloud kitchen website, digital menu website, food business web design",
    sitemapPriority: "0.90",
    sitemapChangefreq: "monthly",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Websites for Restaurants and Cafes",
      "provider": { "@type": "ProfessionalService", "name": "SiteNova", "url": `${SITE_URL}` },
      "areaServed": { "@type": "City", "name": "Mumbai" },
      "audience": { "@type": "Audience", "audienceType": "Restaurants, Cafes, Cloud Kitchens, Food Businesses" },
      "description": "Appetizing, mobile-optimized websites for restaurants in Mumbai featuring digital menus, table reservations, and local SEO.",
      "url": `${SITE_URL}/websites-for-restaurants`,
      "serviceType": "Restaurant Web Design"
    }
  }
];
