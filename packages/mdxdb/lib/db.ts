import { MDXDocument } from './mdx'

export type DBMethods = {
  list: (options?: ListOptions) => Promise<MDXDocument[]>
  get: (id: string) => Promise<MDXDocument>
  set: (id: string, document: MDXDocument) => Promise<void>
  delete: (id: string) => Promise<void>
}

export type DB = {
  [collection: string]: DBMethods & {
    [subcollection: string]: DBMethods
  }
}

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
