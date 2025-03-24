import fetch from 'node-fetch'
import { fileURLToPath } from 'url'
import { getPayloadClient } from '../lib/getPayload/index.js'

const SCHEMA_ORG_URL = 'https://schema.org/version/latest/schemaorg-current-https.jsonld'

interface SchemaOrgData {
  '@graph': Array<{
    '@type': string
    '@id': string
    'rdfs:subClassOf'?: {
      '@id': string
    } | Array<{ '@id': string }>
  }>
}

interface Verb {
  action: string
  act?: string
  activity?: string
  event?: string
  subject?: string
  object?: string
  inverse?: string
  inverseAct?: string
  inverseActivity?: string
  inverseEvent?: string
  inverseSubject?: string
  inverseObject?: string
}

export const extractNounsAndVerbs = (data: SchemaOrgData) => {
  const nouns: string[] = []
  const verbs: Verb[] = []

  // Process each class in the schema
  data['@graph'].forEach(item => {
    if (item['@type'] === 'rdfs:Class' && item['@id'].startsWith('schema:')) {
      const name = item['@id'].replace('schema:', '')
      
      // Check if this class inherits from Thing
      const inheritsFromThing = checkInheritsFromThing(item, data)
      
      if (inheritsFromThing) {
        if (name.endsWith('Action')) {
          // This is a verb (action)
          const action = name.replace('Action', '')
          const verbForms = conjugateVerb(action)
          verbs.push({ 
            action,
            ...verbForms
          })
        } else {
          // This is a noun
          nouns.push(name)
        }
      }
    }
  })

  return { nouns, verbs }
}

// Helper function to conjugate verbs and generate related forms
const conjugateVerb = (action: string): Omit<Verb, 'action'> => {
  // Basic rules for English verb conjugation
  // These are simplified and won't work perfectly for all verbs
  
  // Handle some common irregular verbs
  const irregularVerbs: Record<string, Partial<Omit<Verb, 'action'>>> = {
    'Create': {
      act: 'Creates',
      activity: 'Creating',
      event: 'Created',
      subject: 'Creator',
      object: 'Creation',
      inverse: 'Destroy',
      inverseAct: 'Destroys',
      inverseActivity: 'Destroying',
      inverseEvent: 'Destroyed',
      inverseSubject: 'Destroyer',
      inverseObject: 'Destruction'
    },
    'Read': {
      act: 'Reads',
      activity: 'Reading',
      event: 'Read',
      subject: 'Reader',
      object: 'Reading',
      inverse: 'Write',
      inverseAct: 'Writes',
      inverseActivity: 'Writing',
      inverseEvent: 'Wrote',
      inverseSubject: 'Writer',
      inverseObject: 'Writing'
    },
    'Update': {
      act: 'Updates',
      activity: 'Updating',
      event: 'Updated',
      subject: 'Updater',
      object: 'Update',
      inverse: 'Revert',
      inverseAct: 'Reverts',
      inverseActivity: 'Reverting',
      inverseEvent: 'Reverted',
      inverseSubject: 'Reverter',
      inverseObject: 'Reversion'
    },
    'Delete': {
      act: 'Deletes',
      activity: 'Deleting',
      event: 'Deleted',
      subject: 'Deleter',
      object: 'Deletion',
      inverse: 'Restore',
      inverseAct: 'Restores',
      inverseActivity: 'Restoring',
      inverseEvent: 'Restored',
      inverseSubject: 'Restorer',
      inverseObject: 'Restoration'
    }
  }
  
  // Return irregular verb conjugation if available
  if (irregularVerbs[action]) {
    return irregularVerbs[action] as Omit<Verb, 'action'>
  }
  
  // Regular verb conjugation rules
  let act = action
  let activity = action
  let event = action
  let subject = action + 'er'
  let object = action
  
  // Third person singular present (act)
  if (action.endsWith('s') || action.endsWith('x') || action.endsWith('z') || 
      action.endsWith('ch') || action.endsWith('sh')) {
    act = action + 'es'
  } else if (action.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(action.charAt(action.length - 2))) {
    act = action.slice(0, -1) + 'ies'
  } else {
    act = action + 's'
  }
  
  // Gerund (activity)
  if (action.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(action.charAt(action.length - 2))) {
    // Words ending in consonant + y: Study -> Studying
    activity = action + 'ing'
  } else if (action.endsWith('e') && !action.endsWith('ee')) {
    activity = action.slice(0, -1) + 'ing'
  } else if (action.length > 2 && 
             !['a', 'e', 'i', 'o', 'u'].includes(action.charAt(action.length - 2)) && 
             ['a', 'e', 'i', 'o', 'u'].includes(action.charAt(action.length - 3)) &&
             !['a', 'e', 'i', 'o', 'u'].includes(action.charAt(action.length - 1))) {
    activity = action + action.charAt(action.length - 1) + 'ing'
  } else {
    activity = action + 'ing'
  }
  
  // Past tense (event)
  if (action.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(action.charAt(action.length - 2))) {
    // Words ending in consonant + y: Study -> Studied
    event = action.slice(0, -1) + 'ied'
  } else if (action.endsWith('e') && !action.endsWith('ee')) {
    event = action + 'd'
  } else if (action.length > 2 && 
             !['a', 'e', 'i', 'o', 'u'].includes(action.charAt(action.length - 2)) && 
             ['a', 'e', 'i', 'o', 'u'].includes(action.charAt(action.length - 3)) &&
             !['a', 'e', 'i', 'o', 'u'].includes(action.charAt(action.length - 1))) {
    event = action + action.charAt(action.length - 1) + 'ed'
  } else {
    event = action + 'ed'
  }
  
  // Subject
  if (action.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(action.charAt(action.length - 2))) {
    // Words ending in consonant + y: Study -> Studier
    subject = action.slice(0, -1) + 'ier'
  } else if (action.endsWith('e')) {
    subject = action + 'r'
  } else {
    subject = action + 'er'
  }
  
  // Object
  if (action.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(action.charAt(action.length - 2))) {
    // Words ending in consonant + y: Study -> Studication
    object = action.slice(0, -1) + 'ication'
  } else if (action.endsWith('e')) {
    object = action.slice(0, -1) + 'ation'
  } else {
    object = action + 'ation'
  }
  
  // For simplicity, we're not generating inverse forms automatically
  // as that would require a more sophisticated understanding of semantics
  
  return {
    act,
    activity,
    event,
    subject,
    object
  }
}

// Helper function to check if a class inherits from Thing
const checkInheritsFromThing = (
  item: { '@id': string; 'rdfs:subClassOf'?: { '@id': string } | Array<{ '@id': string }> },
  data: SchemaOrgData
): boolean => {
  // If this is Thing itself, return true
  if (item['@id'] === 'schema:Thing') {
    return true
  }

  // If no subclass information, return false
  if (!item['rdfs:subClassOf']) {
    return false
  }

  // Handle both single and array subclass definitions
  const subClasses = Array.isArray(item['rdfs:subClassOf']) 
    ? item['rdfs:subClassOf'] 
    : [item['rdfs:subClassOf']]

  // Check each parent class
  for (const subClass of subClasses) {
    const parentId = subClass['@id']
    
    // Direct inheritance from Thing
    if (parentId === 'schema:Thing') {
      return true
    }
    
    // Recursive check for inheritance through parent
    const parentItem = data['@graph'].find(graphItem => graphItem['@id'] === parentId)
    if (parentItem && checkInheritsFromThing(parentItem, data)) {
      return true
    }
  }

  return false
}

const seedDatabase = async () => {
  try {
    console.log('Fetching Schema.org data...')
    const response = await fetch(SCHEMA_ORG_URL)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Schema.org data: ${response.statusText}`)
    }
    
    const data = await response.json() as SchemaOrgData
    console.log('Successfully fetched Schema.org data')
    
    const { nouns, verbs } = extractNounsAndVerbs(data)
    console.log(`Extracted ${nouns.length} nouns and ${verbs.length} verbs`)
    
    // Initialize Payload
    console.log('Initializing Payload...')
    const payload = await getPayloadClient({})
    
    // Seed Nouns
    console.log('Seeding Nouns...')
    for (const noun of nouns) {
      try {
        await payload.create({
          collection: 'nouns',
          data: {
            name: noun,
          },
        })
        console.log(`Created noun: ${noun}`)
      } catch (error) {
        console.error(`Error creating noun ${noun}:`, error)
      }
    }
    
    // Seed Verbs
    console.log('Seeding Verbs...')
    for (const verb of verbs) {
      try {
        await payload.create({
          collection: 'verbs',
          data: {
            action: verb.action,
            // Other verb properties can be added here
          },
        })
        console.log(`Created verb: ${verb.action}`)
      } catch (error) {
        console.error(`Error creating verb ${verb.action}:`, error)
      }
    }
    
    console.log('Database seeding completed successfully')
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

// Run the seed function if this script is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase()
}