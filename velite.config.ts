import { defineConfig, s } from 'velite'
import { z } from 'zod'

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    name: 'content',
    format: 'esm',
    clean: true,
  },
  collections: {
    pages: {
      name: 'Page',
      pattern: '**/*.mdx',
      schema: s.object({
        title: s.string().optional(),
        description: s.string().optional(),
        content: s.markdown(),
        component: s.mdx(),
      }),
    },
  },
})
