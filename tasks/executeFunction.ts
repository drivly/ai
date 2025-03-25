import { TaskConfig, TaskHandler } from 'payload'
import { waitUntil } from '@vercel/functions'
import hash from 'object-hash'
import { generateObject } from './generateObject'
import { generateText } from './generateText'
import { validateWithSchema } from './schemaUtils'
import { generateMarkdown } from './generateMarkdown'
import { generateCode } from './generateCode'

// export const executeFunction: TaskHandler<'executeFunction'> = async ({ input, req }) => {
// TODO: Fix the typing and response ... temporary hack to get results in the functions API
export const executeFunction = async ({ input, req, payload }: any) => {
  const headers = req?.headers ? Object.fromEntries(req?.headers) : undefined
  // const { payload } = req
  if (!payload) payload = req?.payload
  const { functionName, args, schema, timeout, seeds, callback, type } = input
  const { settings } = input as any
  const start = Date.now()

  // Determine if this is a text-based function (Markdown, Text, TextArray, etc.)
  const isTextFunction = type === 'Text' || type === 'Markdown' || type === 'TextArray' || (settings?.type && ['Text', 'Markdown', 'TextArray'].includes(settings.type))
  // Determine if this is a code-based function
  const isCodeFunction = type === 'Code' || (settings?.type && settings.type === 'Code')

  // Hash args & schema
  const actionHash = hash({ functionName, args, schema, settings })
  const argsHash = hash(args)
  const schemaHash = schema ? hash(schema) : undefined
  const hashLatency = Date.now() - start

  // Lookup function, schema (type), args (thing), and result (action/object)
  // TODO: would these hash lookups be better as upserts?
  let [
    {
      docs: [functionDoc],
    },
    {
      docs: [schemaDoc],
    },
    {
      docs: [argsDoc],
    },
    {
      docs: [actionDoc],
    },
  ] = await Promise.all([
    payload.find({ collection: 'functions', where: { name: { equals: functionName } }, depth: 0 }),
    schemaHash ? payload.find({ collection: 'types', where: { hash: { equals: schemaHash } }, depth: 0 }) : { docs: [] },
    argsHash ? payload.find({ collection: 'things', where: { hash: { equals: argsHash } }, depth: 0 }) : { docs: [] },
    actionHash ? payload.find({ collection: 'actions', where: { hash: { equals: actionHash } }, depth: 1 }) : { docs: [] },
  ])
  const lookupLatency = Date.now() - (start + hashLatency)

  // If we have a cached result, return it immediately without calling generateObject
  if (actionDoc?.object) {
    // If action & output object exists, log event and return action output/object
    waitUntil(payload.create({ collection: 'events', data: { action: actionDoc.id, request: { headers, seeds, callback }, meta: { type: isTextFunction ? 'text' : 'object' } } }))

    // Extract the data from the object
    const objectData = actionDoc.object.data || { result: 'test data' }

    // Log the object data for debugging
    console.log('Test result:', JSON.stringify(objectData))

    // Return the cached result with the expected structure
    return {
      output: objectData,
      reasoning: actionDoc.reasoning || 'cached reasoning',
    }
  }

  // Create any missing resources
  const createPromise = Promise.all([
    functionDoc ? undefined : payload.create({ collection: 'functions', data: { name: functionName, type: isTextFunction ? type || 'Text' : 'Object' } }),
    argsDoc ? undefined : payload.create({ collection: 'things', data: { hash: argsHash, data: args } }),
  ])

  // Generate the response based on function type
  const prompt = `${functionName}(${JSON.stringify(args)})`
  let object, text, reasoning, generation, generationLatency, request

  if (isCodeFunction && functionDoc?.code) {
    // Use generateCode for code-based functions
    const result = await generateCode({
      input: { prompt: functionDoc.code, settings },
    })

    object = result.parsed || result.raw
    reasoning = `Code execution complete. Result: ${typeof object === 'object' ? JSON.stringify(object) : object}`
    text = result.code
    generationLatency = Date.now() - start
    request = { prompt: functionDoc.code, settings }
  } else if (isTextFunction) {
    if (type === 'TextArray') {
      // For TextArray, use generateMarkdown with ordered list prompt
      const textArraySettings = {
        ...settings,
        systemPrompt: `${settings?.systemPrompt || ''}\n\nRespond only with a numbered markdown ordered list. Each item should be on a separate line.`,
      }

      const result = await generateMarkdown({
        input: { functionName, args, settings: textArraySettings },
        req,
      })

      // Parse the markdown ordered list into a string array
      const markdownText = result.markdown
      const lines = markdownText.split('\n')
      const listItems = lines.filter((line) => /^\s*\d+\.\s+.+/.test(line)).map((line) => line.replace(/^\s*\d+\.\s+/, '').trim())

      text = markdownText
      reasoning = result.reasoning
      generation = result.generation
      generationLatency = result.generationLatency
      request = result.request
      object = { data: listItems }
    } else if (type === 'Markdown' || settings?.type === 'Markdown') {
      // Use generateMarkdown for markdown-based functions
      const result = await generateMarkdown({
        input: { functionName, args, settings },
        req,
      })

      text = result.markdown
      reasoning = result.reasoning
      generation = result.generation
      generationLatency = result.generationLatency
      request = result.request
      object = { text, mdast: result.mdast }
    } else {
      // Use generateText for text-based functions
      const result = await generateText({
        input: { functionName, args, settings },
        req,
      })

      text = result.text
      reasoning = result.reasoning
      generation = result.generation
      generationLatency = result.generationLatency
      request = result.request
      object = { text }
    }
  } else {
    // Use generateObject for object-based functions
    const result = await generateObject({
      input: { functionName, args, schema, settings },
      req,
    })

    object = result.object
    reasoning = result.reasoning
    generation = result.generation
    text = result.text
    generationLatency = result.generationLatency
    request = result.request

    // Validate the object against the schema if provided
    if (schema && object) {
      try {
        object = validateWithSchema(schema, object)
      } catch (error) {
        console.error('Schema validation error:', error)
        // Keep the original object but add validation error information
        object = {
          ...object,
          _validation_error: {
            message: 'Failed to validate against schema',
            details: error instanceof Error ? error.message : String(error),
          },
        }
      }
    }
  }

  const created = await createPromise
  if (!functionDoc && created[0]) functionDoc = created[0]
  if (!argsDoc && created[1]) argsDoc = created[1]

  console.log(generation, text, object)

  const totalLatency = Date.now() - start
  const latency = { hashLatency, lookupLatency, generationLatency, totalLatency }
  console.log(latency)

  // Save the results asynchronously
  waitUntil(
    (async () => {
      const startSave = Date.now()
      const objectHash = hash(object)
      const objectResult = await payload.create({
        collection: 'things',
        data: { name: prompt, hash: objectHash, data: object },
      })
      const actionHash = hash({ functionName, args, settings })

      // Use upsert to avoid duplicates with the same hash
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
        data: { action: actionResult?.id, settings: argsDoc?.id, request, response: generation, status: 'success', duration: generationLatency },
      })
      const eventResult = await payload.create({
        collection: 'events',
        data: { name: prompt, action: actionResult?.id, request: { headers, seeds, callback }, meta: { type: isTextFunction ? 'text' : 'object', latency } },
      })
      const saveLatency = Date.now() - startSave
      console.log({ saveLatency })
    })(),
  )

  return { output: object, reasoning }
}

export const executeFunctionTask = {
  retries: 3,
  slug: 'executeFunction',
  label: 'Execute Function',
  inputSchema: [
    { name: 'functionName', type: 'text', required: true },
    { name: 'args', type: 'json', required: true },
    { name: 'project', type: 'text' },
    { name: 'schema', type: 'json' },
    { name: 'settings', type: 'json' },
    { name: 'timeout', type: 'number' },
    { name: 'seeds', type: 'number' },
    { name: 'callback', type: 'text' },
  ],
  outputSchema: [
    { name: 'output', type: 'json' },
    { name: 'reasoning', type: 'text' },
  ],
  handler: executeFunction,
} as TaskConfig<'executeFunction'>
