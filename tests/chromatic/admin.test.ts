import { test, expect } from '@chromatic-com/playwright'

test('admin login page', async ({ page }) => {
  const loadPromise = page.waitForLoadState('load');
  await page.goto(`${process.env.TEST_BASE_URL || 'http://localhost:3000'}/admin`, 
    { timeout: 60000 } // Increase timeout for slow CI environments
  );
  await loadPromise;

  await page.waitForSelector('input[type="email"]', { timeout: 90000 }); // Increase timeout for CI environments
  
  await expect(page.locator('input[type="email"]').first()).toBeVisible()
  await expect(page.locator('input[type="password"]').first()).toBeVisible()
  await expect(page.locator('button[type="submit"]').first()).toBeVisible()

  await expect(page).toHaveScreenshot('admin-login.png')
})
