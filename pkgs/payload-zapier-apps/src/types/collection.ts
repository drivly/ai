/**
 * Simplified interface for collection configuration used in Zapier templates
 * This decouples the template code from specific Payload implementation details
 */
export interface ZapierCollectionConfig {
  /**
   * The slug of the collection
   */
  slug: string

  /**
   * The fields of the collection
   */
  fields?: ZapierField[]

  /**
   * Admin configuration
   */
  admin?: {
    useAsTitle?: string
  }
}

/**
 * Simplified interface for field configuration used in Zapier templates
 */
export interface ZapierField {
  /**
   * The name of the field
   */
  name?: string

  /**
   * The type of the field
   */
  type?: string

  /**
   * Whether the field is required
   */
  required?: boolean

  /**
   * For relationship fields, the collection to relate to
   */
  relationTo?: string | string[]

  /**
   * For array fields, the fields within the array
   */
  fields?: ZapierField[]
}
