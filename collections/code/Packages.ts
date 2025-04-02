import type { CollectionConfig } from 'payload'

export const Packages: CollectionConfig = {
  slug: 'packages',
  admin: {
    group: 'Code',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    { name: 'name', type: 'text' },
    { 
      name: 'package',
      type: 'json',
      admin: {
        description: 'The package.json content for publishing to NPM',
      },
    },
    {
      name: 'collections',
      type: 'array',
      admin: {
        description: 'Collections to include in this package',
      },
      fields: [
        {
          name: 'items',
          type: 'text',
          admin: {
            description: 'Collection slug to include',
          },
        },
      ],
    },
  ],
}
