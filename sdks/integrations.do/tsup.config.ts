import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['index.ts', 'types.ts', 'bin.ts'],
  banner: {
    js: '#!/usr/bin/env node'
  },
  format: ['esm'],
  dts: true,
  clean: true,
  minify: false,
  skipNodeModulesBundle: true,
  target: 'es2022',
  outDir: 'dist',
  shims: false,
  treeshake: true,
})
