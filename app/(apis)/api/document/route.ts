import { API } from '@/lib/api'

export const GET = API(async (req, { user, payload }) => {
  if (!user?.id) {
    return { error: 'Unauthorized', status: 401 }
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return { error: 'Missing id', status: 400 }
  }

  const documents = await payload.find({
    collection: 'chatResources',
    where: {
      id: { equals: id },
      resourceType: { equals: 'document' }
    }
  })

  if (!documents?.docs?.length) {
    return { error: 'Not found', status: 404 }
  }

  const document = documents.docs[0]

  if ((document.user as any).id !== user.id) {
    return { error: 'Forbidden', status: 403 }
  }

  return document
})

export const POST = API(async (req, { user, payload }) => {
  if (!user?.id) {
    return { error: 'Unauthorized', status: 401 }
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return { error: 'Missing id', status: 400 }
  }

  const { content, title, kind }: { content: string, title: string, kind?: string } = await req.json()

  const documents = await payload.find({
    collection: 'chatResources',
    where: {
      id: { equals: id },
      resourceType: { equals: 'document' }
    }
  })

  if (documents?.docs?.length > 0) {
    const document = documents.docs[0]

    if ((document.user as any).id !== user.id) {
      return { error: 'Forbidden', status: 403 }
    }
    
    const updatedDocument = await payload.update({
      collection: 'chatResources',
      id: id,
      data: {
        title,
        content,
        kind
      }
    })
    
    return updatedDocument
  } else {
    const newDocument = await payload.create({
      collection: 'chatResources',
      data: {
        id,
        title,
        content,
        kind,
        resourceType: 'document',
        user: user.id,
        visibility: 'private'
      }
    })
    
    return newDocument
  }
})

export const DELETE = API(async (req, { user, payload }) => {
  if (!user?.id) {
    return { error: 'Unauthorized', status: 401 }
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const timestamp = searchParams.get('timestamp')

  if (!id) {
    return { error: 'Missing id', status: 400 }
  }

  if (!timestamp) {
    return { error: 'Missing timestamp', status: 400 }
  }

  const documents = await payload.find({
    collection: 'chatResources',
    where: {
      id: { equals: id },
      resourceType: { equals: 'document' }
    }
  })

  if (!documents?.docs?.length) {
    return { error: 'Not found', status: 404 }
  }

  const document = documents.docs[0]

  if ((document.user as any).id !== user.id) {
    return { error: 'Unauthorized', status: 401 }
  }

  await payload.delete({
    collection: 'chatResources',
    id: id
  })

  return { success: true }
})
