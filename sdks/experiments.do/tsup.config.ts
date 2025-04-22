import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/types.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  skipNodeModulesBundle: true,
  target: 'es2022',
  outDir: 'dist',
  shims: false,
  treeshake: true,
})
