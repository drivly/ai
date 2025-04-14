import { test, expect } from '@chromatic-com/playwright'

test('functions collection page', async ({ page }) => {
  const loadPromise = page.waitForLoadState('load');
  await page.goto(`${process.env.TEST_BASE_URL || 'http://localhost:3000'}/admin/collections/functions`, 
    { timeout: 60000 } // Increase timeout for slow CI environments
  );
  await loadPromise;

  await page.waitForSelector('input[type="email"], h1', { timeout: 90000 }); // Increase timeout for CI environments

  if (await page.locator('input[type="email"]').isVisible()) {
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'test')
    
    await page.click('button[type="submit"]');
    await page.waitForSelector('h1:has-text("Functions")', { timeout: 75000 }); // Increased timeout
  }

  await page.waitForSelector('h1', { timeout: 90000 }); // Increase timeout for CI environments
  await expect(page.locator('h1')).toBeVisible()

  await expect(page).toHaveScreenshot('functions-collection.png')
})
