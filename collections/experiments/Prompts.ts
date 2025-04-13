import type { CollectionConfig } from 'payload'

export const Prompts: CollectionConfig = {
  slug: 'prompts',
  admin: {
    group: 'Experiments',
    useAsTitle: 'name',
    description: 'Manages prompt templates for AI model interactions',
  },
  fields: [{ name: 'name', type: 'text' }],
}
