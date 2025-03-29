import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'node',
  },
  resolve: {
    alias: {
      '@payload-config': resolve(__dirname, './payload.config.js'),
      '@': resolve(__dirname),
      'simple-payload': resolve(__dirname, './pkgs/simple-payload'),
    },
  },
})
