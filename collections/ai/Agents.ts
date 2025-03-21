import type { CollectionConfig } from 'payload'

export const Agents: CollectionConfig = {
  slug: 'agents',
  admin: {
    group: 'AI',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [{ name: 'name', type: 'text' }],
}
