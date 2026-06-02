import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, "../dist");
const BASE_HTML_PATH = path.join(DIST_DIR, "index.html");

const SITE_URL = "https://sitenova.dev";

// Define metadata for all routes
const routes = [
  {
    path: "",
    title: "Best Website Designer in Mulund, Mumbai & Nearby Areas | SiteNova",
    description: "SiteNova builds SEO-ready, mobile-first websites for businesses in Mulund, Mumbai, and nearby areas like Bhandup, Nahur, Thane, Ghatkopar, and Powai.",
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
          "priceRange": "Rs. 5,000+"
        }
      ]
    }
  },
  {
    path: "quote",
    title: "Website Quotes Starting from Rs. 5,000 | SiteNova",
    description: "Get a website quote starting from Rs. 5,000. Start our interactive scoping form or contact us via WhatsApp to discuss your web design project in Mumbai.",
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
      "url": `${SITE_URL}/location/andheri/`,
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
      "url": `${SITE_URL}/free-audit/`,
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
      "url": `${SITE_URL}/blog/`,
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
  }
];

function prerender() {
  if (!fs.existsSync(BASE_HTML_PATH)) {
    console.error(`Base HTML file not found at: ${BASE_HTML_PATH}. Run "npm run build" first.`);
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(BASE_HTML_PATH, "utf8");

  console.log(`\n--- Starting SiteNova Pre-renderer ---`);

  // Build each route folder & index.html
  routes.forEach((route) => {
    let finalHtml = baseHtml;

    // Replace Title
    finalHtml = finalHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title>${route.title}</title>`);

    // Replace Description
    const descMetaRegex = /<meta name="description" content="[^"]*"\s*\/?>/i;
    if (descMetaRegex.test(finalHtml)) {
      finalHtml = finalHtml.replace(descMetaRegex, `<meta name="description" content="${route.description}" />`);
    } else {
      finalHtml = finalHtml.replace("</head>", `  <meta name="description" content="${route.description}" />\n  </head>`);
    }

    // Replace Keywords
    const keywordsMetaRegex = /<meta name="keywords" content="[^"]*"\s*\/?>/i;
    if (keywordsMetaRegex.test(finalHtml)) {
      finalHtml = finalHtml.replace(keywordsMetaRegex, `<meta name="keywords" content="${route.keywords}" />`);
    } else {
      finalHtml = finalHtml.replace("</head>", `  <meta name="keywords" content="${route.keywords}" />\n  </head>`);
    }

    // Replace canonical links
    const canonicalRegex = /<link rel="canonical" href="[^"]*"\s*\/?>/i;
    const currentCanonicalUrl = route.path ? `${SITE_URL}/${route.path}/` : `${SITE_URL}/`;
    if (canonicalRegex.test(finalHtml)) {
      finalHtml = finalHtml.replace(canonicalRegex, `<link rel="canonical" href="${currentCanonicalUrl}" />`);
    }

    // Replace OpenGraph & Twitter title + desc + url
    finalHtml = finalHtml.replace(/<meta property="og:title" content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${route.title}" />`);
    finalHtml = finalHtml.replace(/<meta property="og:description" content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${route.description}" />`);
    finalHtml = finalHtml.replace(/<meta property="og:url" content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${currentCanonicalUrl}" />`);
    finalHtml = finalHtml.replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${route.title}" />`);
    finalHtml = finalHtml.replace(/<meta name="twitter:description" content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${route.description}" />`);
    finalHtml = finalHtml.replace(/<meta name="twitter:image" content="[^"]*"\s*\/?>/i, `<meta name="twitter:image" content="${SITE_URL}/seo-preview.png" />`);
    finalHtml = finalHtml.replace(/<meta property="og:image" content="[^"]*"\s*\/?>/i, `<meta property="og:image" content="${SITE_URL}/seo-preview.png" />`);

    // Replace JSON-LD schema block
    const jsonLdBlock = `<script type="application/ld+json" id="route-jsonld">${JSON.stringify(route.jsonLd, null, 2)}</script>`;
    // Remove the default schema block in base html
    const defaultJsonLdRegex = /<script type="application\/ld\+json">[\s\S]*?<\/script>/gi;
    finalHtml = finalHtml.replace(defaultJsonLdRegex, "");
    
    // Inject the new JSON-LD
    finalHtml = finalHtml.replace("</head>", `  ${jsonLdBlock}\n  </head>`);

    // If it's the home route, overwrite dist/index.html
    if (route.path === "") {
      fs.writeFileSync(BASE_HTML_PATH, finalHtml, "utf8");
      console.log(`Updated root: ${BASE_HTML_PATH}`);
    } else {
      // Create subdirectories
      const targetDir = path.join(DIST_DIR, route.path);
      fs.mkdirSync(targetDir, { recursive: true });
      
      const targetHtmlPath = path.join(targetDir, "index.html");
      fs.writeFileSync(targetHtmlPath, finalHtml, "utf8");
      console.log(`Created static route: ${targetHtmlPath}`);
    }
  });

  // Generate sitemap.xml
  const today = new Date().toISOString().split("T")[0];
  let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  routes.forEach((route) => {
    const loc = route.path ? `${SITE_URL}/${route.path}/` : `${SITE_URL}/`;
    sitemapContent += `  <url>\n`;
    sitemapContent += `    <loc>${loc}</loc>\n`;
    sitemapContent += `    <lastmod>${today}</lastmod>\n`;
    sitemapContent += `    <changefreq>${route.sitemapChangefreq}</changefreq>\n`;
    sitemapContent += `    <priority>${route.sitemapPriority}</priority>\n`;
    sitemapContent += `  </url>\n`;
  });

  sitemapContent += `</urlset>\n`;

  const sitemapDistPath = path.join(DIST_DIR, "sitemap.xml");
  const sitemapPublicPath = path.resolve(__dirname, "../public/sitemap.xml");

  fs.writeFileSync(sitemapDistPath, sitemapContent, "utf8");
  console.log(`Generated build sitemap at: ${sitemapDistPath}`);
  
  // Also sync back to public folder for source preservation
  fs.writeFileSync(sitemapPublicPath, sitemapContent, "utf8");
  console.log(`Updated source sitemap at: ${sitemapPublicPath}`);

  console.log(`--- Pre-rendering completed successfully! ---\n`);
}

prerender();
