import { waitUntil } from '@vercel/functions'
import type { CollectionConfig } from 'payload'

export const Nouns: CollectionConfig = {
  slug: 'nouns',
  admin: {
    group: 'Data',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    { name: 'name', type: 'text' },
    { name: 'singular', type: 'text', admin: { description: 'Singular form like User' } },
    { name: 'plural', type: 'text', admin: { description: 'Plural form like Users' } },
    { name: 'possessive', type: 'text', admin: { description: 'Possessive form like User\'s' } },
    { name: 'pluralPossessive', type: 'text', admin: { description: 'Plural possessive form like Users\'' } },
    { name: 'verb', type: 'text', admin: { description: 'Related verb like Use' } },
    { name: 'act', type: 'text', admin: { description: 'Third person singular present tense like Uses' } },
    { name: 'activity', type: 'text', admin: { description: 'Gerund like Using' } },
    { name: 'event', type: 'text', admin: { description: 'Past tense like Used' } },
    { name: 'resources', type: 'join', collection: 'resources', on: 'type' },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (data.name && (!data.singular || !data.plural || !data.possessive || !data.pluralPossessive || 
            !data.verb || !data.act || !data.activity || !data.event)) {
          try {
            const { payload } = req
            
            const jobResult = await payload.jobs.queue({
              task: 'executeFunction',
              input: {
                functionName: 'inflectNouns',
                args: { noun: data.name }
              }
            })
            
            console.log('Queued noun semantics job:', jobResult)
            waitUntil(payload.jobs.runByID({ id: jobResult.id }))
          } catch (error) {
            console.error('Error processing noun semantics:', error)
          }
        }
        return data
      }
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create' || operation === 'update') {
          if (doc.name && (!doc.singular || !doc.plural || !doc.possessive || !doc.pluralPossessive || 
              !doc.verb || !doc.act || !doc.activity || !doc.event)) {
            try {
              const { payload } = req
              
              const jobResult = await payload.jobs.queue({
                task: 'executeFunction',
                input: {
                  functionName: 'inflectNouns',
                  args: { noun: doc.name }
                }
              })
              
              console.log('Noun semantics job result:', jobResult)
              waitUntil(payload.jobs.runByID({ id: jobResult.id }))
              
              const updateData: Record<string, string> = {}
              
              if (!doc.singular) updateData.singular = doc.name
              if (!doc.plural) updateData.plural = `${doc.name}s`
              if (!doc.possessive) updateData.possessive = `${doc.name}'s`
              if (!doc.pluralPossessive) updateData.pluralPossessive = `${doc.name}s'`
              if (!doc.verb) updateData.verb = doc.name.toLowerCase()
              if (!doc.act) updateData.act = `${doc.name.toLowerCase()}s`
              if (!doc.activity) updateData.activity = `${doc.name.toLowerCase()}ing`
              if (!doc.event) updateData.event = `${doc.name.toLowerCase()}ed`
              
              if (Object.keys(updateData).length > 0) {
                try {
                  const existingDoc = await payload.findByID({
                    collection: 'nouns',
                    id: doc.id,
                  })
                  
                  if (existingDoc) {
                    await payload.update({
                      collection: 'nouns',
                      id: doc.id,
                      data: updateData
                    })
                    console.log('Updated noun with semantic values:', updateData)
                  } else {
                    console.log('Document not found for update, will be handled by beforeChange hook on next edit')
                  }
                } catch (updateError) {
                  console.error('Error updating noun with semantic values:', updateError)
                }
              }
            } catch (error) {
              console.error('Error processing noun semantics in afterChange:', error)
            }
          }
        }
      }
    ]
  }
}
