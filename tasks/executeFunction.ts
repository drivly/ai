import { TaskConfig, TaskHandler } from 'payload'
import { waitUntil } from '@vercel/functions'
import hash from 'object-hash'

// export const executeFunction: TaskHandler<'executeFunction'> = async ({ input, req }) => {
// TODO: Fix the typing and response ... temporary hack to get results in the functions API
export const executeFunction = async ({ input, req, payload }: any) => {
  const headers = req?.headers ? Object.fromEntries(req?.headers) : undefined
  // const { payload } = req
  if (!payload) payload = req?.payload
  const { functionName, args, schema, timeout, seeds, callback } = input
  const { settings } = input as any
  const start = Date.now()

  // Hash args & schema
  const actionHash = hash({ functionName, args, schema, settings })
  const argsHash = hash(args)
  const schemaHash = schema ? hash(schema) : undefined
  const hashLatency = Date.now() - start

  // Lookup function, schema (type), args (thing), and result (action/object)
  // TODO: would these hash lookups be better as upserts?
  let [{ docs: [functionDoc] }, { docs: [schemaDoc] }, { docs: [argsDoc] }, { docs: [actionDoc] }] = await Promise.all([
    payload.find({ collection: 'functions', where: { name: { equals: functionName } }, depth: 0 }),
    schemaHash ? payload.find({ collection: 'types', where: { hash: { equals: schemaHash } }, depth: 0 }) : { docs: [] },
    argsHash ? payload.find({ collection: 'things', where: { hash: { equals: argsHash } }, depth: 0 }) : { docs: [] },
    actionHash ? payload.find({ collection: 'actions', where: { hash: { equals: actionHash } }, depth: 1 }) : { docs: [] },
  ])
  const lookupLatency = Date.now() - (start + hashLatency)

  if (actionDoc?.object) {
    // If action & output object exists, log event and return action output/object
    waitUntil(payload.create({ collection: 'events', data: { action: actionDoc.id, request: { headers, seeds, callback }, meta: { type: 'object' } } }))
    return { output: actionDoc.object }
  }

  // TODO: If args (thing) does not exist, then save thing
  // TODO: If action exists, but no output object, then generate output object
  // TODO: If function exists, but no action, then generate object and save action
  // TODO: If function does not exist, then create function, generate object and save action
  const createPromise = Promise.all([
    functionDoc ? undefined : payload.create({ collection: 'functions', data: { name: functionName, type: 'Object' } }), // TODO: Figure out how to handle other types
    argsDoc ? undefined : payload.create({ collection: 'things', data: { hash: argsHash, data: args } }),
    // actionDoc ? undefined : payload.create({ collection: 'actions', data: { hash: actionHash, subject: argsDoc.id, verb: { relationTo: 'functions', value: functionDoc.id }, object: schemaDoc.id } }),
  ])

  // TODO: Refactor into generateObject & generateText tasks
  const prompt = `${functionName}(${JSON.stringify(args)})`
  const request = {
    model: settings?.model || 'google/gemini-2.0-flash-001',
    messages: [
      { role: 'system', content: 'Respond ONLY with JSON.' }, // TODO: Figure out how to integrate/configure
      { role: 'user', content: prompt }, // TODO: Merge with prompt settings/config
    ],
    response_format: { type: 'json_object' },
    ...settings
  }

  const url = process.env.AI_GATEWAY_URL ? process.env.AI_GATEWAY_URL + '/v1/chat/completions' : 'https://openrouter.ai/api/v1/chat/completions'
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.AI_GATEWAY_TOKEN || process.env.OPEN_ROUTER_API_KEY}`,
      'HTTP-Referer': 'https://functions.do', // TODO: Figure out the proper logic to set/override the app
      'X-Title': 'Functions.do - Reliable Structured Outputs Without Complexity', // TODO: Figure out a dynamic place for the app title
    },
    body: JSON.stringify(request),
  })

  const generation = await response.json()
  const generationLatency = Date.now() - (start + lookupLatency + hashLatency)

  const created = await createPromise
  if (!functionDoc && created[0]) functionDoc = created[0]
  if (!argsDoc && created[1]) argsDoc = created[1]


  const text = generation?.choices?.[0]?.message?.content || ''
  const reasoning = generation?.choices?.[0]?.message?.reasoning || undefined
  let object: any

  try {
    object = JSON.parse(text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, ''))
  } catch (error) { }

  console.log(generation, text, object)


  const totalLatency = Date.now() - start
  const latency = { hashLatency, lookupLatency, generationLatency, totalLatency }
  console.log(latency)

  waitUntil((async () => {
    // TODO: Save Action
    // TODO: Save Generation
    // TODO: Save Event
    const startSave = Date.now()
    const actionResult = await payload.create({ collection: 'actions', data: { hash: actionHash, subject: argsDoc?.id, verb: { relationTo: 'functions', value: functionDoc?.id }, object: schemaDoc?.id } })
    const generationResult = await payload.create({ collection: 'generations', data: { action: actionResult?.id, settings: argsDoc?.id, request, response: generation, status: 'success', duration: generationLatency } })
    const eventResult = await payload.create({ collection: 'events', data: { name: prompt, action: actionResult?.id, request: { headers, seeds, callback }, meta: { type: 'object', latency } } })
    const saveLatency = Date.now() - (startSave)
    console.log({ saveLatency })
  })())

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
    { name: 'settings', type: 'json' }, // TODO: Define the correct type here
    { name: 'timeout', type: 'number' },
    { name: 'seeds', type: 'number' },
    { name: 'callback', type: 'text' },
  ],
  outputSchema: [
    { name: 'output', type: 'json' },
    { name: 'reasoning', type: 'text' },
  ],
  handler: executeFunction,
  // onFail: async (ctx) => {}
  // onSuccess: async (ctx) => {}
  // handler: async ({ input, req, tasks, inlineTask }) => {
  //   const headers = Object.fromEntries(req.headers)
  //   const { payload } = req
  //   const { functionName, args, schema, timeout, seeds, callback } = input
  //   const { settings } = input as any
  //   const start = Date.now()

  //   // Hash args & schema
  //   const actionHash = hash({ functionName, args, schema, settings })
  //   const argsHash = hash(args)
  //   const schemaHash = schema ? hash(schema) : undefined
  //   const hashLatency = Date.now() - start

  //   // Lookup function, schema (type), args (thing), and result (action/object)
  //   // TODO: would these hash lookups be better as upserts?
  //   let [{ docs: [functionDoc] }, { docs: [schemaDoc] }, { docs: [argsDoc] }, { docs: [actionDoc] }] = await Promise.all([
  //     payload.find({ collection: 'functions', where: { name: { equals: functionName } }, depth: 0 }),
  //     schemaHash ? payload.find({ collection: 'types', where: { hash: { equals: schemaHash } }, depth: 0 }) : { docs: [] },
  //     argsHash ? payload.find({ collection: 'things', where: { hash: { equals: argsHash } }, depth: 0 }) : { docs: [] },
  //     actionHash ? payload.find({ collection: 'actions', where: { hash: { equals: actionHash } }, depth: 1 }) : { docs: [] },
  //   ])
  //   const lookupLatency = Date.now() - (start + hashLatency)

  //   if (actionDoc?.object) {
  //     // If action & output object exists, log event and return action output/object
  //     waitUntil(payload.create({ collection: 'events', data: { action: actionDoc.id, request: { headers, seeds, callback }, meta: { type: 'object' } } }))
  //     return { output: actionDoc.object }
  //   }

  //   // TODO: If args (thing) does not exist, then save thing
  //   // TODO: If action exists, but no output object, then generate output object
  //   // TODO: If function exists, but no action, then generate object and save action
  //   // TODO: If function does not exist, then create function, generate object and save action
  //   const createPromise = Promise.all([
  //     functionDoc ? undefined : payload.create({ collection: 'functions', data: { name: functionName, type: 'Object' } }), // TODO: Figure out how to handle other types
  //     argsDoc ? undefined : payload.create({ collection: 'things', data: { hash: argsHash, data: args } }),
  //     // actionDoc ? undefined : payload.create({ collection: 'actions', data: { hash: actionHash, subject: argsDoc.id, verb: { relationTo: 'functions', value: functionDoc.id }, object: schemaDoc.id } }),
  //   ])

  //   // TODO: Refactor into generateObject & generateText tasks
  //   const prompt = `${functionName}(${JSON.stringify(args)})`
  //   const request = {
  //     model: settings?.model || 'google/gemini-2.0-flash-001',
  //     messages: [
  //       { role: 'system', content: 'Respond ONLY with JSON.' }, // TODO: Figure out how to integrate/configure
  //       { role: 'user', content: prompt }, // TODO: Merge with prompt settings/config
  //     ],
  //     response_format: { type: 'json_object' },
  //     ...settings
  //   }

  //   const url = process.env.AI_GATEWAY_URL ? process.env.AI_GATEWAY_URL + '/v1/chat/completions' : 'https://openrouter.ai/api/v1/chat/completions'
  //   const response = await fetch(url, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${process.env.AI_GATEWAY_TOKEN}`,
  //       'HTTP-Referer': 'https://functions.do', // TODO: Figure out the proper logic to set/override the app
  //       'X-Title': 'Reliable Structured Outputs Without Complexity', // TODO: Figure out a dynamic place for the app title
  //     },
  //     body: JSON.stringify(request),
  //   })

  //   const generation = await response.json()
  //   const generationLatency = Date.now() - (start + lookupLatency + hashLatency)

  //   const created = await createPromise
  //   if (!functionDoc && created[0]) functionDoc = created[0]
  //   if (!argsDoc && created[1]) argsDoc = created[1]


  //   const text = generation?.choices?.[0]?.message?.content || ''
  //   let object: any

  //   try {
  //     object = JSON.parse(text)
  //   } catch (error) { }

  //   console.log(generation, text, object)


  //   const totalLatency = Date.now() - start
  //   const latency = { hashLatency, lookupLatency, generationLatency, totalLatency }
  //   console.log(latency)

  //   // waitUntil((async () => {
  //     // TODO: Save Action
  //     // TODO: Save Generation
  //     // TODO: Save Event
  //     const startSave = Date.now()
  //     const actionResult = await payload.create({ collection: 'actions', data: { hash: actionHash, subject: argsDoc?.id, verb: { relationTo: 'functions', value: functionDoc?.id }, object: schemaDoc?.id } })
  //     const generationResult = await payload.create({ collection: 'generations', data: { action: actionResult?.id, settings: argsDoc?.id, request, response: generation, status: 'success', duration: generationLatency } })
  //     const eventResult = await payload.create({ collection: 'events', data: { name: prompt, action: actionResult?.id, request: { headers, seeds, callback }, meta: { type: 'object', latency } } })
  //     const saveLatency = Date.now() - (startSave)
  //     console.log({ saveLatency })
  //   // })())

  //   return { output: object }
    

  //   // if (functionDoc) {
  //   //   switch (functionDoc.type) {ob
  //   //     case 'Object':
  //   //     case 'ObjectArray':
  //   //       // Generate object
  //   //       break
  //   //     case 'Text':
  //   //     case 'TextArray':
  //   //     case 'Markdown':
  //   //     case 'Code':
  //   //       // Generate text
  //   //       break
  //   //   }
  //   // } else {

  //   // }


  //   // return { output: 'success' }
  // },
} as TaskConfig<'executeFunction'>
