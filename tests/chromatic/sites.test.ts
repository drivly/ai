import { test, expect } from '@chromatic-com/playwright'

test('sites main page', async ({ page }) => {
  await page.goto('http://localhost:3000/sites')

  await page.waitForSelector('main', { timeout: 10000 })

  await expect(page.locator('main')).toBeVisible()
  await expect(page.locator('h1')).toBeVisible()

  await expect(page).toHaveScreenshot('sites-main-page.png')
})

test('specific site page', async ({ page }) => {
  await page.goto('http://localhost:3000/sites/example.com')

  await page.waitForSelector('main', { timeout: 10000 })

  await expect(page.locator('main')).toBeVisible()

  await expect(page).toHaveScreenshot('sites-specific-domain.png')
})

test('site settings page', async ({ page }) => {
  await page.goto('http://localhost:3000/sites/example.com/settings')

  await page.waitForSelector('main', { timeout: 10000 })

  await expect(page.locator('main')).toBeVisible()

  await expect(page).toHaveScreenshot('sites-settings-page.png')
})

test('site analytics page', async ({ page }) => {
  await page.goto('http://localhost:3000/sites/example.com/analytics')

  await page.waitForSelector('main', { timeout: 10000 })

  await expect(page.locator('main')).toBeVisible()

  await expect(page).toHaveScreenshot('sites-analytics-page.png')
})

test('site functions page', async ({ page }) => {
  await page.goto('http://localhost:3000/sites/example.com/functions')

  await page.waitForSelector('main', { timeout: 10000 })

  await expect(page.locator('main')).toBeVisible()

  await expect(page).toHaveScreenshot('sites-functions-page.png')
})
