import { useLoaderData } from "react-router";
import { Link } from "react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";
import BlogCTA from "@/components/BlogCTA";
import RelatedPosts from "@/components/RelatedPosts";
import { ChevronLeft } from "lucide-react";
import type { loader } from "@/routes/blog.$slug";

export default function BlogPost() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <PageTransition>
      <SEO
        title={`${post.title} | SiteNova Blog`}
        description={post.excerpt || post.content.replace(/<[^>]+>/g, '').substring(0, 160) || `Read our latest article on ${post.title}.`}
        canonicalUrl={`/blog/${post.slug}`}
        type="article"
        publishedTime={post.published_at}
        modifiedTime={post.published_at}
        author="Kavish Ganatra"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt || post.content.replace(/<[^>]+>/g, '').substring(0, 160),
            "datePublished": post.published_at,
            "dateModified": post.published_at,
            "inLanguage": "en-IN",
            "wordCount": post.content.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length,
            "image": {
              "@type": "ImageObject",
              "url": "https://sitenova.dev/seo-preview.png",
              "width": 1200,
              "height": 630
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://sitenova.dev/blog/${post.slug}`
            },
            "author": {
              "@type": "Person",
              "@id": "https://sitenova.dev/#founder",
              "name": "Kavish Ganatra",
              "url": "https://sitenova.dev",
              "jobTitle": "Founder & Lead Developer"
            },
            "publisher": {
              "@type": "Organization",
              "@id": "https://sitenova.dev/#organization",
              "name": "SiteNova",
              "url": "https://sitenova.dev",
              "logo": {
                "@type": "ImageObject",
                "url": "https://sitenova.dev/favicon-32x32.png"
              }
            },
            "isPartOf": {
              "@type": "Blog",
              "@id": "https://sitenova.dev/blog",
              "name": "SiteNova Blog — Web Design & SEO Insights",
              "url": "https://sitenova.dev/blog",
              "publisher": {
                "@type": "Organization",
                "@id": "https://sitenova.dev/#organization"
              }
            },
            "about": {
              "@type": "Organization",
              "@id": "https://sitenova.dev/#organization",
              "name": "SiteNova",
              "url": "https://sitenova.dev"
            },
            "speakable": {
              "@type": "SpeakableSpecification",
              "cssSelector": ["article h1", "article h2", "article p:first-of-type"]
            },
            "mentions": {
              "@type": "Organization",
              "@id": "https://sitenova.dev/#organization",
              "name": "SiteNova"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sitenova.dev/" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://sitenova.dev/blog" },
              { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://sitenova.dev/blog/${post.slug}` }
            ]
          }
        ]}
      />
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />

        <main className="flex-1 pt-32 pb-16 sm:pb-24 max-w-3xl mx-auto px-6 w-full">
          <Link
            to="/blog"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to all posts
          </Link>

          <article>
            <header className="mb-10">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span suppressHydrationWarning>
                  Published on{" "}
                  {new Date(post.published_at).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="text-border">·</span>
                <span>
                  {Math.max(
                    1,
                    Math.ceil(
                      post.content
                        .replace(/<[^>]+>/g, "")
                        .split(/\s+/)
                        .filter(Boolean).length / 200
                    )
                  )}{" "}
                  min read
                </span>
              </div>
            </header>

            {/* Content is sanitized server-side in the route loader */}
            <div
              className="prose prose-slate dark:prose-invert prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Mid-article CTA */}
            <BlogCTA variant="mid" />

            {/* Author bio — E-E-A-T signal */}
            <div className="not-prose mt-10 flex items-start gap-4 rounded-2xl border border-border/60 bg-card/40 p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary font-bold text-lg select-none">
                K
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Kavish Ganatra</p>
                <p className="text-xs text-muted-foreground mt-0.5 mb-2">
                  Founder &amp; Lead Developer at SiteNova · Web Designer in Mulund, Mumbai
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Kavish builds fast, SEO-ready websites for businesses across Mumbai. He writes
                  about web design, local SEO, and digital growth for Indian small businesses.
                </p>
              </div>
            </div>
          </article>

          {/* End-of-article CTA */}
          <BlogCTA variant="end" />

          {/* Related posts */}
          <RelatedPosts currentSlug={post.slug} />
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
