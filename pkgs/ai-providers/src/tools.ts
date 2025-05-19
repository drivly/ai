import { jsonSchema } from 'ai'
import TurndownService from 'turndown'
import { generateText } from './ai'

export const fetchWebsiteContents = {
  type: 'function',
  description: 'Fetch a website',
  parameters: jsonSchema({
    title: 'Fetch',
    type: 'object',
    properties: {
      url: { type: 'string', description: 'The URL to fetch' },
      method: { type: 'string', description: 'The HTTP method to use', enum: ['GET', 'POST', 'PUT', 'DELETE'], default: 'GET' },
      headers: {
        type: 'object',
        properties: {
          'Content-Type': { type: 'string', description: 'The content type of the request' },
          'Authorization': { type: 'string', description: 'The authorization header' }
        }
      },
      additionalProperties: false, 
    },
    required: ['url']
  }),
  execute: async (args: any) => {
    console.log(
      `[FETCH TOOL] Fetching`,
      args
    )

    const start = Date.now()

    const response = await fetch(args.url, {
      method: args.method ?? 'GET', 
      headers: args.headers ?? {}
    })

    // We need to do this to avoid overloading the model with too much text
    const turndown = new TurndownService()
    let text = await response.text()

    // Remove any script tags.
    text = text.replace(/<script[\s\S]*?<\/script>/g, '')
    text = text.replace(/<style[\s\S]*?<\/style>/g, '')
    // Remove SVGs
    text = text.replace(/<svg[\s\S]*?<\/svg>/g, '')
    
    const markdown = turndown.turndown(
      // Only return the content within the body tag.
      text.match(/<body>([\s\S]*)<\/body>/)?.[1] ?? text
    )

    console.log(
      `[FETCH] Finished fetching ${args.url} in ${Date.now() - start}ms`
    )

    return markdown
  }
}

export const worker = (options: any) => ({
  type: 'function',
  description: 'Run a worker to complete a given task. This will send the prompt to another AI to complete the given task.',
  parameters: jsonSchema({
    title: 'WorkerPrompt',
    type: 'object',
    properties: {
      prompt: { type: 'string', description: 'The prompt to send to the worker. Be clear, with a clear goal in mind.' },
      additionalProperties: false, 
    },
    required: ['prompt']
  }),
  execute: async (args: any) => {
    console.log(
      `[WORKER TOOL] Starting working with prompt`,
      args.prompt
    )

    const start = Date.now()

    const response = await generateText({
      model: options.model,
      tools: options.tools,
      prompt: args.prompt,
      user: options.user,
      maxSteps: 5 // lower cap for workers
    })

    console.log(
      `[WORKER] Resolved worker in ${Date.now() - start}ms`,
      response.text.slice(0, 100) + '...'
    )

    return response.text
  }
})

export const testTool = {
  type: 'function',
  description: 'Test a tool',
  parameters: jsonSchema({
    title: 'TestTool',
    type: 'object',
    properties: {
      message: { type: 'string', description: 'The message to return' },
      additionalProperties: false
    },
    required: ['message']
  }),
  execute: async (args: any) => {
    return args.message
  }
}

export const allTools = {
  fetchWebsiteContents,
  worker,
  testTool
}