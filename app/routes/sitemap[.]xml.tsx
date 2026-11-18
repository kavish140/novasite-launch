import { isOriginalPost } from "@/lib/blog-content";
import type { Route } from "./+types/sitemap[.]xml";
import { getBlogServerClient } from "@/lib/blog-client.server";

export async function loader({ context }: Route.LoaderArgs) {
  const siteUrl = "https://sitenova.dev";

  // Static routes from the route file list
  const staticPaths = [
    "/",
    "/pricing",
    "/services/business-websites",
    "/portfolio", "/services", "/reviews", "/resources", "/faq", "/payments",
    "/delivery-policy",
    "/contact-us",
    "/quote",
    "/about",
    "/privacy-policy",
    "/terms-and-conditions",
    "/refund-policy",
    "/locations",
    "/our-process",
    "/why-us",
    "/free-audit",
    "/website-cost-calculator",
    "/blog",
    "/services/ecommerce",
    "/services/web-applications",
    "/services/seo-optimization",
    "/services/google-ads",
    "/services/meta-ads",
    "/ads-contact",
    "/location/thane",
    "/location/powai",
    "/location/andheri",
    "/location/bhandup",
    "/location/nahur",
    "/location/ghatkopar",
    "/location/vikhroli",
    "/location/kurla",
    "/location/dadar",
    "/location/lower-parel",
    "/location/mahalakshmi",
    "/location/pedder-road",
    "/location/mulund",
    "/location/bandra",
    "/websites-for-doctors",
    "/websites-for-finance",
    "/websites-for-real-estate",
    "/websites-for-consultants",
    "/websites-for-lawyers",
    "/websites-for-startups",
    "/websites-for-restaurants",
    "/portfolio/dr-dipti-ganatra",
    "/portfolio/jupiter-fast-finance",
    "/portfolio/corporate-zone",
  ];

  // Fetch live blog slugs from Supabase
  let blogEntries: { slug: string; published_at: string; updated_at?: string }[] = [];
  try {
    const supabase = getBlogServerClient(context);
    const { data } = await supabase
      .from("blog_posts")
      .select("slug, published_at, updated_at, canonical_url")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (data) blogEntries = data.filter(isOriginalPost);
  } catch {
    // Sitemap still works without blog posts
  }

  // Static last-modified dates — update when page content meaningfully changes.
  // Using today's date on every request tells Googlebot that nothing ever changes,
  // causing it to distrust and ignore lastmod signals entirely.
  const lastModified: Record<string, string> = {
    "/services/business-websites": "2026-11-18",
    "/": "2026-10-20",
    "/pricing": "2026-10-10",
    "/delivery-policy": "2026-10-10",
    "/contact-us": "2026-06-01",
    "/quote": "2026-07-01",
    "/about": "2026-10-20",
    "/our-process": "2026-06-01",
    "/why-us": "2026-06-01",
    "/free-audit": "2026-07-01",
    "/website-cost-calculator": "2026-07-01",
    "/blog": "2026-10-20",
    "/services/ecommerce": "2026-06-15",
    "/services/web-applications": "2026-06-15",
    "/services/seo-optimization": "2026-06-15",
    "/services/google-ads": "2026-08-31",
    "/services/meta-ads": "2026-08-31",
    "/ads-contact": "2026-09-01",
  };
  lastModified["/privacy-policy"] = "2026-10-20";
  lastModified["/locations"] = "2026-10-20";
  for (const path of staticPaths) {
    if (path.startsWith("/location/") || path.startsWith("/portfolio/")) lastModified[path] = "2026-10-20";
  }
  const defaultLastMod = "2026-06-01";

  // Higher-priority pages get 0.9, others default to 0.8, homepage is 1.0
  const priorities: Record<string, string> = {
    "/": "1.0",
    "/services/google-ads": "0.9",
    "/services/meta-ads": "0.9",
    "/ads-contact": "0.9",
  };

  const urls = [
    ...staticPaths.map(
      (path) => `
  <url>
    <loc>${siteUrl}${path}</loc>
    <lastmod>${lastModified[path] ?? defaultLastMod}</lastmod>
    <changefreq>${path === "/" ? "daily" : "weekly"}</changefreq>
    <priority>${priorities[path] ?? "0.8"}</priority>
  </url>`
    ),
    ...blogEntries.map(
      (post) => `
  <url>
    <loc>${siteUrl}/blog/${post.slug}</loc>
    <lastmod>${(post.updated_at || post.published_at)?.split("T")[0] || defaultLastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    ),
  ].join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
