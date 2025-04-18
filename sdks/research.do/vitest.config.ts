import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

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
  resolve: {
    alias: {
      'functions.do': resolve(__dirname, '../functions.do/dist'),
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
