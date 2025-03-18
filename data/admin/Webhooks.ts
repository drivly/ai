import type { CollectionConfig } from 'payload'

export const Webhooks: CollectionConfig = {
  slug: 'webhooks',
  admin: {
    group: 'Admin',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [{ name: 'name', type: 'text' }],
}
