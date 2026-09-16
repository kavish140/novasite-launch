---
name: daily-blog-generator
description: >-
  Use this skill when asked to generate a daily SEO blog post for SiteNova
  (sitenova.dev). This skill calls the live Supabase Edge Function API to
  fetch site context, blank guidelines, recent posts, and pending topics,
  then writes a 1600-1800 word HTML blog post with 4-6 strategic human-fill
  blanks, and saves it as a draft via the API. Run this once per day.
---

# SiteNova Daily Blog Generator

Generates one SEO-optimised blog post draft per run and saves it to the
SiteNova Supabase database as `status: draft, source: ai`. Kavish (the site
owner) will later fill in the blanks and publish.

## API Endpoint

```
POST https://bklmtwblsoitafynpikc.supabase.co/functions/v1/blog-api
Authorization: Bearer sb_publishable_1plD6RHQx7ryxfWyXySNow__LIKTxVI
Content-Type: application/json
Body: { "action": "<action_name>", "params": { ... } }
```

Available actions: `get_site_context`, `get_blank_guidelines`,
`list_recent_posts`, `list_topics`, `mark_topic_used`, `add_topic`,
`create_draft`

---

## Step-by-Step Procedure

Follow these steps **in order** on every run.

### Step 1 — Fetch site context

Call `get_site_context` (no params). Read the returned object carefully:
- `business` — who SiteNova is, founder name, location, pricing
- `services` — all services with prices in ₹
- `service_areas` — Mumbai neighbourhoods to reference in posts
- `blog_strategy` — target audience, content pillars, tone, internal links
- `target_word_count` — **1600–1800 words**

### Step 2 — Fetch blank guidelines

Call `get_blank_guidelines` (no params). Read the rules:
- You MUST insert **4–6** `<!-- BLANK:unique_id -->` HTML comment markers
- Each blank needs a matching entry in `blanks_metadata`
- The 3 **required** blank types are: `intro_anecdote`, `local_example`,
  `case_study`, `cta`
- Never leave a blank isolated — surround it with a context sentence

### Step 3 — Fetch recent posts (avoid duplicates)

Call `list_recent_posts` (no params). Note all titles and topics returned.
**Do not write about any topic already covered in the last 30 posts.**

### Step 4 — Pick a topic

Call `list_topics` (no params).

**If pending topics exist:** Use the first topic in the list (highest
priority + oldest). Call `mark_topic_used` with its `topic_id` after you
finish writing.

**If no pending topics:** Auto-generate a topic using this logic:
1. Think about what is currently relevant to Mumbai small business owners
2. Cross-reference the `content_pillars` from site context
3. Pick a topic that is NOT in recent posts
4. Aim for long-tail keywords relevant to Mumbai / Maharashtra local search
5. Consider seasonal relevance (festivals, financial year, monsoon, etc.)
6. Call `add_topic` to log the auto-generated topic for future reference

**Good topic examples:**
- "Why Mumbai Restaurants Need a Mobile-First Website in 2025"
- "Google My Business vs Your Own Website: What Every Mulund Business Owner Needs to Know"
- "How to Get Your Doctor's Clinic on Page 1 of Google in Thane"
- "5 Signs Your E-Commerce Store is Losing Mumbai Customers (And How to Fix It)"
- "Core Web Vitals Explained for Indian Business Owners Who Aren't Tech-Savvy"

### Step 5 — Write the blog post (HTML)

Write the full post in **valid HTML** suitable for direct insertion into a
TipTap-rendered blog. Requirements:

**Structure:**
```
<h1>Post Title</h1>
<p>Introduction paragraph...</p>
<!-- BLANK:intro_anecdote_1 -->
<p>Context sentence after blank...</p>

<h2>Section Heading</h2>
<p>...</p>
...
<!-- BLANK:local_example_1 -->
...
<!-- BLANK:case_study_1 -->
...
<!-- BLANK:opinion_1 -->  (optional)
...
<!-- BLANK:cta_1 -->
<p>Context CTA sentence...</p>

<h2>Conclusion</h2>
<p>...</p>
<!-- BLANK:stat_source_1 -->  (optional)
```

**Content rules:**
- Length: **1600–1800 words** (count carefully)
- Tone: Professional but warm, like a knowledgeable friend — not corporate
- Language: English with Indian market context and ₹ pricing
- Include 3–5 internal links from the `internal_links` list (use `<a href="...">` tags)
- Use proper heading hierarchy: `<h2>` for sections, `<h3>` for subsections
- No `<html>`, `<head>`, `<body>` wrapper tags — content only
- No placeholder text like "[Insert X here]" — the blank markers handle that
- Do NOT make up statistics — leave a `stat_source` blank for Kavish to verify
- Do NOT write the intro anecdote yourself — leave the `intro_anecdote` blank
- Do NOT write client results — leave the `case_study` blank

**SEO rules:**
- Title: 50–70 characters, include primary keyword
- Use the primary keyword naturally in the first paragraph
- Include location keywords (Mumbai, Mulund, or other service areas) naturally
- Use semantic variations of the keyword throughout (not keyword stuffing)

### Step 6 — Build blanks_metadata array

For every `<!-- BLANK:id -->` marker you inserted, create a matching object:

```json
{
  "id": "intro_anecdote_1",
  "label": "Personal Anecdote — Opening",
  "guideline": "Write 2-3 sentences about a real experience or client situation relevant to [topic]. Be specific.",
  "location": "Second paragraph of the introduction",
  "filled": false,
  "filled_content": null
}
```

The guideline must be **specific to the post's topic** — not generic.

### Step 7 — Build the slug and excerpt

**Slug:** lowercase, hyphenated, max 60 characters, no stop words
```
why-mumbai-restaurants-need-mobile-first-website-2025
```

**Excerpt:** 150–160 characters, includes primary keyword, written as a
compelling meta description that makes someone click.

### Step 8 — Generate tags array

3–6 tags, lowercase, relevant. Example:
```json
["web design", "mumbai", "restaurants", "mobile-first", "local seo"]
```

### Step 9 — Save the draft

Call `create_draft` with:
```json
{
  "action": "create_draft",
  "params": {
    "title": "...",
    "slug": "...",
    "excerpt": "...",
    "content": "<h1>...</h1><p>...</p><!-- BLANK:intro_anecdote_1 -->...",
    "tags": ["...", "..."],
    "blanks_metadata": [ { "id": "...", ... }, ... ],
    "ai_model": "gemini-2.5-flash",
    "ai_prompt_used": "Topic: ..."
  }
}
```

**Verify:** The response should return `{ "success": true, "data": { "id": "...", "slug": "...", "status": "draft" } }`

### Step 10 — Confirm completion

Report back with:
- ✅ Post title
- ✅ Slug
- ✅ Word count (approximate)
- ✅ Number of blanks inserted
- ✅ Database ID returned
- ✅ Topic source (queue or auto-generated)

---

## Error Handling

- If `create_draft` fails with a duplicate slug error: append `-2` to the slug and retry once
- If any API call returns `success: false`: log the error and stop — do not retry more than once
- If topic selection finds a very similar post in recent history: pick a different angle or subtopic

---

## Quality Checklist (run before saving)

Before calling `create_draft`, verify:
- [ ] Word count is between 1600–1800
- [ ] Exactly 4–6 `<!-- BLANK:id -->` markers are present
- [ ] Every blank has a matching entry in `blanks_metadata`
- [ ] At least 3 required blank types are used (intro_anecdote, local_example, case_study, cta)
- [ ] 3–5 internal links from site context are included
- [ ] No invented statistics or client results
- [ ] Slug is unique vs recent posts
- [ ] Excerpt is 150–160 characters
