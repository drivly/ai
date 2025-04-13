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
      pattern: '../sdks/!(node_modules)/**/README.md',
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
        brandColor: s.string().optional(), // Add this field
        content: s.markdown(),
        group: s.string().optional(),
        codeExample: s.string().optional(), // Code example content
        codeLang: s.string().optional(), // Language of the code example (typescript, json, etc.)
        badge: s.string().optional(), // Badge text
      }),
      transform: (data: any) => {
        const pathParts = data._path.split('/'); // e.g., ['sites', 'ai', 'some-site.mdx'] or ['sites', 'workflows.do.mdx']
        let group = 'other';
      
        if (pathParts.length > 2) {
          group = pathParts[1];
        } else if (pathParts.length === 2) {
          const filename = pathParts[1];
          const match = filename.match(/^([^.]+)\.?/); 
          if (match && match[1]) {
            group = match[1];
          }
        }
      
        return {
          ...data,
          group,
        };
      },
    },
  },
})
