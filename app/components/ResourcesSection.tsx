import { ArrowRight, BookOpen, Calculator, ExternalLink } from "lucide-react";

const articles = [
  {
    title: "Your AI Strategy Needs an Implementation Team, Not More Tools",
    description: "Plan the roles, workflow ownership and measurements that help a small business put AI to work.",
    href: "https://ai-insights.sitenova.dev/blog/ai-implementation-team-strategy",
  },
  {
    title: "OpenAI Dots: How to Set Approval Rules for an Always-On Agent",
    description: "Decide which actions an agent can take independently and where human approval belongs.",
    href: "https://ai-insights.sitenova.dev/blog/openai-dots-approval-rules-checklist",
  },
  {
    title: "Gemini Skills vs Gems: How to Migrate Before Gems Go Away",
    description: "Explore the differences, limitations and steps involved in adapting reusable AI workflows.",
    href: "https://ai-insights.sitenova.dev/blog/gemini-skills-vs-gems-migration-guide",
  },
];

const tools = [
  {
    title: "QR Code Generator",
    description: "Turn a website link into a QR code for a business card, printed menu or poster.",
    href: "https://tools.sitenova.dev/category/productivity/qr-code",
  },
  {
    title: "Merge PDF",
    description: "Combine separate PDF documents into one file, with processing in your browser.",
    href: "https://tools.sitenova.dev/category/pdf/merge-pdf",
  },
  {
    title: "Split PDF",
    description: "Extract the pages you need from a larger PDF to prepare a smaller document.",
    href: "https://tools.sitenova.dev/category/pdf/split-pdf",
  },
];

const linkStyle = "group block rounded-2xl border border-border/60 bg-background/70 p-5 transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const ctaStyle = "inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export default function ResourcesSection() {
  return (
    <section id="resources" aria-labelledby="resources-title" className="scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Learn &amp; explore</p>
          <h2 id="resources-title" className="mt-3 font-heading text-3xl font-bold tracking-tight md:text-4xl">
            Resources by <span className="gradient-text">SiteNova</span>
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Beyond building websites, SiteNova creates resources to help you understand AI and get everyday tasks done.
            Read our AI Insights articles for ideas you can apply to your work, or open Toolbox for free calculators and utilities.
            Both are part of SiteNova and available on their own dedicated sites.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <article aria-labelledby="ai-insights-title" className="flex flex-col rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card p-6 sm:p-8">
            <BookOpen aria-hidden="true" className="mb-5 h-10 w-10 rounded-xl bg-primary/10 p-2 text-primary" />
            <h3 id="ai-insights-title" className="font-heading text-2xl font-semibold">AI Insights</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Articles on AI awareness, automation and strategy. Explore how AI fits into business workflows,
              what to consider before adopting a tool, and where human judgment still matters.
            </p>
            <h4 className="mt-6 mb-3 text-sm font-semibold">Featured articles</h4>
            <ul className="mb-6 space-y-3">
              {articles.map((article) => (
                <li key={article.href}>
                  <a href={article.href} className={linkStyle}>
                    <span className="flex items-start justify-between gap-3 font-heading font-semibold">
                      {article.title}<ArrowRight aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                    </span>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{article.description}</p>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-2">
              <a href="https://ai-insights.sitenova.dev" className={ctaStyle}>Explore AI Insights<ExternalLink aria-hidden="true" className="h-4 w-4" /></a>
              <p className="mt-3 text-xs text-muted-foreground">ai-insights.sitenova.dev</p>
            </div>
          </article>

          <article aria-labelledby="toolbox-title" className="flex flex-col rounded-3xl border border-border/60 bg-card/60 p-6 sm:p-8">
            <Calculator aria-hidden="true" className="mb-5 h-10 w-10 rounded-xl bg-primary/10 p-2 text-primary" />
            <h3 id="toolbox-title" className="font-heading text-2xl font-semibold">Toolbox by SiteNova</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Free online tools for finance, education, text, productivity and PDFs. Use a calculator to work through
              a number, create a QR code, or prepare documents without signing up for an account.
            </p>
            <h4 className="mt-6 mb-3 text-sm font-semibold">Tools to try</h4>
            <ul className="mb-6 space-y-3">
              {tools.map((tool) => (
                <li key={tool.href}>
                  <a href={tool.href} className={linkStyle}>
                    <span className="flex items-start justify-between gap-3 font-heading font-semibold">
                      {tool.title}<ArrowRight aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                    </span>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-2">
              <a href="https://tools.sitenova.dev" className={ctaStyle}>Browse free tools<ExternalLink aria-hidden="true" className="h-4 w-4" /></a>
              <p className="mt-3 text-xs text-muted-foreground">tools.sitenova.dev</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
