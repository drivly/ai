import { waitUntil } from '@vercel/functions'
import type { CollectionConfig } from 'payload'
import { on } from '../../pkgs/payload-hooks-queue/src'

export const Searches: CollectionConfig = {
  slug: 'searches',
  admin: {
    group: 'Events',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    { name: 'name', type: 'text' },
    { name: 'query', type: 'text' },
    { 
      name: 'searchType', 
      type: 'select', 
      options: [
        { label: 'Text', value: 'text' },
        { label: 'Vector', value: 'vector' },
        { label: 'Hybrid', value: 'hybrid' }
      ],
      defaultValue: 'text'
    },
    { name: 'results', type: 'json', admin: { readOnly: true } },
    { name: 'embedding', type: 'json', admin: { hidden: true } }
  ],
  hooks: {
    ...on('beforeChange', {
      slug: 'executeFunction',
      input: {
        functionName: 'generateEmbedding',
        args: { query: 'data.query' }
      },
      condition: 'data.searchType === "vector" || data.searchType === "hybrid"'
    }),
    ...on('afterChange', [
      {
        slug: 'searchThings',
        input: {
          query: 'doc.query',
          limit: 10
        },
        condition: 'doc.searchType === "vector"'
      },
      {
        slug: 'hybridSearchThings',
        input: {
          query: 'doc.query',
          limit: 10
        },
        condition: 'doc.searchType === "hybrid"'
      }
    ])
  }
}
