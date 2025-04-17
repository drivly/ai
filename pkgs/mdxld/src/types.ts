import type { Root } from 'mdast'

/**
 * Core MDXLD interface for parsed MDX documents with YAML-LD frontmatter
 */
export interface MDXLD {
  /** Optional document ID */
  id?: string
  /** Document type URI */
  type?: string
  /** JSON-LD context - can be string URI or object */
  context?: string | Record<string, unknown>
  /** Document language */
  language?: string
  /** Base URI */
  base?: string
  /** Vocabulary URI */
  vocab?: string
  /** Optional list value */
  list?: unknown[]
  /** Optional set value */
  set?: Set<unknown>
  /** Optional reverse flag */
  reverse?: boolean
  /** Frontmatter data excluding special $ and @ prefixed properties */
  data: Record<string, unknown>
  /** Document content excluding frontmatter */
  content: string
}

/**
 * Extended MDXLD interface with AST support
 */
export interface MDXLDWithAST extends MDXLD {
  /** Abstract Syntax Tree from remark parsing */
  ast: Root
}

/**
 * Options for parsing MDX documents
 */
export interface ParseOptions {
  /** Whether to parse the content as AST */
  ast?: boolean
  /** Whether to allow @ prefix (defaults to $ prefix) */
  allowAtPrefix?: boolean
}

/**
 * Options for stringifying MDX documents
 */
export interface StringifyOptions {
  /** Whether to use @ prefix instead of default $ */
  useAtPrefix?: boolean
}

/**
 * Special properties that should be extracted to root level
 */
export type SpecialProperty = 'type' | 'context' | 'id' | 'language' | 'base' | 'vocab' | 'list' | 'set' | 'reverse'
