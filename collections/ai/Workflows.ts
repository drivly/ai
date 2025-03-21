import type { CollectionConfig } from 'payload'

export const Workflows: CollectionConfig = {
  slug: 'workflows',
  admin: {
    group: 'AI',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    { name: 'name', type: 'text' },
    { name: 'type', type: 'code', admin: { language: 'typescript' } },
    { name: 'code', type: 'code', admin: { language: 'typescript' } },
    { name: 'functions', type: 'relationship', relationTo: 'functions' },
    { name: 'module', type: 'relationship', relationTo: 'modules' },
    { name: 'package', type: 'relationship', relationTo: 'packages' },
    { name: 'deployment', type: 'relationship', relationTo: 'deployments' },
  ],
}
