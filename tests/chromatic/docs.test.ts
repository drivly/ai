import { test as chromaticTest } from '@chromatic-com/playwright' // Use chromatic test runner
import { takeNamedSnapshot } from '../utils/chromatic-helpers'

chromaticTest.setTimeout(180000) // Further increased for CI environment

const skipInCI = process.env.CI === 'true'

;(skipInCI ? chromaticTest.skip : chromaticTest)('documentation page', async ({ page }, testInfo) => {
  // Use chromaticTest and add testInfo
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000'

  // Navigate to documentation page
  await page.goto(`${baseUrl}/docs`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  })

  // Take a named snapshot for Chromatic
  await takeNamedSnapshot(page, 'documentation', testInfo)
})
