import { POST as POST_LLM } from '@/app/(apis)/api/llm/chat/completions/route'
import { getApiKey } from '@/collections/admin/APIKeys'
import config from '@payload-config'
import { NextRequest } from 'next/server'
import { getPayload } from 'payload'

// Allow streaming responses up to 600 seconds
export const maxDuration = 600

export async function POST(req: Request) {
  const payload = await getPayload({ config })
  let { apiKey, user } = await getApiKey(req.headers, payload)
  if (!apiKey && user?.email) {
    const created = await payload.create({
      collection: 'apikeys',
      data: {
        name: user.email,
        user: user.id,
        email: user.email,
      },
    })
    apiKey = created.apiKey
  }
  if (apiKey) {
    req.headers.set('Authorization', `Bearer ${apiKey}`)
  }
  // Rewrite the URL to declare that we need useChat compatible output.
  const newUrl = new URL('/llm/chat/completions?stream=true&useChat=true', req.url)
  const newRequest = new NextRequest(newUrl, req)

  return await POST_LLM(newRequest)
}

// export async function POST(req: Request) {
//   try {
//     const body = await req.json()

//     const messages = body.messages || []
//     const modelName = body.model || 'gpt-4.1'

//     if (!messages || messages.length === 0) {
//       return new Response(JSON.stringify({ error: 'No messages provided' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
//     }

//     const result = streamText({
//       model: model(modelName),
//       messages: messages,
//     })

//     return result.toDataStreamResponse()
//   } catch (error) {
//     console.error('Error in chat API:', error)
//     return new Response(JSON.stringify({ error: 'Failed to process chat request' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
//   }
// }

// import { API } from '@/lib/api'
// import { waitUntil } from '@vercel/functions'
// import { put } from '@vercel/blob'
// import OpenAI from 'openai'

// const { TransformStream } = globalThis

// interface ChatMessage {
//   role?: string
//   content: string
//   metadata?: Record<string, any>
// }

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY || '',
// })

// export const GET = API(async (req, { db, user, payload }) => {
//   if (!user?.id) {
//     return { error: 'Unauthorized', status: 401 }
//   }

//   const { searchParams } = new URL(req.url)
//   const id = searchParams.get('id')

//   if (id) {
//     const chat = await payload.find({
//       collection: 'chatResources',
//       where: {
//         id: { equals: id },
//         resourceType: { equals: 'chat' },
//         user: { equals: user.id },
//       },
//     })

//     if (!chat?.docs?.length) {
//       return { error: 'Chat not found', status: 404 }
//     }

//     const messages = await payload.find({
//       collection: 'chatResources',
//       where: {
//         parentId: { equals: id },
//         resourceType: { equals: 'message' },
//       },
//     })

//     return { chat: chat.docs[0], messages: messages.docs }
//   } else {
//     const limit = parseInt(searchParams.get('limit') || '10')
//     const startingAfter = searchParams.get('starting_after')
//     const endingBefore = searchParams.get('ending_before')

//     let query: any = {
//       resourceType: { equals: 'chat' },
//       user: { equals: user.id },
//     }

//     if (startingAfter) {
//       query.createdAt = { less_than: startingAfter }
//     }

//     if (endingBefore) {
//       query.createdAt = { greater_than: endingBefore }
//     }

//     const chats = await payload.find({
//       collection: 'chatResources',
//       where: query,
//       limit,
//       sort: '-createdAt',
//     })

//     return { chats: chats.docs }
//   }
// })

// export const POST = API(async (req, { user, payload }) => {
//   if (!user?.id) {
//     return { error: 'Unauthorized', status: 401 }
//   }

//   const { id, messages }: { id?: string; messages: ChatMessage[] } = await req.json()

//   let chat
//   if (id) {
//     const existingChat = await payload.find({
//       collection: 'chatResources',
//       where: {
//         id: { equals: id },
//         resourceType: { equals: 'chat' },
//         user: { equals: user.id },
//       },
//     })

//     if (!existingChat?.docs?.length) {
//       return { error: 'Chat not found', status: 404 }
//     }

//     chat = existingChat.docs[0]
//   } else {
//     const title = messages[0]?.content?.substring(0, 100) || 'New Chat'
//     const newChat = await payload.create({
//       collection: 'chatResources',
//       data: {
//         title,
//         resourceType: 'chat',
//         user: user.id,
//         metadata: {
//           model: messages[0]?.metadata?.model || 'gpt-4',
//         },
//         visibility: 'private',
//       },
//     })

//     chat = newChat
//   }

//   const userMessage = await payload.create({
//     collection: 'chatResources',
//     data: {
//       title: 'User Message',
//       content: messages[messages.length - 1].content,
//       resourceType: 'message',
//       user: user.id,
//       parentId: chat.id,
//       metadata: messages[messages.length - 1].metadata || {},
//     },
//   })

//   const assistantMessage = await payload.create({
//     collection: 'chatResources',
//     data: {
//       title: 'Assistant Message',
//       content: '',
//       resourceType: 'message',
//       user: user.id,
//       parentId: chat.id,
//       metadata: {
//         role: 'assistant',
//       },
//     },
//   })

//   const { readable, writable } = new TransformStream()

//   const streamProcessor = async () => {
//     try {
//       const completion = await openai.chat.completions.create({
//         model: chat.metadata?.model || 'gpt-4.1',
//         messages: [
//           { role: 'system', content: 'You are a helpful assistant.' },
//           ...messages
//             .map((m: ChatMessage) => {
//               const roleInput = m.role || 'user'
//               if (roleInput === 'function') {
//                 return {
//                   role: 'function' as const,
//                   content: m.content,
//                   name: m.metadata?.name || 'default_name',
//                 }
//               } else if (roleInput === 'tool') {
//                 if (!m.metadata?.tool_call_id) {
//                   console.warn('Skipping tool message without tool_call_id')
//                   // Return a user message instead of null to avoid type errors
//                   return {
//                     role: 'user' as const,
//                     content: m.content,
//                   }
//                 }
//                 return {
//                   role: 'tool' as const,
//                   content: m.content,
//                   tool_call_id: m.metadata.tool_call_id,
//                 }
//               } else {
//                 return {
//                   role: roleInput as 'system' | 'user' | 'assistant',
//                   content: m.content,
//                 }
//               }
//             })
//             .filter(Boolean),
//         ],
//         stream: true,
//       })

//       const textEncoder = new TextEncoder()
//       const writer = writable.getWriter()

//       let accumulatedContent = ''

//       for await (const chunk of completion) {
//         const content = chunk.choices[0]?.delta?.content || ''
//         if (content) {
//           accumulatedContent += content
//           await writer.write(textEncoder.encode(content))

//           if (accumulatedContent.length % 100 < 10) {
//             try {
//               await payload.update({
//                 collection: 'chatResources',
//                 id: assistantMessage.id,
//                 data: {
//                   content: accumulatedContent,
//                 },
//               })
//             } catch (error: any) {
//               console.error('Error updating message content:', error)
//             }
//           }
//         }
//       }

//       try {
//         await payload.update({
//           collection: 'chatResources',
//           id: assistantMessage.id,
//           data: {
//             content: accumulatedContent,
//           },
//         })
//       } catch (error: any) {
//         console.error('Error updating final message content:', error)
//       }

//       writer.close()
//     } catch (error: any) {
//       console.error('Error processing stream:', error)
//     }
//   }

//   waitUntil(streamProcessor())

//   // Return a streaming response using the native Response object
//   return new Response(readable, {
//     headers: {
//       'Content-Type': 'text/plain; charset=utf-8',
//       'Transfer-Encoding': 'chunked',
//     },
//   })
// })

// export const DELETE = API(async (req, { user, payload }) => {
//   if (!user?.id) {
//     return { error: 'Unauthorized', status: 401 }
//   }

//   const { searchParams } = new URL(req.url)
//   const id = searchParams.get('id')

//   if (!id) {
//     return { error: 'Missing id', status: 400 }
//   }

//   const chat = await payload.find({
//     collection: 'chatResources',
//     where: {
//       id: { equals: id },
//       resourceType: { equals: 'chat' },
//       user: { equals: user.id },
//     },
//   })

//   if (!chat?.docs?.length) {
//     return { error: 'Chat not found', status: 404 }
//   }

//   const messages = await payload.find({
//     collection: 'chatResources',
//     where: {
//       parentId: { equals: id },
//       resourceType: { equals: 'message' },
//     },
//   })

//   for (const message of messages.docs) {
//     await payload.delete({
//       collection: 'chatResources',
//       id: message.id,
//     })
//   }

//   await payload.delete({
//     collection: 'chatResources',
//     id: id,
//   })

//   return { success: true }
// })
