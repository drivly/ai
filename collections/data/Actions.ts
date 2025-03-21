import type { CollectionConfig } from 'payload'

export const Actions: CollectionConfig = {
  slug: 'actions',
  admin: {
    group: 'Data',
    useAsTitle: 'verb',
    // useAsTitle: 'function',
  },
  versions: true,
  fields: [
    { name: 'subject', type: 'relationship', relationTo: 'resources' },
    { name: 'verb', type: 'relationship', relationTo: 'functions' },
    { name: 'object', type: 'relationship', relationTo: 'resources' },
    // { name: 'input', type: 'relationship', relationTo: 'resources' },
    // { name: 'function', type: 'relationship', relationTo: 'functions' },
    // { name: 'output', type: 'relationship', relationTo: 'resources' },
    { name: 'generation', type: 'join', collection: 'generations', on: 'action' },
  ],
}