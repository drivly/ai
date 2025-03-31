import type { CollectionConfig } from 'payload'
import { getPayload } from 'payload'
import config from '@/payload.config'

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
    { name: 'things', type: 'join', collection: 'things', on: 'type' },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (data.name && (!data.singular || !data.plural || !data.possessive || !data.pluralPossessive || 
            !data.verb || !data.act || !data.activity || !data.event)) {
          try {
            const payload = await getPayload({ config })
            
            const jobResult = await payload.jobs.queue({
              task: 'executeFunction',
              input: {
                functionName: 'inflectNouns',
                args: { noun: data.name },
                schema: {
                  singular: 'string',
                  plural: 'string',
                  possessive: 'string',
                  pluralPossessive: 'string',
                  verb: 'string',
                  act: 'string',
                  activity: 'string',
                  event: 'string'
                }
              }
            })
            
            console.log('Queued noun semantics job:', jobResult)
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
              const payload = req.payload
              
              const jobResult = await payload.jobs.queue({
                task: 'executeFunction',
                input: {
                  functionName: 'inflectNouns',
                  args: { noun: doc.name }
                }
              })
              
              console.log('Noun semantics job result:', jobResult)
              
              await payload.update({
                collection: 'nouns',
                id: doc.id,
                data: {
                  singular: doc.singular || doc.name,
                  plural: doc.plural || `${doc.name}s`,
                  possessive: doc.possessive || `${doc.name}'s`,
                  pluralPossessive: doc.pluralPossessive || `${doc.name}s'`,
                  verb: doc.verb || doc.name.toLowerCase(),
                  act: doc.act || `${doc.name.toLowerCase()}s`,
                  activity: doc.activity || `${doc.name.toLowerCase()}ing`,
                  event: doc.event || `${doc.name.toLowerCase()}ed`
                }
              })
            } catch (error) {
              console.error('Error processing noun semantics in afterChange:', error)
            }
          }
        }
      }
    ]
  }
}
