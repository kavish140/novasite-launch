import { describe, it, expect, vi, beforeEach } from "vitest";

const fixture = vi.hoisted(() => ({ rows: [] as Record<string, unknown>[], queries: [] as string[], calls: 0 }));
vi.mock("@supabase/supabase-js", () => ({ createClient: () => ({ from: (table: string) => {
  fixture.calls++;
  const filters: ((row: Record<string, unknown>) => boolean)[] = [];
  const result = () => ({ data: fixture.rows.filter((row) => filters.every((fn) => fn(row))), error: null });
  const chain = {
    select: () => chain,
    eq: (field: string, value: unknown) => { fixture.queries.push(`${table}.${field}=${value}`); filters.push((row) => row[field] === value); return chain; },
    neq: (field: string, value: unknown) => { filters.push((row) => row[field] !== value); return chain; },
    order: async () => result(),
    single: async () => ({ data: result().data[0], error: null }),
    insert: () => Promise.resolve({ error: null }),
    then: (resolve: (value: unknown) => unknown) => Promise.resolve(result()).then(resolve),
  };
  return chain;
} }) }));
import { loader as indexLoader } from "@/routes/blog._index";
import { loader as postLoader, meta } from "@/routes/blog.$slug";
import { loader as sitemapLoader } from "@/routes/sitemap[.]xml";

const context = { cloudflare: { env: { SUPABASE_URL: "https://fixture.test", SUPABASE_ANON_KEY: "fixture" } } };
const base = { id: "1", slug: "guide", title: "Guide", status: "published", content: `<p>${"word ".repeat(1200)}</p>`, excerpt: "Short excerpt", published_at: "2026-10-01", updated_at: "2026-10-20", tags: ["Performance"] };
beforeEach(() => { fixture.rows = [base, { ...base, id: "2", slug: "related" }, { ...base, id: "3", slug: "draft", status: "draft" }, { ...base, id: "4", slug: "copy", canonical_url: "https://ai-insights.sitenova.dev/blog/source" }]; fixture.queries = []; fixture.calls = 0; });
describe("public editorial loaders", () => {
  it("returns real reading time, no article bodies, and only original published listings", async () => {
    const result = await indexLoader({ context } as never);
    expect(result.posts.map((p) => p.slug)).toEqual(["guide", "related"]);
    expect(result.posts[0].reading_time_minutes).toBe(6);
    expect(result.posts[0]).not.toHaveProperty("content");
    expect(fixture.queries).toContain("blog_posts.status=published");
  });
  it("serves related reading with the article and excludes draft, copy and current post", async () => {
    const result = await postLoader({ context, params: { slug: "guide" } } as never);
    expect(result.relatedPosts.map((p) => p.slug)).toEqual(["related"]);
    expect(result.relatedPosts[0]).not.toHaveProperty("content");
    expect(result.post).not.toHaveProperty("ai_prompt_used");
    const tags = meta({ data: result } as never);
    expect(tags.find((tag) => tag.rel === "canonical")?.href).toBe("https://sitenova.dev/blog/guide");
    expect(tags.find((tag) => tag.property === "article:modified_time")?.content).toBe("2026-10-20");
  });
  it("keeps a republished article's head canonical on its verified original", async () => {
    const result = await postLoader({ context, params: { slug: "copy" } } as never);
    expect(meta({ data: result } as never).find((tag) => tag.rel === "canonical")?.href).toBe("https://ai-insights.sitenova.dev/blog/source");
  });
  it("redirects consolidated local articles without touching the CMS", async () => {
    await expect(postLoader({ context, params: { slug: "web-design-company-in-thane-2026" } } as never)).rejects.toMatchObject({ status: 301 });
    expect(fixture.calls).toBe(0);
  });
  it("lists original published articles and legal pages in the sitemap with the blog client's environment fallback", async () => {
    const response = await sitemapLoader({ context: { env: context.cloudflare.env } } as never);
    const xml = await response.text();
    expect(xml).toContain('https://sitenova.dev/blog/guide</loc>');
    expect(xml).toContain('https://sitenova.dev/blog/related</loc>');
    expect(xml).toContain('https://sitenova.dev/privacy-policy</loc>');
    expect(xml).toContain('https://sitenova.dev/terms-and-conditions</loc>');
    expect(xml).not.toContain('https://sitenova.dev/blog/draft</loc>');
    expect(xml).not.toContain('https://sitenova.dev/blog/copy</loc>');
  });
});
