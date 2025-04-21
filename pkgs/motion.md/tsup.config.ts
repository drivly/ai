import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/video/composition.tsx'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  outExtension({ format }) {
    return {
      js: '.mjs',
    }
  },
  esbuildOptions(options) {
    options.jsx = 'automatic'
    return options
  },
})
