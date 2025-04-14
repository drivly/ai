import { test, expect } from '@chromatic-com/playwright'

test('basic test', async ({ page }) => {
  await page.goto(`${process.env.TEST_EXAMPLE_URL || 'https://example.com'}`)
  await expect(page).toHaveTitle(/Example Domain/)
  await expect(page).toHaveScreenshot()
})
