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
    beforeChange: [
      async ({ data, req }) => {
        if (data.searchType === 'vector' || data.searchType === 'hybrid') {
          try {
            const { generateEmbedding } = await import('../../tasks/generateEmbedding')
            
            if (data.query) {
              const embedding = await generateEmbedding(data.query)
              data.embedding = embedding
            }
          } catch (error) {
            console.error('Error generating embedding for search:', error)
          }
        }
        
        return data
      }
    ],
    afterChange: [
      async ({ doc, req }) => {
        try {
          if (doc.searchType === 'vector') {
            const { searchThings } = await import('../../tasks/searchThings')
            
            const results = await searchThings(doc.query)
            
            const { initializePayloadDB } = await import('../../lib/db')
            const db = await initializePayloadDB()
            
            await db.searches.update(doc.id, { results })
          } else if (doc.searchType === 'hybrid') {
            const { hybridSearchThings } = await import('../../tasks/searchThings')
            
            const results = await hybridSearchThings(doc.query)
            
            const { initializePayloadDB } = await import('../../lib/db')
            const db = await initializePayloadDB()
            
            await db.searches.update(doc.id, { results })
          }
        } catch (error) {
          console.error('Error performing search:', error)
        }
        
        return doc
      }
    ]
  }
}
