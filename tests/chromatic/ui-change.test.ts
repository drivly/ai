import { test, expect } from '@chromatic-com/playwright'

test('ui change test', async ({ page }) => {
  const loadPromise = page.waitForLoadState('load');
  await page.goto(`${process.env.TEST_EXAMPLE_URL || 'https://example.com'}`, 
    { timeout: 60000 } // Increase timeout for slow CI environments
  );
  await loadPromise;

  await page.evaluate(() => {
    const style = document.createElement('style')
    style.textContent = `
      body { 
        background-color: #f0f8ff !important;
        padding: 50px !important;
      }
      h1 {
        color: #ff6347 !important;
        font-size: 3em !important;
      }
      p {
        color: #4682b4 !important;
        font-size: 1.5em !important;
      }
    `
    document.head.appendChild(style)
  })

  await page.waitForTimeout(1000)

  await expect(page).toHaveScreenshot('modified-example-page.png')
})
