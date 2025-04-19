import { test as playwrightTest, expect } from '@playwright/test' // Use standard expect for visibility checks
import { test as chromaticTest } from '@chromatic-com/playwright' // Use chromatic test runner
import { takeNamedSnapshot } from '../utils/chromatic-helpers'

chromaticTest.setTimeout(180000) // Further increased for CI environment

chromaticTest('functions collection page', async ({ page }, testInfo) => {
  // Use chromaticTest and add testInfo
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000'

  // Use a more basic approach for CI environment
  if (process.env.CI) {
    console.log('Running in CI environment with simplified approach')

    page.setDefaultNavigationTimeout(120000)

    await page.goto(`${baseUrl}/admin/collections/functions`, {
      waitUntil: 'load',
      timeout: 120000, // Further increased for CI environment
    })
  } else {
    await page.goto(`${baseUrl}/admin/collections/functions`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    })
  }

  // Increase visibility timeout for CI environment
  const visibilityTimeout = process.env.CI ? 90000 : 30000

  const emailInput = page.locator('input[type="email"]')
  if (await emailInput.isVisible({ timeout: visibilityTimeout / 3 }).catch(() => false)) {
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'test')

    await page.click('button[type="submit"]', { force: true })

    // Use appropriate wait strategy for CI environment
    const waitLoadState = process.env.CI ? 'load' : 'networkidle'
    await page.waitForLoadState(waitLoadState, { timeout: visibilityTimeout })
  }

  await expect(page.locator('h1').first()).toBeVisible({ timeout: visibilityTimeout })

  await takeNamedSnapshot(page, 'page-functions-collection', testInfo)
})
