import type { CollectionConfig } from 'payload'

export const Apps: CollectionConfig = {
  slug: 'apps',
  admin: {
    group: 'Admin',
    useAsTitle: 'name',
  },
  auth: { useAPIKey: true },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
