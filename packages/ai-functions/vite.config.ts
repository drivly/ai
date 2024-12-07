import { defineConfig } from 'vite'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [
        remarkFrontmatter, // Parses YAML frontmatter
        [remarkMdxFrontmatter, { name: 'meta' }], // Converts frontmatter to export statements
      ],
    }),
  ],
})