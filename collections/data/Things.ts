import type { CollectionConfig } from 'payload'

export const Things: CollectionConfig = {
  slug: 'things',
  admin: {
    group: 'Data',
    hidden: true,
    description: 'Defines semantic types with their various grammatical forms',
  },
  versions: true,
  fields: [
    { name: 'name', type: 'text' },
    { name: 'singular', type: 'text', admin: { description: 'Singular form' } },
    { name: 'plural', type: 'text', admin: { description: 'Plural form' } },
    { name: 'possessive', type: 'text', admin: { description: 'Possessive form' } },
    { name: 'pluralPossessive', type: 'text', admin: { description: 'Plural possessive form' } },
    { name: 'verb', type: 'text', admin: { description: 'Related verb' } },
    { name: 'act', type: 'text', admin: { description: 'Third person singular present tense' } },
    { name: 'activity', type: 'text', admin: { description: 'Gerund' } },
    { name: 'event', type: 'text', admin: { description: 'Past tense' } },
    { name: 'resources', type: 'join', collection: 'resources', on: 'type' },
  ],
}
