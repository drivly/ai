import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  test: {
    include: ['tests/e2e/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    globals: true,
    setupFiles: ['tests/setup.ts'],
    // Disable browser tests in CI environment to avoid dependency issues
    // The tests have fallback mechanisms for when browser is not available
    environmentOptions: {
      envFile: '.env.e2e.local',
    },
    env: {
      BASE_URL: process.env.BASE_URL,
      BROWSER_TESTS: process.env.BROWSER_TESTS,
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
})
