import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { getPayload } from 'payload'
import config from '../payload.config'

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

export async function fetchOpenRouterModels() {
  try {
    console.log('Fetching OpenRouter models...')
    const response = await fetch('https://openrouter.ai/api/frontend/models/find')
    const data = await response.json()
    console.log('Successfully fetched OpenRouter models')
    return data
  } catch (error) {
    console.error('Error fetching OpenRouter models:', error)
    throw error
  }
}

export function extractNounsAndVerbs(data: any) {
  const nouns: Set<string> = new Set()
  const things: Set<string> = new Set()
  const verbs: { action: string; type: string }[] = []

  // Extract @graph from the JSONLD
  const graph = data['@graph']

  if (!graph) {
    console.error('No @graph found in Schema.org data')
    return { nouns: [], things: [], verbs }
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
      } else if (typeName && typeName.length > 0) {
        nouns.add(typeName)
        things.add(typeName)
      }
    }
  })

  return { nouns: Array.from(nouns), things: Array.from(things), verbs }
}

// Function to seed the database
export async function seedDatabase() {
  try {
    console.log('Starting database seed process...')

    // Initialize Payload
    const payload = await getPayload({ config })

    // Fetch Schema.org data
    const schemaOrgData = await fetchSchemaOrgData()

    const { nouns, things, verbs } = extractNounsAndVerbs(schemaOrgData)

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

    console.log('Seeding Things...')
    let thingsCreated = 0
    let thingsSkipped = 0

    for (const thing of things) {
      try {
        const exists = await payload.find({
          collection: 'nouns',
          where: { name: { equals: thing } },
        })

        if (exists.docs.length > 0) {
          console.log(`Thing already exists: ${thing}`)
          thingsSkipped++
          continue
        }

        // Create if it doesn't exist
        await payload.create({
          collection: 'nouns',
          data: {
            name: thing,
          },
        })
        console.log(`Created thing: ${thing}`)
        thingsCreated++
      } catch (error) {
        console.error(`Error processing thing ${thing}:`, error)
      }
    }

    console.log(`Things: ${thingsCreated} created, ${thingsSkipped} skipped`)

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

    console.log('Fetching OpenRouter models...')
    const openRouterData = await fetchOpenRouterModels()

    if (!openRouterData || !openRouterData.data) {
      console.error('No data returned from OpenRouter API')
      return
    }

    console.log(`Found ${openRouterData.data.length} models from OpenRouter`)

    const providers = new Map<string, any>()
    const labs = new Map<string, any>()

    openRouterData.data.forEach((model: any) => {
      if (model.provider && !providers.has(model.provider.id)) {
        providers.set(model.provider.id, model.provider)
      }

      if (model.lab && !labs.has(model.lab.id)) {
        labs.set(model.lab.id, model.lab)
      }
    })

    console.log('Seeding Providers...')
    let providersCreated = 0
    let providersSkipped = 0

    for (const [id, provider] of providers.entries()) {
      try {
        const exists = await payload.find({
          collection: 'providers' as any,
          where: { id: { equals: id } },
        })

        if (exists.docs.length > 0) {
          console.log(`Provider already exists: ${provider.name}`)
          providersSkipped++
          continue
        }

        // Create if it doesn't exist
        await payload.create({
          collection: 'providers' as any,
          data: {
            id,
            name: provider.name,
            description: provider.description || '',
            logoUrl: provider.logoUrl || '',
          },
        })
        console.log(`Created provider: ${provider.name}`)
        providersCreated++
      } catch (error) {
        console.error(`Error creating provider ${provider.name}:`, error)
      }
    }

    console.log(`Providers: ${providersCreated} created, ${providersSkipped} skipped`)

    console.log('Seeding Labs...')
    let labsCreated = 0
    let labsSkipped = 0

    for (const [id, lab] of labs.entries()) {
      try {
        const exists = await payload.find({
          collection: 'labs' as any,
          where: { id: { equals: id } },
        })

        if (exists.docs.length > 0) {
          console.log(`Lab already exists: ${lab.name}`)
          labsSkipped++
          continue
        }

        // Create if it doesn't exist
        await payload.create({
          collection: 'labs' as any,
          data: {
            id,
            name: lab.name,
            description: lab.description || '',
            logoUrl: lab.logoUrl || '',
          },
        })
        console.log(`Created lab: ${lab.name}`)
        labsCreated++
      } catch (error) {
        console.error(`Error creating lab ${lab.name}:`, error)
      }
    }

    console.log(`Labs: ${labsCreated} created, ${labsSkipped} skipped`)

    console.log('Seeding Models...')
    let modelsCreated = 0
    let modelsSkipped = 0

    for (const model of openRouterData.data) {
      try {
        const exists = await payload.find({
          collection: 'models',
          where: { id: { equals: model.id } },
        })

        if (exists.docs.length > 0) {
          console.log(`Model already exists: ${model.name}`)
          modelsSkipped++
          continue
        }

        let providerId = null
        if (model.provider) {
          const providerDoc = await payload.find({
            collection: 'providers' as any,
            where: { id: { equals: model.provider.id } },
          })

          if (providerDoc.docs.length > 0) {
            providerId = providerDoc.docs[0].id
          }
        }

        let labId = null
        if (model.lab) {
          const labDoc = await payload.find({
            collection: 'labs' as any,
            where: { id: { equals: model.lab.id } },
          })

          if (labDoc.docs.length > 0) {
            labId = labDoc.docs[0].id
          }
        }

        await payload.create({
          collection: 'models',
          data: {
            id: model.id,
            name: model.name,
            provider: providerId as any,
            lab: labId as any,
            description: model.description || '',
            context_length: model.context_length || 0,
            pricing: {
              prompt: model.pricing?.prompt || 0,
              completion: model.pricing?.completion || 0,
            },
            capabilities: model.capabilities?.map((capability: any) => ({ capability })) || [],
            modelUrl: model.modelUrl || '',
            imageUrl: model.imageUrl || '',
          } as any,
        })
        console.log(`Created model: ${model.name}`)
        modelsCreated++
      } catch (error) {
        console.error(`Error creating model ${model.name}:`, error)
      }
    }

    console.log(`Models: ${modelsCreated} created, ${modelsSkipped} skipped`)

    console.log('Database seeding completed successfully!')
    return {
      nouns: { created: nounsCreated, skipped: nounsSkipped },
      things: { created: thingsCreated, skipped: thingsSkipped },
      verbs: { created: verbsCreated, skipped: verbsSkipped },
      providers: { created: providersCreated, skipped: providersSkipped },
      labs: { created: labsCreated, skipped: labsSkipped },
      models: { created: modelsCreated, skipped: modelsSkipped },
    }
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

// // Run the seed function if this script is executed directly
// import { fileURLToPath } from 'url'
// const currentFile = fileURLToPath(import.meta.url)
// const isMainModule = process.argv[1] === currentFile

// if (isMainModule) {
//   seedDatabase()
// }
