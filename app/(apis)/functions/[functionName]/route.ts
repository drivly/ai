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
    prompt
  }
  
  const start = Date.now()
  const results = await executeFunction({ input: { functionName, args, settings }, payload })
  const latency = Date.now() - start
  const output = results?.output
  const keys = Object.keys(output || {})
  const type = keys.length === 1 ? keys[0]: undefined
  const data = type ? output[type] : output
  return { functionName, args, type, data, reasoning: results?.reasoning?.split('\n'), settings, latency }


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
