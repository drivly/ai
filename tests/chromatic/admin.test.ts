import { test, expect } from '@chromatic-com/playwright'

test.setTimeout(180000); // Further increased for CI environment

test('admin login page', async ({ page }) => {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
  
  // Use a more basic approach for CI environment
  if (process.env.CI) {
    console.log('Running in CI environment with simplified approach');
    
    page.setDefaultNavigationTimeout(120000);
    
    await page.goto(`${baseUrl}/admin`, {
      waitUntil: 'load',
      timeout: 120000 // Further increased for CI environment
    });
  } else {
    await page.goto(`${baseUrl}/admin`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
  }
  
  // Increase visibility timeout for CI environment
  const visibilityTimeout = process.env.CI ? 90000 : 30000;
  
  try {
    await expect(page.locator('input[type="email"]').first()).toBeVisible({ timeout: visibilityTimeout })
    await expect(page.locator('input[type="password"]').first()).toBeVisible({ timeout: visibilityTimeout })
    await expect(page.locator('button[type="submit"]').first()).toBeVisible({ timeout: visibilityTimeout })

    await expect(page).toHaveScreenshot('admin-login.png')
  } catch (error: any) {
    console.log('Encountered error, retrying with page reload:', error.message);
    
    // Use appropriate wait strategy for CI environment
    const reloadWaitUntil = process.env.CI ? 'load' : 'networkidle';
    await page.reload({ waitUntil: reloadWaitUntil, timeout: visibilityTimeout });
    
    await expect(page.locator('input[type="email"]').first()).toBeVisible({ timeout: visibilityTimeout })
    await expect(page.locator('input[type="password"]').first()).toBeVisible({ timeout: visibilityTimeout })
    await expect(page.locator('button[type="submit"]').first()).toBeVisible({ timeout: visibilityTimeout })
    
    await expect(page).toHaveScreenshot('admin-login.png')
  }
})
