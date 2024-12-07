import { defineConfig } from 'vite'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import dts from 'vite-plugin-dts' 

export default defineConfig({
  build: {
    lib: {
      entry: './index.ts',
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'ai', '@ai-sdk/openai', '@ai-sdk/anthropic', 'zod']
    }
  },
  plugins: [
    dts({ insertTypesEntry: true }),
    mdx({
      remarkPlugins: [
        remarkFrontmatter, // Parses YAML frontmatter
        [remarkMdxFrontmatter, { name: 'meta' }], // Converts frontmatter to export statements
      ],
    }),
  ],
})