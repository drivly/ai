import { test, expect } from '@chromatic-com/playwright'

test('sites main page', async ({ page }) => {
  const loadPromise = page.waitForLoadState('load');
  await page.goto(`${process.env.TEST_BASE_URL || 'http://localhost:3000'}/sites`, 
    { timeout: 60000 } // Increase timeout for slow CI environments
  );
  await loadPromise;

  await page.waitForSelector('main', { timeout: 15000 })

  await expect(page.locator('main').first()).toBeVisible()
  await expect(page.locator('h1')).toBeVisible()

  await expect(page).toHaveScreenshot('sites-main-page.png')
})

test('docs page', async ({ page }) => {
  const loadPromise = page.waitForLoadState('load');
  await page.goto(`${process.env.TEST_BASE_URL || 'http://localhost:3000'}/docs`, 
    { timeout: 60000 } // Increase timeout for slow CI environments
  );
  await loadPromise;

  await page.waitForSelector('main', { timeout: 15000 })

  await expect(page.locator('main').first()).toBeVisible()
  await expect(page.locator('h1')).toBeVisible()

  await expect(page).toHaveScreenshot('docs-page.png')
})

test('specific site page', async ({ page }) => {
  const loadPromise = page.waitForLoadState('load');
  await page.goto(`${process.env.TEST_BASE_URL || 'http://localhost:3000'}/sites/workflows.do`, 
    { timeout: 60000 } // Increase timeout for slow CI environments
  );
  await loadPromise;

  await page.waitForSelector('main', { timeout: 15000 })

  await expect(page.locator('main').first()).toBeVisible()

  await expect(page).toHaveScreenshot('sites-specific-domain.png')
})

test('site settings page', async ({ page }) => {
  const loadPromise = page.waitForLoadState('load');
  await page.goto(`${process.env.TEST_BASE_URL || 'http://localhost:3000'}/sites/workflows.do/settings`, 
    { timeout: 60000 } // Increase timeout for slow CI environments
  );
  await loadPromise;

  await page.waitForSelector('main', { timeout: 15000 })

  await expect(page.locator('main').first()).toBeVisible()

  await expect(page).toHaveScreenshot('sites-settings-page.png')
})

test('site analytics page', async ({ page }) => {
  const loadPromise = page.waitForLoadState('load');
  await page.goto(`${process.env.TEST_BASE_URL || 'http://localhost:3000'}/sites/workflows.do/analytics`, 
    { timeout: 60000 } // Increase timeout for slow CI environments
  );
  await loadPromise;

  await page.waitForSelector('main', { timeout: 15000 })

  await expect(page.locator('main').first()).toBeVisible()

  await expect(page).toHaveScreenshot('sites-analytics-page.png')
})


test('site blog page', async ({ page }) => {
  const loadPromise = page.waitForLoadState('load');
  await page.goto(`${process.env.TEST_BASE_URL || 'http://localhost:3000'}/sites/workflows.do/blog`, 
    { timeout: 60000 } // Increase timeout for slow CI environments
  );
  await loadPromise;

  await page.waitForSelector('main', { timeout: 15000 })

  await expect(page.locator('main').first()).toBeVisible()
  await expect(page.locator('h1')).toBeVisible()
  await expect(page.locator('.blog-posts')).toBeVisible()

  await expect(page).toHaveScreenshot('sites-blog-page.png')
})

test('site blog post page', async ({ page }) => {
  const loadPromise = page.waitForLoadState('load');
  await page.goto(`${process.env.TEST_BASE_URL || 'http://localhost:3000'}/sites/workflows.do/blog/example-post`, 
    { timeout: 60000 } // Increase timeout for slow CI environments
  );
  await loadPromise;

  await page.waitForSelector('main', { timeout: 15000 })

  await expect(page.locator('main').first()).toBeVisible()
  await expect(page.locator('h1')).toBeVisible()
  await expect(page.locator('.blog-content')).toBeVisible()

  await expect(page).toHaveScreenshot('sites-blog-post-page.png')
})

test('site pricing page', async ({ page }) => {
  const loadPromise = page.waitForLoadState('load');
  await page.goto(`${process.env.TEST_BASE_URL || 'http://localhost:3000'}/sites/workflows.do/pricing`, 
    { timeout: 60000 } // Increase timeout for slow CI environments
  );
  await loadPromise;

  await page.waitForSelector('main', { timeout: 15000 })

  await expect(page.locator('main').first()).toBeVisible()
  
  await expect(page.locator('h1')).toBeVisible()

  await expect(page).toHaveScreenshot('sites-pricing-page.png')
})

test('site privacy page', async ({ page }) => {
  const loadPromise = page.waitForLoadState('load');
  await page.goto(`${process.env.TEST_BASE_URL || 'http://localhost:3000'}/sites/workflows.do/privacy`, 
    { timeout: 60000 } // Increase timeout for slow CI environments
  );
  await loadPromise;

  await page.waitForSelector('main', { timeout: 15000 })

  await expect(page.locator('main').first()).toBeVisible()
  await expect(page.locator('h1')).toBeVisible()
  await expect(page.locator('.prose')).toBeVisible()

  await expect(page).toHaveScreenshot('sites-privacy-page.png')
})

test('site terms page', async ({ page }) => {
  const loadPromise = page.waitForLoadState('load');
  await page.goto(`${process.env.TEST_BASE_URL || 'http://localhost:3000'}/sites/workflows.do/terms`, 
    { timeout: 60000 } // Increase timeout for slow CI environments
  );
  await loadPromise;

  await page.waitForSelector('main', { timeout: 15000 })

  await expect(page.locator('main').first()).toBeVisible()
  await expect(page.locator('h1')).toBeVisible()
  await expect(page.locator('.prose')).toBeVisible()

  await expect(page).toHaveScreenshot('sites-terms-page.png')
})

test('site waitlist page - unauthenticated', async ({ page }) => {
  const loadPromise = page.waitForLoadState('load');
  const responsePromise = page.waitForResponse(response => 
    response.url().includes('/waitlist') && response.status() === 200
  );
  await page.goto(`${process.env.TEST_BASE_URL || 'http://localhost:3000'}/sites/workflows.do/waitlist`, 
    { timeout: 60000 } // Increase timeout for slow CI environments
  );
  await Promise.all([loadPromise, responsePromise]);
  
  await page.waitForSelector('main', { timeout: 15000 })
  
  await expect(page.locator('main').first()).toBeVisible()
  
  await expect(page).toHaveScreenshot('sites-waitlist-unauthenticated.png')
})
