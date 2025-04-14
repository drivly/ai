import { test, expect } from '@chromatic-com/playwright'

test('documentation page', async ({ page }) => {
  const loadPromise = page.waitForLoadState('load');
  await page.goto(`${process.env.TEST_BASE_URL || 'http://localhost:3000'}/docs`, 
    { timeout: 90000 } // Further increase timeout for slow CI environments
  );
  await loadPromise;

  await page.waitForLoadState('networkidle', { timeout: 60000 });
  await page.waitForTimeout(5000);
  
  await page.waitForSelector('nav, main', { timeout: 90000 }); // Increase timeout for CI environments
  
  await expect(page.locator('nav').first()).toBeVisible() // Use .first() to avoid strict mode violation
  await expect(page.locator('main').first()).toBeVisible() // Use .first() to avoid strict mode violation

  await expect(page).toHaveScreenshot('docs-main.png')
})
