import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['index.ts', 'types.ts'],
  format: ['esm'],
  dts: {
    resolve: true,
    compilerOptions: {
      composite: true,
      incremental: true,
    },
  },
  clean: true,
  minify: false,
  skipNodeModulesBundle: true,
  target: 'es2022',
  outDir: 'dist',
  shims: false,
  treeshake: true,
})
