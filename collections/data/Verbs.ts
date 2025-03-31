import type { CollectionConfig } from 'payload'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const Verbs: CollectionConfig = {
  slug: 'verbs',
  admin: {
    group: 'Data',
    useAsTitle: 'action',
  },
  versions: true,
  fields: [
    // { name: 'actions', type: 'join', collection: 'actions', on: 'verb' },
    { name: 'action', type: 'text', admin: { description: 'Active tense like Create', position: 'sidebar' } },
    { name: 'act', type: 'text', admin: { description: 'Third person singular present tense like Creates', position: 'sidebar' } },
    { name: 'activity', type: 'text', admin: { description: 'Gerund like Creating', position: 'sidebar' } },
    { name: 'event', type: 'text', admin: { description: 'Past tense like Created', position: 'sidebar' } },
    { name: 'subject', type: 'text', admin: { description: 'Subject like Creator', position: 'sidebar' } },
    { name: 'object', type: 'text', admin: { description: 'Object like Creation', position: 'sidebar' } },
    { name: 'inverse', type: 'text', admin: { description: 'Opposite like Destroy', position: 'sidebar' } },
    { name: 'inverseAct', type: 'text', admin: { description: 'Third person singular present tense like Destroys', position: 'sidebar' } },
    { name: 'inverseActivity', type: 'text', admin: { description: 'Gerund like Destroying', position: 'sidebar' } },
    { name: 'inverseEvent', type: 'text', admin: { description: 'Past tense like Destroyed', position: 'sidebar' } },
    { name: 'inverseSubject', type: 'text', admin: { description: 'Subject like Destroyer', position: 'sidebar' } },
    { name: 'inverseObject', type: 'text', admin: { description: 'Object like Destruction', position: 'sidebar' } },
    { name: 'actions', type: 'join', collection: 'actions', on: 'verb' },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (data.action && (!data.act || !data.activity || !data.event || !data.subject || !data.object || 
            !data.inverse || !data.inverseAct || !data.inverseActivity || !data.inverseEvent || 
            !data.inverseSubject || !data.inverseObject)) {
          try {
            const payload = await getPayload({ config })
            
            const jobResult = await payload.jobs.queue({
              task: 'executeFunction',
              input: {
                functionName: 'conjugateVerbs',
                args: { verb: data.action }
              }
            })
            
            console.log('Queued verb semantics job:', jobResult)
          } catch (error) {
            console.error('Error processing verb semantics:', error)
          }
        }
        return data
      }
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create' || operation === 'update') {
          if (doc.action && (!doc.act || !doc.activity || !doc.event || !doc.subject || !doc.object || 
              !doc.inverse || !doc.inverseAct || !doc.inverseActivity || !doc.inverseEvent || 
              !doc.inverseSubject || !doc.inverseObject)) {
            try {
              const payload = req.payload
              
              const jobResult = await payload.jobs.queue({
                task: 'executeFunction',
                input: {
                  functionName: 'conjugateVerbs',
                  args: { verb: doc.action }
                }
              })
              
              console.log('Verb semantics job result:', jobResult)
              
              const updateData: Record<string, string> = {}
              
              if (!doc.act) updateData.act = `${doc.action}s`
              if (!doc.activity) updateData.activity = `${doc.action}ing`
              if (!doc.event) updateData.event = `${doc.action}ed`
              if (!doc.subject) updateData.subject = `${doc.action}er`
              if (!doc.object) updateData.object = `${doc.action}ion`
              if (!doc.inverse) updateData.inverse = `Un${doc.action}`
              if (!doc.inverseAct) updateData.inverseAct = `Un${doc.action}s`
              if (!doc.inverseActivity) updateData.inverseActivity = `Un${doc.action}ing`
              if (!doc.inverseEvent) updateData.inverseEvent = `Un${doc.action}ed`
              if (!doc.inverseSubject) updateData.inverseSubject = `Un${doc.action}er`
              if (!doc.inverseObject) updateData.inverseObject = `Un${doc.action}ion`
              
              if (Object.keys(updateData).length > 0) {
                await payload.update({
                  collection: 'verbs',
                  id: doc.id,
                  data: updateData
                })
              }
            } catch (error) {
              console.error('Error processing verb semantics in afterChange:', error)
            }
          }
        }
      }
    ]
  }
}

// conjugateVerbs: {
//   action: 'active tense like Create',
//   act: 'third person singular present tense like Creates',
//   activity: 'gerund like Creating',
//   event: 'past tense like Created',
//   subject: 'subject like Creator',
//   object: 'object like Creation',
//   inverse: 'opposite like Destroy',
//   inverseAct: 'third person singular present tense like Destroys',
//   inverseActivity: 'gerund like Destroying',
//   inverseEvent: 'past tense like Destroyed',
//   inverseSubject: 'subject like Destroyer',
//   inverseObject: 'object like Destruction',
// },
