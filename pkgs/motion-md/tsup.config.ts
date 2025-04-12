import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/video/composition.tsx'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  esbuildOptions(options) {
    // Handle node built-ins
    options.alias = {
      'node:path': 'path',
      'node:fs': 'fs',
      'node:url': 'url',
      'node:process': 'process',
    }
    return options
  }
})
