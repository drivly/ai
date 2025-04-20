import { API } from '@/lib/api'

export const GET = API(async (req, { user, payload }) => {
  if (!user?.id) {
    return { error: 'Unauthorized', status: 401 }
  }

  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '10')
  const startingAfter = searchParams.get('starting_after')
  const endingBefore = searchParams.get('ending_before')

  if (startingAfter && endingBefore) {
    return { error: 'Only one of starting_after or ending_before can be provided', status: 400 }
  }

  let query: any = {
    resourceType: { equals: 'chat' },
    user: { equals: user.id }
  }

  if (startingAfter) {
    query.createdAt = { less_than: startingAfter }
  }

  if (endingBefore) {
    query.createdAt = { greater_than: endingBefore }
  }

  try {
    const chats = await payload.find({
      collection: 'chat-resources',
      where: query,
      limit,
      sort: '-createdAt'
    })

    return { chats: chats.docs }
  } catch (error) {
    console.error('Error fetching chat history:', error)
    return { error: 'Failed to fetch chats', status: 500 }
  }
})
