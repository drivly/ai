import { API } from '@/api.config'

export const GET = API(async (request, { db, user, url }) => {
  // Using the new db interface for more concise syntax
  const functions = await db.functions.find()
  // If we need a specific function by ID, we could use:
  // const specificFunction = await db.functions.get('function-id')

  return { functions, user }
})
