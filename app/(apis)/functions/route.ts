import { API, generatePaginationLinks, createFunctionsObject, formatUrl } from '@/lib/api'

export const GET = API(async (request, { db, user, url, origin, domain }) => {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const search = searchParams.get('search') || ''
  
  try {
    const showDomains = url.searchParams.has('domains')

    const formatWithOptions = (path: string, defaultDomain?: string) =>
      formatUrl(path, {
        origin,
        domain,
        showDomains,
        defaultDomain,
      })
    
    const where: any = {}
    if (search) {
      where.name = {
        contains: search,
      }
    }
    
    const countResult = await db.functions.find({
      where,
      limit: 0
    })
    const totalItems = countResult.totalDocs || 0
    
    const functionsArray = await db.functions.find({
      where,
      page,
      limit,
      sort: 'name',
      depth: 2, // Include related fields like examples
    }) || []
    
    const baseUrl = request.nextUrl.origin + request.nextUrl.pathname
    const links: { home: string; next?: string; prev?: string; create?: string; documentation?: string } = {
      home: baseUrl,
    }
    
    if (totalItems > page * limit) {
      const nextParams = new URLSearchParams(searchParams)
      nextParams.set('page', (page + 1).toString())
      links.next = `${baseUrl}?${nextParams.toString()}`
    }
    
    if (page > 1) {
      const prevParams = new URLSearchParams(searchParams)
      prevParams.set('page', (page - 1).toString())
      links.prev = `${baseUrl}?${prevParams.toString()}`
    }
    
    links.create = formatWithOptions('functions/create', 'functions.do')
    links.documentation = formatWithOptions('docs/functions', 'functions.do')
    
    const functions: Record<string, string> = {}
    
    if (Array.isArray(functionsArray)) {
      for (let i = 0; i < functionsArray.length; i++) {
        const func = functionsArray[i]
        if (func && typeof func === 'object' && func.name) {
          functions[func.name] = formatWithOptions(`functions/${func.name}`, 'functions.do')
        }
      }
    }
    
    return {
      functions,
      links,
      meta: {
        total: totalItems,
        page,
        limit,
        totalPages: Math.ceil(totalItems / limit),
        user: user?.id,
      },
      actions: {
        toggleDomains: url.searchParams.has('domains') 
          ? url.toString().replace(/[?&]domains/, '') 
          : url.toString() + (url.toString().includes('?') ? '&domains' : '?domains'),
        search: `${baseUrl}?search=`,
      },
    }
  } catch (error) {
    console.error('Error fetching functions:', error)
    return {
      error: 'Failed to fetch functions',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500,
    }
  }
})

export const POST = API(async (request, { db, user, url }) => {
  try {
    const body = await request.json()
    
    if (body.action === 'clone' && body.functionId) {
      const originalFunction = await db.functions.get(body.functionId)
      
      if (!originalFunction) {
        return { 
          error: 'Function not found',
          message: `No function found with ID: ${body.functionId}`,
          status: 404
        }
      }
      
      if (!originalFunction.public && originalFunction.user?.id !== user?.id) {
        return { 
          error: 'Permission denied',
          message: 'You do not have permission to clone this function',
          status: 403
        }
      }
      
      const cloneData = {
        ...originalFunction,
        name: `${originalFunction.name} (Clone)`,
        clonedFrom: body.functionId,
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
      
      return {
        success: true,
        function: {
          id: newFunction.id,
          name: newFunction.name,
          url: formatUrl(new URL(`${request.nextUrl.origin}/functions/${newFunction.name}`)),
        },
        links: {
          self: formatUrl(new URL(`${request.nextUrl.origin}/functions/${newFunction.name}`)),
          examples: formatUrl(new URL(`${request.nextUrl.origin}/functions/${newFunction.name}/examples`)),
        }
      }
    }
    
    if (!body.action && body.name) {
      const existingFunction = await db.functions.findOne({
        where: {
          name: {
            equals: body.name,
          },
        },
      })
      
      if (existingFunction) {
        return {
          error: 'Function already exists',
          message: `A function with name '${body.name}' already exists`,
          status: 409,
          function: {
            id: existingFunction.id,
            name: existingFunction.name,
            url: formatUrl(new URL(`${request.nextUrl.origin}/functions/${existingFunction.name}`)),
          },
        }
      }
      
      const createdFunction = await db.functions.create({
        data: {
          name: body.name,
          type: body.type || 'Generation',
          format: body.format || 'Object',
          description: body.description || `${body.name} function`,
          code: body.code,
          prompt: body.prompt,
          shape: body.shape || body.schema,
          user: user?.id,
        },
      })
      
      return {
        id: createdFunction.id,
        name: createdFunction.name,
        url: formatUrl(new URL(`${request.nextUrl.origin}/functions/${createdFunction.name}`)),
        links: {
          self: formatUrl(new URL(`${request.nextUrl.origin}/functions/${createdFunction.name}`)),
          examples: formatUrl(new URL(`${request.nextUrl.origin}/functions/${createdFunction.name}/examples`)),
        },
      }
    }
    
    return { 
      error: 'Invalid request',
      message: 'The request must include either an action for cloning or a name for creating a function',
      status: 400
    }
  } catch (error) {
    console.error('Error processing function request:', error)
    return {
      error: 'Failed to process request',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500,
    }
  }
})
