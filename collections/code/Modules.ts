import type { CollectionConfig } from 'payload'

export const Modules: CollectionConfig = {
  slug: 'modules',
  admin: {
    group: 'Code',
    useAsTitle: 'name',
    description: 'Manages code modules that can be imported and used in functions',
  },
  versions: true,
  fields: [{ name: 'name', type: 'text' }],
}
