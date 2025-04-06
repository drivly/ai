import type { CollectionConfig } from 'payload'

export const Webhooks: CollectionConfig = {
  slug: 'webhooks',
  admin: {
    group: 'Admin',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    { name: 'name', type: 'text' },
    { name: 'url', type: 'text', required: true },
    {
      name: 'filters',
      type: 'array',
      fields: [
        {
          name: 'pattern',
          type: 'text',
          required: true,
          admin: {
            description: 'Use Noun.Verb format (e.g., Listing.Created) or wildcards (e.g., Listing.* or *.Created)',
          },
        },
      ],
    },
    { name: 'enabled', type: 'checkbox', defaultValue: true },
    { name: 'secret', type: 'text' },
  ],
}
