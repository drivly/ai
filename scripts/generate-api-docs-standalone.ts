import fs from 'fs'
import path from 'path'
import { collections } from '../collections'

/**
 * Standalone script to generate API documentation for all collections
 * This creates MDX files in the /content/apis directory without requiring Payload initialization
 */
const generateApiDocs = async () => {
  try {
    console.log('Generating API documentation for collections...')

    const apisDir = path.resolve(process.cwd(), 'content/apis/apis')
    if (!fs.existsSync(apisDir)) {
      fs.mkdirSync(apisDir, { recursive: true })
    }

    const indexPath = path.join(apisDir, 'index.mdx')
    if (!fs.existsSync(indexPath)) {
      fs.writeFileSync(
        indexPath,
        `---
title: API Reference
description: API documentation for all collections
---

# API Reference

This section contains API documentation for all collections in the system.
`,
      )
      console.log('Created API documentation index file')
    }

    for (const collection of collections) {
      await generateCollectionDoc(collection, apisDir)
    }

    console.log('API documentation generation complete')
  } catch (error) {
    console.error('Error generating API documentation:', error)
    process.exit(1)
  }
}

/**
 * Generates an MDX file for a single collection
 */
const generateCollectionDoc = async (collection: any, apisDir: string) => {
  const { slug, fields = [], admin = {} } = collection

  if (!slug) return

  const title = slug.charAt(0).toUpperCase() + slug.slice(1)

  const group = admin.group || 'Uncategorized'

  const fieldDocs = fields
    .filter((field: any) => field.name && field.type) // Only document fields with name and type
    .map((field: any) => {
      const { name, type, required, defaultValue, admin: fieldAdmin = {} } = field
      const description = fieldAdmin.description || ''

      let defaultValueStr = ''
      if (defaultValue !== undefined) {
        if (typeof defaultValue === 'object') {
          defaultValueStr = `\`${JSON.stringify(defaultValue)}\``
        } else {
          defaultValueStr = `\`${defaultValue}\``
        }
      }

      return `### ${name}

- **Type**: \`${type}\`
- **Required**: ${required ? 'Yes' : 'No'}
${defaultValue !== undefined ? `- **Default**: ${defaultValueStr}` : ''}
${description ? `- **Description**: ${description}` : ''}
`
    })
    .join('\n\n')

  const endpoints = `
## API Endpoints

### GET /api/${slug}
Retrieves a list of ${title} with pagination.

#### Query Parameters
- \`limit\`: Maximum number of items to return (default: 10)
- \`page\`: Page number for pagination (default: 1)
- \`sort\`: Field to sort by (default: createdAt)
- \`where\`: JSON query for filtering results

### GET /api/${slug}/:id
Retrieves a single ${title} by ID.

### POST /api/${slug}
Creates a new ${title}.

### PATCH /api/${slug}/:id
Updates an existing ${title}.

### DELETE /api/${slug}/:id
Deletes a ${title}.
`

  const mdxContent = `---
title: ${title}
sidebarTitle: ${title}
group: ${group}
---

# ${title} API

${collection.admin?.description || `API for managing ${title} resources.`}

## Fields

${fieldDocs}

${endpoints}
`

  const filePath = path.join(apisDir, `${slug}.mdx`)
  fs.writeFileSync(filePath, mdxContent)
  console.log(`Generated API documentation for ${slug}`)
}

generateApiDocs()
