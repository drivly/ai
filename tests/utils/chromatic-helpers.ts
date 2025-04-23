import { Page, TestInfo, expect as playwrightExpect } from '@playwright/test'
import { takeSnapshot as chromaticTakeSnapshot } from '@chromatic-com/playwright'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Takes a named Chromatic snapshot of the page with retry logic.
 * @param page Playwright Page object
 * @param name Snapshot name (following 'page-[page-name]-[optional-state]' convention)
 * @param testInfo Playwright TestInfo object
 * @param retries Number of retry attempts (default: 2)
 * @param retryDelay Delay between retries in ms (default: 500)
 */
export async function takeNamedSnapshot(page: Page, name: string, testInfo: TestInfo, retries = 2, retryDelay = 500): Promise<void> {
  if (!name || !/^[a-z0-9-]+$/.test(name)) {
    console.warn(`Snapshot name "${name}" might not follow the recommended convention 'page-[page-name]-[optional-state]' (lowercase, hyphens).`)
  }
  for (let i = 0; i <= retries; i++) {
    try {
      await chromaticTakeSnapshot(page, name, testInfo)
      return
    } catch (error: any) {
      console.log(`Snapshot '${name}' attempt ${i + 1} failed. Retrying... Error: ${error.message}`)
      if (i < retries) {
        await delay(retryDelay)
      } else {
        console.error(`Snapshot '${name}' failed after ${retries + 1} attempts.`)
        throw error
      }
    }
  }
}

/**
 * Wraps expect(page).toHaveScreenshot with retry logic.
 * Use this when testInfo is not available (e.g., in Vitest tests).
 * @param page Playwright Page object
 * @param name Snapshot name (including .png extension)
 * @param options Options for toHaveScreenshot
 * @param retries Number of retry attempts (default: 2)
 * @param retryDelay Delay between retries in ms (default: 500)
 */
export async function expectWithRetries(
  page: Page,
  name: string,
  options?: Parameters<typeof playwrightExpect extends (arg: any) => infer R ? (R extends { toHaveScreenshot: (...args: infer P) => any } ? P[1] : never) : never>[0], // Infer options type
  retries = 2,
  retryDelay = 500,
): Promise<void> {
  if (!name.endsWith('.png')) {
    console.warn(`Snapshot name "${name}" for expectWithRetries should typically end with .png`)
    name += '.png' // Append if missing, though Playwright might handle it
  }
  for (let i = 0; i <= retries; i++) {
    try {
      await playwrightExpect(page).toHaveScreenshot(name, options)
      return // Success
    } catch (error: any) {
      console.log(`toHaveScreenshot '${name}' attempt ${i + 1} failed. Retrying... Error: ${error.message}`)
      if (i < retries) {
        await delay(retryDelay)
      } else {
        console.error(`toHaveScreenshot '${name}' failed after ${retries + 1} attempts.`)
        throw error
      }
    }
  }
}
