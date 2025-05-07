import { CollectionConfig } from 'payload/types'

/**
 * Types collection definition (replacing Nouns and Verbs)
 */
export const Types: CollectionConfig = {
  slug: 'types',
  fields: [
    { name: 'name', type: 'text' },
    { name: 'description', type: 'text' },
    { name: 'schema', type: 'json' },
    { name: 'hash', type: 'text', admin: { readOnly: true }, index: true },
    { name: 'singular', type: 'text', admin: { description: 'Singular form like User' } },
    { name: 'plural', type: 'text', admin: { description: 'Plural form like Users' } },
    { name: 'action', type: 'text', admin: { description: 'Active tense like Create' } },
    { name: 'activity', type: 'text', admin: { description: 'Gerund like Creating' } },
  ],
}

/**
 * Resources collection definition
 */
export const Resources: CollectionConfig = {
  slug: 'resources',
  fields: [
    { name: 'name', type: 'text' },
    { name: 'description', type: 'text' },
    { name: 'sqid', type: 'text', admin: { readOnly: true }, index: true },
    { name: 'hash', type: 'text', admin: { readOnly: true }, index: true },
    { name: 'type', type: 'relationship', relationTo: ['types'] },
    { name: 'data', type: 'json' },
    { name: 'embedding', type: 'json', admin: { hidden: true }, index: false },
    { name: 'content', type: 'richText' },
  ],
}

/**
 * Relationships collection definition
 */
export const Relationships: CollectionConfig = {
  slug: 'relationships',
  fields: [
    { name: 'subject', type: 'relationship', relationTo: 'resources' },
    { name: 'verb', type: 'relationship', relationTo: 'types' },
    { name: 'object', type: 'relationship', relationTo: 'resources' },
    { name: 'hash', type: 'text' },
  ],
}

/**
 * Users collection definition
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 60 * 60 * 24 * 30, // 30 days
    useAPIKey: true,
  },
  admin: {
    useAsTitle: 'email',
    description: 'Manages user accounts and their associated roles',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'text',
      required: false,
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'user',
      options: ['user', 'admin', 'superAdmin'],
      required: true,
    },
    {
      name: 'emailVerified',
      type: 'checkbox',
      defaultValue: false,
      required: true,
    },
  ],
}

/**
 * Collection configs for Payload CMS
 */
export const collections = {
  types: Types,
  resources: Resources,
  relationships: Relationships,
  users: Users,
}
