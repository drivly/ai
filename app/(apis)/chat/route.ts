import { streamText } from 'ai'
import { model } from '@/lib/ai'

export const maxDuration = 300

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: model('openai/gpt-4.1'),
    system: 'You are a helpful assistant.',
    messages,
  })

  return result.toDataStreamResponse()
}

export const GET = POST
