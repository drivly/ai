import { test, expect } from '@chromatic-com/playwright'

test('documentation page', async ({ page }) => {
  await page.goto(`${process.env.TEST_BASE_URL || 'http://localhost:3000'}/docs`, {
    waitUntil: 'domcontentloaded',
    timeout: 90000 // Further increase timeout for slow CI environments
  });
  
  await page.waitForLoadState('load', { timeout: 90000 });
  await page.waitForLoadState('networkidle', { timeout: 90000 });
  await page.waitForTimeout(5000);
  
  try {
    await page.waitForSelector('nav, main', { timeout: 120000 }); // Increase timeout for CI environments
    
    await expect(page.locator('nav').first()).toBeVisible() // Use .first() to avoid strict mode violation
    await expect(page.locator('main').first()).toBeVisible() // Use .first() to avoid strict mode violation

    await expect(page).toHaveScreenshot('docs-main.png')
  } catch (error: any) {
    console.log('Encountered error, retrying with additional stabilization:', error.message);
    await page.waitForTimeout(10000);
    await page.reload({ waitUntil: 'networkidle', timeout: 90000 });
    
    await page.waitForSelector('nav, main', { timeout: 120000 });
    await expect(page.locator('nav').first()).toBeVisible()
    await expect(page.locator('main').first()).toBeVisible()
    
    await expect(page).toHaveScreenshot('docs-main.png')
  }
})
