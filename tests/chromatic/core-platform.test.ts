import { test, expect } from '@chromatic-com/playwright'

test.setTimeout(180000); // Further increased for CI environment

test('functions collection page', async ({ page }) => {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
  
  // Use a more basic approach for CI environment
  if (process.env.CI) {
    console.log('Running in CI environment with simplified approach');
    
    page.setDefaultNavigationTimeout(120000);
    
    await page.goto(`${baseUrl}/admin/collections/functions`, {
      waitUntil: 'load',
      timeout: 120000 // Further increased for CI environment
    });
  } else {
    await page.goto(`${baseUrl}/admin/collections/functions`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
  }
  
  // Increase visibility timeout for CI environment
  const visibilityTimeout = process.env.CI ? 90000 : 30000;
  
  try {
    const emailInput = page.locator('input[type="email"]');
    if (await emailInput.isVisible({ timeout: visibilityTimeout / 3 }).catch(() => false)) {
      await page.fill('input[type="email"]', 'test@example.com')
      await page.fill('input[type="password"]', 'test')
      
      await page.click('button[type="submit"]');
      
      // Use appropriate wait strategy for CI environment
      const waitLoadState = process.env.CI ? 'load' : 'networkidle';
      await page.waitForLoadState(waitLoadState, { timeout: visibilityTimeout });
    }

    await expect(page.locator('h1').first()).toBeVisible({ timeout: visibilityTimeout })
    await expect(page).toHaveScreenshot('functions-collection.png')
  } catch (error: any) {
    console.log('Encountered error, retrying with page reload:', error.message);
    
    // Use appropriate wait strategy for CI environment
    const reloadWaitUntil = process.env.CI ? 'load' : 'networkidle';
    await page.reload({ waitUntil: reloadWaitUntil, timeout: visibilityTimeout });
    
    await expect(page.locator('h1').first()).toBeVisible({ timeout: visibilityTimeout })
    await expect(page).toHaveScreenshot('functions-collection.png')
  }
})
