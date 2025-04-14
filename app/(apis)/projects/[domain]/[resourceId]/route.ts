import { API } from '@/lib/api'

/**
 * API handler for a specific project-scoped resource
 */
export const GET = API(async (request, { params, db, payload }) => {
  const resolvedParams = await params as { domain: string; resourceId: string }
  const { domain, resourceId } = resolvedParams
  
  const project = await db.projects.findOne({
    where: {
      domain: {
        equals: domain
      }
    }
  })
  
  if (!project) {
    return { error: 'Project not found', status: 404 }
  }
  
  try {
    const resource = await payload.findByID({
      collection: 'resources',
      id: resourceId,
    })
    
    if (!resource.tenant || resource.tenant.toString() !== project.id) {
      return { error: 'Resource does not belong to this project', status: 404 }
    }
    
    return {
      resource,
      project: {
        id: project.id,
        name: project.name,
        domain: project.domain
      }
    }
  } catch (error) {
    return { error: 'Resource not found', status: 404 }
  }
})
