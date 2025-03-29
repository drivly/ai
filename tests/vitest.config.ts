import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, '..'),
      '@payload-config': resolve(__dirname, '../payload.config.ts'),
      '@/.velite': resolve(__dirname, '../.velite'),
      '@/app': resolve(__dirname, '../app'),
      '@/tasks': resolve(__dirname, '../tasks'),
      '@/collections': resolve(__dirname, '../collections'),
      '@/lib': resolve(__dirname, '../lib'),
      '@/scripts': resolve(__dirname, '../scripts'),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.{test,spec}.{js,ts,jsx,tsx}', 'tasks/**/*.{test,spec}.{js,ts,jsx,tsx}', 'api-tests/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    globals: true,
    setupFiles: ['tests/setup.ts'],
  },
})
