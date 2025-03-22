import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    group: 'Admin',
    useAsTitle: 'email',
  },
  auth: { tokenExpiration: 60 * 60 * 24 * 30, useAPIKey: true },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
