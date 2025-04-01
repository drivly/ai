import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    testTimeout: 60000, // Increase timeout for database operations in CI
    setupFiles: ['dotenv/config'], // Automatically load .env files
  },
})
