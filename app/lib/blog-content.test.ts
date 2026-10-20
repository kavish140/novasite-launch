import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { MemoryRouter } from "react-router";
import { articleText, readingStats, summarizePost, postCanonical, validCanonicalUrl, isOriginalPost } from "./blog-content";
import { locationContent } from "./location-content";
import { buildLocationJsonLd } from "./locationMeta";
import { buildMeta } from "./meta";
import { suppressPromotions } from "./booking";
import RelatedPosts from "@/components/RelatedPosts";
import { editorialTopics, rankPosts } from "./relatedPosts";

describe("editorial content boundaries", () => {
  it("uses portfolio/performance relevance when old rows lack meaningful tags", () => {
    const candidates = [
      { id: "1", slug: "bakery-website", title: "Home bakers", published_at: "2026-10-20" },
      { id: "2", slug: "interior-designers", title: "Interior design portfolios", published_at: "2026-09-01" },
      { id: "3", slug: "pagespeed-guide", title: "PageSpeed guide", published_at: "2026-09-01" },
    ].map((post) => ({ ...post, tags: editorialTopics({ ...post, tags: ["Web Design"] }), excerpt: "", view_count: 0 }));
    const current = editorialTopics({ slug: "architects", title: "Architect practice", tags: ["Web Design"] });
    expect(rankPosts(candidates, current, 2).map((post) => post.id)).toEqual(["2", "3"]);
  });
  it("uses full article words and omits the body from summaries", () => {
    const summary = summarizePost({ title: "Long guide", excerpt: "Only two words", content: `<p>${"word ".repeat(1200)}</p>` });
    expect(summary.reading_time_minutes).toBe(6);
    expect(summary).not.toHaveProperty("content");
    expect(readingStats("").wordCount).toBe(0);
  });
  it("counts block boundaries and ignores scripts, styles, comments and nonbreaking spaces", () => {
    expect(articleText('<p>one</p><p>two&nbsp;three</p><script>fake words</script><style>fake words</style><!-- fake words -->')).toBe("one two three");
    expect(readingStats(`<p>${"word ".repeat(1201)}</p>`).reading_time_minutes).toBe(7);
  });
  it("derives missing excerpts from readable body text without exposing the body", () => {
    const summary = summarizePost({ excerpt: '  ', content: '<p></p><p>A useful migration guide.</p>' });
    expect(summary.excerpt).toBe('A useful migration guide.');
    expect(summary).not.toHaveProperty('content');
    expect(summarizePost({ excerpt: 'Reviewed summary', content: '<p>Different body</p>' }).excerpt).toBe('Reviewed summary');
  });
  it("validates original URLs and keeps canonical/social URLs aligned", () => {
    const url = "https://ai-insights.sitenova.dev/article/original";
    expect(postCanonical({ slug: "copy", canonical_url: url })).toBe(url);
    expect(isOriginalPost({ slug: "copy", canonical_url: url })).toBe(false);
    expect(postCanonical({ slug: "original" })).toBe("https://sitenova.dev/blog/original");
    for (const invalid of ["javascript:alert(1)", "//evil.test", "http://example.com/a", "https://user:pass@example.com/a", "https://example.com/a#secret", "https://example.com/?token=private"]) expect(validCanonicalUrl(invalid)).toBeNull();
    const tags = buildMeta({ title: "Test", description: "Test", canonicalUrl: url });
    expect(tags.find((tag) => tag.rel === "canonical")?.href).toBe(url);
    expect(tags.find((tag) => tag.property === "og:url")?.content).toBe(url);
    expect(isOriginalPost({ slug: "web-design-company-in-thane-2026" })).toBe(false);
  });
  it("renders related reading in server HTML without service or suburb link blocks", () => {
    const markup = renderToStaticMarkup(createElement(MemoryRouter, {}, createElement(RelatedPosts, { posts: [{ id: "1", slug: "guide", title: "Guide", excerpt: "Useful reading", tags: [], view_count: 0, published_at: "2026-10-01", reading_time_minutes: 6 }] })));
    expect(markup).toContain('href="/blog/guide"');
    expect(markup).toContain("6 min read");
    expect(markup).not.toContain("/location/");
    expect(markup).not.toContain("/pricing");
    expect(suppressPromotions("/blog/guide")).toBe(true);
    expect(suppressPromotions("/pricing")).toBe(false);
  });
  it("requires distinct local paragraphs and FAQs, reflected exactly in JSON-LD", () => {
    const paragraphs: string[] = [];
    const questions: string[] = [];
    expect(Object.keys(locationContent)).toHaveLength(14);
    for (const [name, market] of Object.entries(locationContent)) {
      expect(market.localBusinessLandscape).toHaveLength(2);
      expect(market.suburbSpecificFAQs.length).toBeGreaterThanOrEqual(3);
      expect(market.localSearchBehavior.queries.length).toBeGreaterThanOrEqual(3);
      paragraphs.push(...market.localBusinessLandscape, market.localSearchBehavior.analysis, market.localSearchBehavior.competition, market.caseStudyHighlight.relevance);
      questions.push(...market.suburbSpecificFAQs.map((faq) => faq.q));
      const schema = buildLocationJsonLd(name)[1] as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] };
      expect(schema.mainEntity.map((faq) => [faq.name, faq.acceptedAnswer.text])).toEqual(market.suburbSpecificFAQs.map((faq) => [faq.q, faq.a]));
    }
    expect(new Set(paragraphs).size).toBe(paragraphs.length);
    expect(new Set(questions).size).toBe(questions.length);
  });
});
