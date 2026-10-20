/**
 * relatedPosts.ts
 *
 * Shared ranking logic for the "Continue Reading" section.
 *
 * Algorithm:
 *  1. Tag overlap score  — number of shared tags between current post and each candidate
 *  2. Tiebreaker 1       — all-time view count (descending)
 *  3. Tiebreaker 2       — published_at (descending, most recent first)
 *
 * Fallback: if currentTags is empty or no candidate shares any tag, rank purely by
 * view count (most popular), then recency.
 */

export interface PostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published_at: string;
  tags: string[];
  view_count: number;
  reading_time_minutes?: number;
}

/** Recover useful topic signals for legacy rows with empty or generic tags. */
export function editorialTopics(post: { title: string; slug: string; tags?: string[] }): string[] {
  const topics = new Set((post.tags ?? []).map((tag) => tag.toLowerCase().trim())
    .filter((tag) => !/^(web design|website|mumbai|sitenova|business)$/.test(tag)));
  const text = `${post.title} ${post.slug}`.toLowerCase();
  if (/architect|interior|photograph|gallery|portfolio/.test(text)) { topics.add("visual portfolios"); topics.add("performance"); }
  if (/pagespeed|performance|speed|vitals|mobile/.test(text)) topics.add("performance");
  if (/clinic|doctor|patient|healthcare/.test(text)) { topics.add("healthcare"); topics.add("appointments"); }
  if (/booking|salon|cater|event|wedding/.test(text)) topics.add("appointments");
  if (/ca.firm|account|consultant|professional|lawyer/.test(text)) topics.add("professional services");
  if (/security|privacy|document/.test(text)) topics.add("security");
  if (/manufacturer|b2b|catalog|indiamart|wholesale/.test(text)) topics.add("b2b");
  if (/seo|search|business.profile|google.reviews/.test(text)) topics.add("local discovery");
  return [...topics];
}

/** Score a candidate post against the current post's tags. */
function tagOverlapScore(currentTags: string[], candidateTags: string[]): number {
  if (!currentTags.length || !candidateTags.length) return 0;
  const current = new Set(currentTags.map((t) => t.toLowerCase().trim()));
  return candidateTags.filter((t) => current.has(t.toLowerCase().trim())).length;
}

/**
 * Rank candidates by (tagOverlap DESC, viewCount DESC, publishedAt DESC)
 * and return the top `limit`.
 */
export function rankPosts(
  candidates: PostSummary[],
  currentTags: string[],
  limit = 3
): PostSummary[] {
  const scored = candidates.map((post) => ({
    post,
    score: tagOverlapScore(currentTags, post.tags),
  }));

  scored.sort((a, b) => {
    // Primary: tag overlap
    if (b.score !== a.score) return b.score - a.score;
    // Tiebreaker 1: view count
    if (b.post.view_count !== a.post.view_count) return b.post.view_count - a.post.view_count;
    // Tiebreaker 2: recency
    return (
      new Date(b.post.published_at).getTime() - new Date(a.post.published_at).getTime()
    );
  });

  return scored.slice(0, limit).map((s) => s.post);
}
