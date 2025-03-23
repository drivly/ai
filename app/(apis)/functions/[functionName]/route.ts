import { executeFunction } from '@/tasks/executeFunction'
import { API } from 'clickable-apis'

export const GET = API(async (request, { db, user, url, payload, params, req }) => {
  // Using the new db interface for more concise syntax
  // const functions = await db.functions.find()
  // If we need a specific function by ID, we could use:
  // const specificFunction = await db.functions.get('function-id')
  const { functionName } = params as { functionName: string }
  const { seed = '1', temperature, model, ...args } = Object.fromEntries(request.nextUrl.searchParams)
  const settings = {
    seed: parseInt(seed),
    temperature: temperature ? parseFloat(temperature) : undefined,
    model,
  }
  
  const start = Date.now()
  const results = await executeFunction({ input: { functionName, args, settings }, payload, req: request })
  const latency = Date.now() - start
  return { functionName, data: results?.output, settings, latency }


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
