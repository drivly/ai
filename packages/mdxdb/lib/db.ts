import { MDXDocument } from './mdx'


export type DB = Record<string, {
  list: (options?: ListOptions) => Promise<MDXDocument[]>
  // find: (options?: FindOptions) => Promise<MDXDocument[]>
  // search: (query: string) => Promise<MDXDocument[]>
  get: (id: string) => Promise<MDXDocument>
  set: (id: string, document: MDXDocument) => Promise<void>
  delete: (id: string) => Promise<void>
}>

export type ListOptions = {
  [key: string]: any
  page?: number
  pageSize?: number
  take?: number
  skip?: number
  sort?: string | string[]
}

export type FindOptions = ListOptions & {
  [key: string]: any
}
