import { test, expect } from '@chromatic-com/playwright'

test('admin login page', async ({ page }) => {
  await page.goto(`${process.env.TEST_BASE_URL || 'http://localhost:3000'}/admin`, {
    waitUntil: 'domcontentloaded',
    timeout: 90000 // Further increase timeout for slow CI environments
  });
  
  await page.waitForLoadState('load', { timeout: 90000 });
  await page.waitForLoadState('networkidle', { timeout: 90000 });
  await page.waitForTimeout(5000);
  
  try {
    await page.waitForSelector('input[type="email"]', { timeout: 120000 }); // Increase timeout for CI environments
    
    await expect(page.locator('input[type="email"]').first()).toBeVisible()
    await expect(page.locator('input[type="password"]').first()).toBeVisible()
    await expect(page.locator('button[type="submit"]').first()).toBeVisible()

    await expect(page).toHaveScreenshot('admin-login.png')
  } catch (error: any) {
    console.log('Encountered error, retrying with additional stabilization:', error.message);
    await page.waitForTimeout(10000);
    await page.reload({ waitUntil: 'networkidle', timeout: 90000 });
    
    await page.waitForSelector('input[type="email"]', { timeout: 120000 });
    await expect(page.locator('input[type="email"]').first()).toBeVisible()
    await expect(page.locator('input[type="password"]').first()).toBeVisible()
    await expect(page.locator('button[type="submit"]').first()).toBeVisible()
    
    await expect(page).toHaveScreenshot('admin-login.png')
  }
})
