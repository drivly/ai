import { auth } from '@/auth'
import { streamText } from '@/pkgs/ai-providers/src'
import { CoreMessage } from 'ai'

export const maxDuration = 600

export async function POST(req: Request) {
  let messages: CoreMessage[] = []
  let model: string = 'openai/gpt-4.1'
  const qs = new URL(req.url).searchParams

  const session = await auth()

  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Support both GET and POST requests
  try {
    const postData = await req.json()
    messages = postData.messages || []
    model = postData.model || model

    // Log the received messages for debugging
    console.log('Received messages:', JSON.stringify(messages))
  } catch (error) {
    console.error('Error parsing request:', error)
    // We're in a GET request, so use message from query params
    const message = qs.get('message')
    model = qs.get('model') || model

    if (!message) {
      return new Response('No message provided', { status: 400 })
    }

    messages = [{ role: 'user', content: message }]
  }

  // Ensure we have at least one message
  if (messages.length === 0) {
    return new Response('No messages provided', { status: 400 })
  }

  try {
    const result = await streamText({
      model,
      system: 'You are a helpful assistant.',
      messages: messages,
      user: session.user.email || '',
      maxSteps: 50,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Error processing chat request:', error)
    return new Response('Error processing request', { status: 500 })
  }
}

export const GET = POST
