import { test, expect } from '@chromatic-com/playwright'

test.setTimeout(120000); // Reduced timeout for faster feedback

test('admin login page', async ({ page }) => {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
  const ciNavigationTimeout = 90000; // Reduced navigation timeout
  const ciVisibilityTimeout = 60000; // Reduced visibility timeout
  
  // Use a more basic approach for CI environment
  if (process.env.CI) {
    console.log('Running in CI environment, using domcontentloaded');
    
    page.setDefaultNavigationTimeout(ciNavigationTimeout);
    
    await page.goto(`${baseUrl}/admin`, {
      waitUntil: 'load', // Reverted back from 'domcontentloaded'
      timeout: ciNavigationTimeout 
    });
  } else {
    await page.goto(`${baseUrl}/admin`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
  }
  
  // Use reduced visibility timeout for CI environment
  const visibilityTimeout = process.env.CI ? ciVisibilityTimeout : 30000;
  
  try {
    await expect(page.locator('input[type="email"]').first()).toBeVisible({ timeout: visibilityTimeout })
    await expect(page.locator('input[type="password"]').first()).toBeVisible({ timeout: visibilityTimeout })
    await expect(page.locator('button[type="submit"]').first()).toBeVisible({ timeout: visibilityTimeout })

    await expect(page).toHaveScreenshot('admin-login.png')
  } catch (error: any) {
    console.log('Encountered error, retrying with page reload:', error.message);
    
    await page.reload({ waitUntil: 'load', timeout: ciNavigationTimeout }); // Reverted back from 'domcontentloaded'
    
    await expect(page.locator('input[type="email"]').first()).toBeVisible({ timeout: visibilityTimeout })
    await expect(page.locator('input[type="password"]').first()).toBeVisible({ timeout: visibilityTimeout })
    await expect(page.locator('button[type="submit"]').first()).toBeVisible({ timeout: visibilityTimeout })
    
    await expect(page).toHaveScreenshot('admin-login.png')
  }
})
