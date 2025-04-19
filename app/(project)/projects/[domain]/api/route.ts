import { API } from '@/lib/api'

/**
 * API handler for project-scoped resources
 * This route handles resources tied to specific projects identified by their domain
 */
export const GET = API(async (request, { params, db, payload }) => {
  const resolvedParams = await params
  const { domain } = resolvedParams

  const project = await db.projects.findOne({
    where: {
      domain: {
        equals: domain,
      },
    },
  })

  if (!project) {
    return { error: 'Project not found', status: 404 }
  }

  const page = Number(request.nextUrl.searchParams.get('page') || '1')
  const limit = Number(request.nextUrl.searchParams.get('limit') || '10')

  const resourcesResult = await payload.find({
    collection: 'resources',
    where: {
      tenant: {
        equals: project.id,
      },
    },
    page,
    limit,
  })

  const url = new URL(request.url)
  const baseUrl = url.origin + url.pathname

  const links: { self: string; next?: string; prev?: string } = {
    self: url.toString(),
  }

  if (resourcesResult.hasNextPage) {
    const nextParams = new URLSearchParams(request.nextUrl.searchParams)
    nextParams.set('page', (page + 1).toString())
    links.next = `${baseUrl}?${nextParams.toString()}`
  }

  if (page > 1) {
    const prevParams = new URLSearchParams(request.nextUrl.searchParams)
    prevParams.set('page', (page - 1).toString())
    links.prev = `${baseUrl}?${prevParams.toString()}`
  }

  return {
    project: {
      id: project.id,
      name: project.name,
      domain: project.domain,
    },
    resources: resourcesResult.docs,
    links,
    totalDocs: resourcesResult.totalDocs,
    page: resourcesResult.page,
    totalPages: resourcesResult.totalPages,
    hasNextPage: resourcesResult.hasNextPage,
    hasPrevPage: resourcesResult.hasPrevPage,
  }
})

export const POST = API(async (request, { params, db, payload }) => {
  const resolvedParams = await params
  const { domain } = resolvedParams

  const project = await db.projects.findOne({
    where: {
      domain: {
        equals: domain,
      },
    },
  })

  if (!project) {
    return { error: 'Project not found', status: 404 }
  }

  const body = await request.json()

  const resource = await payload.create({
    collection: 'resources',
    data: {
      ...body,
      tenant: project.id, // Associate with project
    },
  })

  return {
    success: true,
    resource,
  }
})

export const PUT = API(async (request, { params, db, payload }) => {
  const resolvedParams = await params
  const { domain } = resolvedParams
  const resourceId = request.nextUrl.searchParams.get('id')

  if (!resourceId) {
    return { error: 'Resource ID is required', status: 400 }
  }

  const project = await db.projects.findOne({
    where: {
      domain: {
        equals: domain,
      },
    },
  })

  if (!project) {
    return { error: 'Project not found', status: 404 }
  }

  const existingResource = await payload.findByID({
    collection: 'resources',
    id: resourceId,
  })

  if (!existingResource) {
    return { error: 'Resource not found', status: 404 }
  }

  if (existingResource.tenant && existingResource.tenant.toString() !== project.id) {
    return { error: 'Resource does not belong to this project', status: 403 }
  }

  const body = await request.json()

  const updatedResource = await payload.update({
    collection: 'resources',
    id: resourceId,
    data: {
      ...body,
      tenant: project.id, // Ensure project association is maintained
    },
  })

  return {
    success: true,
    resource: updatedResource,
  }
})

export const DELETE = API(async (request, { params, db, payload }) => {
  const resolvedParams = await params
  const { domain } = resolvedParams
  const resourceId = request.nextUrl.searchParams.get('id')

  if (!resourceId) {
    return { error: 'Resource ID is required', status: 400 }
  }

  const project = await db.projects.findOne({
    where: {
      domain: {
        equals: domain,
      },
    },
  })

  if (!project) {
    return { error: 'Project not found', status: 404 }
  }

  const existingResource = await payload.findByID({
    collection: 'resources',
    id: resourceId,
  })

  if (!existingResource) {
    return { error: 'Resource not found', status: 404 }
  }

  if (existingResource.tenant && existingResource.tenant.toString() !== project.id) {
    return { error: 'Resource does not belong to this project', status: 403 }
  }

  await payload.delete({
    collection: 'resources',
    id: resourceId,
  })

  return {
    success: true,
    deletedResource: resourceId,
  }
})
