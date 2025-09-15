import { test, expect } from '@playwright/test';

test('searches for "cola" on AH and shows results', async ({ page }) => {
  // Go to AH home
  await page.goto('https://www.ah.nl/');
  await page.waitForLoadState('networkidle');

    const acceptCookies = page.locator('[data-testhook="accept-cookies"]');
  if (await acceptCookies.count() > 0) {
    try {
      await acceptCookies.first().click({ timeout: 5000 });
      // give the UI a moment to settle
      await page.waitForTimeout(500);
    } catch (e) {
      // ignore click failures and continue
    }
  }

  // Fill the search input (Dutch label used on AH site)
  const searchbox = page.getByRole('searchbox', { name: 'Waar ben je naar op zoek?' });
  await expect(searchbox).toBeVisible({ timeout: 10_000 });
  await searchbox.fill('cola');

  await page.waitForTimeout(1000); // wait a moment for suggestions to appear
  // Click the search button
  const searchBtn = page.getByRole('button', { name: 'Zoeken' });
  await expect(searchBtn).toBeVisible({ timeout: 5_000 });
  await searchBtn.click();
  await page.waitForTimeout(1000);
  await page.waitForTimeout(1000);
  await page.waitForTimeout(1000);

  // Wait for results page (URL includes zoeken?query=cola)
  await page.waitForURL(/\/zoeken\?query=cola/, { timeout: 15_000 });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Ensure at least one instance of "cola" is present on the page
  const occurrences = await page.locator('text=cola').count();
  await page.waitForTimeout(1000);
  await page.waitForTimeout(1000);
  expect(occurrences).toBeGreaterThan(0);

  // Save a screenshot to the report folder for verification
  await page.screenshot({ path: 'playwright-report/cola-search.png', fullPage: true });
});