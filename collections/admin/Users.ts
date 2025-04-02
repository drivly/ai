import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    group: 'Admin',
    useAsTitle: 'email',
  },
  auth: { tokenExpiration: 60 * 60 * 24 * 30, useAPIKey: true, disableLocalStrategy: true },
  fields: [
    // Email added by default
    //     {
    //       name: 'roles',
    //       type: 'relationship',
    //       relationTo: 'roles',
    //       hasMany: true,
    //     },
    //     {
    //       name: 'tasks',
    //       type: 'relationship',
    //       relationTo: 'tasks',
    //       hasMany: true,
    //     },
  ],
}
