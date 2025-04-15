import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  workers: 2,
  fullyParallel: true,
  use: {
    baseURL: process.env.TEST_BASE_URL || 'http://localhost:3000',
    screenshot: 'on',
    trace: 'on',
    actionTimeout: 10 * 1000, // Reduced from 15s to 10s
    navigationTimeout: 30 * 1000, // Reduced from 60s to 30s
  },
  timeout: 30 * 1000, // Reduced from 120s to 30s
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  updateSnapshots: process.env.CI ? 'all' : 'missing',
})
