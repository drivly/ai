import { compile, evaluate } from '@mdx-js/mdx'
import matter from 'gray-matter'
import type { GrayMatterFile } from 'gray-matter'
import { MDXModule } from 'mdx/types'
// import React from 'react'
// import { jsx } from 'react/jsx-runtime'

export type MDXDocument = {
  content: string
  data: Record<string, any> | any[]
  code?: string
  module?: MDXModule
  javascript?: any // TODO: type for JavaScript AST
  markdown?: any // TODO: type for Markdown AST
  // schema: any // JSON Schema type
  // types: string // TODO: types.d.ts file
}

export const load = async (mdx: string): Promise<MDXDocument> => {
  const { data, content } = matter(mdx)

  // const code = await compile(content, {
  //   outputFormat: 'program' // 'function-body',
  // }).then((vfile) => vfile.toString())

  // const module = await evaluate(content, {
  //   jsx,
  //   Fragment: React.Fragment,
  // })
  return {
    content,
    data,
    // code,
    // module,
    // exports,
    // javascript: {},
    // markdown: {},
  }
}

export const dump = async (document: Partial<MDXDocument>): Promise<string> => {
  const { content = '', data = {} } = document
  return matter.stringify(content, data)
}
