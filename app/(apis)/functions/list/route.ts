import { API } from '@/lib/api'
import { list } from '@/sdks/functions.do/src/list'
import { NextResponse } from 'next/server'

export const GET = API(async (request, { user, url }) => {
  const { system, prompt, model, stream } = Object.fromEntries(request.nextUrl.searchParams)
  const baseSystemPrompt = system || 'You are an assistant that always responds with numbered, markdown ordered lists.'

  if (!prompt) {
    return new NextResponse('Missing required prompt parameter', { status: 400 })
  }

  if (stream === 'true') {
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const iterator = await list(prompt, {
          system: baseSystemPrompt,
          model,
          stream: true,
        })

        for await (const item of iterator()) {
          controller.enqueue(encoder.encode(`${item}\n`))
        }
        controller.close()
      },
    })

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked',
      },
    })
  }

  const result = await list(prompt, {
    system: baseSystemPrompt,
    model,
  })

  const baseUrl = request.nextUrl.origin + request.nextUrl.pathname
  const links = {
    self: url.toString(),
    home: baseUrl,
  }

  return {
    items: result.items,
    links,
    prompt,
    settings: {
      system: baseSystemPrompt,
      model: model || 'default',
    },
  }
})
