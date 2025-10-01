import { test, expect } from '@playwright/test';

test('search and add stroopwafels to cart', async ({ page }) => {
  // Go to Albert Heijn home
  await page.goto('https://www.ah.nl/');

  // Try to accept cookies if present (common Dutch labels)
  try {
    const cookieSelectors = [
      'button:has-text("Akkoord")',
      'button:has-text("Accepteren")',
      'button:has-text("Alle cookies accepteren")',
      '#onetrust-accept-btn-handler'
    ];
    for (const sel of cookieSelectors) {
      const btn = page.locator(sel);
      if (await btn.count() > 0) {
        await btn.first().click();
        break;
      }
    }
  } catch {
    // ignore if not present
  }

  // Search for stroopwafels
  const searchbox = page.getByRole('searchbox', { name: /Waar ben je naar op zoek\?/i });
  await expect(searchbox).toBeVisible();
  await searchbox.fill('stroopwafels');
  await searchbox.press('Enter');

  // Wait for search results to load
  await page.waitForURL(/zoeken\?query=stroopwafels/);
  await expect(page.getByRole('article').first()).toBeVisible();

  // Add the first product to the cart
  const firstArticle = page.getByRole('article').first();
  const addButton = firstArticle.getByRole('button', { name: /Product toevoegen/i });
  await addButton.click();

  // Verify a confirmation (e.g. "toegevoegd") appears in the product card
  await expect(firstArticle.getByText(/toegevoegd/i)).toBeVisible();

  // Open the cart and assert the item is present
  // Use a relaxed link matcher for the cart
  const cartLink = page.getByRole('link', { name: /Naar winkelmand/i });
  await cartLink.click();

  // Cart page checks
  await expect(page.getByRole('heading', { name: /Winkelmandje/i })).toBeVisible();
  // Expect at least one cart item mentioning "stroopwafel"
  await expect(page.locator('main').locator('text=/stroopwafel/i').first()).toBeVisible();
});