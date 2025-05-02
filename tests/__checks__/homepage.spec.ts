import { test, expect } from '@playwright/test'

// You can override the default Playwright test timeout of 30s
// test.setTimeout(60_000);

test('workflows.do', async ({ page }) => {
  const origin = process.env.ENVIRONMENT_URL || 'https://ai-git-main.dev.driv.ly'
  const response = await page.goto(origin + '/sites/workflows.do')
  expect(response?.status()).toBeLessThan(400)
  // await expect(page).toHaveTitle(/Danube WebShop/)
  await page.screenshot({ path: 'homepage.jpg' })
})
