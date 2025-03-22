import type { CollectionConfig } from 'payload'

export const Actions: CollectionConfig = {
  slug: 'actions',
  admin: {
    group: 'Events',
    useAsTitle: 'verb',
    // useAsTitle: 'function',
  },
  versions: true,
  fields: [
    { name: 'subject', type: 'relationship', relationTo: 'things' },
    { name: 'verb', type: 'relationship', relationTo: 'verbs' },
    // { name: 'function', type: 'join', collection: 'functions', on: 'function' },
    { name: 'object', type: 'relationship', relationTo: 'things' },
    // { name: 'input', type: 'relationship', relationTo: 'resources' },
    // { name: 'function', type: 'relationship', relationTo: 'functions' },
    // { name: 'output', type: 'relationship', relationTo: 'resources' },
    { name: 'generation', type: 'join', collection: 'generations', on: 'action' },
  ],
}
