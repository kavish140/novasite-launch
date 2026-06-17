import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DOMPurify from "dompurify";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";
import { ChevronLeft } from "lucide-react";

interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published_at: string;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("slug", slug)
          .single();
          
        if (error) {
          console.error("Error fetching post:", error);
        } else if (data) {
          setPost(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex flex-col">
          <Navbar />
          <main className="flex-1 pt-32 pb-24 max-w-3xl mx-auto px-6 w-full">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-24 bg-muted rounded"></div>
            <div className="h-10 w-3/4 bg-muted rounded"></div>
            <div className="h-6 w-1/4 bg-muted rounded mt-8"></div>
            <div className="space-y-2 mt-8">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  if (!post) {
    return (
      <PageTransition>
        <SEO title="Post Not Found | SiteNova" />
        <div className="min-h-screen bg-background flex flex-col">
          <Navbar />
          <main className="flex-1 pt-32 pb-24 max-w-3xl mx-auto px-6 w-full text-center">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/blog" className="text-primary hover:underline">
            ← Back to Blog
          </Link>
        </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

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
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://sitenova.dev/blog/${post.slug}`
            },
            "author": {
              "@type": "Person",
              "name": "Kavish Ganatra",
              "url": "https://sitenova.dev"
            },
            "publisher": {
              "@type": "Organization",
              "name": "SiteNova",
              "url": "https://sitenova.dev",
              "logo": {
                "@type": "ImageObject",
                "url": "https://sitenova.dev/favicon-32x32.png"
              }
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
            <p className="text-muted-foreground">
              Published on {new Date(post.published_at || Date.now()).toLocaleDateString("en-IN", {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </header>
          
          <div 
            className="prose prose-slate dark:prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
          />
        </article>
      </main>
      
      <Footer />
      </div>
    </PageTransition>
  );
}
