import { test, expect } from '@playwright/test';

test('search rookworst on AH and open product', async ({ page }, testInfo) => {
  // Open Albert Heijn homepage
  await page.goto('https://www.ah.nl/');
  await page.waitForLoadState('networkidle');
  // If cookie banner appears, accept cookies
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

  await page.screenshot({ path: testInfo.outputPath('ah-homepage.png') });

  // Type 'rookworst' into the search input and press Enter
  await page.fill('#navigation-search-input', 'rookworst');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: testInfo.outputPath('ah-homepage-with-query.png') });
   
  const suggestionAnchor = page.locator('a[href="/zoeken?query=rookworst"]');
  //suggestionAnchor.first().click();

  //await expect(page).toHaveURL('https://www.ah.nl/zoeken?query=rookworst');
  await page.goto('https://www.ah.nl/zoeken?query=rookworst');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: testInfo.outputPath('ah-search-results.png') });

  // Prefer the specific product title span
  const productTitleSpan = page.locator('span[data-testhook="product-title-line-clamp"]', { hasText: 'AH Runderrookworst' });

  await expect(productTitleSpan.first()).toBeVisible({ timeout: 2000 });
  await productTitleSpan.first().click();

  // Wait for product page to load and capture final screenshot
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: testInfo.outputPath('ah-product-page.png') });

  // The expected product page title
  await expect(page).toHaveTitle('AH Rookworst XXL  bestellen | Albert Heijn', { timeout: 2000 });
});
