import { useLoaderData } from "react-router";
import { Link } from "react-router";
import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { JsonLd } from "@/components/JsonLd";
import PageTransition from "@/components/PageTransition";
import BlogCTA from "@/components/BlogCTA";
import RelatedPosts from "@/components/RelatedPosts";
import { ChevronLeft, Clock, ExternalLink } from "lucide-react";
import type { loader } from "@/routes/blog.$slug";

// ── Reading progress bar ──────────────────────────────────────────────────────
function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
    }
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-[60] h-[3px] bg-gradient-to-r from-primary to-accent transition-[width] duration-100"
      style={{ width: `${progress}%` }}
      aria-hidden="true"
    />
  );
}

// ── Table of contents ─────────────────────────────────────────────────────────
interface TocItem {
  id: string;
  text: string;
  level: number;
}

function extractToc(html: string): TocItem[] {
  if (typeof document === "undefined") return [];
  const div = document.createElement("div");
  div.innerHTML = html;
  const headings = div.querySelectorAll("h2, h3");
  const items: TocItem[] = [];
  headings.forEach((h) => {
    const text = h.textContent?.trim() || "";
    if (!text) return;
    // Create a slug id from the text
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 60);
    items.push({ id, text, level: parseInt(h.tagName[1]) });
  });
  return items;
}

function TableOfContents({ html }: { html: string }) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    setItems(extractToc(html));
  }, [html]);

  // Inject IDs into the rendered article headings after mount
  useEffect(() => {
    if (items.length === 0) return;
    const article = document.querySelector("article .prose");
    if (!article) return;
    const headings = article.querySelectorAll("h2, h3");
    headings.forEach((h, i) => {
      if (items[i]) h.id = items[i].id;
    });
  }, [items]);

  // Intersection observer for active heading
  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -60% 0px" }
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav
      className="hidden lg:block sticky top-28 self-start w-[220px] shrink-0"
      aria-label="Table of contents"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4">
        On this page
      </p>
      <ul className="space-y-1">
        {items.map(({ id, text, level }) => (
          <li key={id} style={{ paddingLeft: level === 3 ? "0.75rem" : "0" }}>
            <a
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(id);
                if (el) {
                  const top = el.getBoundingClientRect().top + window.scrollY - 96;
                  window.scrollTo({ top, behavior: "smooth" });
                }
              }}
              className={`block text-sm leading-snug py-1 transition-colors border-l-2 pl-3 ${
                activeId === id
                  ? "text-primary border-primary font-medium"
                  : "text-muted-foreground border-transparent hover:text-foreground hover:border-border"
              }`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function BlogPost() {
  const { post } = useLoaderData<typeof loader>();

  const wordCount = post.content
    .replace(/<[^>]+>/g, "")
    .split(/\s+/)
    .filter(Boolean).length;
  const readMins = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <PageTransition>
      <SEO
        title={`${post.title} | SiteNova Blog`}
        description={post.excerpt || post.content.replace(/<[^>]+>/g, "").substring(0, 160) || `Read our latest article on ${post.title}.`}
        canonicalUrl={`/blog/${post.slug}`}
        type="article"
        publishedTime={post.published_at}
        modifiedTime={post.published_at}
        author="Kavish Ganatra"
      />
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt || post.content.replace(/<[^>]+>/g, "").substring(0, 160),
          "datePublished": post.published_at,
          "dateModified": post.published_at,
          "inLanguage": "en-IN",
          "wordCount": wordCount,
          "image": {
            "@type": "ImageObject",
            "url": "https://sitenova.dev/seo-preview.png",
            "width": 1200,
            "height": 630,
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://sitenova.dev/blog/${post.slug}`,
          },
          "author": {
            "@type": "Person",
            "@id": "https://sitenova.dev/#founder",
            "name": "Kavish Ganatra",
            "url": "https://sitenova.dev",
            "jobTitle": "Founder & Lead Developer",
          },
          "publisher": {
            "@type": "Organization",
            "@id": "https://sitenova.dev/#organization",
            "name": "SiteNova",
            "url": "https://sitenova.dev",
            "logo": {
              "@type": "ImageObject",
              "url": "https://sitenova.dev/favicon-32x32.png",
            },
          },
          "isPartOf": {
            "@type": "Blog",
            "@id": "https://sitenova.dev/blog",
            "name": "SiteNova Blog — Web Design & SEO Insights",
            "url": "https://sitenova.dev/blog",
            "publisher": {
              "@type": "Organization",
              "@id": "https://sitenova.dev/#organization",
            },
          },
          "about": {
            "@type": "Organization",
            "@id": "https://sitenova.dev/#organization",
            "name": "SiteNova",
            "url": "https://sitenova.dev",
          },
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ["article h1", "article h2", "article p:first-of-type"],
          },
          "mentions": {
            "@type": "Organization",
            "@id": "https://sitenova.dev/#organization",
            "name": "SiteNova",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sitenova.dev/" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://sitenova.dev/blog" },
            { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://sitenova.dev/blog/${post.slug}` },
          ],
        },
      ]} />

      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <ReadingProgress />
        <Navbar />

        <main className="flex-1 pt-32 pb-16 sm:pb-24 w-full">
          <div className="max-w-7xl mx-auto px-6">
            {/* Back link */}
            <Link
              to="/blog"
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-10 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              All articles
            </Link>

            {/* Content area: article + TOC sidebar */}
            <div className="flex gap-16 items-start">
              {/* Article */}
              <article className="min-w-0 flex-1 max-w-3xl">
                {/* Article header */}
                <header className="mb-8 pb-8 border-b border-border/40">
                  <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] mb-5">
                    {post.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span suppressHydrationWarning>
                      {new Date(post.published_at).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="text-border">·</span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={13} />
                      {readMins} min read
                    </span>
                    <span className="text-border">·</span>
                    <span>{wordCount.toLocaleString("en-IN")} words</span>
                  </div>
                </header>

                {/* Content — sanitized server-side in route loader */}
                <div
                  className="prose prose-slate dark:prose-invert prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Mid-article CTA */}
                <BlogCTA variant="mid" />

                {/* Author bio */}
                <div className="not-prose mt-10 flex items-start gap-5 rounded-2xl border border-border/60 bg-gradient-to-r from-primary/5 via-card/80 to-card p-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary font-bold text-xl ring-2 ring-primary/20 select-none">
                    K
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-foreground">Kavish Ganatra</p>
                      <a
                        href="https://sitenova.dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="SiteNova website"
                      >
                        <ExternalLink size={12} />
                      </a>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Founder & Lead Developer at SiteNova · Web Designer in Mulund, Mumbai
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Kavish builds fast, SEO-ready websites for businesses across Mumbai. He writes
                      about web design, local SEO, and digital growth for Indian small businesses.
                    </p>
                  </div>
                </div>
              </article>

              {/* TOC sidebar — only renders on lg+, hides if < 2 headings */}
              <TableOfContents html={post.content} />
            </div>

            {/* End-of-article CTA */}
            <div className="max-w-3xl mt-2">
              <BlogCTA variant="end" />
              <RelatedPosts currentSlug={post.slug} currentTags={post.tags ?? []} />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
