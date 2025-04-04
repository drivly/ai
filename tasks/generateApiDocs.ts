import fs from 'fs'
import path from 'path'
import { getPayload, Payload, CollectionConfig } from 'payload'
import config from '../payload.config'
import { collections } from '../collections'

/**
 * Generates API documentation in MDX format for each collection
 * Places the generated files in the /content/apis directory
 */
export const generateApiDocsTask = async ({ payload }: { payload: Payload }) => {
  try {
    console.log('Generating API documentation for collections...')
    
    const apisDir = path.resolve(process.cwd(), 'content/apis')
    if (!fs.existsSync(apisDir)) {
      fs.mkdirSync(apisDir, { recursive: true })
    }
    
    for (const collection of collections) {
      await generateCollectionDoc(collection, apisDir)
    }
    
    console.log('API documentation generation complete')
    return { success: true }
  } catch (error: unknown) {
    console.error('Error generating API documentation:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    }
  }
}

interface CollectionField {
  name: string
  type: string
  required?: boolean
  defaultValue?: any
  admin?: {
    description?: string
    [key: string]: any
  }
  [key: string]: any
}

type Collection = CollectionConfig

/**
 * Generates an MDX file for a single collection
 */
const generateCollectionDoc = async (collection: Collection, apisDir: string) => {
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

export default generateApiDocsTask
