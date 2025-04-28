import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
  },
  resolve: {
    alias: {
      '@payload-config': resolve(__dirname, './src/__tests__/mocks/payload-config.mock.ts'),
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
