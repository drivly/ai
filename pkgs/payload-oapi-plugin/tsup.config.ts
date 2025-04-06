import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: {
    compilerOptions: {
      incremental: false
    }
  },
  splitting: false,
  sourcemap: true,
  clean: true,
})
