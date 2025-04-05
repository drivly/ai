export type { ListResponse, ErrorResponse, QueryParams } from '../../apis.do/src/types.js'

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
