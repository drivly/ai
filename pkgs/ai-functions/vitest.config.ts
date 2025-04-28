import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    snapshotFormat: {
      printBasicPrototype: true,
    },
    testTimeout: 10000, // Add timeout for external API calls
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
      'ai-providers': resolve(__dirname, '../ai-providers/src'),
    },
  },
})
