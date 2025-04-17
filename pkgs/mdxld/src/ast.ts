import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMDX from 'remark-mdx'
import remarkGFM from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import type { Root } from 'mdast'
import type { MDXLDWithAST, ParseOptions } from './types.js'
import { parse as parseCore, stringify as stringifyCore } from './parser.js'

export function parse(mdx: string, options?: ParseOptions): MDXLDWithAST {
  const core = parseCore(mdx, options)

  try {
    const ast = unified().use(remarkParse).use(remarkFrontmatter, ['yaml']).use(remarkMDX).use(remarkGFM).parse(mdx) as Root

    ast.children = ast.children.filter((node) => node.type !== 'yaml')

    return {
      ...core,
      ast,
    }
  } catch (error) {
    throw new Error(`Failed to parse MDX AST: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export function stringify(mdxld: MDXLDWithAST, options?: { useAtPrefix?: boolean }): string {
  return stringifyCore(mdxld, options)
}
