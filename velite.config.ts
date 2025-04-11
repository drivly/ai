import { defineConfig, s } from 'velite'

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
        // component: s.mdx(),
      }),
    },
    sdks: {
      name: 'SDK',
      pattern: '../sdks/**/README.md',
      schema: s.object({
        title: s.string().optional(),
        description: s.string().optional(),
        content: s.markdown(),
      }),
    },
    sites: {
      name: 'Site',
      pattern: 'sites/**/*.mdx',
      schema: s.object({
        title: s.string(),
        description: s.string(),
        headline: s.string(),
        subhead: s.string().optional(),
        content: s.markdown(),
        group: s.computed(doc => {
          const pathParts = doc._path.split('/');
          return pathParts.length > 2 ? pathParts[1] : 'other';
        }),
      }),
    },
  },
})
