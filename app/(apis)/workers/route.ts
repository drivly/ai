import { API } from '@/lib/api'
import { headers } from 'next/headers'

export const GET = API(async (request, { origin, url, payload }) => {
  const headersList = await headers()
  const authHeader = headersList.get('Authorization')
  const sharedSecret = process.env.WORKERS_API_SECRET
  
  if (!authHeader || !sharedSecret || authHeader !== `Bearer ${sharedSecret}`) {
    return { error: 'Unauthorized', status: 401 }
  }
  
  const searchParams = url.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  
  let workers: Record<string, string> = {}
  try {
    const deployments = await payload.find({
      collection: 'deployments',
      limit,
      page,
    })
    
    deployments.docs.forEach((deployment: { name?: string }) => {
      if (deployment.name) {
        workers[deployment.name] = `${origin}/workers/${deployment.name}`
      }
    })
    
    const baseUrl = `${origin}/workers`
    const links: Record<string, string> = {
      home: baseUrl,
    }
    
    if (deployments.hasNextPage) {
      links.next = `${baseUrl}?page=${page + 1}&limit=${limit}`
    }
    
    if (page > 1) {
      links.prev = `${baseUrl}?page=${page - 1}&limit=${limit}`
    }
    
    return {
      workers,
      links,
      page,
      limit,
      total: deployments.totalDocs,
    }
  } catch (error) {
    console.error('Error fetching workers:', error)
    
    const baseUrl = `${origin}/workers`
    const links: Record<string, string> = {
      home: baseUrl,
    }
    
    workers = {
      'example-worker': `${baseUrl}/example-worker`,
    }
    
    return {
      workers,
      links,
      page,
      limit,
      total: Object.keys(workers).length,
    }
  }
})

export const POST = API(async (request, { params, url }) => {
  return { error: 'Method not allowed on root workers endpoint. Use a specific worker path.', status: 405 }
})

export const PUT = API(async (request, { params, url }) => {
  return { error: 'Method not allowed on root workers endpoint. Use a specific worker path.', status: 405 }
})

export const DELETE = API(async (request, { params, url }) => {
  return { error: 'Method not allowed on root workers endpoint. Use a specific worker path.', status: 405 }
})

export const PATCH = API(async (request, { params, url }) => {
  return { error: 'Method not allowed on root workers endpoint. Use a specific worker path.', status: 405 }
})
