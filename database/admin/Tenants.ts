import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    group: 'Admin',
    useAsTitle: 'name',
  },
  fields: [
    { name: 'name', type: 'text' },
    { name: 'domain', type: 'text' },
  ],
}
