// SiteNova Blog MCP Server — Supabase Edge Function
// Speaks MCP-over-HTTP (JSON-RPC 2.0) so Gemini Spark can call blog tools.
// Endpoint: https://bklmtwblsoitafynpikc.supabase.co/functions/v1/blog-mcp

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, mcp-session-id, x-api-key",
};

// ── Tool definitions (shown to Gemini) ───────────────────────────────────────
const TOOLS = [
  {
    name: "list_topics",
    description: "List all pending blog topics in the SiteNova topic queue, ordered by priority. Use this to see what topics are waiting to be written.",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "add_topic",
    description: "Add a new topic to the SiteNova blog topic queue. The AI blog generator will pick it up on the next run.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "The blog topic title" },
        description: { type: "string", description: "Specific angle or focus for this topic" },
        target_keywords: { type: "array", items: { type: "string" }, description: "Target SEO keywords" },
        priority: { type: "number", description: "Priority 0-100. Higher = picked first. Default 0." },
      },
      required: ["title"],
    },
  },
  {
    name: "mark_topic_used",
    description: "Mark a topic as used after it has been written about.",
    inputSchema: {
      type: "object",
      properties: {
        topic_id: { type: "string", description: "The UUID of the topic to mark as used" },
      },
      required: ["topic_id"],
    },
  },
  {
    name: "skip_topic",
    description: "Skip a topic — it will be moved to the skipped list and the AI will not pick it up.",
    inputSchema: {
      type: "object",
      properties: {
        topic_id: { type: "string", description: "The UUID of the topic to skip" },
      },
      required: ["topic_id"],
    },
  },
  {
    name: "list_recent_posts",
    description: "List the 15 most recent blog posts (published + drafts) to avoid writing about duplicate topics.",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "list_drafts",
    description: "List all AI-generated draft blog posts that are waiting to be reviewed and published.",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "create_draft",
    description: "Save a new AI-generated blog post draft to the SiteNova database with status=draft.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Post title (50-70 chars)" },
        slug: { type: "string", description: "URL slug (lowercase-hyphenated, max 60 chars)" },
        excerpt: { type: "string", description: "Post excerpt (150-160 chars)" },
        content: { type: "string", description: "Full HTML content with <!-- BLANK:id --> markers" },
        tags: { type: "array", items: { type: "string" }, description: "3-6 lowercase tags" },
        blanks_metadata: { type: "array", description: "Array of blank metadata objects" },
        ai_model: { type: "string", description: "Model name used" },
        ai_prompt_used: { type: "string", description: "Topic or prompt used" },
      },
      required: ["title", "slug", "excerpt", "content"],
    },
  },
  {
    name: "get_site_context",
    description: "Get SiteNovas full business context: services, pricing in rupees, Mumbai service areas, content pillars, tone, and internal links to use in blog posts.",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "get_blank_guidelines",
    description: "Get the rules for inserting human-fill blank markers into AI blog posts. Always call this before writing a post.",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
];

// ── Site context ──────────────────────────────────────────────────────────────
const SITE_CONTEXT = {
  business: {
    name: "SiteNova",
    domain: "https://sitenova.dev",
    founder: "Kavish Ganatra",
    location: "Mulund, Mumbai, Maharashtra, India",
    phone: "+91 9326060621",
    email: "kavishganatra5@gmail.com",
    whatsapp: "wa.me/919326060621",
  },
  services: [
    { name: "Business Websites", price_from: 15000 },
    { name: "E-Commerce Stores", price_from: 18000, note: "Razorpay + Stripe" },
    { name: "Custom Web Applications", price_from: 30000 },
    { name: "SEO & Speed Audits", price_from: 8000 },
    { name: "Google Ads Management", price_from: null },
    { name: "Meta Ads Management", price_from: null },
  ],
  service_areas: [
    "Mulund", "Bhandup", "Nahur", "Thane", "Ghatkopar", "Powai",
    "Vikhroli", "Kurla", "Dadar", "Andheri", "Lower Parel",
    "Mahalakshmi", "Pedder Road", "Bandra", "Central Mumbai",
  ],
  niche_verticals: ["Doctors & Clinics", "Lawyers", "Finance & CAs", "Real Estate", "Consultants", "Startups", "Restaurants"],
  content_pillars: [
    "Why every local Mumbai business needs a professional website",
    "Local SEO tips for Mumbai & Maharashtra businesses",
    "How to get more customers with Google Ads for small budgets",
    "E-commerce for Indian businesses - Razorpay, COD, UPI",
    "Website speed & Core Web Vitals for better Google rankings",
    "Industry-specific website tips (doctors, lawyers, restaurants, etc.)",
    "How to choose a web designer in Mumbai - red flags & green flags",
    "Real results: before & after website transformations for Mumbai businesses",
  ],
  tone: "Knowledgeable friend - helpful, direct, relatable. No corporate jargon. Use Indian context naturally.",
  internal_links: [
    { text: "free website audit", url: "https://sitenova.dev/free-audit" },
    { text: "web design pricing", url: "https://sitenova.dev/pricing" },
    { text: "get a quote", url: "https://sitenova.dev/quote" },
    { text: "e-commerce website", url: "https://sitenova.dev/services/ecommerce" },
    { text: "SEO & speed audit", url: "https://sitenova.dev/services/seo-optimization" },
    { text: "Google Ads management", url: "https://sitenova.dev/services/google-ads" },
    { text: "contact SiteNova", url: "https://sitenova.dev/contact-us" },
    { text: "website cost calculator", url: "https://sitenova.dev/website-cost-calculator" },
  ],
};

const BLANK_GUIDELINES = {
  purpose: "Blanks let the human founder add real experience signals that Google rewards for E-E-A-T ranking. Never fill these in yourself.",
  format: "<!-- BLANK:unique_snake_case_id -->",
  required_blank_types: [
    { type: "intro_anecdote", label: "Personal Anecdote - Opening", description: "A specific real story from Kavish's client work. 2-3 sentences. Must relate directly to this post's topic.", placement: "After the opening paragraph" },
    { type: "local_example", label: "Local Mumbai Example", description: "A specific business in Mumbai or a named neighbourhood that illustrates the point.", placement: "Within a main body section" },
    { type: "case_study", label: "Real Client Result", description: "A concrete before/after result from a real SiteNova client.", placement: "In the social proof section" },
    { type: "cta", label: "Personalised CTA", description: "Kavish's personal call-to-action specific to this post's topic.", placement: "Near the end, before conclusion" },
  ],
  rules: [
    "Exactly 4-6 blanks per post",
    "Must include: intro_anecdote, local_example, case_study, and cta",
    "After each blank marker, add a context sentence explaining what goes there",
    "Each blank guideline must be specific to THIS post's topic",
    "IDs must be snake_case and unique within the post",
    "Never write the blank content yourself",
  ],
};

// ── Tool execution ────────────────────────────────────────────────────────────
async function callTool(name: string, args: Record<string, unknown>) {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  switch (name) {
    case "get_site_context":
      return { success: true, data: SITE_CONTEXT };

    case "get_blank_guidelines":
      return { success: true, data: BLANK_GUIDELINES };

    case "list_topics": {
      const { data, error } = await supabase
        .from("blog_topics")
        .select("*")
        .eq("status", "pending")
        .order("priority", { ascending: false })
        .order("created_at", { ascending: true });
      if (error) throw new Error(error.message);
      return {
        success: true,
        data: data ?? [],
        count: (data ?? []).length,
        message: (data ?? []).length === 0
          ? "No pending topics. Auto-select a relevant topic for Mumbai businesses."
          : `${(data ?? []).length} pending topic(s). Use the first one (highest priority).`,
      };
    }

    case "add_topic": {
      const { data, error } = await supabase
        .from("blog_topics")
        .insert([{
          title: args.title,
          description: args.description ?? null,
          target_keywords: args.target_keywords ?? [],
          status: "pending",
          priority: args.priority ?? 0,
        }])
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return { success: true, data, message: `Topic "${args.title}" added to queue.` };
    }

    case "mark_topic_used": {
      const { error } = await supabase
        .from("blog_topics")
        .update({ status: "used", used_at: new Date().toISOString() })
        .eq("id", args.topic_id);
      if (error) throw new Error(error.message);
      return { success: true, message: `Topic ${args.topic_id} marked as used.` };
    }

    case "skip_topic": {
      const { error } = await supabase
        .from("blog_topics")
        .update({ status: "skipped" })
        .eq("id", args.topic_id);
      if (error) throw new Error(error.message);
      return { success: true, message: `Topic ${args.topic_id} skipped.` };
    }

    case "list_recent_posts": {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, tags, status, source, created_at")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      const posts = data ?? [];
      return {
        success: true,
        data: posts,
        count: posts.length,
        // Flat list of titles for quick duplicate-checking
        topics_covered: posts.map((p: Record<string, unknown>) => p.title),
        note: "Check BOTH title similarity AND tags before choosing a new topic. Do not write about anything in topics_covered.",
      };
    }

    case "list_drafts": {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, status, source, blanks_metadata, created_at")
        .eq("status", "draft")
        .eq("source", "ai")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return { success: true, data: data ?? [], count: (data ?? []).length };
    }

    case "create_draft": {
      const { data: existing } = await supabase
        .from("blog_posts")
        .select("id")
        .eq("slug", args.slug)
        .single();
      const slug = existing ? `${args.slug}-2` : args.slug;
      const { data, error } = await supabase
        .from("blog_posts")
        .insert([{
          title: args.title,
          slug,
          excerpt: args.excerpt,
          content: args.content,
          tags: args.tags ?? [],
          status: "draft",
          source: "ai",
          blanks_metadata: args.blanks_metadata ?? [],
          ai_model: args.ai_model ?? "unknown",
          ai_prompt_used: args.ai_prompt_used ?? "",
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select("id, slug, status")
        .single();
      if (error) throw new Error(error.message);
      return {
        success: true,
        data,
        message: `Draft saved! Review at sitenova.dev/admin -> AI Drafts.`,
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ── JSON-RPC helpers ──────────────────────────────────────────────────────────
function ok(id: unknown, result: unknown) {
  return Response.json({ jsonrpc: "2.0", id, result }, { headers: CORS });
}
function rpcErr(id: unknown, code: number, message: string) {
  return Response.json({ jsonrpc: "2.0", id, error: { code, message } }, { headers: CORS });
}

// ── Main handler ──────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });

  if (req.method === "GET") {
    return Response.json(
      { name: "sitenova-blog", version: "1.0.0", description: "SiteNova Blog Tools", tools: TOOLS.map((t) => ({ name: t.name, description: t.description })) },
      { headers: CORS }
    );
  }

  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: CORS });

  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return rpcErr(null, -32700, "Parse error"); }

  const { id, method, params } = body as { id: unknown; method: string; params: Record<string, unknown> };

  switch (method) {
    case "initialize":
      return ok(id, {
        protocolVersion: "2024-11-05",
        serverInfo: { name: "sitenova-blog", version: "1.0.0" },
        capabilities: { tools: {} },
      });
    case "notifications/initialized":
      return new Response(null, { status: 204, headers: CORS });
    case "ping":
      return ok(id, {});
    case "tools/list":
      return ok(id, { tools: TOOLS });
    case "tools/call": {
      const toolName = (params?.name as string) ?? "";
      const toolArgs = (params?.arguments as Record<string, unknown>) ?? {};
      try {
        const result = await callTool(toolName, toolArgs);
        return ok(id, { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        return ok(id, { content: [{ type: "text", text: `Error: ${msg}` }], isError: true });
      }
    }
    default:
      return rpcErr(id, -32601, `Method not found: ${method}`);
  }
});
