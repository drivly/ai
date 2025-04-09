import fs from 'fs'
import path from 'path'
import { collections } from '../collections'


/**
 * Standalone script to generate API documentation for all collections
 * This creates MDX files in the /content/apis/apis.do directory without requiring Payload initialization
 */
const generateApiDocs = async () => {
  try {
    console.log('Generating API documentation for collections...')

    const apisDir = path.resolve(process.cwd(), 'content/apis/apis.do')
    if (!fs.existsSync(apisDir)) {
      fs.mkdirSync(apisDir, { recursive: true })
    }

    const metaPath = path.join(apisDir, '_meta.ts')
    if (!fs.existsSync(metaPath)) {
      fs.writeFileSync(
        metaPath,
        `import type { MetaRecord } from 'nextra'

const meta: MetaRecord = {
  index: 'API Reference',
}

export default meta
`,
      )
      console.log('Created _meta.ts file for apis.do directory')
    }

    const indexPath = path.join(apisDir, 'index.mdx')
    if (!fs.existsSync(indexPath)) {
      fs.writeFileSync(
        indexPath,
        `---
title: API Reference
description: API documentation for all collections
asIndexPage: true
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

  const interfaceName = `${title}Type`
  
  const typeProperties = fields
    .filter((field: any) => field.name && field.type) // Only document fields with name and type
    .map((field: any) => {
      const { name, type, required, defaultValue, admin: fieldAdmin = {} } = field
      const description = fieldAdmin.description || ''
      
      let tsType = 'any'
      switch (type) {
        case 'text':
        case 'textarea':
        case 'email':
        case 'code':
        case 'date':
          tsType = 'string'
          break
        case 'number':
          tsType = 'number'
          break
        case 'checkbox':
          tsType = 'boolean'
          break
        case 'select':
          tsType = 'string'
          break
        case 'relationship':
          tsType = 'string | { id: string }'
          break
        case 'array':
          tsType = 'any[]'
          break
        case 'blocks':
        case 'group':
        case 'json':
        case 'richText':
          tsType = 'object'
          break
        default:
          tsType = 'any'
      }

      const jsDocComment = description ? `/** ${description} */\n  ` : ''
      
      return `${jsDocComment}${name}${required ? '' : '?'}: ${tsType}`
    })
    .join('\n  ')

  const tsInterface = `interface ${interfaceName} {
  ${typeProperties}
}`

  const fieldDocs = `<TSDoc>
\`\`\`typescript
${tsInterface}
\`\`\`
</TSDoc>`

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

import { TSDoc } from 'nextra/components'

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

/**
 * Updates the API documentation index file with links to all collection docs
 */
const updateApiDocsIndex = async (apisDir: string) => {
  try {
    console.log('Updating API documentation index...')

    const files = fs.readdirSync(apisDir).filter((file) => file.endsWith('.mdx') && file !== 'index.mdx')

    const apisByGroup: Record<string, { title: string; slug: string }[]> = {}

    for (const file of files) {
      const filePath = path.join(apisDir, file)
      const content = fs.readFileSync(filePath, 'utf-8')

      const titleMatch = content.match(/title:\s*([^\n]+)/)
      const groupMatch = content.match(/group:\s*([^\n]+)/)

      const title = titleMatch ? titleMatch[1].trim() : path.basename(file, '.mdx')
      const group = groupMatch ? groupMatch[1].trim() : 'Uncategorized'

      if (!apisByGroup[group]) {
        apisByGroup[group] = []
      }

      apisByGroup[group].push({
        title,
        slug: path.basename(file, '.mdx'),
      })
    }

    const sortedGroups = Object.keys(apisByGroup).sort()

    let indexContent = `---
title: API Reference
description: API documentation for all collections
asIndexPage: true
---

import { TSDoc } from 'nextra/components'

# API Reference

This section contains API documentation for all collections in the system, organized by category.

`

    for (const group of sortedGroups) {
      indexContent += `## ${group}\n\n`

      const sortedApis = apisByGroup[group].sort((a, b) => a.title.localeCompare(b.title))

      for (const api of sortedApis) {
        indexContent += `- [${api.title}](${api.slug})\n`
      }

      indexContent += '\n'
    }

    const indexPath = path.join(apisDir, 'index.mdx')
    fs.writeFileSync(indexPath, indexContent)

    console.log('API documentation index updated successfully')
  } catch (error) {
    console.error('Error updating API documentation index:', error)
  }
}

const main = async () => {
  await generateApiDocs()
  const apisDir = path.resolve(process.cwd(), 'content/apis/apis.do')
  await updateApiDocsIndex(apisDir)
}

main()
