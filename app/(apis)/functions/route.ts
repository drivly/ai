import { API, generatePaginationLinks, createFunctionsObject, formatUrl } from '@/lib/api'
import { executeFunction } from '@/tasks/ai/executeFunction'
import { waitUntil } from '@vercel/functions'

export const GET = API(async (request, { db, user, url, origin, domain }) => {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  const showDomains = url.searchParams.has('domains')

  const formatWithOptions = (path: string, defaultDomain?: string) =>
    formatUrl(path, {
      origin,
      domain,
      showDomains,
      defaultDomain,
    })

  // Using the new db interface for more concise syntax
  const functionsArray =
    (await db.functions.find({
      page,
      limit,
      depth: 2, // Include related fields like examples
    })) || []

  const totalItems = Array.isArray(functionsArray) ? functionsArray.length : 0

  const baseUrl = request.nextUrl.origin + request.nextUrl.pathname
  const links: { home: string; next?: string; prev?: string } = {
    home: baseUrl,
  }

  if (totalItems === limit) {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('page', (page + 1).toString())
    links.next = `${baseUrl}?${nextParams.toString()}`
  }

  if (page > 1) {
    const prevParams = new URLSearchParams(searchParams)
    prevParams.set('page', (page - 1).toString())
    links.prev = `${baseUrl}?${prevParams.toString()}`
  }

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

    page,
    limit,
    total: totalItems,
    actions: {
      toggleDomains: url.searchParams.has('domains') ? url.toString().replace(/[?&]domains/, '') : url.toString() + (url.toString().includes('?') ? '&domains' : '?domains'),
    },
  }
})

export const POST = API(async (request, { db, user, url, payload, req }) => {
  const body = await request.json()

  if (body.functionName || body.input) {
    const functionName = body.functionName
    const args = body.input || body.args || {}
    const settings = body.config || body.settings || {}

    const start = Date.now()
    const results = await executeFunction({ input: { functionName, args, settings }, payload })
    const latency = Date.now() - start

    const output = results?.output
    const generationHash = results?.generationHash

    return {
      functionName,
      args,
      data: output,
      reasoning: results?.reasoning?.split('\n'),
      settings,
      latency,
      generationHash,
    }
  }

  const { action, functionId } = body

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

  if (body.name && (body.analyze !== false)) {
    try {
      const { analyzeFunctionDefinition } = await import('@/utils/functionAnalyzer');
      
      const { name, shape } = body;
      
      const analysis = await analyzeFunctionDefinition(name, shape, payload);
      
      if (analysis) {
        if (!body.type && analysis.type) {
          body.type = analysis.type;
        }
        
        if (!body.format && analysis.format) {
          body.format = analysis.format;
        }
        
        body.metadata = {
          ...body.metadata,
          semantic: {
            verb: analysis.verb,
            subject: analysis.subject,
            object: analysis.object,
            verbForms: analysis.verbForms,
            nounForms: analysis.nounForms,
            confidence: analysis.confidence
          }
        };
      }
    } catch (error) {
      console.error('Error analyzing function:', error);
    }
  }
  
  return { error: 'Invalid action' }
})
