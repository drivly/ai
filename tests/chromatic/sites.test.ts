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

test('site blog page', async ({ page }) => {
  await page.goto('http://localhost:3000/sites/example.com/blog')

  await page.waitForSelector('main', { timeout: 10000 })

  await expect(page.locator('main')).toBeVisible()
  await expect(page.locator('h1')).toBeVisible()
  await expect(page.locator('.blog-posts')).toBeVisible()

  await expect(page).toHaveScreenshot('sites-blog-page.png')
})

test('site blog post page', async ({ page }) => {
  await page.goto('http://localhost:3000/sites/example.com/blog/example-post')

  await page.waitForSelector('main', { timeout: 10000 })

  await expect(page.locator('main')).toBeVisible()
  await expect(page.locator('h1')).toBeVisible()
  await expect(page.locator('.blog-content')).toBeVisible()

  await expect(page).toHaveScreenshot('sites-blog-post-page.png')
})

test('site pricing page', async ({ page }) => {
  await page.goto('http://localhost:3000/sites/example.com/pricing')

  await page.waitForSelector('main', { timeout: 10000 })

  await expect(page.locator('main')).toBeVisible()
  
  await expect(page.locator('h1')).toBeVisible()

  await expect(page).toHaveScreenshot('sites-pricing-page.png')
})

test('site privacy page', async ({ page }) => {
  await page.goto('http://localhost:3000/sites/example.com/privacy')

  await page.waitForSelector('main', { timeout: 10000 })

  await expect(page.locator('main')).toBeVisible()
  await expect(page.locator('h1')).toBeVisible()
  await expect(page.locator('.prose')).toBeVisible()

  await expect(page).toHaveScreenshot('sites-privacy-page.png')
})

test('site terms page', async ({ page }) => {
  await page.goto('http://localhost:3000/sites/example.com/terms')

  await page.waitForSelector('main', { timeout: 10000 })

  await expect(page.locator('main')).toBeVisible()
  await expect(page.locator('h1')).toBeVisible()
  await expect(page.locator('.prose')).toBeVisible()

  await expect(page).toHaveScreenshot('sites-terms-page.png')
})

test('site waitlist page - unauthenticated', async ({ page }) => {
  await page.goto('http://localhost:3000/sites/example.com/waitlist')
  
  await page.waitForSelector('main', { timeout: 10000 })
  
  await expect(page.locator('main')).toBeVisible()
  
  await expect(page).toHaveScreenshot('sites-waitlist-unauthenticated.png')
})
