import fs from 'fs/promises'
import glob from 'fast-glob'
import { compileMDX } from 'next-mdx-remote/rsc'
import { generateSchema } from './schema.js'

export async function loadMDX() {
  const files = await glob(['ai/**/*.mdx', '**/ai.*.mdx'])
  let data: Record<string, any> = {}
  for (const file of files) {
    const mdx = await fs.readFile(file, 'utf8')
    const compiled = await compileMDX({
      source: mdx,
      components: {},
      options: { parseFrontmatter: true }
    })
    data[file.replace('.mdx', '')] = compiled
    const schema = generateSchema(compiled.frontmatter.output as any)
    console.log(compiled.frontmatter.output, schema)
  }
  return data
}

// loadConfig()