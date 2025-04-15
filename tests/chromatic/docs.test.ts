import { test, expect } from '@chromatic-com/playwright'

test.setTimeout(180000); // Further increased for CI environment

test('documentation page', async ({ page }) => {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
  
  // Use a more basic approach for CI environment
  if (process.env.CI) {
    console.log('Running in CI environment with simplified approach');
    
    page.setDefaultNavigationTimeout(120000);
    
    await page.goto(`${baseUrl}/docs`, {
      waitUntil: 'load',
      timeout: 120000 // Further increased for CI environment
    });
  } else {
    await page.goto(`${baseUrl}/docs`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
  }
  
  // Increase visibility timeout for CI environment
  const visibilityTimeout = process.env.CI ? 90000 : 30000;
  
  await expect(page.locator('nav, main').first()).toBeVisible({ timeout: visibilityTimeout });
  
  await expect(page.locator('main').first()).toBeVisible({ timeout: visibilityTimeout });

  await expect(page).toHaveScreenshot('docs-main.png');
});
