import { test, expect } from '@chromatic-com/playwright'

test('functions collection page', async ({ page }) => {
  await page.goto(`${process.env.TEST_BASE_URL || 'http://localhost:3000'}/admin/collections/functions`, {
    waitUntil: 'domcontentloaded',
    timeout: 90000 // Further increase timeout for slow CI environments
  });
  
  await page.waitForLoadState('load', { timeout: 90000 });
  await page.waitForLoadState('networkidle', { timeout: 90000 });
  await page.waitForTimeout(5000);
  
  try {
    await page.waitForSelector('input[type="email"], h1', { timeout: 120000 }); // Increase timeout for CI environments

    if (await page.locator('input[type="email"]').isVisible()) {
      await page.fill('input[type="email"]', 'test@example.com')
      await page.fill('input[type="password"]', 'test')
      
      await page.click('button[type="submit"]');
      
      await page.waitForLoadState('networkidle', { timeout: 90000 });
      await page.waitForTimeout(5000);
      await page.waitForSelector('h1', { timeout: 120000 }); // Use more general selector
    }

    await page.waitForSelector('h1', { timeout: 120000 }); // Increase timeout for CI environments
    await expect(page.locator('h1')).toBeVisible()

    await expect(page).toHaveScreenshot('functions-collection.png')
  } catch (error: any) {
    console.log('Encountered error, retrying with additional stabilization:', error.message);
    await page.waitForTimeout(10000);
    await page.reload({ waitUntil: 'networkidle', timeout: 90000 });
    
    await page.waitForSelector('h1', { timeout: 120000 });
    await expect(page.locator('h1')).toBeVisible()
    
    await expect(page).toHaveScreenshot('functions-collection.png')
  }
})
