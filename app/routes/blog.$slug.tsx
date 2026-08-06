import type { Route } from "./+types/blog.$slug";
import { buildMeta } from "@/lib/meta";
import { createServerClient } from "@/lib/supabaseClient";
import sanitizeHtml from "sanitize-html";

export async function loader({ params, context }: Route.LoaderArgs) {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = context.cloudflare.env;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Response(
      "Server configuration error: Supabase secrets not set in Cloudflare Worker.",
      { status: 500 }
    );
  }

  const supabase = createServerClient(context);
  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (error || !post) {
    throw new Response("Not Found", { status: 404 });
  }

  // Sanitize HTML on the server so the client receives clean content.
  // Wrapped in try/catch in case sanitize-html has edge runtime issues.
  let sanitizedContent = post.content;
  try {
    sanitizedContent = sanitizeHtml(post.content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        "img", "iframe", "video", "source", "picture", "figure",
        "figcaption", "details", "summary", "mark", "del", "ins", "sub", "sup",
      ]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ["src", "srcset", "alt", "title", "width", "height", "loading", "decoding", "class"],
        iframe: ["src", "width", "height", "frameborder", "allowfullscreen", "allow", "title", "loading"],
        video: ["src", "controls", "width", "height", "poster", "preload", "muted", "autoplay", "loop", "playsinline"],
        source: ["src", "srcset", "type", "media", "sizes"],
        "*": ["class", "id", "style"],
      },
      allowedIframeHostnames: ["www.youtube.com", "www.youtube-nocookie.com", "player.vimeo.com", "www.loom.com"],
    });
  } catch (e) {
    console.error("sanitize-html failed in Worker, using raw content:", e);
  }

  return { post: { ...post, content: sanitizedContent } };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data?.post) {
    return buildMeta({
      title: "Post Not Found | SiteNova",
      description: "The blog post you're looking for could not be found.",
      noindex: true,
    });
  }

  return buildMeta({
    title: `${data.post.title} | SiteNova Blog`,
    description: data.post.excerpt || data.post.title,
    canonicalPath: `/blog/${data.post.slug}`,
    type: "article",
    publishedTime: data.post.published_at,
    author: "Kavish Ganatra",
    image: data.post.cover_image,
  });
}

export { default } from "@/pages/blog/BlogPost";
