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
      transform: (data: any) => {
        const pathParts = data._path.split('/');
        const sdkName = pathParts[pathParts.length - 2]; // Get the directory name
        
        return {
          ...data,
          title: sdkName, // Set the title to the SDK name
        };
      },
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
        const pathParts = data._path.split('/');
        return {
          ...data,
          group: pathParts.length > 2 ? pathParts[1] : 'other',
        };
      },
    },
  },
})
