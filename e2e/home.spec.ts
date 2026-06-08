import { test, expect } from '@playwright/test';

test('has title and main heading', async ({ page }) => {
  await page.goto('/');

  // Expect a title to contain "SiteNova"
  await expect(page).toHaveTitle(/SiteNova/);

  // Expect the main heading to contain "SiteNova"
  const heading = page.locator('h1');
  await expect(heading).toContainText(/SiteNova/i);
});
