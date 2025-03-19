import { API } from '@/api.config'

// Get a specific user by ID
export const GET = API(async (request, { params, db }) => {
  const userId = params.id as string
  
  // Using the new 'get' method (previously findById/findByID)
  const user = await db.users.get(userId)
  
  if (!user) {
    throw new Error('User not found')
  }
  
  return { user }
})

// Update a specific user by ID
export const PUT = API(async (request, { params, db }) => {
  const userId = params.id as string
  const data = await request.json()
  
  // Using the new 'set' method (alias for update)
  const updatedUser = await db.users.set(userId, data)
  
  return { user: updatedUser }
})
