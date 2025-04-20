import { API } from '@/lib/api'

export const GET = API(async (req, { user, payload }) => {
  if (!user?.id) {
    return { error: 'Unauthorized', status: 401 }
  }

  const { searchParams } = new URL(req.url)
  const chatId = searchParams.get('chatId')

  if (!chatId) {
    return { error: 'chatId is required', status: 400 }
  }

  const chat = await payload.find({
    collection: 'chat-resources',
    where: {
      id: { equals: chatId },
      resourceType: { equals: 'chat' }
    }
  })

  if (!chat?.docs?.length) {
    return { error: 'Chat not found', status: 404 }
  }

  if (chat.docs[0].user.id !== user.id) {
    return { error: 'Unauthorized', status: 401 }
  }

  const messages = await payload.find({
    collection: 'chat-resources',
    where: {
      parentId: { equals: chatId },
      resourceType: { equals: 'message' }
    }
  })

  const votes = messages.docs
    .filter((message: any) => message.votes && message.votes.length > 0)
    .map((message: any) => ({
      messageId: message.id,
      votes: message.votes
    }))

  return votes
})

export const PATCH = API(async (req, { user, payload }) => {
  if (!user?.id) {
    return { error: 'Unauthorized', status: 401 }
  }

  const { chatId, messageId, type } = await req.json()

  if (!chatId || !messageId || !type) {
    return { error: 'messageId and type are required', status: 400 }
  }

  const chat = await payload.find({
    collection: 'chat-resources',
    where: {
      id: { equals: chatId },
      resourceType: { equals: 'chat' }
    }
  })

  if (!chat?.docs?.length) {
    return { error: 'Chat not found', status: 404 }
  }

  if (chat.docs[0].user.id !== user.id) {
    return { error: 'Unauthorized', status: 401 }
  }

  const message = await payload.findByID({
    collection: 'chat-resources',
    id: messageId
  })

  if (!message) {
    return { error: 'Message not found', status: 404 }
  }

  const votes = message.votes || []
  const existingVoteIndex = votes.findIndex((vote: any) => vote.user === user.id)

  if (existingVoteIndex >= 0) {
    votes[existingVoteIndex] = {
      user: user.id,
      type,
      createdAt: new Date().toISOString()
    }
  } else {
    votes.push({
      user: user.id,
      type,
      createdAt: new Date().toISOString()
    })
  }

  await payload.update({
    collection: 'chat-resources',
    id: messageId,
    data: {
      votes
    }
  })

  return { success: true }
})
