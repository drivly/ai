import { API } from '@/lib/api'
import config from '@/payload.config'
import { getPayload } from 'payload'
import { seedDatabase } from '@/scripts/seedDatabase'
import fs from 'fs/promises'
import path from 'path'

export const GET = API(async (req, { db, params, user, payload }) => {
  if (!user?.email?.endsWith('@driv.ly')) {
    return { user: user?.email, success: false, message: 'Unauthorized' }
  }

  const seedResults = await seedDatabase()

  const graph = await fetch('https://schema.org/version/latest/schemaorg-current-https.jsonld')
    .then((res) => res.json())
    .then((data) => data['@graph'])

  const thingsResults = await payload.db.connection.collection('things').bulkWrite(
    graph.map((thing: any) => {
      thing.name = thing['rdfs:label']
      return { updateOne: { filter: { '@id': thing['@id'] }, update: { $set: thing }, upsert: true } }
    }),
  )
  console.log('Schema.org things seeded')

  const schemaResults = await payload.db.connection.collection('nouns').bulkWrite(
    graph.map((thing: any) => {
      thing.name = thing['rdfs:label']
      return { updateOne: { filter: { '@id': thing['@id'] }, update: { $set: thing }, upsert: true } }
    }),
  )
  console.log('Schema.org nouns seeded')

  // Integrations, Categories, Triggers, and Actions
  const composio = { headers: { 'x-api-key': process.env.COMPOSIO_API_KEY! } }
  const apps = await fetch('https://backend.composio.dev/api/v1/apps', composio)
    .then((res) => res.json())
    .then((data) => data.items)
  const categories = await fetch('https://backend.composio.dev/api/v1/apps/list/categories', composio)
    .then((res) => res.json())
    .then((data) => data.items)
  const triggers = await fetch('https://backend.composio.dev/api/v1/triggers', composio).then((res) => res.json())
  const actions = await fetch('https://backend.composio.dev/api/v2/actions/list/all', composio)
    .then((res) => res.json())
    .then((data) => data.items)
  const integrations = await payload.db.connection.collection('integrations').bulkWrite(
    apps.map((app: any) => {
      return { updateOne: { filter: { key: app.key }, update: { $set: app }, upsert: true } }
    }),
  )
  console.log('Integrations seeded')
  const categoriesResults = await payload.db.connection.collection('integrationcategories').bulkWrite(
    categories.map((category: any) => {
      return { updateOne: { filter: { category }, update: { $set: { category } }, upsert: true } }
    }),
  )
  console.log('Categories seeded')
  const triggersResults = await payload.db.connection.collection('integrationtriggers').bulkWrite(
    triggers.map((trigger: any) => {
      if (trigger.display_name) {
        trigger.displayName = trigger.display_name
        delete trigger.display_name
      }
      return { updateOne: { filter: { appKey: trigger.appKey }, update: { $set: trigger }, upsert: true } }
    }),
  )
  console.log('Triggers seeded')
  const actionsResults = await payload.db.connection.collection('integrationactions').bulkWrite(
    actions.map((action: any) => {
      return { updateOne: { filter: { appKey: action.appKey }, update: { $set: action }, upsert: true } }
    }),
  )
  console.log('Actions seeded')

  try {
    const staticIntegrationData = {
      apps,
      categories,
      triggers,
      actions,
    }

    const dataDir = path.join(process.cwd(), 'public/data')
    try {
      await fs.access(dataDir)
    } catch (error) {
      await fs.mkdir(dataDir, { recursive: true })
    }

    const outputPath = path.join(dataDir, 'integrations.json')
    await fs.writeFile(outputPath, JSON.stringify(staticIntegrationData, null, 2))
    console.log(`✅ Generated static integrations data at ${outputPath}`)
  } catch (error) {
    console.error('Error generating static integrations data:', error)
  }

  return { success: true, schemaResults, integrations, categoriesResults, triggersResults, actionsResults }
})
