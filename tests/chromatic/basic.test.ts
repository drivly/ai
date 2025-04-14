import { test, expect } from '@chromatic-com/playwright'

test('basic test', async ({ page }) => {
  const loadPromise = page.waitForLoadState('load');
  await page.goto(`${process.env.TEST_EXAMPLE_URL || 'https://example.com'}`, 
    { timeout: 60000 } // Increase timeout for slow CI environments
  );
  await loadPromise;
  
  await expect(page).toHaveTitle(/Example Domain/)
  await expect(page).toHaveScreenshot()
})
