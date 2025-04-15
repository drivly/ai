import { test, expect } from '@chromatic-com/playwright'

test.setTimeout(120000); // Further increased for CI environment

test('documentation page', async ({ page }) => {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
  
  // to prevent timeouts in CI environment
  await page.goto(`${baseUrl}/docs`, {
    waitUntil: 'domcontentloaded', // Changed from networkidle to prevent timeouts
    timeout: 90000 // Further increased for CI environment
  });
  
  await expect(page.locator('nav, main').first()).toBeVisible({ timeout: 60000 });
  await expect(page.locator('main').first()).toBeVisible({ timeout: 30000 });

  await expect(page).toHaveScreenshot('docs-main.png');
});
