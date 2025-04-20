import type { CollectionConfig } from 'payload'

export const Waitlist: CollectionConfig = {
  slug: 'waitlist',
  admin: {
    group: 'Admin',
    useAsTitle: 'email',
    description: 'Manages waitlist email submissions',
  },
  fields: [
    { name: 'email', type: 'email', required: true },
    { name: 'domain', type: 'text', required: true },
    {
      name: 'createdAt',
      type: 'date',
      admin: { readOnly: true },
    },
    {
      name: 'status',
      type: 'select',
      options: ['pending', 'contacted', 'converted'],
      defaultValue: 'pending',
    },
    { name: 'notes', type: 'textarea' },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        return {
          ...data,
          createdAt: data.createdAt || new Date(),
        }
      },
    ],
  },
}
