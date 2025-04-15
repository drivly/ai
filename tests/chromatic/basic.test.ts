import { test, expect } from '@chromatic-com/playwright'

test.setTimeout(90000); // Increase test timeout for CI environment

test('basic test', async ({ page }) => {
  await page.goto(`${process.env.TEST_EXAMPLE_URL || 'https://example.com'}`, {
    waitUntil: 'networkidle',
    timeout: 60000 // Increased for CI environment
  });
  
  await expect(page).toHaveTitle(/Example Domain/)
  await expect(page).toHaveScreenshot()
})
