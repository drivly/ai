import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    snapshotFormat: {
      printBasicPrototype: true,
    },
  },
})
