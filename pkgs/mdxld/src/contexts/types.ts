export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

export interface JsonLdContext extends Record<string, JsonValue | undefined> {
  '@context'?: Record<string, JsonValue>
  '@vocab'?: string
  '@type'?: string
  '@id'?: string
  '@base'?: string
  '@container'?: string
  '@protected'?: boolean
}

export interface TransformedContext extends Record<string, JsonValue | undefined> {
  $context?: Record<string, JsonValue>
  $vocab?: string
}

export interface JsonLdContextDocument {
  '@context'?: Record<string, JsonValue>
  [key: string]: JsonValue | undefined
}
