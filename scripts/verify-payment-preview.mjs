// Run against a local production preview with payments disabled; no real API calls.
import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";

const previewUrl = process.env.PAYMENT_PREVIEW_URL ?? "http://127.0.0.1:8092";
await mkdir("test-results/payment-preview", { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  const page = await browser.newPage();
  const consoleErrors = [];
  page.on("pageerror", error => consoleErrors.push(error.message));
  await page.route(/google|clarity\.ms|sentry\.io/, route => route.abort());
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto(`${previewUrl}/pay?package=starter`);
    assert.equal(response.status(), 200);
    await page.getByRole("heading", { name: "Pay your project advance" }).waitFor();
    await page.getByText("Online payments are coming soon").waitFor();
    assert.equal(await page.getByRole("button", { name: /Pay.*advance/ }).count(), 0);
    assert.equal(await page.locator('meta[name="robots"]').getAttribute("content"), "noindex, nofollow");
    assert.equal(await page.locator('script[src*="checkout.razorpay.com"],script[src*="clarity.ms"],script[src*="googletagmanager.com"]').count(), 0);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    // Confirm the page has received its stylesheet, rather than checking an unstyled fallback.
    assert.equal(await page.locator("h1").evaluate(el => parseFloat(getComputedStyle(el).fontSize) >= 28), true);
    await page.screenshot({ path: `test-results/payment-preview/pay-${width}.png`, fullPage: true });
  }
  await page.goto(`${previewUrl}/pay?package=business`);
  await page.getByText("Business website", { exact: true }).waitFor();
  await page.getByText("₹7,500.00", { exact: true }).waitFor();
  await page.goto(`${previewUrl}/pricing`);
  assert.equal(await page.getByRole("link", { name: /Pay.*advance/ }).count(), 0);
  await page.getByRole("link", { name: "Choose Business" }).waitFor();
  await page.goto(`${previewUrl}/delivery-policy`);
  await page.getByRole("heading", { name: "Digital Delivery Policy" }).waitFor();
  assert.equal(await page.locator('a[href="/delivery-policy"]').count() > 0, true);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  const blocked = await page.request.post(`${previewUrl}/api/payments/order`, { headers: { origin: previewUrl }, data: {} });
  assert.equal(blocked.status(), 503);
  assert.equal((await page.request.get(`${previewUrl}/api/payments/order`)).status(), 405);
  assert.deepEqual(consoleErrors, []);
  console.log("Payment preview passed: styled desktop/mobile, disabled checkout, package amounts, policy links, no tracking, and closed API.");
} finally { await browser.close(); }
