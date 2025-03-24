import { getPayloadClient } from '../lib/getPayload'
import fetch from 'node-fetch'

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
  const nouns: string[] = []
  const verbs: { action: string; type: string }[] = []
  
  // Extract @graph from the JSONLD
  const graph = data['@graph']
  
  if (!graph) {
    console.error('No @graph found in Schema.org data')
    return { nouns, verbs }
  }
  
  // Process each item in the graph
  graph.forEach((item: any) => {
    // Check if it's a type that inherits from Thing
    if (item['@type'] === 'rdfs:Class' && 
        (item['rdfs:subClassOf']?.['@id'] === 'schema:Thing' || 
         Array.isArray(item['rdfs:subClassOf']) && 
         item['rdfs:subClassOf'].some((subClass: any) => subClass['@id'] === 'schema:Thing'))) {
      
      const typeName = item['@id'].replace('schema:', '')
      
      // If it ends with "Action", it's a verb
      if (typeName.endsWith('Action')) {
        const verb = typeName.replace('Action', '')
        verbs.push({ action: verb, type: typeName })
      } 
      // Otherwise it's a noun
      else {
        nouns.push(typeName)
      }
    }
  })
  
  return { nouns, verbs }
}

// Function to seed the database
export async function seedDatabase() {
  try {
    console.log('Starting database seed process...')
    
    // Initialize Payload
    const payload = await getPayloadClient({
      initOptions: {
        local: true,
      },
    })
    
    // Fetch Schema.org data
    const schemaOrgData = await fetchSchemaOrgData()
    
    // Extract Nouns and Verbs
    const { nouns, verbs } = extractNounsAndVerbs(schemaOrgData)
    
    console.log(`Found ${nouns.length} nouns and ${verbs.length} verbs`)
    
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
      } catch (error) {
        console.error(`Error creating verb ${verb.action}:`, error)
      }
    }
    
    console.log('Database seeding completed successfully!')
    
    // Close the Payload client
    await payload.disconnect()
    
  } catch (error) {
    console.error('Error seeding database:', error)
  }
}

// Run the seed function if this script is executed directly
if (import.meta.url === import.meta.main) {
  seedDatabase()
}