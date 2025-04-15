import { test, expect } from '@chromatic-com/playwright'

test.setTimeout(90000); // Increase test timeout for CI environment

test('functions collection page', async ({ page }) => {
  await page.goto(`${process.env.TEST_BASE_URL || 'http://localhost:3000'}/admin/collections/functions`, {
    waitUntil: 'networkidle',
    timeout: 60000 // Increased for CI environment
  });
  
  try {
    const emailInput = page.locator('input[type="email"]');
    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await page.fill('input[type="email"]', 'test@example.com')
      await page.fill('input[type="password"]', 'test')
      
      await page.click('button[type="submit"]');
      
      await page.waitForLoadState('networkidle', { timeout: 60000 });
    }

    await expect(page.locator('h1').first()).toBeVisible({ timeout: 30000 })
    await expect(page).toHaveScreenshot('functions-collection.png')
  } catch (error: any) {
    console.log('Encountered error, retrying with page reload:', error.message);
    await page.reload({ waitUntil: 'networkidle', timeout: 60000 });
    
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 30000 })
    await expect(page).toHaveScreenshot('functions-collection.png')
  }
})
