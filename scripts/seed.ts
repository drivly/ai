import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { getPayload } from 'payload'
import config from '@/payload.config.ts'

// Function to fetch Schema.org JSONLD
export async function fetchSchemaOrgData() {
  try {
    console.log('Fetching Schema.org JSONLD data...')
    const response = await fetch('https://schema.org/version/latest/schemaorg-current-https.jsonld')
    const data = await response.json()
    console.log('Successfully fetched Schema.org data')
    return data
  } catch (error) {
    console.error('Error fetching Schema.org data:', error)
    throw error
  }
}

// Function to extract Nouns and Verbs from Schema.org data
export function extractNounsAndVerbs(data: any) {
  const nouns: Set<string> = new Set()
  const verbs: { action: string; type: string }[] = []

  // Extract @graph from the JSONLD
  const graph = data['@graph']

  if (!graph) {
    console.error('No @graph found in Schema.org data')
    return { nouns: [], verbs }
  }

  // Process each item in the graph
  graph.forEach((item: any) => {
    if (item['@type'] === 'rdfs:Class') {
      const typeName = item['@id'].replace('schema:', '')

      // If it ends with "Action", it's a verb
      if (typeName.endsWith('Action')) {
        // Extract the verb action from the type name (remove 'Action' suffix)
        const action = typeName.replace('Action', '')
        // Only add if we have a valid action name
        if (action && action.length > 0) {
          verbs.push({ action, type: typeName })
        }
      }
      // Otherwise it's a noun - we capture all class types as nouns, not just Thing subclasses
      else if (typeName && typeName.length > 0) {
        nouns.add(typeName)
      }
    }
  })

  return { nouns: Array.from(nouns), verbs }
}

// Function to seed the database
export async function seedDatabase() {
  try {
    console.log('Starting database seed process...')

    // Initialize Payload
    const payload = await getPayload({ config })

    // Fetch Schema.org data
    const schemaOrgData = await fetchSchemaOrgData()

    // Extract Nouns and Verbs
    const { nouns, verbs } = extractNounsAndVerbs(schemaOrgData)

    console.log(`Found ${nouns.length} nouns and ${verbs.length} verbs`)

    // Seed Nouns
    console.log('Seeding Nouns...')
    let nounsCreated = 0
    let nounsSkipped = 0

    for (const noun of nouns) {
      try {
        // Check if noun already exists
        const exists = await payload.find({
          collection: 'nouns',
          where: { name: { equals: noun } },
        })

        if (exists.docs.length > 0) {
          console.log(`Noun already exists: ${noun}`)
          nounsSkipped++
          continue
        }

        // Create if it doesn't exist
        await payload.create({
          collection: 'nouns',
          data: {
            name: noun,
          },
        })
        console.log(`Created noun: ${noun}`)
        nounsCreated++
      } catch (error) {
        console.error(`Error processing noun ${noun}:`, error)
      }
    }

    console.log(`Nouns: ${nounsCreated} created, ${nounsSkipped} skipped`)

    // Seed Verbs
    console.log('Seeding Verbs...')
    let verbsCreated = 0
    let verbsSkipped = 0

    for (const verb of verbs) {
      try {
        // Skip verbs with empty action
        if (!verb.action || verb.action.trim() === '') {
          console.log(`Skipping verb with empty action: ${verb.type}`)
          verbsSkipped++
          continue
        }

        // Check if verb already exists
        const exists = await payload.find({
          collection: 'verbs',
          where: { action: { equals: verb.action } },
        })

        if (exists.docs.length > 0) {
          console.log(`Verb already exists: ${verb.action}`)
          verbsSkipped++
          continue
        }

        // Basic verb form
        const action = verb.action

        // Generate other verb forms (simplified)
        const act = `${action}s`
        const activity = `${action}ing`
        const event = `${action}ed`
        const subject = `${action}er`
        const object = `${action}ion`

        await payload.create({
          collection: 'verbs',
          data: {
            action,
            act,
            activity,
            event,
            subject,
            object,
          },
        })
        console.log(`Created verb: ${action}`)
        verbsCreated++
      } catch (error) {
        console.error(`Error creating verb ${verb.action}:`, error)
      }
    }

    console.log(`Verbs: ${verbsCreated} created, ${verbsSkipped} skipped`)

    console.log('Database seeding completed successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
  }
}

// // Run the seed function if this script is executed directly
// import { fileURLToPath } from 'url'
// const currentFile = fileURLToPath(import.meta.url)
// const isMainModule = process.argv[1] === currentFile

// if (isMainModule) {
//   seedDatabase()
// }
