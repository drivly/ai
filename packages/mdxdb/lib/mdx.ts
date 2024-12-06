import * as matter from 'gray-matter'
import type { GrayMatterFile } from 'gray-matter'

export type MDXDocument = {
  content: string
  data: Record<string, any> | any[]
  exports: Record<string, any>
  Component: React.ComponentType
  javascript: any // TODO: type for JavaScript AST
  markdown: any // TODO: type for Markdown AST
  schema: any // JSON Schema type
  types: any // TODO: type for TypeScript AST
}

export const load = async (mdx: string): Promise<MDXDocument> => {
  const { default: mdxContent } = await import(mdx)
  return mdxContent
}

export const dump = async (document: Partial<MDXDocument>): Promise<string> => {
  return ''
}
