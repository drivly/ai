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
    messages = postData.messages
    model = postData.model
    
  } catch (error) {
    // We're in a GET request, so use message from query params
    const message = qs.get('message')
    model = qs.get('model') || model

    if (!message) {
      return new Response('No message provided', { status: 400 })
    }

    messages = [{ role: 'user', content: message }]
  }

  const result = await streamText({
    model,
    system: 'You are a helpful assistant.',
    messages: messages,
    user: session.user.email || '',
    maxSteps: 50
  })

  return result.toDataStreamResponse()
}

export const GET = POST
