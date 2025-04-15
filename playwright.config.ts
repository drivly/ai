import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  workers: 2,
  fullyParallel: true,
  use: {
    baseURL: process.env.TEST_BASE_URL || 'http://localhost:3000',
    screenshot: 'on',
    trace: 'on',
    actionTimeout: 15 * 1000, 
    navigationTimeout: 60 * 1000, 
  },
  timeout: 120 * 1000,
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  updateSnapshots: process.env.CI ? 'all' : 'missing',
})
