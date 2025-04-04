import type { CollectionConfig } from 'payload'

export const Roles: CollectionConfig = {
  slug: 'roles',
  admin: {
    group: 'Admin',
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'superAdmin',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Grant super admin privileges to users with this role',
      },
    },
    // {
    //   name: 'users',
    //   type: 'relationship',
    //   relationTo: 'users',
    //   hasMany: true,
    // },
  ],
}
