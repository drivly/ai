import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'
import tsconfigPaths from 'vite-tsconfig-paths'
import { resolve } from 'path'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ['tests/e2e/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    globals: true,
    setupFiles: ['tests/setup.ts'],
    testTimeout: 60000, // Increased timeout for browser tests
    // Disable browser tests in CI environment to avoid dependency issues
    // The tests have fallback mechanisms for when browser is not available
  },
  resolve: {
    alias: {
      '@': resolve(process.cwd()),
      '@/payload.config': resolve(process.cwd(), 'payload.config.ts'),
      '@payload-config': resolve(process.cwd(), 'payload.config.ts'),
    },
  },
})
