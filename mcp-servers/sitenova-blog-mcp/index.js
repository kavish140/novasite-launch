#!/usr/bin/env node
// SiteNova Blog MCP — thin wrapper forwarding tool calls to Supabase Edge Function
// Set these env vars in mcp_config.json:
//   EDGE_FUNCTION_URL = https://<project-ref>.supabase.co/functions/v1
//   SUPABASE_ANON_KEY = your anon key

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const EDGE_URL = process.env.EDGE_FUNCTION_URL;
const ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!EDGE_URL || !ANON_KEY) {
  console.error("ERROR: EDGE_FUNCTION_URL and SUPABASE_ANON_KEY must be set in env.");
  process.exit(1);
}

const ENDPOINT = `${EDGE_URL}/blog-api`;

async function callEdge(action, params = {}) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${ANON_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action, params }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Edge function error");
  return json.data;
}

const TOOLS = [
  {
    name: "create_draft",
    description: "Creates a new AI-generated blog post draft in SiteNova's Supabase database with status=draft, source=ai, and blanks_metadata for human fill-in points.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "SEO-optimised post title (50-70 chars)" },
        slug: { type: "string", description: "URL slug (lowercase, hyphenated)" },
        excerpt: { type: "string", description: "Meta description (150-160 chars)" },
        content: { type: "string", description: "Full HTML content with <!-- BLANK:id --> markers" },
        tags: { type: "array", items: { type: "string" }, description: "Array of topic tags" },
        blanks_metadata: { type: "array", description: "Array of blank objects with id, label, guideline, location, filled, filled_content" },
        ai_model: { type: "string", description: "Name of the AI model used (e.g. gemini-2.5-flash)" },
        ai_prompt_used: { type: "string", description: "The topic or prompt used to generate this post" },
      },
      required: ["title", "slug", "content"],
    },
  },
  {
    name: "list_recent_posts",
    description: "Returns the 30 most recent blog posts (all statuses) so the AI can avoid duplicate topics.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "list_topics",
    description: "Returns all pending topics from the blog_topics queue. The AI should use these before auto-generating a topic.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "mark_topic_used",
    description: "Marks a topic from the queue as used after the AI has written about it.",
    inputSchema: {
      type: "object",
      properties: {
        topic_id: { type: "string", description: "UUID of the topic to mark as used" },
      },
      required: ["topic_id"],
    },
  },
  {
    name: "add_topic",
    description: "Adds a new topic suggestion to the blog_topics queue for future posts.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Topic title" },
        description: { type: "string", description: "Brief description of the topic angle" },
        target_keywords: { type: "array", items: { type: "string" }, description: "Target SEO keywords" },
      },
      required: ["title"],
    },
  },
  {
    name: "get_site_context",
    description: "Returns SiteNova business info: services, pricing, service areas, blog strategy, and internal links to use in posts.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_blank_guidelines",
    description: "Returns the blank insertion rules, blank types, guidelines for each blank, and blanks_metadata format that the AI must follow when writing posts.",
    inputSchema: { type: "object", properties: {} },
  },
];

const server = new Server(
  { name: "sitenova-blog", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    const data = await callEdge(name, args ?? {});
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  } catch (err) {
    return {
      content: [{ type: "text", text: `Error: ${err.message}` }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("sitenova-blog MCP server running");
