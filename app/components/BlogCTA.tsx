import { Link } from "react-router";

export default function BlogCTA({ tags = [] }: { tags?: string[] }) {
  const technical = tags.some((tag) => /speed|performance|seo|security/i.test(tag));
  return <aside className="mt-10 rounded-2xl border border-border bg-card p-6" aria-label="Help applying this guide">
    <h2 className="font-heading text-xl font-semibold">{technical ? "Check these ideas against your own website" : "Turn this guide into a website brief"}</h2>
    <p className="mt-2 text-sm text-muted-foreground">{technical ? "Ask SiteNova to review your current site and identify the changes relevant to your business." : "Share your business workflow and the parts you want to improve. We can help scope the implementation."}</p>
    <Link className="mt-4 inline-block text-primary font-semibold underline underline-offset-4" to={technical ? "/free-audit?utm_source=blog&utm_medium=article_cta" : "/quote?utm_source=blog&utm_medium=article_cta"}>{technical ? "Request a website audit" : "Discuss your project"}</Link>
  </aside>;
}
