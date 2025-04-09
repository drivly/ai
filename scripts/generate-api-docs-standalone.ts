import fs from 'fs'
import path from 'path'
import { collections } from '../collections'
import type { Field } from 'payload'

/**
 * Standalone script to generate API documentation for all collections
 * This creates MDX files in the /content/apis directory without requiring Payload initialization
 */
const generateApiDocs = async () => {
  try {
    console.log('Generating API documentation for collections...')

    const apisBaseDir = path.resolve(process.cwd(), 'content/apis')
    const apisDir = path.resolve(apisBaseDir, 'apis.do')
    if (!fs.existsSync(apisDir)) {
      fs.mkdirSync(apisDir, { recursive: true })
    }

    const indexPath = path.join(apisDir, 'index.mdx')
    if (!fs.existsSync(indexPath)) {
      fs.writeFileSync(
        indexPath,
        `---
asIndexPage: true
title: API Reference
description: API documentation for all collections
---

# apis.do API Reference

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

  // Generate TypeScript interface for the collection
  const generateTypeInterface = (fields: any[]) => {
    return fields
      .filter((field: any) => field.name && field.type)
      .map((field: any) => {
        const { name, type, required, defaultValue } = field
        let tsType = mapPayloadTypeToTS(field)
        
        // Format the field as a TypeScript property
        return `  ${name}${required ? '' : '?'}: ${tsType};`
      })
      .join('\n')
  }

  // Map Payload field types to TypeScript types
  const mapPayloadTypeToTS = (field: any): string => {
    const { type, hasMany } = field
    
    switch (type) {
      case 'text':
      case 'textarea':
      case 'code':
      case 'email':
      case 'date':
        return 'string'
      case 'number':
        return 'number'
      case 'checkbox':
        return 'boolean'
      case 'select':
        if (field.options && Array.isArray(field.options)) {
          const options = field.options
            .map((opt: any) => typeof opt === 'string' ? `'${opt}'` : `'${opt.value}'`)
            .join(' | ')
          return options || 'string'
        }
        return 'string'
      case 'relationship':
        const relationType = field.relationTo
        if (Array.isArray(relationType)) {
          return hasMany ? `Array<{ relationTo: string; value: string }>` : `{ relationTo: string; value: string }`
        }
        return hasMany ? `string[]` : 'string'
      case 'array':
        return 'any[]'
      case 'json':
      case 'object':
        return 'Record<string, any>'
      case 'richText':
        return 'any[]' // Rich text is typically stored as a JSON array
      default:
        return 'any'
    }
  }

  // Generate field documentation with TSDoc format
  const fieldDocs = `
## Fields

<TSDoc code={"interface ${title} {
${generateTypeInterface(fields)}
}"} />

`

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

import { Callout, unstable_TSDoc as TSDoc } from 'nextra/components'

# ${title} API

${collection.admin?.description || `API for managing ${title} resources.`}

<Callout type="info">
  This documentation is automatically generated from the Payload CMS collection configuration.
</Callout>

${fieldDocs}

${endpoints}
`

  const filePath = path.join(apisDir, `${slug}.mdx`)
  fs.writeFileSync(filePath, mdxContent)
  console.log(`Generated API documentation for ${slug}`)
}

generateApiDocs()
