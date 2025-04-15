import { test, expect } from '@chromatic-com/playwright'

test.setTimeout(90000); // Increased for CI environment

test('documentation page', async ({ page }) => {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
  
  await page.goto(`${baseUrl}/docs`, {
    waitUntil: 'networkidle',
    timeout: 60000 // Increased for CI environment
  });
  
  await expect(page.locator('nav, main').first()).toBeVisible({ timeout: 30000 });
  await expect(page.locator('main').first()).toBeVisible();

  await expect(page).toHaveScreenshot('docs-main.png');
});
