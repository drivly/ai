import { API } from '@/lib/api'

export const GET = API(async (request, { db, user, origin, url, domain }) => {
  const id = url.pathname.split('/').pop()

  if (id && id !== 'services') {
    const service = await db.services.get(id)
    return service
  }

  const query: Record<string, any> = {}

  if (url.searchParams.has('name')) {
    query.name = url.searchParams.get('name')
  }

  if (url.searchParams.has('status')) {
    query.status = url.searchParams.get('status')
  }

  const services = await db.services.find({
    where: query,
    limit: url.searchParams.has('limit') ? parseInt(url.searchParams.get('limit') as string) : 10,
    page: url.searchParams.has('page') ? parseInt(url.searchParams.get('page') as string) : 1,
  })

  return services
})

export const POST = API(async (request, { db, user, origin, url, domain }) => {
  const body = await request.json()

  const service = await db.services.create(body.status ? body : { ...body, status: 'active' })

  return service
})

export const PATCH = API(async (request, { db, user, origin, url, domain }) => {
  const id = url.pathname.split('/').pop()

  if (!id || id === 'services') {
    return {
      errors: [{ message: 'Service ID is required' }],
    }
  }

  const body = await request.json()

  const service = await db.services.update(id, body)

  return service
})

export const DELETE = API(async (request, { db, user, origin, url, domain }) => {
  const id = url.pathname.split('/').pop()

  if (!id || id === 'services') {
    return {
      errors: [{ message: 'Service ID is required' }],
    }
  }

  const service = await db.services.delete(id)

  return service
})
