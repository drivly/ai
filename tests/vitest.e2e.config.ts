import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  test: {
    include: ['tests/e2e/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    globals: true,
    setupFiles: ['tests/setup.ts'],
    // Disable browser tests in CI environment to avoid dependency issues
    // The tests have fallback mechanisms for when browser is not available
    testTimeout: 10000, // Increase timeout for browser tests
    environmentOptions: {
      env: {
        BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
        API_URL: process.env.API_URL || 'http://localhost:3000',
        VERCEL_URL: process.env.VERCEL_URL || 'http://localhost:3000',
        IS_TEST_ENV: process.env.IS_TEST_ENV || 'true',
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
})
