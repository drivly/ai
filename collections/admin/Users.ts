import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    group: 'Admin',
    useAsTitle: 'email',
  },
  auth: { tokenExpiration: 60 * 60 * 24 * 30, useAPIKey: true, disableLocalStrategy: process.env.NODE_ENV === 'development' ? undefined : true },
  fields: [
    {
      name: 'roles',
      type: 'relationship',
      relationTo: 'roles',
      hasMany: true,
      admin: {
        description: 'User roles for permissions and access control',
      },
    },
  ],
}
