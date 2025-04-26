import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    group: 'Infrastructure',
    useAsTitle: 'name',
    description: 'Service Registry and Management for the .do ecosystem',
  },
  versions: true,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
            { label: 'Degraded', value: 'degraded' },
          ],
          defaultValue: 'active',
          required: true,
        },
      ],
    },
    { name: 'description', type: 'textarea' },
    { name: 'endpoint', type: 'text', required: true },
    { name: 'version', type: 'text' },
    { name: 'metadata', type: 'json', admin: { description: 'Additional metadata for the service' } },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        return data
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        try {
          return doc
        } catch (error) {
          console.error('Error in service afterChange hook:', error)
          return doc
        }
      },
    ],
  },
}
