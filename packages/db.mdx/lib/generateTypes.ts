import fg from 'fast-glob'
import fs from 'fs/promises'
import { camelCase } from 'lodash-es'

export async function generateTypes() {
  const files = await fg('**/*.mdx', {
    cwd: process.cwd(),
    absolute: true,
    ignore: ['**/node_modules/**'],
  })

  const relativePaths = files.map((file) => file.replace(process.cwd() + '/', ''))

  let typeContent = `// Auto-generated types for MDX files\n\n`
  // typeContent += `import type { MDXDocument } from 'db.mdx'\n\n`
  typeContent += `export interface MDXDocument {\n`
  typeContent += `  content: string\n`
  typeContent += `  data: Record<string, any> | any[]\n`
  typeContent += `  code?: string\n`
  typeContent += `  module?: Record<string, any>\n`
  typeContent += `  javascript?: any\n`
  typeContent += `  markdown?: any\n`
  typeContent += `}\n`

  typeContent += `export interface MDX {\n`

  // Create a tree structure
  const tree: any = {}

  relativePaths.forEach((file) => {
    console.log(file)
    const parts = file.replace(/\.mdx$/, '').split('/')
    let current = tree

    parts.forEach((part) => {
      current[part] = current[part] || {}
      current = current[part]
    })
  })

  // Helper to generate nested interfaces
  function generateInterface(obj: any, indent: number = 2): string {
    let result = ''
    const spaces = ' '.repeat(indent)

    Object.keys(obj).forEach((key) => {
      if (Object.keys(obj[key]).length > 0) {
        result += `${spaces}${camelCase(key)}: {\n`
        result += generateInterface(obj[key], indent + 2)
        result += `${spaces}}\n`
      } else {
        result += `${spaces}${camelCase(key)}: MDXDocument\n`
      }
    })

    return result
  }

  typeContent += generateInterface(tree)
  typeContent += `}\n`
  typeContent += `declare module 'db.mdx' {\n`
  typeContent += `  export interface MDXDocuments extends MDX {}\n`
  typeContent += `}\n`

  await fs.writeFile('mdx.d.ts', typeContent)
}

// if (import.meta.url === `file://${process.argv[1]}`) {
//   generateTypes()
// }
// generateTypes()
