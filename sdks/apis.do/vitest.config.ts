import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: process.env.CI === 'true' ? ['**/node_modules/**', '**/dist/**', '**/tests/e2e/**'] : ['**/node_modules/**', '**/dist/**'],
    hookTimeout: 60000,
    testTimeout: 30000,
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
