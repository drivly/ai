import { test, expect } from '@chromatic-com/playwright';

test('documentation page', async ({ page }) => {
  await page.goto('http://localhost:3000/docs');
  
  await expect(page.locator('nav')).toBeVisible();
  await expect(page.locator('main')).toBeVisible();
  
  await expect(page).toHaveScreenshot('docs-main.png');
});
