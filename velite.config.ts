import { defineConfig, s, type ZodMeta } from 'velite' // Import ZodMeta

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
      pattern: '../sdks/*/README.md',
      schema: s.object({
        title: s.string().optional(),
        description: s.string().optional(),
        content: s.markdown(),
        sdk: s.boolean().optional(),
        cli: s.boolean().optional(),
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
        codeExample: s.string().optional(), // Code example content
        codeLang: s.string().optional(), // Language of the code example (typescript, json, etc.)
        badge: s.string().optional(), // Badge text
      }).transform((data, { meta }: { meta: any }) => { // Use 'any' for meta
        const path = meta.path;
        const contentSitesPattern = '/content/sites/';
        const contentSitesIndex = path.indexOf(contentSitesPattern);
        let group = 'other';

        if (contentSitesIndex !== -1) {
          const relativePath = path.substring(contentSitesIndex + contentSitesPattern.length);
          const relativePathParts = relativePath.split('/');
          if (relativePathParts.length > 1) {
            group = relativePathParts[0];
          }
        }

        return {
          ...data,
          group: group, // Assign the determined group
        };
      }),
    },
  },
})
