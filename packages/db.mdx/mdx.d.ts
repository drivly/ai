// Auto-generated types for MDX files

export interface MDXDocument {
  content: string
  data: Record<string, any> | any[]
  code?: string
  module?: Record<string, any>
  javascript?: any
  markdown?: any
}
export interface MDX {
  examples: {
    aiAgent: MDXDocument
    aiDatabase: MDXDocument
    aiFunction: MDXDocument
    aiWorkflow: MDXDocument
    cloudflareWorker: MDXDocument
    graphdl: MDXDocument
    payload: MDXDocument
    blog: {
      helloMdxdb: MDXDocument
    }
  }
}
declare module 'db.mdx' {
  export interface MDXDocuments extends MDX {}
}
