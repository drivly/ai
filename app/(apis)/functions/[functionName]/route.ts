import { executeFunction } from '@/tasks/executeFunction'
import { API } from 'clickable-apis'

export const GET = API(async (request, { db, user, url, payload, params, req }) => {
  // Using the new db interface for more concise syntax
  // const functions = await db.functions.find()
  // If we need a specific function by ID, we could use:
  // const specificFunction = await db.functions.get('function-id')
  const { functionName } = params as { functionName: string }
  const { seed = '1', temperature, model, system, prompt, ...args } = Object.fromEntries(request.nextUrl.searchParams)
  const settings = {
    seed: parseInt(seed),
    temperature: temperature ? parseFloat(temperature) : undefined,
    model,
    system,
    prompt,
  }

  const start = Date.now()
  const results = await executeFunction({ input: { functionName, args, settings }, payload })
  const latency = Date.now() - start
  const output = results?.output
  const keys = Object.keys(output || {})
  const type = keys.length === 1 ? keys[0] : undefined
  const data = type ? output[type] : output
  
  // Create links object with next and prev seed values
  const currentSeed = parseInt(seed)
  const baseUrl = request.nextUrl.origin + request.nextUrl.pathname
  
  // Create a copy of the current search params
  const nextParams = new URLSearchParams(request.nextUrl.searchParams)
  nextParams.set('seed', (currentSeed + 1).toString())
  
  const links: { 
    next: string; 
    prev?: string;
    temperature?: {
      '0': string;
      '0.2': string;
      '0.4': string;
      '0.6': string;
      '0.8': string;
      '1': string;
    }
  } = {
    next: `${baseUrl}?${nextParams.toString()}`,
  }
  
  // Only include prev link if seed is greater than 1
  if (currentSeed > 1) {
    const prevParams = new URLSearchParams(request.nextUrl.searchParams)
    prevParams.set('seed', (currentSeed - 1).toString())
    links.prev = `${baseUrl}?${prevParams.toString()}`
  }
  
  // Add temperature links
  const temperatureValues = [0, 0.2, 0.4, 0.6, 0.8, 1.0]
  links.temperature = {} as any
  
  temperatureValues.forEach(temp => {
    const tempParams = new URLSearchParams(request.nextUrl.searchParams)
    tempParams.set('temperature', temp.toString())
    // Use a type assertion to tell TypeScript that temp.toString() is a valid key
    const key = temp.toString() as '0' | '0.2' | '0.4' | '0.6' | '0.8' | '1'
    links.temperature![key] = `${baseUrl}?${tempParams.toString()}`
  })
  
  return { functionName, args, links, type, data, reasoning: results?.reasoning?.split('\n'), settings, latency }

  // const job = await payload.jobs.queue({
  //   task: 'executeFunction',
  //   input: { functionName, args, settings },
  // })
  // const queueLatency = Date.now() - start

  // if (job.id) {
  //   const result = await payload.jobs.runByID({ id: job.id })
  //   const runLatency = Date.now() - (start + queueLatency)
  //   return { data: result, queueLatency, runLatency }
  // } else {
  //   throw new Error('Failed to queue job')
  // }
})
