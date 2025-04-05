import { test, expect } from '@chromatic-com/playwright';

test('functions collection page', async ({ page }) => {
  await page.goto('http://localhost:3000/admin/collections/functions');
  
  if (await page.locator('input[type="email"]').isVisible()) {
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'test');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
  }
  
  await expect(page.locator('h1')).toBeVisible();
  
  await expect(page).toHaveScreenshot('functions-collection.png');
});
