import { test, expect } from '@playwright/test';

test('has title and main heading', async ({ page }) => {
  await page.goto('/');

  // Expect a title to contain "SiteNova"
  await expect(page).toHaveTitle(/SiteNova/);

  // The main offer remains visible in the redesigned hero.
  const heading = page.locator('h1');
  await expect(heading).toContainText(/A website that\s*means business/i);
});
