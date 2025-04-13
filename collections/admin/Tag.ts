import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    group: 'Admin',
    useAsTitle: 'id',
    hidden: true,
    description: 'Manages tags for categorizing and organizing content',
  },
  versions: true,
  fields: [{ name: 'id', type: 'text' }],
}
