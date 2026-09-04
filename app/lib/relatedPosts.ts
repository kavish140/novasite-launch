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
