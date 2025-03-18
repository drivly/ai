import type { CollectionConfig } from 'payload'

export const Functions: CollectionConfig = {
  slug: 'functions',
  admin: {
    group: 'Functions',
    useAsTitle: 'name',
  },
  fields: [
    { name: 'name', type: 'text' },
  ],
}
