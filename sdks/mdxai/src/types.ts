/**
 * Types for the mdxai package
 */

export interface MDXLDData {
  $type?: string
  $context?: string
  $id?: string
  name?: string
  description?: string
  keywords?: string[]
  author?: {
    name: string
    url?: string
  }
  datePublished?: string
  dateModified?: string
  image?: string
  url?: string
  metadata?: {
    [key: string]: any
  }
}

export interface OutlineItem {
  title: string
  description?: string
  children?: OutlineItem[]
}

export interface GenerateOptions {
  prompt: string
  model?: string
  type?: string
  schema?: any
  recursive?: boolean
  depth?: number
  onProgress?: (progress: number, message: string) => void
}

export interface GenerateResult {
  content: string
  ast?: any
  outline?: OutlineItem[]
}

export interface MDXLDAST {
  type: string
  children: any[]
  data?: {
    frontmatter?: MDXLDData
  }
}
