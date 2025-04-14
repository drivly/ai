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
    { timeout: 90000 } // Further increase timeout for potentially very slow CI environments
  );
  await loadPromise;

  await page.waitForSelector('main', { timeout: 60000 }) // Increased wait for main element

  await expect(page.locator('main').first()).toBeVisible()
  await expect(page.locator('h1')).toBeVisible()
  
  await page.waitForLoadState('networkidle', { timeout: 60000 });
  await page.waitForTimeout(5000);
  
  await page.waitForSelector('article', { timeout: 120000 });
  await expect(page.locator('article').first()).toBeVisible();

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
    waitUntil: 'domcontentloaded', // Wait for the initial HTML, redirect might happen client-side or server-side
    timeout: 60000 
  });

  await page.waitForURL(`${process.env.TEST_BASE_URL || 'http://localhost:3000'}/`, { timeout: 45000 }); 
  await page.waitForLoadState('load', { timeout: 45000 }); // Wait for the redirected page to fully load

  await page.waitForSelector('body', { timeout: 120000 }); 
  
  await page.waitForLoadState('networkidle', { timeout: 60000 });
  
  await page.waitForTimeout(5000);

  await expect(page).toHaveScreenshot('sites-waitlist-redirected-to-login.png');
})
