import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    testTimeout: 60000, // Increase timeout for database operations in CI
    setupFiles: ['dotenv/config'], // Automatically load .env files
  },
  resolve: {
    alias: {
      '@payload-config': resolve(__dirname, '../../payload.config.ts'),
      '@': resolve(__dirname, '../..'),
      '@/lib': resolve(__dirname, '../../lib'),
      '@/.velite': resolve(__dirname, '../../.velite'),
      '@/app': resolve(__dirname, '../../app'),
      '@/collections': resolve(__dirname, '../../collections'),
      '@/tasks': resolve(__dirname, '../../tasks'),
      '@/scripts': resolve(__dirname, '../../scripts'),
    },
  },
})
