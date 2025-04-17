import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/video/composition.tsx'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  outExtension({ format }) {
    return {
      js: format === 'esm' ? '.mjs' : '.js',
    }
  },
  esbuildOptions(options) {
    options.jsx = 'automatic'
    return options
  }
})
