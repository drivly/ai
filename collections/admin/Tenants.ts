import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    group: 'Admin',
    useAsTitle: 'name',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true },
    { name: 'domain', type: 'text' },
    { name: 'domains', type: 'relationship', relationTo: 'domains' as any, hasMany: true },
  ],
}
