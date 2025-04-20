import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/ast.ts', 'src/parser.ts'],
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
    options.alias = {
      'node:path': 'path',
      'node:fs': 'fs',
      'node:url': 'url',
      'node:process': 'process',
    }
    return options
  },
})
