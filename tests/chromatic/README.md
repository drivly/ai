# Chromatic Visual Tests

This directory contains tests that use Chromatic for visual testing.

## Running Tests

To run the tests with Chromatic:

```bash
# Set the Chromatic project token
export CHROMATIC_PROJECT_TOKEN=your_project_token

# Run the tests
pnpm test:chromatic
```

Or run directly with npx:

```bash
npx chromatic --playwright --project-token=your_project_token --config=playwright.config.ts
```

## Adding New Tests

Create new test files in this directory using the Chromatic Playwright syntax:

```typescript
import { test, expect } from '@chromatic-com/playwright'

test('your test name', async ({ page }) => {
  await page.goto('your-url')
  // Test interactions here
  await expect(page).toHaveScreenshot()
})
```
