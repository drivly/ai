import { test, expect } from '@chromatic-com/playwright';

test('admin login page', async ({ page }) => {
  await page.goto('http://localhost:3000/admin');
  
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();
  
  await expect(page).toHaveScreenshot('admin-login.png');
});
