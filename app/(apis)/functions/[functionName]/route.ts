import { executeFunction } from '@/tasks/ai/executeFunction'
import { API } from '@/lib/api'
import { waitUntil } from '@vercel/functions'
import hash from 'object-hash'

export const POST = API(async (request, { db, user, url, payload, params, req }) => {
  const { functionName } = params as { functionName: string }
  const body = await request.json()
  const { input } = body

  if (!input) {
    return Response.json({ error: 'Missing input in request body' }, { status: 400 })
  }

  const { args = {}, settings = {} } = input

  const start = Date.now()
  const results = await executeFunction({ input, payload })
  const latency = Date.now() - start
  const output = results?.output
  const generationHash = results?.generationHash
  const keys = Object.keys(output || {})
  const type = keys.length === 1 ? keys[0] : undefined
  const data = type ? output[type] : output

  // Create links object
  const baseUrl = request.nextUrl.origin + request.nextUrl.pathname
  const links: Record<string, string> = {
    self: decodeURIComponent(url.toString()).replace(/ /g, '+'),
  }

  const modelUrl = new URL(url)
  modelUrl.pathname = modelUrl.pathname + '/models'
  links.models = modelUrl.toString()

  const functionDetails = await db.functions.findOne({
    where: {
      name: {
        equals: functionName,
      },
    },
    depth: 2,
  })

  if (functionDetails?.examples?.length > 0) {
    const examplesUrl = new URL(url)
    examplesUrl.pathname = examplesUrl.pathname + '/examples'
    links.examples = examplesUrl.toString()
  }

  if (generationHash) {
    const generationUrl = new URL(url)
    generationUrl.pathname = `/api/generations/${generationHash}`
    links.generation = generationUrl.toString()
  }

  return {
    functionName,
    args,
    links,
    type,
    data,
    reasoning: results?.reasoning?.split('\n'),
    settings,
    latency,
    examples: functionDetails?.examples || [],
  }
})

export const GET = API(async (request, { db, user, url, payload, params, req }) => {
  const { functionName } = params as { functionName: string }
  const { seed = '1', temperature, model, system, prompt, async = 'false', ...args } = Object.fromEntries(request.nextUrl.searchParams)
  const settings = {
    seed: parseInt(seed),
    temperature: temperature ? parseFloat(temperature) : undefined,
    model,
    system,
    prompt,
  }

  const functionDetails = await db.functions.findOne({
    where: {
      name: {
        equals: functionName,
      },
    },
    depth: 2, // Include related fields like examples
  })

  if (async === 'true') {
    const start = Date.now()

    const generationHash = hash({ functionName, args, settings, timestamp: Date.now() })

    const job = await payload.jobs.queue({
      task: 'executeFunction',
      input: { functionName, args, settings, generationHash },
    })

    waitUntil(payload.jobs.runByID({ id: job.id }))
    const queueLatency = Date.now() - start

    const baseUrl = request.nextUrl.origin + request.nextUrl.pathname
    const links: Record<string, string> = {
      self: decodeURIComponent(url.toString()).replace(/ /g, '+'),
    }

    const statusUrl = new URL(url)
    statusUrl.pathname = `/api/payload-jobs/${job.id}`
    links.status = statusUrl.toString()

    if (functionDetails?.examples?.length > 0) {
      const examplesUrl = new URL(url)
      examplesUrl.pathname = examplesUrl.pathname + '/examples'
      links.examples = examplesUrl.toString()
    }

    const generationUrl = new URL(url)
    generationUrl.pathname = `/api/generations/${generationHash}`
    links.generation = generationUrl.toString()

    return {
      functionName,
      args,
      links,
      type: 'async',
      jobId: job.id,
      queueLatency,
    }
  }

  const start = Date.now()
  const results = await executeFunction({ input: { functionName, args, settings }, payload })
  const latency = Date.now() - start
  const output = results?.output
  const generationHash = results?.generationHash
  const keys = Object.keys(output || {})
  const type = keys.length === 1 ? keys[0] : undefined
  const data = type ? output[type] : output

  // Create links object with next and prev seed values
  const currentSeed = parseInt(seed)
  const baseUrl = request.nextUrl.origin + request.nextUrl.pathname

  // Create a copy of the current search params
  const nextParams = new URLSearchParams(request.nextUrl.searchParams)
  nextParams.set('seed', (currentSeed + 1).toString())

  const links: Record<string, string> = {
    self: decodeURIComponent(url.toString()).replace(/ /g, '+'),
    next: `${baseUrl}?${nextParams.toString()}`,
    // temperature: {},
  }

  // Only include prev link if seed is greater than 1
  if (currentSeed > 1) {
    const prevParams = new URLSearchParams(request.nextUrl.searchParams)
    prevParams.set('seed', (currentSeed - 1).toString())
    links.prev = `${baseUrl}?${prevParams.toString()}`
  }

  const modelUrl = new URL(url)
  modelUrl.pathname = modelUrl.pathname + '/models'
  links.models = modelUrl.toString()

  if (functionDetails?.examples?.length > 0) {
    const examplesUrl = new URL(url)
    examplesUrl.pathname = examplesUrl.pathname + '/examples'
    links.examples = examplesUrl.toString()
  }

  if (generationHash) {
    const generationUrl = new URL(url)
    generationUrl.pathname = `/api/generations/${generationHash}`
    links.generation = generationUrl.toString()
  }

  // // Add temperature links with values 0, 0.2, 0.4, 0.6, 0.8, and 1.0
  // const temperatureValues = [0, 0.2, 0.4, 0.6, 0.8, 1.0]

  // temperatureValues.forEach((temp) => {
  //   const tempParams = new URLSearchParams(request.nextUrl.searchParams)
  //   tempParams.set('temperature', temp.toString())
  //   links.temperature[temp.toString()] = `${baseUrl}?${tempParams.toString()}`
  // })

  return {
    functionName,
    args,
    links,
    type,
    data,
    reasoning: results?.reasoning?.split('\n'),
    settings,
    latency,
    examples: functionDetails?.examples || [],
  }

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
