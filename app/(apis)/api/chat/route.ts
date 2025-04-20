import { API } from '@/lib/api'
import { waitUntil } from '@vercel/functions'
import { put } from '@vercel/blob'
import OpenAI from 'openai'

const { TransformStream } = globalThis

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const GET = API(async (req, { db, user, payload }) => {
  if (!user?.id) {
    return { error: 'Unauthorized', status: 401 }
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (id) {
    const chat = await payload.find({
      collection: 'chat-resources',
      where: {
        id: { equals: id },
        resourceType: { equals: 'chat' },
        user: { equals: user.id }
      }
    })

    if (!chat?.docs?.length) {
      return { error: 'Chat not found', status: 404 }
    }

    const messages = await payload.find({
      collection: 'chat-resources',
      where: {
        parentId: { equals: id },
        resourceType: { equals: 'message' }
      }
    })

    return { chat: chat.docs[0], messages: messages.docs }
  } else {
    const limit = parseInt(searchParams.get('limit') || '10')
    const startingAfter = searchParams.get('starting_after')
    const endingBefore = searchParams.get('ending_before')

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

    const chats = await payload.find({
      collection: 'chat-resources',
      where: query,
      limit,
      sort: '-createdAt'
    })

    return { chats: chats.docs }
  }
})

export const POST = API(async (req, { user, payload }) => {
  if (!user?.id) {
    return { error: 'Unauthorized', status: 401 }
  }

  const { id, messages } = await req.json()

  let chat
  if (id) {
    const existingChat = await payload.find({
      collection: 'chat-resources',
      where: {
        id: { equals: id },
        resourceType: { equals: 'chat' },
        user: { equals: user.id }
      }
    })

    if (!existingChat?.docs?.length) {
      return { error: 'Chat not found', status: 404 }
    }
    
    chat = existingChat.docs[0]
  } else {
    const title = messages[0]?.content?.substring(0, 100) || 'New Chat'
    const newChat = await payload.create({
      collection: 'chat-resources',
      data: {
        title,
        resourceType: 'chat',
        user: user.id,
        metadata: {
          model: messages[0]?.metadata?.model || 'gpt-4',
        },
        visibility: 'private'
      }
    })
    
    chat = newChat
  }

  const userMessage = await payload.create({
    collection: 'chat-resources',
    data: {
      title: 'User Message',
      content: messages[messages.length - 1].content,
      resourceType: 'message',
      user: user.id,
      parentId: chat.id,
      metadata: messages[messages.length - 1].metadata || {}
    }
  })

  const assistantMessage = await payload.create({
    collection: 'chat-resources',
    data: {
      title: 'Assistant Message',
      content: '',
      resourceType: 'message',
      user: user.id,
      parentId: chat.id,
      metadata: {
        role: 'assistant'
      }
    }
  })

  const { readable, writable } = new TransformStream()
  
  const streamProcessor = async () => {
    try {
      const completion = await openai.chat.completions.create({
        model: chat.metadata?.model || 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          ...messages.map(m => ({ 
            role: m.role || 'user', 
            content: m.content 
          }))
        ],
        stream: true,
      })

      const textEncoder = new TextEncoder()
      const writer = writable.getWriter()

      let accumulatedContent = ''
      
      for await (const chunk of completion) {
        const content = chunk.choices[0]?.delta?.content || ''
        if (content) {
          accumulatedContent += content
          await writer.write(textEncoder.encode(content))

          if (accumulatedContent.length % 100 < 10) {
            try {
              await payload.update({
                collection: 'chat-resources',
                id: assistantMessage.id,
                data: {
                  content: accumulatedContent
                }
              })
            } catch (error) {
              console.error('Error updating message content:', error)
            }
          }
        }
      }

      try {
        await payload.update({
          collection: 'chat-resources',
          id: assistantMessage.id,
          data: {
            content: accumulatedContent
          }
        })
      } catch (error) {
        console.error('Error updating final message content:', error)
      }

      writer.close()
    } catch (error) {
      console.error('Error processing stream:', error)
    }
  }

  waitUntil(streamProcessor())

  // Return a streaming response using the native Response object
  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked'
    }
  })
})

export const DELETE = API(async (req, { user, payload }) => {
  if (!user?.id) {
    return { error: 'Unauthorized', status: 401 }
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return { error: 'Missing id', status: 400 }
  }

  const chat = await payload.find({
    collection: 'chat-resources',
    where: {
      id: { equals: id },
      resourceType: { equals: 'chat' },
      user: { equals: user.id }
    }
  })

  if (!chat?.docs?.length) {
    return { error: 'Chat not found', status: 404 }
  }

  const messages = await payload.find({
    collection: 'chat-resources',
    where: {
      parentId: { equals: id },
      resourceType: { equals: 'message' }
    }
  })

  for (const message of messages.docs) {
    await payload.delete({
      collection: 'chat-resources',
      id: message.id
    })
  }

  await payload.delete({
    collection: 'chat-resources',
    id: id
  })

  return { success: true }
})
