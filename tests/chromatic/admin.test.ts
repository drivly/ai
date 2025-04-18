import { test, expect } from '@playwright/test' // Use standard expect for visibility checks
import { test as chromaticTest } from '@chromatic-com/playwright' // Use chromatic test runner
import { takeNamedSnapshot } from '../utils/chromatic-helpers'

chromaticTest.setTimeout(180000) // Further increased for CI environment

chromaticTest('admin login page', async ({ page }, testInfo) => {
  // Use chromaticTest and add testInfo
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000'

  // Use a more basic approach for CI environment
  if (process.env.CI) {
    console.log('Running in CI environment with simplified approach')

    page.setDefaultNavigationTimeout(120000)

    await page.goto(`${baseUrl}/admin`, {
      waitUntil: 'load',
      timeout: 120000, // Further increased for CI environment
    })
  } else {
    await page.goto(`${baseUrl}/admin`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    })
  }

  // Increase visibility timeout for CI environment
  const visibilityTimeout = process.env.CI ? 90000 : 30000

  await expect(page.locator('input[type="email"]').first()).toBeVisible({ timeout: visibilityTimeout })
  await expect(page.locator('input[type="password"]').first()).toBeVisible({ timeout: visibilityTimeout })
  await expect(page.locator('button[type="submit"]').first()).toBeVisible({ timeout: visibilityTimeout })

  await takeNamedSnapshot(page, 'page-admin-login', testInfo)
})
