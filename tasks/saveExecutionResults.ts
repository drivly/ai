import { TaskConfig } from 'payload'
import hash from 'object-hash'

export const saveExecutionResults = async ({ input, req }: { input: any; req: any }) => {
  const { prompt, object, functionName, args, settings, argsDoc, functionDoc, reasoning, generation, generationLatency, headers, seeds, callback, isTextFunction, latency, generationHash } = input

  const payload = req.payload
  const startSave = Date.now()
  const objectHash = hash(object)
  const objectResult = await payload.create({
    collection: 'things',
    data: { name: prompt, hash: objectHash, data: object },
  })
  const actionHash = hash({ functionName, args, settings })

  const actionResult = await payload.db.upsert({
    collection: 'actions',
    where: { hash: { equals: actionHash } },
    data: {
      hash: actionHash,
      subject: argsDoc?.id,
      function: functionDoc?.id,
      object: objectResult?.id,
      reasoning: reasoning,
    },
  })
  const generationResult = await payload.create({
    collection: 'generations',
    data: { id: generationHash, action: actionResult?.id, settings: argsDoc?.id, request: input.request || {}, response: generation || {}, status: 'success', duration: generationLatency },
  })
  const eventResult = await payload.create({
    collection: 'events',
    data: { name: prompt, action: actionResult?.id, request: { headers, seeds, callback }, meta: { type: isTextFunction ? 'text' : 'object', latency } },
  })
  const saveLatency = Date.now() - startSave
  console.log({ saveLatency })

  return { success: true }
}

export const saveExecutionResultsTask = {
  retries: 3,
  slug: 'saveExecutionResults',
  label: 'Save Execution Results',
  inputSchema: [
    { name: 'prompt', type: 'text' },
    { name: 'object', type: 'json' },
    { name: 'functionName', type: 'text' },
    { name: 'args', type: 'json' },
    { name: 'settings', type: 'json' },
    { name: 'argsDoc', type: 'json' },
    { name: 'functionDoc', type: 'json' },
    { name: 'reasoning', type: 'text' },
    { name: 'generation', type: 'json' },
    { name: 'generationLatency', type: 'number' },
    { name: 'headers', type: 'json' },
    { name: 'seeds', type: 'json' },
    { name: 'callback', type: 'text' },
    { name: 'isTextFunction', type: 'text' },
    { name: 'latency', type: 'json' },
    { name: 'generationHash', type: 'text' },
  ],
  outputSchema: [{ name: 'success', type: 'text' }],
  handler: saveExecutionResults,
} as unknown as TaskConfig
