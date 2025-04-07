import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'index.ts',
    types: 'types.ts',
    cli: 'src/cli.ts',
    bin: 'src/bin.ts',
  },
  format: ['esm'],
  dts: {
    resolve: true,
    compilerOptions: {
      skipLibCheck: true,
      moduleResolution: 'NodeNext',
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
