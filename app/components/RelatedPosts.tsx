import { Link } from "react-router";
import type { PostSummary } from "@/lib/relatedPosts";

/** Public, original posts ranked in the route loader and present in SSR HTML. */
export default function RelatedPosts({ posts }: { posts: PostSummary[] }) {
  if (!posts.length) return null;
  return <aside className="mt-12 border-t border-border/40 pt-8" aria-label="Related articles">
    <h2 className="font-heading text-xl font-bold mb-6">Related Articles</h2>
    <div className="grid gap-4 sm:grid-cols-3">
      {posts.map((post) => <Link key={post.id} to={`/blog/${post.slug}`} className="rounded-2xl border border-border bg-card p-5 hover:border-primary/40">
        <p className="text-xs text-muted-foreground mb-3">{post.reading_time_minutes} min read</p>
        <h3 className="font-semibold leading-snug">{post.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
      </Link>)}
    </div>
  </aside>;
}
