const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e-playwright',
  workers: process.env.CI ? 4 : 2,
  fullyParallel: true,
  use: {
    baseURL: process.env.TEST_BASE_URL || 'http://localhost:3000',
    screenshot: 'on',
    trace: 'on',
    actionTimeout: 10 * 1000,
    navigationTimeout: 30 * 1000,
  },
  timeout: 60 * 1000,
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  updateSnapshots: process.env.CI ? 'all' : 'missing',
  retries: process.env.CI ? 2 : 0,
});
