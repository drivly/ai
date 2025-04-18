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
      pattern: '../sites/*.mdx',
      schema: s
        .object({
          title: s.string(),
          description: s.string(),
          headline: s.string(),
          subhead: s.string().optional(),
          brandColor: s.string().optional(), // Add this field
          content: s.markdown(),
          codeExample: s.string().optional(), // Code example content
          codeLang: s.string().optional(), // Language of the code example (typescript, json, etc.)
          badge: s.string().optional(), // Badge text
        })
        .transform((data, { meta }: { meta: any }) => {
          // Extract domain from filename (without extension)
          const path = meta.path
          const domain = path.split('/').pop()?.split('.')?.slice(0, 2)?.join('.') || ''

          const contentSitesPattern = '/sites/'
          const contentSitesIndex = path.indexOf(contentSitesPattern)
          let group = 'other'

          if (contentSitesIndex !== -1) {
            const relativePath = path.substring(contentSitesIndex + contentSitesPattern.length)
            const relativePathParts = relativePath.split('/')
            if (relativePathParts.length > 1) {
              group = relativePathParts[0]
            }
          }

          return {
            ...data,
            domain, // First two components
            group, // Default group or extract from folder structure if needed
          }
        }),
    },
    sitesConfig: {
      name: 'SitesConfig',
      pattern: '../sites/.sites.yaml',
      single: true,
      schema: s.object({
        categories: s.array(
          s.object({
            name: s.string(),
            sites: s.array(
              s.object({
                domain: s.string(),
                title: s.string(),
                description: s.string(),
                headline: s.string(),
                subhead: s.string().optional(),
                badge: s.string().optional(),
                brandColor: s.string().optional(),
                tags: s.array(s.string()).optional(),
                links: s
                  .array(
                    s.object({
                      title: s.string(),
                      url: s.string(),
                    }),
                  )
                  .optional(),
              }),
            ),
          }),
        ),
      }),
    },
  },
})
