import { API } from '@/lib/api'

export const GET = API(async (request, { db, user, url }) => {
  // Using the new db interface for more concise syntax
  const workflows = await db.workflows.find()
  // If we need a specific function by ID, we could use:
  // const specificFunction = await db.functions.get('function-id')

  return { workflows }
})
