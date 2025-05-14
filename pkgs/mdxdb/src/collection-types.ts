/**
 * Collection field types
 */
export type FieldType = 
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'password'
  | 'checkbox'
  | 'select'
  | 'relationship'
  | 'array'
  | 'group'
  | 'blocks'
  | 'date'
  | 'upload'
  | 'richText'
  | 'json'
  | 'code'
  | 'point'
  | 'radio'
  | 'row'
  | 'collapsible'
  | 'tabs'
  | 'ui'

/**
 * Collection field definition
 */
export interface CollectionField {
  name: string
  type: FieldType
  required?: boolean
  unique?: boolean
  index?: boolean
  defaultValue?: any
  label?: string
  admin?: {
    description?: string
    readOnly?: boolean
    hidden?: boolean
    useAsTitle?: boolean
    [key: string]: any
  }
  relationTo?: string | string[]
  options?: string[] | { label: string; value: string }[]
  [key: string]: any
}

/**
 * Collection authentication options
 */
export interface CollectionAuthConfig {
  tokenExpiration?: number
  verify?: boolean
  maxLoginAttempts?: number
  lockTime?: number
  useAPIKey?: boolean
  [key: string]: any
}

/**
 * Collection admin options
 */
export interface CollectionAdminConfig {
  useAsTitle?: string
  defaultColumns?: string[]
  description?: string
  listSearchableFields?: string[]
  [key: string]: any
}

/**
 * Collection configuration
 */
export interface CollectionConfig {
  slug: string
  fields: CollectionField[]
  auth?: CollectionAuthConfig
  admin?: CollectionAdminConfig
  hooks?: any
  access?: any
  endpoints?: any
  versions?: any
  [key: string]: any
}
