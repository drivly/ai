import matter from 'gray-matter'
import type { GrayMatterFile } from 'gray-matter'

export type MDXDocument = {
  content: string
  data: Record<string, any> | any[]
  exports: Record<string, any>
  javascript: any // TODO: type for JavaScript AST
  markdown: any // TODO: type for Markdown AST
  // schema: any // JSON Schema type
  // types: string // TODO: types.d.ts file
}

export const load = async (mdx: string): Promise<MDXDocument> => {
  const { data, content } = matter(mdx)
  return {
    content,
    data,
    exports: {},
    javascript: {},
    markdown: {},
  }
}

export const dump = async (document: Partial<MDXDocument>): Promise<string> => {
  const { content = '', data = {} } = document
  return matter.stringify(content, data)
}
