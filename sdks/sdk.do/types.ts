export type { ListResponse, ErrorResponse, QueryParams } from 'apis.do/types'

export interface Package {
  id: string
  name: string
  package: any
  collections: Array<{
    collection: string
  }>
}

export interface PublishOptions {
  tag?: string
  dryRun?: boolean
}
