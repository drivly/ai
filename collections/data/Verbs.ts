import type { CollectionConfig } from 'payload'

export const Verbs: CollectionConfig = {
  slug: 'verbs',
  admin: {
    group: 'Data',
    useAsTitle: 'action',
    description: 'Defines action verbs and their conjugations for semantic relationships',
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
    // { name: 'actions', type: 'join', collection: 'actions', on: 'verbId' },
  ],
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
