import { defineConfig } from 'tsup'
import path from 'path'
import fs from 'fs'

export default defineConfig({
  entry: {
    base: './src/base.tsx',
    globals: './src/globals.tsx',
    'components/index': './src/components/index.ts',
    'lib/index': './src/lib/index.ts',
    'hooks/index': './src/hooks/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'framer-motion'],
  esbuildOptions(options) {
    options.alias = {
      '@': path.resolve(__dirname, './src'),
    }
    return options
  },
  async onSuccess() {
    fs.copyFileSync(path.resolve(__dirname, './src/globals.css'), path.resolve(__dirname, './dist/globals.css'))
    fs.copyFileSync(path.resolve(__dirname, './src/base.globals.css'), path.resolve(__dirname, './dist/base.css'))

    console.log('CSS files copied successfully!')
  },
})
