import { API } from '@/lib/api'

export const GET = API(async (request, { db, user, url }) => {
  // Using the new db interface for more concise syntax
  const functions = await db.functions.find({
    depth: 2 // Include related fields like examples
  })
  // If we need a specific function by ID, we could use:

  return { functions, user }
})

export const POST = API(async (request, { db, user, url }) => {
  const { action, functionId } = await request.json()

  if (action === 'clone' && functionId) {
    const originalFunction = await db.functions.get(functionId)
    
    if (!originalFunction) {
      return { error: 'Function not found' }
    }
    
    if (!originalFunction.public && originalFunction.user?.id !== user?.id) {
      return { error: 'You do not have permission to clone this function' }
    }
    
    const cloneData = {
      ...originalFunction,
      name: `${originalFunction.name} (Clone)`,
      clonedFrom: functionId,
      isPublic: false, // Default to private
      pricing: {
        isMonetized: false, // Default to not monetized
      },
      user: user?.id, // Set the current user as the owner
    }
    
    delete cloneData.id
    delete cloneData.createdAt
    delete cloneData.updatedAt
    delete cloneData.stripeProductId
    delete cloneData.stripePriceId
    
    const newFunction = await db.functions.create(cloneData)
    
    return { success: true, function: newFunction }
  }
  
  return { error: 'Invalid action' }
})
