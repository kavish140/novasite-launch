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
  const envPath = path.resolve(__dirname, '../.env');
  let supabaseUrl = '';
  let supabaseKey = '';
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
      if (line.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
      if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim();
    });
  }

  if (supabaseUrl && supabaseKey) {
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
  }

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

prerender().catch(console.error);
