import { API } from '@/lib/api'

export const GET = API(async (request, { db, user, url }) => {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  
  // Using the new db interface for more concise syntax
  const functions = await db.functions.find({
    page,
    limit,
  })
  
  const baseUrl = request.nextUrl.origin + request.nextUrl.pathname
  
  const links = {
    home: baseUrl,
  }
  
  if (functions.length === limit) {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('page', (page + 1).toString())
    links.next = `${baseUrl}?${nextParams.toString()}`
  }
  
  if (page > 1) {
    const prevParams = new URLSearchParams(searchParams)
    prevParams.set('page', (page - 1).toString())
    links.prev = `${baseUrl}?${prevParams.toString()}`
  }
  
  const functionsObject = {}
  functions.forEach(func => {
    functionsObject[func.name] = `${request.nextUrl.origin}/functions/${func.name}`
  })
  
  return { 
    functions: functionsObject, 
    links,
    user,
    page,
    limit,
    total: functions.length
  }
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
