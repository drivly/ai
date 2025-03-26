import { defineConfig } from 'tsup';

export default defineConfig({
  target: 'es2022',
  entry: {
    index: 'index.ts',
    'hooks/index': 'hooks/index.ts',
  },
  outDir: 'dist',
  format: ['esm'],
  clean: true,
  dts: true,
  sourcemap: true,
  external: ['react', 'react-dom'],
});
