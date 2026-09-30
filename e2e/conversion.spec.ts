import { test, expect } from "@playwright/test";

const bookingUrl =
  "https://calendar.google.com/calendar/appointments/schedules/test-sitenova";
test.beforeEach(async ({ page }) => {
  await page.route(/googletagmanager|clarity\.ms/, (route) => route.abort());
  await page.route(/\.supabase\.co\//, (route) => route.fulfill({ json: [] }));
  await page.route(/sentry\.io\//, (route) => route.abort());
  await page.route("**/api/booking-settings", (route) =>
    route.fulfill({ json: { enabled: true, booking_url: bookingUrl } }),
  );
  await page.route("https://calendar.google.com/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<p>Test booking calendar</p>",
    }),
  );
});

test("direct booking, iframe fallback and disabled configuration", async ({
  page,
}) => {
  await page.goto("/pricing");
  await page.getByRole("link", { name: "Book a 15-minute Call" }).click();
  await expect(page).toHaveURL(/book-a-call/);
  await expect(
    page.getByRole("heading", {
      name: "Book a 15-minute Website Consultation",
    }),
  ).toBeVisible();
  await expect(
    page.locator('iframe[title="Book a SiteNova Google Meet consultation"]'),
  ).toHaveAttribute("src", bookingUrl);
  await expect(
    page.getByRole("link", { name: "Open booking calendar in a new tab" }),
  ).toHaveAttribute("href", bookingUrl);
  await page.route("**/api/booking-settings", (route) =>
    route.fulfill({ json: { enabled: false, booking_url: bookingUrl } }),
  );
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Arrange a time with Kavish" }),
  ).toBeVisible();
  await expect(
    page.locator('iframe[title="Book a SiteNova Google Meet consultation"]'),
  ).toHaveCount(0);
  await page.goto("/pricing");
  await expect(
    page.getByRole("link", { name: "Book a 15-minute Call" }),
  ).toHaveCount(0);
});

for (const entry of ["/quote", "/lp/web-design"]) {
  test(`quote qualification, safe retry and booking after ${entry}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const submitted: { submissionId: string }[] = [];
    await page.route("**/api/quotes", async (route) => {
      const body = route.request().postDataJSON();
      submitted.push(body);
      if (submitted.length === 1)
        await route.fulfill({
          status: 503,
          json: { error: "Please retry; your details are safe." },
        });
      else
        await route.fulfill({
          json: { saved: true, submissionId: body.submissionId },
        });
    });
    await page.goto(entry);
    const form = page.locator("#website-quote-form");
    await form.getByRole("button", { name: /Business Website/ }).click();
    await form.getByRole("button", { name: "Continue", exact: true }).click();
    await expect(form.getByRole("alert")).toContainText("select your budget");
    await form.getByLabel("Project budget").selectOption("Rs. 15,000 - 30,000");
    await form.getByRole("button", { name: "Continue", exact: true }).click();
    await form
      .getByLabel("Business name", { exact: true })
      .fill("Test Business");
    await form.getByLabel("Your name", { exact: true }).fill("Test Buyer");
    await form.getByLabel("Email", { exact: true }).fill("buyer@example.test");
    await form
      .getByLabel("Phone / WhatsApp", { exact: true })
      .fill("9999999999");
    await form.getByRole("button", { name: "Get My Website Quote" }).click();
    await expect(form.getByRole("alert")).toContainText("Please retry");
    await expect(form.getByLabel("Your name", { exact: true })).toHaveValue(
      "Test Buyer",
    );
    await form.getByRole("button", { name: "Get My Website Quote" }).click();
    await expect(page).toHaveURL(
      entry.startsWith("/lp") ? /lp\/thank-you-quote/ : /\/thank-you$/,
    );
    expect(submitted[0].submissionId).toBe(submitted[1].submissionId);
    const countQuotes = () =>
      page.evaluate(
        () =>
          (window.dataLayer || []).filter(
            (e: ArrayLike<unknown>) =>
              e[0] === "event" && e[1] === "submit_quote_form",
          ).length,
      );
    expect(await countQuotes()).toBe(1);
    expect(
      await page.evaluate(
        () =>
          (window.dataLayer || []).filter(
            (e: ArrayLike<unknown>) =>
              e[0] === "event" && e[1] === "conversion",
          ).length,
      ),
    ).toBe(1);
    await expect(
      page.getByRole("link", { name: "Book a 15-minute Call" }),
    ).toBeVisible();
    await page.reload();
    expect(await countQuotes()).toBe(0);
    expect(
      await page.evaluate(
        () =>
          (window.dataLayer || []).filter(
            (e: ArrayLike<unknown>) =>
              e[0] === "event" && e[1] === "conversion",
          ).length,
      ),
    ).toBe(0);
    await page.getByRole("link", { name: "Book a 15-minute Call" }).click();
    await expect(page).toHaveURL(/book-a-call/);
    await expect(
      page.getByLabel("Contact SiteNova", { exact: true }),
    ).toHaveCount(0);
  });
}

test("pricing retains package and mobile layout has one contact bar", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/pricing");
  await expect(
    page.getByLabel("Contact SiteNova", { exact: true }),
  ).toHaveCount(1);
  await page
    .getByRole("link", { name: "Choose Business", exact: true })
    .click();
  await expect(page.locator("#website-quote-form")).toContainText(
    "Business Website · Business package",
  );
  await expect(page.getByLabel("Project budget")).toHaveValue("");
  await expect(
    page.getByLabel("Contact SiteNova", { exact: true }),
  ).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("direct confirmation access cannot record a quote conversion", async ({
  page,
}) => {
  await page.goto("/thank-you");
  await expect(page).toHaveURL("/");
  expect(
    await page.evaluate(() =>
      (window.dataLayer || []).some(
        (e: ArrayLike<unknown>) => e[1] === "submit_quote_form",
      ),
    ),
  ).toBe(false);
});

test("mobile booking and focused quote form fit a reduced viewport", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/book-a-call");
  await expect(
    page.getByRole("link", { name: "Open booking calendar in a new tab" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath("mobile-booking.png"),
    fullPage: true,
  });
  await page.goto("/quote");
  const form = page.locator("#website-quote-form");
  await form.getByRole("button", { name: /Business Website/ }).click();
  await form.getByLabel("Project budget").selectOption("Rs. 15,000 - 30,000");
  await form.getByRole("button", { name: "Continue", exact: true }).click();
  await page.setViewportSize({ width: 390, height: 460 });
  await form.getByLabel("Phone / WhatsApp", { exact: true }).focus();
  await expect(
    form.getByLabel("Phone / WhatsApp", { exact: true }),
  ).toBeFocused();
  await form
    .getByRole("button", { name: "Get My Website Quote" })
    .scrollIntoViewIfNeeded();
  await expect(
    form.getByRole("button", { name: "Get My Website Quote" }),
  ).toBeInViewport();
  await expect(
    page.getByLabel("Contact SiteNova", { exact: true }),
  ).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath("mobile-form.png") });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "Book a 15-minute Call" }),
  ).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("homepage.png") });
});

test("SEO checker never substitutes invented scores on failure", async ({
  page,
}) => {
  let checks = 0;
  await page.route("https://www.googleapis.com/pagespeedonline/**", (route) => {
    checks++;
    return route.fulfill(
      checks === 1
        ? { status: 503, json: { error: "Unavailable" } }
        : {
            json: {
              lighthouseResult: {
                categories: {
                  performance: { score: 0.71 },
                  seo: { score: 0.83 },
                  accessibility: { score: 0.91 },
                  "best-practices": { score: 0.86 },
                },
              },
            },
          },
    );
  });
  await page.goto("/services/seo-optimization");
  await page
    .getByPlaceholder("e.g., https://mybusiness.com")
    .fill("https://sitenova.dev");
  await page.getByRole("button", { name: "Start Diagnostic Audit" }).click();
  await expect(
    page.getByText(/Verified PageSpeed results are unavailable/),
  ).toBeVisible();
  await page.getByRole("button", { name: "Start Diagnostic Audit" }).click();
  await expect(page.getByText("71/100", { exact: true })).toBeVisible();
  expect(checks).toBe(2);
});
