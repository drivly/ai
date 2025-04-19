import { test as playwrightTest, expect } from '@playwright/test' // Use standard expect for visibility checks
import { test as chromaticTest } from '@chromatic-com/playwright' // Use chromatic test runner
import { takeNamedSnapshot } from '../utils/chromatic-helpers'

chromaticTest.setTimeout(180000) // Further increased for CI environment

chromaticTest('documentation page', async ({ page }, testInfo) => {
  // Use chromaticTest and add testInfo
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000'

  // Use a more basic approach for CI environment
  if (process.env.CI) {
    console.log('Running in CI environment with simplified approach')

    page.setDefaultNavigationTimeout(120000)

    await page.goto(`${baseUrl}/docs`, {
      waitUntil: 'domcontentloaded', // Changed from 'load' to fix timeout issue (ENG-647)
      timeout: 120000, // Further increased for CI environment
    })
  } else {
    await page.goto(`${baseUrl}/docs`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    })
  }

  // Increase visibility timeout for CI environment
  const visibilityTimeout = process.env.CI ? 90000 : 30000

  await expect(page.locator('body > div > main, main, [role="main"], nav').first())
    .toBeVisible({ timeout: visibilityTimeout })
  await expect(page.locator('body > div > main, main, [role="main"]').first())
    .toBeVisible({ timeout: visibilityTimeout })

  await takeNamedSnapshot(page, 'page-docs-main', testInfo)
})
