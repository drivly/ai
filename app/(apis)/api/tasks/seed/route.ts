import { API } from '@/lib/api'
import config from '@/payload.config'
import { getPayload } from 'payload'
// import { seedDatabase } from '@/scripts/seed'

export const GET = API(async (req, { db, user, payload, params }) => {
  // seedDatabase()

  if (!user.email?.endsWith('@driv.ly')) {
    return { success: false, message: 'Unauthorized' }
  }

  // Schema.org Nouns
  const graph = await fetch('https://schema.org/version/latest/schemaorg-current-https.jsonld')
    .then((res) => res.json())
    .then((data) => data['@graph'])
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
  const actions = await fetch('https://backend.composio.dev/api/v1/actions', composio)
    .then((res) => res.json())
    .then((data) => data.items)
  const integrations = await payload.db.connection.collection('integrations').bulkWrite(
    apps.map((app: any) => {
      return { updateOne: { filter: { key: app.key }, update: { $set: app }, upsert: true } }
    }),
  )
  console.log('Integrations seeded')
  const categoriesResults = await payload.db.connection.collection('integration-categories').bulkWrite(
    categories.map((category: any) => {
      return { updateOne: { filter: { category }, update: { $set: { category } }, upsert: true } }
    }),
  )
  console.log('Categories seeded')
  const triggersResults = await payload.db.connection.collection('integration-triggers').bulkWrite(
    triggers.map((trigger: any) => {
      return { updateOne: { filter: { appKey: trigger.appKey }, update: { $set: trigger }, upsert: true } }
    }),
  )
  console.log('Triggers seeded')
  const actionsResults = await payload.db.connection.collection('integration-actions').bulkWrite(
    actions.map((action: any) => {
      return { updateOne: { filter: { appKey: action.appKey }, update: { $set: action }, upsert: true } }
    }),
  )
  console.log('Actions seeded')

  return { success: true, schemaResults, integrations, categoriesResults, triggersResults, actionsResults }
})
