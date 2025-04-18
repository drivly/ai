import fs from 'fs'
import path from 'path'
import { collections } from '../collections'
import type { Field } from 'payload'

/**
 * Standalone script to generate API documentation for all collections
 * This creates MDX files in the /content/apis directory without requiring Payload initialization
 */
/**
 * Creates a _meta.ts file for a directory to control the order of items in the sidebar
 */
const createMetaFile = (dir: string, items: string[]) => {
  const metaPath = path.join(dir, '_meta.ts')

  // Create the meta content with proper escaping
  let itemsStr = ''
  for (const item of items) {
    itemsStr += `  '${item}': '',
`
  }

  const metaContent = `import type { MetaRecord } from 'nextra'

const meta: MetaRecord = {
${itemsStr}}

export default meta`

  fs.writeFileSync(metaPath, metaContent)
}

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

    // Group collections by their admin group
    interface CollectionGroup {
      [key: string]: any[]
    }

    const collectionsByGroup: CollectionGroup = {}

    for (const collection of collections) {
      // Safely extract the group and ensure it's a string
      const groupName: string = typeof collection.admin?.group === 'string' ? collection.admin.group : 'Uncategorized'

      // Use the string as an index key
      if (!collectionsByGroup[groupName]) {
        collectionsByGroup[groupName] = []
      }
      collectionsByGroup[groupName].push(collection)
    }

    // First, delete all existing files and directories in the apisDir except index.mdx
    const existingFiles = fs.readdirSync(apisDir)
    for (const file of existingFiles) {
      if (file !== 'index.mdx') {
        const filePath = path.join(apisDir, file)
        if (fs.lstatSync(filePath).isDirectory()) {
          // Delete directory recursively
          fs.rmSync(filePath, { recursive: true, force: true })
        } else {
          // Delete file
          fs.unlinkSync(filePath)
        }
      }
    }

    // Process each group
    for (const group of Object.keys(collectionsByGroup)) {
      const groupKey = group as string // Ensure group is treated as a string
      const collectionsInGroup = collectionsByGroup[groupKey] || []
      for (const collection of collectionsInGroup) {
        await generateCollectionDoc(collection, apisDir)
      }
    }

    // Create _meta.ts files for each group directory to control sidebar order
    const groups = Object.keys(collectionsByGroup)
    createMetaFile(
      apisDir,
      groups.map((group) => group.toLowerCase().replace(/\s+/g, '-')),
    )

    // Create _meta.ts files for each group's collections
    for (const group of groups) {
      // Ensure group is a string and create valid directory name
      const groupStr = String(group)
      const groupDirName = groupStr.toLowerCase().replace(/\s+/g, '-')
      const groupDir = path.join(apisDir, groupDirName)

      if (fs.existsSync(groupDir)) {
        const files = fs
          .readdirSync(groupDir)
          .filter((file) => file.endsWith('.mdx') && file !== 'index.mdx')
          .map((file) => file.replace('.mdx', ''))

        createMetaFile(groupDir, files)
      }
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
  const { slug, fields = [], admin = {}, labels = {} } = collection

  if (!slug) return

  // Use labels.plural if available, otherwise capitalize the slug
  const title = labels.plural || slug.charAt(0).toUpperCase() + slug.slice(1)

  const group = admin.group || 'Uncategorized'

  // Create a subfolder for the group if it doesn't exist
  const groupDir = path.join(apisDir, group.toLowerCase().replace(/\s+/g, '-'))
  if (!fs.existsSync(groupDir)) {
    fs.mkdirSync(groupDir, { recursive: true })

    // Create an index.mdx file for the group
    const groupIndexPath = path.join(groupDir, 'index.mdx')
    fs.writeFileSync(
      groupIndexPath,
      `---
asIndexPage: true
title: ${group}
description: API documentation for ${group} collections
---

# ${group} API Reference

This section contains API documentation for ${group} collections.
`,
    )
  }

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
          const options = field.options.map((opt: any) => (typeof opt === 'string' ? `'${opt}'` : `'${opt.value}'`)).join(' | ')
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

  // Generate field documentation with standard code block
  const fieldDocs = `
## Fields

\`\`\`typescript
interface ${title} {
${generateTypeInterface(fields)}
}
\`\`\`

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

import { Callout } from 'nextra/components'

# ${title} API

${collection.admin?.description || `API for managing ${title} resources.`}



${fieldDocs}

${endpoints}
`

  const filePath = path.join(groupDir, `${slug}.mdx`)
  fs.writeFileSync(filePath, mdxContent)
  console.log(`Generated API documentation for ${slug}`)
}

generateApiDocs()
