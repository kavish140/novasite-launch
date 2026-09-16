// SiteNova Blog API — Supabase Edge Function
// Function name: blog-api
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are auto-injected by Supabase.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const body = await req.json();
    const action: string = body.action;
    const params: Record<string, unknown> = body.params ?? {};

    let result: unknown;

    switch (action) {
      case "create_draft":
        result = await handleCreateDraft(supabaseAdmin, params);
        break;
      case "list_recent_posts":
        result = await handleListRecentPosts(supabaseAdmin);
        break;
      case "list_topics":
        result = await handleListTopics(supabaseAdmin);
        break;
      case "mark_topic_used":
        result = await handleMarkTopicUsed(supabaseAdmin, params);
        break;
      case "add_topic":
        result = await handleAddTopic(supabaseAdmin, params);
        break;
      case "get_site_context":
        result = getSiteContext();
        break;
      case "get_blank_guidelines":
        result = getBlankGuidelines();
        break;
      default:
        return new Response(
          JSON.stringify({ success: false, error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function handleCreateDraft(
  supabase: ReturnType<typeof createClient>,
  params: Record<string, unknown>
) {
  const { title, slug, excerpt, content, tags, blanks_metadata, ai_model, ai_prompt_used } = params;
  if (!title || !slug || !content) throw new Error("title, slug, and content are required");
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("blog_posts")
    .insert([{
      title, slug, excerpt: excerpt ?? "", content,
      tags: tags ?? [],
      status: "draft", source: "ai",
      blanks_metadata: blanks_metadata ?? [],
      ai_model: ai_model ?? null,
      ai_prompt_used: ai_prompt_used ?? null,
      created_at: now, updated_at: now,
    }])
    .select("id, slug, status")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

async function handleListRecentPosts(supabase: ReturnType<typeof createClient>) {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, tags, status, source, created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  const posts = data ?? [];
  return {
    posts,
    count: posts.length,
    topics_covered: posts.map((p: Record<string, unknown>) => p.title),
    note: "Check BOTH title similarity AND tags before choosing a new topic. Do not write about anything in topics_covered.",
  };
}

async function handleListTopics(supabase: ReturnType<typeof createClient>) {
  const { data, error } = await supabase
    .from("blog_topics")
    .select("*")
    .eq("status", "pending")
    .order("priority", { ascending: false })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

async function handleMarkTopicUsed(
  supabase: ReturnType<typeof createClient>,
  params: Record<string, unknown>
) {
  const { topic_id } = params;
  if (!topic_id) throw new Error("topic_id is required");
  const { error } = await supabase
    .from("blog_topics")
    .update({ status: "used", used_at: new Date().toISOString() })
    .eq("id", topic_id);
  if (error) throw new Error(error.message);
  return { topic_id, status: "used" };
}

async function handleAddTopic(
  supabase: ReturnType<typeof createClient>,
  params: Record<string, unknown>
) {
  const { title, description, target_keywords } = params;
  if (!title) throw new Error("title is required");
  const { data, error } = await supabase
    .from("blog_topics")
    .insert([{ title, description: description ?? null, target_keywords: target_keywords ?? [], status: "pending" }])
    .select("id, title")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

function getSiteContext() {
  return {
    business: {
      name: "SiteNova",
      tagline: "Custom Web Design & Development Agency",
      domain: "https://sitenova.dev",
      founded: 2024,
      founder: "Kavish Ganatra",
      location: "Mulund, Mumbai, Maharashtra, India",
      phone: "+91 9326060621",
      email: "kavishganatra5@gmail.com",
    },
    services: [
      { name: "Business Websites", price_from: "₹15,000" },
      { name: "E-Commerce Stores", price_from: "₹18,000", note: "Razorpay + Stripe" },
      { name: "Custom Web Applications / Dashboards", price_from: "₹30,000" },
      { name: "SEO & Speed Audits / Core Web Vitals", price_from: "₹8,000" },
      { name: "Google Ads Management", note: "Recommended ad spend: ₹10,000–₹15,000/month" },
      { name: "Meta Ads (Facebook & Instagram)", note: "Recommended ad spend: ₹10,000–₹15,000/month" },
    ],
    niche_specialties: ["Doctors", "Lawyers", "Finance/CA Firms", "Real Estate Agents", "Consultants", "Startups", "Restaurants"],
    service_areas: ["Mulund", "Mumbai", "Bhandup", "Nahur", "Thane", "Ghatkopar", "Powai", "Vikhroli", "Kurla", "Dadar", "Andheri", "Lower Parel", "Mahalakshmi", "Pedder Road"],
    blog_strategy: {
      target_audience: "Small business owners in Mumbai and Maharashtra looking to grow online",
      content_pillars: [
        "Web design tips for Indian businesses",
        "Local SEO for Mumbai / Maharashtra search",
        "E-commerce for Indian market",
        "Google Ads and Meta Ads for local businesses",
        "Website speed and Core Web Vitals",
        "Industry-specific: doctors, lawyers, restaurants, real estate",
        "Digital marketing ROI and business growth through web",
        "AI and automation trends in web development",
      ],
      tone: "Professional but approachable — like a knowledgeable friend, not a corporate brochure",
      language: "English, INR (₹) pricing, Indian market references, Mumbai-specific examples",
      target_word_count: "1600-1800 words",
      internal_links: [
        { url: "https://sitenova.dev/pricing", label: "Our Pricing" },
        { url: "https://sitenova.dev/free-audit", label: "Free Website Audit" },
        { url: "https://sitenova.dev/contact-us", label: "Contact SiteNova" },
        { url: "https://sitenova.dev/services/seo-optimization", label: "SEO Services" },
        { url: "https://sitenova.dev/services/ecommerce", label: "E-Commerce Development" },
        { url: "https://sitenova.dev/services/google-ads", label: "Google Ads Management" },
        { url: "https://sitenova.dev/services/meta-ads", label: "Meta Ads Management" },
        { url: "https://sitenova.dev/why-us", label: "Why Choose SiteNova" },
      ],
    },
  };
}

function getBlankGuidelines() {
  return {
    instructions: "Insert exactly 4-6 <!-- BLANK:unique_id --> HTML comment markers at critical points. Each blank MUST have a matching entry in blanks_metadata. Surround each blank with a context sentence so Kavish knows what to write there.",
    example_usage: 'In my experience working with Mumbai businesses, <!-- BLANK:intro_anecdote_1 --> This kind of hands-on experience is exactly why I always tell clients...',
    blank_types: [
      {
        id_prefix: "intro_anecdote",
        label: "Personal Anecdote (Intro)",
        guideline: "Kavish will add 2-3 sentences of personal experience from real client work. Demonstrates E-E-A-T for Google.",
        required: true,
        placement: "Within the first 2 paragraphs",
      },
      {
        id_prefix: "local_example",
        label: "Local Mumbai / India Example",
        guideline: "A specific grounded example from Mumbai or Indian market. Can reference a neighbourhood, local business type, or Indian consumer behaviour.",
        required: true,
        placement: "Middle section, inside or after a key point",
      },
      {
        id_prefix: "case_study",
        label: "Real Client Result / Case Study",
        guideline: "A real client result with a specific metric. DO NOT invent numbers — Kavish will add the real stat. Format: 'One of our [area] clients saw [result] within [timeframe].'",
        required: true,
        placement: "After explaining a key concept, to prove it works",
      },
      {
        id_prefix: "opinion",
        label: "Expert Opinion / Personal Recommendation",
        guideline: "Kavish's personal take or specific tool recommendation. First-person. This is what makes the post unique vs AI-only content.",
        required: false,
        placement: "Before a tips section or before the conclusion",
      },
      {
        id_prefix: "cta",
        label: "Call-to-Action Paragraph",
        guideline: "A personalised, topic-relevant CTA. Natural, not salesy. Should reference the post's specific topic. Link to /free-audit or /contact-us. 2-3 sentences.",
        required: true,
        placement: "Near the end, before the conclusion",
      },
      {
        id_prefix: "stat_source",
        label: "Verified Statistic with Source",
        guideline: "A verified recent statistic with a source link (Statista, Google, NASSCOM, credible Indian report). Kavish will verify — AI-generated stats are NOT acceptable here.",
        required: false,
        placement: "Early in the article (first 30%) to establish credibility",
      },
    ],
    blanks_metadata_format: {
      id: "Must exactly match the ID in the HTML comment (e.g. 'intro_anecdote_1')",
      label: "Human-readable label for the admin UI",
      guideline: "Specific instructions for Kavish",
      location: "Where in the article this blank appears",
      filled: false,
      filled_content: null,
    },
  };
}
