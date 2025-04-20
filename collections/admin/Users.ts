import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    group: 'Admin',
    useAsTitle: 'email',
    description: 'Manages user accounts and their associated roles',
  },
  auth: { tokenExpiration: 60 * 60 * 24 * 30, useAPIKey: true },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'password',
      type: 'text',
      required: true,
      admin: {
        condition: () => false,
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'text',
      required: false,
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'user',
      options: ['user', 'admin', 'superAdmin'],
      required: true,
    },
    {
      name: 'emailVerified',
      type: 'checkbox',
      defaultValue: false,
      required: true,
    },
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
