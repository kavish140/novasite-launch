import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

const now = new Date().toISOString();
const audits = [
  {
    id: "audit-preview",
    name: "Preview Client",
    email: "preview@example.test",
    mobile: "",
    website_url: "https://example.test",
    status: "pending",
    source: null,
    created_at: now,
  },
];
const quotes = [
  {
    id: "quote-preview",
    name: "Sample Business",
    email: "sample@example.test",
    business_name: "Sample Studio",
    project_type: "Business Website",
    status: "new",
    created_at: now,
  },
];

test.beforeEach(async ({ page }) => {
  await page.route(/googletagmanager|clarity\.ms|sentry\.io/, (route) =>
    route.abort(),
  );
  await page.route("**/api/booking-settings", (route) =>
    route.fulfill({ json: { enabled: false, booking_url: null } }),
  );
  await page.route(/\.supabase\.co\//, (route) => {
    const table = new URL(route.request().url()).pathname.split("/").pop();
    return route.fulfill({
      json:
        table === "audit_requests"
          ? audits
          : table === "quote_requests"
            ? quotes
            : [],
      headers: { "content-range": "0-0/0" },
    });
  });
});

async function previewSession(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    const payload = btoa(
      JSON.stringify({
        sub: "admin-design-preview",
        exp: Math.floor(Date.now() / 1000) + 3600,
      }),
    );
    localStorage.setItem(
      "sb-bklmtwblsoitafynpikc-auth-token",
      JSON.stringify({
        access_token: `preview.${payload}.preview`,
        refresh_token: "preview-only",
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        expires_in: 3600,
        token_type: "bearer",
        user: {
          id: "admin-design-preview",
          email: "preview@example.test",
          aud: "authenticated",
          role: "authenticated",
          app_metadata: {},
          user_metadata: {},
          created_at: new Date().toISOString(),
        },
      }),
    );
  });
}

test("blog editor applies HTML and exports a review of unsaved changes with a complete archive", async ({ page }) => {
  await previewSession(page);
  const post = { id: "editor-preview", title: "Original title", slug: "editor-preview", excerpt: "Summary", content: "<p>Original content</p>", tags: ["SEO"], status: "published", source: "manual", blanks_metadata: [], created_at: now, published_at: now, ai_model: null };
  await page.route("**/rest/v1/blog_posts*", (route) => {
    const url = new URL(route.request().url());
    return route.fulfill({ json: url.searchParams.has("id") ? post : [post, { ...post, id: "earlier", slug: "earlier", title: "Earlier article", content: "<p>Entire older article</p>" }] });
  });
  await page.goto("/admin/blog/editor-preview");
  await page.getByLabel("Post Title").fill("Unsaved upgraded title");
  const canvas = page.locator(".tiptap");
  await canvas.click();
  await page.keyboard.press("Control+End");
  await page.keyboard.press("Enter");
  await canvas.pressSequentially("<h2>Typed heading</h2><strong>Bold</strong> plain");
  await expect(canvas.locator("h2")).toHaveText("Typed heading");
  await expect(canvas.locator("strong")).toHaveText("Bold");
  await canvas.evaluate((element) => {
    const data = new DataTransfer();
    data.setData("text/plain", "<p>Pasted <em>HTML</em></p>");
    element.dispatchEvent(new ClipboardEvent("paste", { clipboardData: data, bubbles: true, cancelable: true }));
  });
  await expect(canvas.locator("em")).toHaveText("HTML");
  await page.evaluate(() => {
    Object.defineProperty(navigator.clipboard, "writeText", { configurable: true, value: async (text: string) => { (window as unknown as { reviewClipboard: string }).reviewClipboard = text; } });
  });
  await page.getByRole("button", { name: "Copy review prompt + post", exact: true }).click();
  const copied = await page.evaluate(() => (window as unknown as { reviewClipboard: string }).reviewClipboard);
  expect(copied).toContain("Unsaved upgraded title");
  expect(copied).toContain("Typed heading");
  expect(copied).toContain("Fact-check");
  expect(copied).not.toContain("PUBLISHED POSTS —");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download review TXT (all posts)", exact: true }).click();
  const download = await downloadPromise;
  const archive = await readFile((await download.path())!, "utf8");
  expect(archive).toContain("PUBLISHED POSTS — 2 posts");
  expect(archive).toContain("Entire older article");
  expect(archive).toContain("Unsaved upgraded title");
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("admin remains protected and login supports password visibility", async ({
  page,
}) => {
  await page.goto("/admin/dashboard");
  await expect(page).toHaveURL(/\/admin$/);
  await expect(
    page.getByRole("heading", { name: "Welcome back." }),
  ).toBeVisible();
  await page.getByLabel("Password", { exact: true }).fill("preview-password");
  await page.getByRole("button", { name: "Show password" }).click();
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute(
    "type",
    "text",
  );
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: "test-results/admin-login-desktop.png",
    fullPage: true,
  });
});

test("overview shows real inquiry counts and navigation actions", async ({
  page,
}) => {
  await previewSession(page);
  await page.goto("/admin/dashboard");
  await expect(
    page.getByRole("heading", { name: "Overview", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("2 inquiries need your attention.", { exact: false }),
  ).toBeVisible();
  await expect(page.getByText("Sample Studio", { exact: true })).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: "test-results/admin-overview-desktop.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Review inquiries" }).click();
  await expect(
    page.getByRole("heading", { name: "Quote requests", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Search workspace" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Toggle color theme" }).click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: "test-results/admin-quotes-light.png",
    fullPage: true,
  });
});

test("mobile sidebar closes after navigation without page overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await previewSession(page);
  await page.goto("/admin/dashboard");
  await expect(
    page.getByText("2 inquiries need your attention.", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Toggle Sidebar" }).click();
  await page
    .getByRole("button", { name: "Scheduled calls", exact: false })
    .click();
  await expect(
    page.getByRole("heading", { name: "Scheduled calls", exact: true }),
  ).toBeVisible();
  await expect(
    page.locator('[data-sidebar="sidebar"][data-mobile="true"]'),
  ).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: "test-results/admin-calls-mobile.png",
    fullPage: true,
  });
});

test("content studio filters drafts and keeps search recoverable", async ({
  page,
}) => {
  const aiPosts = [
    {
      id: "draft-1",
      title: "A better restaurant website",
      slug: "restaurant-websites",
      excerpt: "A useful guide to getting more bookings with a clear website.",
      tags: ["Web design", "Restaurants"],
      source: "ai",
      status: "draft",
      ai_model: "Preview model",
      created_at: now,
      blanks_metadata: [
        {
          id: "blank-1",
          label: "Your client experience",
          guideline: "Add an example from a local restaurant project.",
          filled: false,
        },
        {
          id: "blank-2",
          label: "Local context",
          guideline: "Describe your local audience.",
          filled: true,
        },
      ],
    },
    {
      id: "draft-2",
      title: "Planning your business website",
      slug: "business-plan",
      excerpt: "What to prepare before speaking to your developer.",
      tags: ["Planning"],
      source: "ai",
      status: "draft",
      created_at: now,
      blanks_metadata: [],
    },
    {
      id: "published-1",
      title: "Published guide",
      slug: "published-guide",
      source: "ai",
      status: "published",
      created_at: now,
      blanks_metadata: [],
    },
  ];
  await page.route("**/rest/v1/blog_posts?**", (route) =>
    route.fulfill({ json: aiPosts }),
  );
  await previewSession(page);
  await page.goto("/admin/dashboard");
  await page.getByRole("button", { name: /^AI drafts(?:\s*\d+)?$/ }).click();
  await expect(page.getByText("1 of 2 complete")).toBeVisible();
  await page.getByText("1 contribution to add", { exact: true }).click();
  await expect(
    page.getByText("Add an example from a local restaurant project."),
  ).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: "test-results/admin-drafts-desktop.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: /^Published/ }).click();
  await expect(
    page.getByRole("link", { name: "Published guide", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Publish", exact: true }),
  ).toHaveCount(0);
  await page.getByLabel("Search AI drafts").fill("no matching article");
  await expect(
    page.getByText("No matching articles", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear draft search" }).click();
  await expect(
    page.getByRole("link", { name: "Published guide", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "All articles", exact: true }).click();
  await expect(
    page.getByRole("link", {
      name: "A better restaurant website",
      exact: true,
    }),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: "test-results/admin-drafts-mobile.png",
    fullPage: true,
  });
});

test("topic queue shows every stage, prioritizes ideas and supports adding", async ({
  page,
}) => {
  const topics = [
    {
      id: "topic-1",
      title: "Website planning for Mumbai businesses",
      description: "A practical guide for local business owners.",
      target_keywords: ["Mumbai", "Business websites"],
      status: "pending",
      priority: 3,
      created_at: now,
      used_at: null,
    },
    {
      id: "topic-2",
      title: "A timely restaurant guide",
      description: "How to make online bookings simpler.",
      target_keywords: ["Restaurants"],
      status: "pending",
      priority: 10,
      created_at: now,
      used_at: null,
    },
    {
      id: "topic-3",
      title: "Article being written",
      description: "This topic is in progress.",
      target_keywords: [],
      status: "in_progress",
      priority: 0,
      created_at: now,
      used_at: null,
    },
  ];
  let added: Record<string, unknown> | undefined;
  await page.route("**/rest/v1/blog_topics?**", (route) => {
    if (route.request().method() === "POST") {
      added = route.request().postDataJSON()[0];
      return route.fulfill({
        json: { ...added, id: "new-topic", created_at: now, used_at: null },
      });
    }
    return route.fulfill({ json: topics });
  });
  await previewSession(page);
  await page.goto("/admin/dashboard");
  await page.getByRole("button", { name: "Topic queue", exact: true }).click();
  await expect(
    page.getByRole("heading", {
      name: "A timely restaurant guide",
      exact: true,
    }),
  ).toHaveCount(2);
  await page.getByRole("button", { name: /^In progress/ }).click();
  await expect(
    page.getByRole("heading", { name: "Article being written", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "All topics", exact: true }).click();
  await expect(page.locator("article h3").first()).toHaveText(
    "A timely restaurant guide",
  );
  await page
    .getByRole("button", {
      name: "Delete A timely restaurant guide",
      exact: true,
    })
    .click();
  await expect(page.getByRole("alertdialog")).toBeVisible();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await page.getByRole("button", { name: "Toggle color theme" }).click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: "test-results/admin-topics-desktop.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Add topic", exact: true }).click();
  await page
    .getByLabel("Topic title", { exact: false })
    .fill("A new local guide");
  await page.getByLabel("Queue priority").fill("20");
  await page.getByLabel("Target keywords").fill("local, guide");
  await page.getByRole("button", { name: "Add to queue", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "A new local guide", exact: true }),
  ).toHaveCount(2);
  expect(added).toMatchObject({
    title: "A new local guide",
    priority: 20,
    target_keywords: ["local", "guide"],
  });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Add topic", exact: true }).click();
  await expect(page.locator("#topic-add-form")).toHaveCSS("opacity", "1");
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: "test-results/admin-topic-form-mobile.png",
    animations: "disabled",
    fullPage: true,
  });
});
