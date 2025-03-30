import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.{js,ts,jsx,tsx}'],
    environment: 'jsdom',
    testTimeout: 30000,
    typecheck: {
      enabled: false,
    },
    coverage: {
      exclude: ['tests/e2e/**'],
    },
  },
})
