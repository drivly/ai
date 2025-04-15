import { test, expect } from '@chromatic-com/playwright'

test.setTimeout(90000); // Increase test timeout for CI environment

test('admin login page', async ({ page }) => {
  await page.goto(`${process.env.TEST_BASE_URL || 'http://localhost:3000'}/admin`, {
    waitUntil: 'domcontentloaded', // Changed from networkidle to prevent timeouts
    timeout: 90000 // Further increased for CI environment
  });
  
  try {
    await expect(page.locator('input[type="email"]').first()).toBeVisible({ timeout: 30000 })
    await expect(page.locator('input[type="password"]').first()).toBeVisible()
    await expect(page.locator('button[type="submit"]').first()).toBeVisible()

    await expect(page).toHaveScreenshot('admin-login.png')
  } catch (error: any) {
    console.log('Encountered error, retrying with page reload:', error.message);
    await page.reload({ waitUntil: 'networkidle', timeout: 30000 });
    
    await expect(page.locator('input[type="email"]').first()).toBeVisible({ timeout: 30000 })
    await expect(page.locator('input[type="password"]').first()).toBeVisible()
    await expect(page.locator('button[type="submit"]').first()).toBeVisible()
    
    await expect(page).toHaveScreenshot('admin-login.png')
  }
})
