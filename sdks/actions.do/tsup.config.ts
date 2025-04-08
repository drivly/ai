import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['index.ts', 'types.ts'],
  format: ['esm'],
  dts: {
    resolve: true,
  },
  clean: true,
  skipNodeModulesBundle: true,
})
