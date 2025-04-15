import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  workers: process.env.CI ? 4 : 2, // Optimized workers for CI/local
  fullyParallel: true,
  use: {
    baseURL: process.env.TEST_BASE_URL || 'http://localhost:3000',
    screenshot: 'on',
    trace: 'on',
    actionTimeout: 10 * 1000, // Reduced from 15s to 10s
    navigationTimeout: 30 * 1000, // Reduced from 60s to 30s
  },
  timeout: 60 * 1000, // Set timeout to 60s as requested
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  updateSnapshots: process.env.CI ? 'all' : 'missing',
  retries: process.env.CI ? 2 : 0, // Add retries for CI environment
})
