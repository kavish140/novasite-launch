import { Link } from "react-router";

const guides = [
  ["2026-mumbai-website-performance-report", "Mumbai business website performance report", "Read the published audit methodology, findings and performance recommendations."],
  ["zero-click-searches-mumbai-local-businesses", "Zero-click searches and local discovery", "How business profiles and useful website pages support different customer decisions."],
  ["mumbai-b2b-manufacturers-website-indiamart", "A manufacturer's website beyond IndiaMART", "Product specifications, buyer qualification and catalog decisions for B2B teams."],
  ["website-redesign-seo-checklist-mumbai", "Search checks for a website redesign", "Plan URL mapping, redirects and post-launch monitoring before changing your site."],
];

export default function LatestGuidesSection() {
  return <section className="section-padding border-y border-border/40" aria-labelledby="latest-guides">
    <div className="mx-auto max-w-7xl">
      <h2 id="latest-guides" className="font-heading text-3xl font-bold">Latest Research &amp; Guides</h2>
      <p className="mt-3 text-muted-foreground">Practical reading from the SiteNova editorial archive.</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {guides.map(([slug, title, description]) => <Link key={slug} to={`/blog/${slug}`} className="rounded-2xl border border-border bg-card p-6 hover:border-primary/50">
          <h3 className="font-heading font-semibold">{title}</h3><p className="mt-3 text-sm text-muted-foreground">{description}</p>
        </Link>)}
      </div>
    </div>
  </section>;
}
