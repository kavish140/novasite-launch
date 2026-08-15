import type { Route } from "./+types/sitemap[.]xml";
import { createServerClient } from "@/lib/supabaseClient";

export async function loader({ context }: Route.LoaderArgs) {
  const siteUrl = "https://sitenova.dev";

  // Static routes from the route file list
  const staticPaths = [
    "/",
    "/pricing",
    "/contact-us",
    "/quote",
    "/about",
    "/our-process",
    "/why-us",
    "/free-audit",
    "/website-cost-calculator",
    "/blog",
    "/services/ecommerce",
    "/services/web-applications",
    "/services/seo-optimization",
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
  let blogEntries: { slug: string; published_at: string }[] = [];
  try {
    const supabase = createServerClient(context);
    const { data } = await supabase
      .from("blog_posts")
      .select("slug, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (data) blogEntries = data;
  } catch {
    // Sitemap still works without blog posts
  }

  const today = new Date().toISOString().split("T")[0];

  const urls = [
    ...staticPaths.map(
      (path) => `
  <url>
    <loc>${siteUrl}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${path === "/" ? "daily" : "weekly"}</changefreq>
    <priority>${path === "/" ? "1.0" : "0.8"}</priority>
  </url>`
    ),
    ...blogEntries.map(
      (post) => `
  <url>
    <loc>${siteUrl}/blog/${post.slug}</loc>
    <lastmod>${post.published_at?.split("T")[0] || today}</lastmod>
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
