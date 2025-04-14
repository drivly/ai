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

  await page.waitForTimeout(500); 
  await expect(page).toHaveScreenshot('sites-specific-domain.png', { maxDiffPixelRatio: 0.02 }); // Allow slightly larger diff ratio
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
  await expect(page.locator('div.grid[class*="sm:grid-cols-2"]')).toBeVisible({ timeout: 10000 });

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
  await page.waitForSelector('div.prose', { timeout: 60000 }); // Increased timeout for the container
  await expect(page.locator('div.prose h2')).toBeVisible({ timeout: 10000 }); // Shorter timeout for the header check within the container

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
  await page.goto(`${process.env.TEST_BASE_URL || 'http://localhost:3000'}/sites/workflows.do/waitlist`, {
    waitUntil: 'domcontentloaded', // Wait until the initial redirect response is received
    timeout: 60000 
  });

  await page.waitForURL(`${process.env.TEST_BASE_URL || 'http://localhost:3000'}/`, { timeout: 45000 });
  await page.waitForLoadState('load', { timeout: 45000 }); // Wait for the root page to load

  await page.waitForSelector('form[action*="/api/users/login"]', { timeout: 60000 }); 
  await expect(page.locator('form[action*="/api/users/login"]')).toBeVisible();

  await expect(page).toHaveScreenshot('sites-waitlist-redirected-root-login-page.png');
})
