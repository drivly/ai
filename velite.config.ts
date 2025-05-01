import { defineConfig, s, type ZodMeta, defineLoader } from 'velite' // Import ZodMeta and defineLoader

const tsvLoader = defineLoader({
  name: 'tsv',
  test: /\.tsv$/,
  load: (file) => {
    const content = file.value.toString()
    const lines = content.split('\n').filter((line) => line.trim())
    const headers = lines[0].split('\t').map((header) => header.trim())

    const entries = lines.slice(1).map((line) => {
      const values = line.split('\t').map((value) => value.trim())
      const entry: Record<string, string> = {}
      headers.forEach((header, index) => {
        entry[header] = values[index] || ''
      })
      return entry
    })

    return { data: entries }
  },
})

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    name: 'content',
    format: 'esm',
    clean: true,
  },
  loaders: [tsvLoader],
  collections: {
    domains: {
      name: 'Domain',
      pattern: '../sites/.domains.tsv',
      schema: s.object({
        domain: s.string(),
        category: s.string(),
        description: s.string(),
      }),
    },
    primitives: {
      name: 'Primitive',
      pattern: '../primitives.yaml',
      schema: s.record(s.string(), s.string()),
      single: true,
    },
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
    packages: {
      name: 'Package',
      pattern: '../packages/*/README.md',
      schema: s.object({
        title: s.string().optional(),
        description: s.string().optional(),
        content: s.markdown(),
      }),
      transform: (data: any, { meta }: { meta: any }) => {
        const path = meta.path
        const name = path.split('/').pop()?.split('.')?.slice(0, 2)?.join('.') || ''
        return {
          ...data,
          name,
        }
      },
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
          headline: s.string().optional(),
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
                description: s.string().optional(),
                headline: s.string().optional(),
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
