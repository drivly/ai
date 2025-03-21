import type { CollectionConfig } from 'payload'

export const Prompts: CollectionConfig = {
  slug: 'prompts',
  admin: {
    group: 'Evals',
    useAsTitle: 'name',
  },
  fields: [{ name: 'name', type: 'text' }],
}
