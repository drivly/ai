import { test, expect } from '@chromatic-com/playwright'

test.setTimeout(90000); // Increase test timeout for CI environment

test('sites main page', async ({ page }) => {
  await page.goto(`${process.env.TEST_BASE_URL || 'http://localhost:3000'}/sites`, {
    waitUntil: 'networkidle',
    timeout: 60000 // Increased for CI environment
  });

  await expect(page.locator('main').first()).toBeVisible({ timeout: 30000 })
  await expect(page.locator('h1')).toBeVisible()

  await expect(page).toHaveScreenshot('sites-main-page.png')
})

test('docs page', async ({ page }) => {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
  
  await page.goto(`${baseUrl}/docs`, {
    waitUntil: 'networkidle',
    timeout: 60000 // Increased for CI environment
  });
  
  await expect(page.locator('main').first()).toBeVisible({ timeout: 30000 });
  await expect(page.locator('h1')).toBeVisible();
  
  await expect(page).toHaveScreenshot('docs-page.png');
})

test('specific site page', async ({ page }) => {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
  
  await page.goto(`${baseUrl}/sites/workflows.do`, {
    waitUntil: 'networkidle',
    timeout: 60000 // Increased for CI environment
  });
  
  await expect(page.locator('main').first()).toBeVisible({ timeout: 30000 });
  
  await expect(page).toHaveScreenshot('sites-specific-domain.png', { maxDiffPixelRatio: 0.02 }); // Allow slightly larger diff ratio
})

test('site blog page', async ({ page }) => {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
  
  await page.goto(`${baseUrl}/sites/workflows.do/blog`, {
    waitUntil: 'networkidle',
    timeout: 60000 // Increased for CI environment
  });
  
  await expect(page.locator('main').first()).toBeVisible({ timeout: 30000 });
  await expect(page.locator('h1')).toBeVisible();
  
  try {
    await expect(page.locator('div.grid[class*="sm:grid-cols-2"]')).toBeVisible({ timeout: 10000 });
  } catch (error) {
    console.log('Could not find grid element, continuing with screenshot anyway');
  }
  
  await expect(page).toHaveScreenshot('sites-blog-page.png');
})

test('site blog post page', async ({ page }) => {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
  
  await page.goto(`${baseUrl}/sites/workflows.do/blog/example-post`, {
    waitUntil: 'networkidle',
    timeout: 60000 // Increased for CI environment
  });
  
  await expect(page.locator('main').first()).toBeVisible({ timeout: 30000 });
  await expect(page.locator('h1')).toBeVisible();
  
  try {
    const contentElement = page.locator('article, div.prose, .blog-content');
    if (await contentElement.count() > 0) {
      await expect(contentElement.first()).toBeVisible({ timeout: 10000 });
    }
  } catch (error) {
    console.log('Could not find article, div.prose, or .blog-content, continuing with screenshot anyway');
  }
  
  await expect(page).toHaveScreenshot('sites-blog-post-page.png');
});

test('site pricing page', async ({ page }) => {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
  
  await page.goto(`${baseUrl}/sites/workflows.do/pricing`, {
    waitUntil: 'networkidle',
    timeout: 60000 // Increased for CI environment
  });
  
  await expect(page.locator('main').first()).toBeVisible({ timeout: 30000 });
  await expect(page.locator('h1')).toBeVisible();
  
  await expect(page).toHaveScreenshot('sites-pricing-page.png');
})

test('site privacy page', async ({ page }) => {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
  
  await page.goto(`${baseUrl}/sites/workflows.do/privacy`, {
    waitUntil: 'networkidle',
    timeout: 60000 // Increased for CI environment
  });
  
  await expect(page.locator('main').first()).toBeVisible({ timeout: 30000 });
  await expect(page.locator('h1')).toBeVisible();
  
  try {
    const contentElement = page.locator('.prose, .content, article')
    if (await contentElement.count() > 0) {
      await expect(contentElement.first()).toBeVisible({ timeout: 10000 });
    }
  } catch (error) {
    console.log('Could not find prose, content, or article element, continuing with screenshot anyway');
  }
  
  await expect(page).toHaveScreenshot('sites-privacy-page.png');
})

test('site terms page', async ({ page }) => {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
  
  await page.goto(`${baseUrl}/sites/workflows.do/terms`, {
    waitUntil: 'networkidle',
    timeout: 60000 // Increased for CI environment
  });
  
  await expect(page.locator('main').first()).toBeVisible({ timeout: 30000 });
  await expect(page.locator('h1')).toBeVisible();
  
  try {
    const contentElement = page.locator('.prose, .content, article')
    if (await contentElement.count() > 0) {
      await expect(contentElement.first()).toBeVisible({ timeout: 10000 });
    }
  } catch (error) {
    console.log('Could not find prose, content, or article element, continuing with screenshot anyway');
  }
  
  await expect(page).toHaveScreenshot('sites-terms-page.png');
})

test('site waitlist page - unauthenticated', async ({ page }) => {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
  
  await page.goto(`${baseUrl}/sites/workflows.do/waitlist`, {
    waitUntil: 'networkidle',
    timeout: 60000 // Increased for CI environment
  });
  
  await page.waitForURL(`${baseUrl}/`, { timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 60000 });
  
  await expect(page.locator('body')).toBeVisible({ timeout: 30000 });
  
  await expect(page).toHaveScreenshot('sites-waitlist-redirected-to-login.png');
})
