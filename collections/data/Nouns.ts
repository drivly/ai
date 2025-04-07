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
    { name: 'possessive', type: 'text', admin: { description: "Possessive form like User's" } },
    { name: 'pluralPossessive', type: 'text', admin: { description: "Plural possessive form like Users'" } },
    { name: 'verb', type: 'text', admin: { description: 'Related verb like Use' } },
    { name: 'act', type: 'text', admin: { description: 'Third person singular present tense like Uses' } },
    { name: 'activity', type: 'text', admin: { description: 'Gerund like Using' } },
    { name: 'event', type: 'text', admin: { description: 'Past tense like Used' } },
    { name: 'type', type: 'relationship', relationTo: ['things'], hasMany: true },
    { name: 'resources', type: 'join', collection: 'resources', on: 'type' },
  ],
}
