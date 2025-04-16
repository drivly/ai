import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      exclude: ['tests/**', '**/*.test.ts', 'dist/**'],
      provider: 'istanbul',
    },
  },
})
