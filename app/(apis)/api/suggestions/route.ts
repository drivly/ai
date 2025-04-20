import { API } from '@/lib/api'

export const GET = API(async (req, { user, payload }) => {
  if (!user?.id) {
    return { error: 'Unauthorized', status: 401 }
  }

  const { searchParams } = new URL(req.url)
  const documentId = searchParams.get('documentId')

  if (!documentId) {
    return { error: 'Not Found', status: 404 }
  }

  const suggestions = await payload.find({
    collection: 'chatResources',
    where: {
      'metadata.documentId': { equals: documentId },
      resourceType: { equals: 'suggestion' }
    }
  })

  if (!suggestions?.docs?.length) {
    return []
  }

  const documents = await payload.find({
    collection: 'chat-resources',
    where: {
      id: { equals: documentId },
      resourceType: { equals: 'document' }
    }
  })

  if (!documents?.docs?.length || (documents.docs[0].user as any).id !== user.id) {
    return { error: 'Unauthorized', status: 401 }
  }

  return suggestions.docs
})
