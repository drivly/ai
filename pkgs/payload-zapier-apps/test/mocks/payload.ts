// Mock for payload CollectionConfig type
export interface CollectionConfig {
  slug: string
  fields: Array<{
    name: string
    type: string
    required?: boolean
    relationTo?: string | string[]
    fields?: Array<{
      name: string
      type: string
      required?: boolean
      relationTo?: string | string[]
    }>
  }>
  admin?: {
    useAsTitle?: string
  }
}
