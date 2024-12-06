import fg from 'fast-glob'
import fs from 'fs/promises'
import { camelCase } from 'lodash-es'

export async function generateTypes() {
  const files = await fg('**/*.mdx', { 
    cwd: process.cwd(),
    absolute: true 
  })
  
  const relativePaths = files.map(file => 
    file.replace(process.cwd() + '/', '')
  )

  let typeContent = `// Auto-generated types for MDX files\n\n`
  typeContent += `import type { MDXDocument } from 'mdxdb'\n\n`
  typeContent += `declare module 'mdxdb' {\n`
  typeContent += `  export const mdx: {\n`

  // Create a tree structure
  const tree: any = {}
  
  relativePaths.forEach(file => {
    const parts = file.replace(/\.mdx$/, '').split('/')
    let current = tree
    
    parts.forEach((part) => {
      current[part] = current[part] || {}
      current = current[part]
    })
  })

  // Helper to generate nested interfaces
  function generateInterface(obj: any, indent: number = 4): string {
    let result = ''
    const spaces = ' '.repeat(indent)
    
    Object.keys(obj).forEach(key => {
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
  typeContent += `  }\n`
  typeContent += `}\n`

  await fs.writeFile('mdx.d.ts', typeContent)
}

// if (import.meta.url === `file://${process.argv[1]}`) {
//   generateTypes()
// } 
generateTypes()