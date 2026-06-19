import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, "../dist");
const BASE_HTML_PATH = path.join(DIST_DIR, "index.html");

import { routes, SITE_URL } from "../src/lib/seoRoutes.js";

async function prerender() {
  if (!fs.existsSync(BASE_HTML_PATH)) {
    console.error(`Base HTML file not found at: ${BASE_HTML_PATH}. Run "npm run build" first.`);
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(BASE_HTML_PATH, "utf8");

  console.log(`\n--- Starting SiteNova Pre-renderer ---`);

  // Dynamically fetch blog posts from Supabase
  let supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  let supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseKey) {
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      const envFile = fs.readFileSync(envPath, 'utf8');
      envFile.split('\n').forEach(line => {
        if (line.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
        if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim();
      });
    }
  }

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) {
    console.log("Fetching dynamic blog posts from Supabase for sitemap...");
    try {
      // Use native fetch (available in Node 18+)
      const res = await fetch(`${supabaseUrl}/rest/v1/blog_posts?select=slug,published_at,title,excerpt`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });
      if (res.ok) {
        const posts = await res.json();
        posts.forEach(post => {
          routes.push({
            path: `blog/${post.slug}`,
            title: `${post.title} | SiteNova Blog`,
            description: post.excerpt || "Read our latest insights on web design and SEO.",
            keywords: "web design blog, SEO tips, SiteNova",
            sitemapPriority: "0.80",
            sitemapChangefreq: "monthly",
            jsonLd: {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.excerpt || "Read our latest insights on web design and SEO.",
              "datePublished": post.published_at || new Date().toISOString(),
              "url": `${SITE_URL}/blog/${post.slug}`,
              "author": {
                "@type": "Organization",
                "name": "SiteNova"
              }
            }
          });
        });
        console.log(`Successfully added ${posts.length} dynamic blog routes to sitemap.`);
      } else {
        console.warn(`Supabase fetch failed with status ${res.status}`);
      }
    } catch (err) {
      console.error("Failed to fetch blog posts:", err.message);
    }
  } else {
    console.log("Skipping dynamic blog sitemap generation: Supabase credentials not found in environment or .env file.");
  }

  // Build each route folder & index.html
  routes.forEach((route) => {
    let finalHtml = baseHtml;

    // Replace Title
    finalHtml = finalHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title data-rh="true">${route.title}</title>`);

    // Replace Description
    const descMetaRegex = /<meta name="description" content="[^"]*"\s*\/?>/i;
    if (descMetaRegex.test(finalHtml)) {
      finalHtml = finalHtml.replace(descMetaRegex, `<meta name="description" content="${route.description}" data-rh="true" />`);
    } else {
      finalHtml = finalHtml.replace("</head>", `  <meta name="description" content="${route.description}" data-rh="true" />\n  </head>`);
    }

    // Replace Keywords
    const keywordsMetaRegex = /<meta name="keywords" content="[^"]*"\s*\/?>/i;
    if (keywordsMetaRegex.test(finalHtml)) {
      finalHtml = finalHtml.replace(keywordsMetaRegex, `<meta name="keywords" content="${route.keywords}" data-rh="true" />`);
    } else {
      finalHtml = finalHtml.replace("</head>", `  <meta name="keywords" content="${route.keywords}" data-rh="true" />\n  </head>`);
    }

    // Replace canonical links
    const canonicalRegex = /<link rel="canonical" href="[^"]*"\s*\/?>/i;
    const currentCanonicalUrl = route.path ? `${SITE_URL}/${route.path}` : `${SITE_URL}/`;
    if (canonicalRegex.test(finalHtml)) {
      finalHtml = finalHtml.replace(canonicalRegex, `<link rel="canonical" href="${currentCanonicalUrl}" data-rh="true" />`);
    }

    // Replace OpenGraph & Twitter title + desc + url
    finalHtml = finalHtml.replace(/<meta property="og:title" content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${route.title}" data-rh="true" />`);
    finalHtml = finalHtml.replace(/<meta property="og:description" content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${route.description}" data-rh="true" />`);
    finalHtml = finalHtml.replace(/<meta property="og:url" content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${currentCanonicalUrl}" data-rh="true" />`);
    finalHtml = finalHtml.replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${route.title}" data-rh="true" />`);
    finalHtml = finalHtml.replace(/<meta name="twitter:description" content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${route.description}" data-rh="true" />`);
    finalHtml = finalHtml.replace(/<meta name="twitter:image" content="[^"]*"\s*\/?>/i, `<meta name="twitter:image" content="${SITE_URL}/seo-preview.png" data-rh="true" />`);
    finalHtml = finalHtml.replace(/<meta property="og:image" content="[^"]*"\s*\/?>/i, `<meta property="og:image" content="${SITE_URL}/seo-preview.png" data-rh="true" />`);

    // Replace JSON-LD schema block
    const jsonLdBlock = `<script type="application/ld+json" data-rh="true">${JSON.stringify(route.jsonLd, null, 2)}</script>`;
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
      // Create HTML file instead of directory with index.html to prevent trailing slash redirects
      const targetHtmlPath = path.join(DIST_DIR, `${route.path}.html`);
      const targetDir = path.dirname(targetHtmlPath);
      fs.mkdirSync(targetDir, { recursive: true });
      
      fs.writeFileSync(targetHtmlPath, finalHtml, "utf8");
      console.log(`Created static route: ${targetHtmlPath}`);
    }
  });

  // Generate sitemap.xml
  const today = new Date().toISOString().split("T")[0];
  let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  routes.forEach((route) => {
    const loc = route.path ? `${SITE_URL}/${route.path}` : `${SITE_URL}/`;
    sitemapContent += `  <url>\n`;
    sitemapContent += `    <loc>${loc}</loc>\n`;
    sitemapContent += `    <lastmod>${today}</lastmod>\n`;
    sitemapContent += `    <changefreq>${route.sitemapChangefreq}</changefreq>\n`;
    sitemapContent += `    <priority>${route.sitemapPriority}</priority>\n`;
    if (route.path && route.path.startsWith("blog/")) {
      const pubDate = route.jsonLd?.datePublished ? route.jsonLd.datePublished.split("T")[0] : today;
      const safeTitle = (route.title || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      // For SEO news parsing, the title should just be the article name, so we can strip " | SiteNova Blog" if present
      const cleanTitle = safeTitle.replace(" | SiteNova Blog", "");
      sitemapContent += `    <news:news>\n`;
      sitemapContent += `      <news:publication>\n`;
      sitemapContent += `        <news:name>SiteNova Blog</news:name>\n`;
      sitemapContent += `        <news:language>en</news:language>\n`;
      sitemapContent += `      </news:publication>\n`;
      sitemapContent += `      <news:publication_date>${pubDate}</news:publication_date>\n`;
      sitemapContent += `      <news:title>${cleanTitle}</news:title>\n`;
      sitemapContent += `    </news:news>\n`;
    }
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

prerender().catch(console.error);
