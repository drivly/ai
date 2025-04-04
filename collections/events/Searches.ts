import { waitUntil } from '@vercel/functions'
import type { CollectionConfig } from 'payload'

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
    afterChange: [
      async ({ doc, req }) => {
        try {
          const { payload } = req
          
          if (doc.searchType === 'vector') {
            console.log(`Processing vector search for: ${doc.query}`)
          } else if (doc.searchType === 'hybrid') {
            console.log(`Processing hybrid search for: ${doc.query}`)
          }
        } catch (error) {
          console.error('Error processing search task:', error)
        }
        
        return doc
      }
    ]
  }
}
