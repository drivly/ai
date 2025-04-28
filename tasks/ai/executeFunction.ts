import { TaskConfig, TaskHandler } from 'payload'
import hash from 'object-hash'
import { generateObject } from './generateObject'
import { generateObjectArray } from './generateObjectArray'
import { generateText } from './generateText'
import { validateWithSchema } from '../language/schemaUtils'
import { generateMarkdown } from './generateMarkdown'
import { generateCode } from './generateCode'

// export const executeFunction: TaskHandler<'executeFunction'> = async ({ input, req }) => {
// TODO: Fix the typing and response ... temporary hack to get results in the functions API
export const executeFunction = async ({ input, req, payload }: any) => {
  const headers = req?.headers ? Object.fromEntries(req?.headers) : undefined
  // const { payload } = req
  if (!payload) payload = req?.payload

  if (!input) {
    throw new Error('Invalid input: input object is undefined')
  }

  if (!input.functionName && input.data) {
    input = {
      functionName: 'executeFunction',
      args: input.data,
      ...input,
    }
  }

  const { functionName = null, args = {}, schema = null, timeout = null, seeds = null, callback = null, type = null } = input

  // Validate required parameters
  if (!functionName) {
    throw new Error('Missing required parameter: functionName')
  }
  const { settings } = input as any
  const start = Date.now()

  // Determine if this is a text-based function (Markdown, Text, TextArray, etc.)
  const isTextFunction = type === 'Text' || type === 'Markdown' || type === 'TextArray' || (settings?.type && ['Text', 'Markdown', 'TextArray'].includes(settings.type))
  const isObjectArrayFunction = type === 'ObjectArray' || (settings?.type && settings.type === 'ObjectArray')
  // Determine if this is a code-based function
  const isCodeFunction = type === 'Code' || (settings?.type && settings.type === 'Code')
  const isHumanFunction = type === 'Human' || (settings?.type && settings.type === 'Human')
  const isAgentFunction = type === 'Agent' || (settings?.type && settings.type === 'Agent')

  // Hash args & schema
  const actionHash = hash({ functionName, args, schema, settings })
  const argsHash = hash(args)
  const schemaHash = schema ? hash(schema) : undefined
  const hashLatency = Date.now() - start

  const cacheTTL = settings?.cacheTTL || 24 * 60 * 60 * 1000 // Default: 24 hours in milliseconds

  let functionDoc, schemaDoc, argsDoc, actionDoc

  try {
    // Lookup function, schema (type), args (thing), and result (action/object)
    const results = await Promise.all([
      payload.find({ collection: 'functions', where: { name: { equals: functionName } }, depth: 0 }),
      schemaHash ? payload.find({ collection: 'types', where: { hash: { equals: schemaHash } }, depth: 0 }) : { docs: [] },
      argsHash ? payload.find({ collection: 'things', where: { hash: { equals: argsHash } }, depth: 0 }) : { docs: [] },
      actionHash ? payload.find({ collection: 'actions', where: { hash: { equals: actionHash } }, depth: 1 }) : { docs: [] },
    ])

    functionDoc = results[0].docs[0]
    schemaDoc = results[1].docs[0]
    argsDoc = results[2].docs[0]
    actionDoc = results[3].docs[0]
  } catch (error) {
    console.error('Error during hash lookups:', error)
    functionDoc = undefined
    schemaDoc = undefined
    argsDoc = undefined
    actionDoc = undefined
  }
  const lookupLatency = Date.now() - (start + hashLatency)

  if (actionDoc?.object) {
    const isCacheValid = actionDoc.createdAt ? Date.now() - new Date(actionDoc.createdAt).getTime() < cacheTTL : false

    if (isCacheValid) {
      payload.create({
        collection: 'events',
        data: { action: actionDoc.id, request: { headers, seeds, callback }, meta: { type: isTextFunction ? 'text' : 'object', cached: true } },
      })

      // Extract the data from the object
      const objectData = actionDoc.object.data || { result: 'test data' }

      // Return the cached result with the expected structure
      return {
        output: objectData,
        reasoning: actionDoc.reasoning || 'cached reasoning',
        cached: true,
      }
    }
  }

  // Create any missing resources
  const createPromise = Promise.all([
    functionDoc
      ? undefined
      : payload.create({
          collection: 'functions',
          data: {
            name: functionName,
            type: isCodeFunction ? 'Code' : 'Generation',
            format: isTextFunction ? type || 'Text' : 'Object',
          },
        }),
    argsDoc ? undefined : payload.create({ collection: 'things', data: { hash: argsHash, data: args } }),
  ])

  // Generate the response based on function type
  const prompt = `${functionName}(${JSON.stringify(args)})`
  let object, text, reasoning, generation, generationLatency, request

  if (isHumanFunction) {
    const { requestHumanFeedback } = await import('./requestHumanFeedback')

    const schema = functionDoc?.shape || {}

    const userId = args.userId || settings?.userId || functionDoc?.user?.id
    const roleId = args.roleId || settings?.roleId || schema.roleId
    const timeoutValue = args.timeout || settings?.timeout || schema.timeout || 3600000 // Default: 1 hour

    const humanFeedbackInput = {
      title: args.title || `Human feedback required: ${functionName}`,
      description: args.description || `Please provide feedback for function: ${functionName}`,
      options: args.options || schema.options,
      freeText: args.freeText !== undefined ? args.freeText : schema.freeText,
      platform: args.platform || schema.platform || 'slack',
      userId,
      roleId,
      timeout: timeoutValue,
      blocks: args.blocks || schema.blocks,
      channel: args.channel || schema.channel,
      mentions: args.mentions || schema.mentions,
    }

    // Create a task and request human feedback
    const result = await requestHumanFeedback({
      input: humanFeedbackInput,
      payload,
    })

    object = result
    reasoning = `Human feedback requested. Task ID: ${result.taskId}, Status: ${result.status}`
    generationLatency = Date.now() - start
    request = { functionName, args, settings }
    
    if (result && result.taskId) {
      payload.jobs.queue({
        task: 'monitorHumanFeedbackTask',
        input: {
          taskId: result.taskId,
          functionName,
          timeout: timeoutValue,
          callback: args.callback || settings?.callback,
        },
      })
    }
  } else if (isAgentFunction) {
    const agentId = functionDoc?.agent || args.agent || settings?.agent

    if (!agentId) {
      throw new Error('Agent ID is required for Agent functions')
    }

    try {
      // Create a task for the agent execution
      const task = await payload.create({
        collection: 'tasks',
        data: {
          title: `Agent Task: ${functionName}`,
          description: `Executing agent function: ${functionName} with agent: ${agentId}`,
          status: 'in-progress',
          metadata: {
            type: 'agent-function',
            functionName,
            agentId,
            createdAt: new Date().toISOString(),
          },
        },
      })

      const agentJobResult = await payload.jobs.queue({
        task: 'executeAgentFunction',
        input: {
          agentId,
          prompt: args.prompt || args.input || JSON.stringify(args),
          context: args.context || settings?.context,
          taskId: task.id,
          options: settings?.agentOptions,
        },
      })

      object = { 
        taskId: task.id,
        status: 'in-progress',
        message: `Agent function execution queued: ${functionName} with agent: ${agentId}`,
        jobId: agentJobResult.id
      }
      
      reasoning = `Agent function execution queued. Task ID: ${task.id}, Agent ID: ${agentId}`
      generationLatency = Date.now() - start
      request = { functionName, agentId, args, settings }
    } catch (error: any) {
      console.error('Error executing agent function:', error)
      
      // Create error response
      object = { error: error.message || 'Unknown error executing agent function' }
      reasoning = `Agent function execution failed: ${error.message}`
      generationLatency = Date.now() - start
      request = { functionName, agentId: agentId, args, settings }
    }
  } else if (isCodeFunction && functionDoc?.code) {
    const { executeCodeFunction } = await import('../code/executeCodeFunction')

    const result = await executeCodeFunction({
      code: functionDoc.code,
      args,
      timeout: settings?.timeout || 5000,
      memoryLimit: settings?.memoryLimit || 128,
    })

    object = result.result
    reasoning = result.error ? `Code execution failed: ${result.error}` : `Code execution complete. Result: ${typeof object === 'object' ? JSON.stringify(object) : object}`
    text = functionDoc.code
    generationLatency = Date.now() - start
    request = { code: functionDoc.code, args, settings }
  } else if (isObjectArrayFunction) {
    let zodSchema
    try {
      // if (schema && typeof schema === 'object' && schema !== null && !Array.isArray(schema)) {
      //   zodSchema = generateSchema(schema)
      // }
    } catch (schemaGenError) {
      console.error('Schema generation error:', schemaGenError)
    }

    const result = await generateObjectArray({
      input: { functionName, args, schema, zodSchema, settings },
      req,
    })

    const objectArray = result.objectArray
    reasoning = result.reasoning
    generation = result.generation
    text = result.text
    generationLatency = result.generationLatency
    request = result.request

    let validatedArray = objectArray
    if (schema && objectArray && Array.isArray(objectArray)) {
      try {
        if (typeof schema === 'object' && schema !== null && !Array.isArray(schema)) {
          validatedArray = objectArray.map((item) => {
            try {
              return validateWithSchema(schema, item)
            } catch (itemError) {
              console.error('Schema validation error for array item:', itemError)
              return {
                ...item,
                _validation_error: {
                  message: 'Failed to validate against schema',
                  details: itemError instanceof Error ? itemError.message : String(itemError),
                },
              }
            }
          })
        }
      } catch (error) {
        console.error('Schema validation error for array:', error)
        validatedArray = objectArray
        object = {
          items: validatedArray,
          _validation_error: {
            message: 'Failed to validate array against schema',
            details: error instanceof Error ? error.message : String(error),
          },
        }
      }
    }

    object = { items: validatedArray }
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
      object = listItems
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
      object = text
    }
  } else {
    let zodSchema
    try {
      // if (schema && typeof schema === 'object' && schema !== null && !Array.isArray(schema)) {
      //   zodSchema = generateSchema(schema)
      // }
    } catch (schemaGenError) {
      console.error('Schema generation error:', schemaGenError)
    }

    // Use generateObject for object-based functions
    const result = await generateObject({
      input: { functionName, args, schema, zodSchema, settings },
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
        if (typeof schema === 'object' && schema !== null && !Array.isArray(schema)) {
          // try {
          //   const zodSchema = generateSchema(schema)
          //   object = zodSchema.parse(object)
          // } catch (schemaGenError) {
          //   console.error('Schema generation error:', schemaGenError)
          //   object = validateWithSchema(schema, object)
          // }
          object = validateWithSchema(schema, object)
        } else {
          object = validateWithSchema(schema, object)
        }
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

  if (process.env.NODE_ENV === 'development') {
    console.log('Generation result:', { generation, text, object })
  }

  const totalLatency = Date.now() - start
  const latency = { hashLatency, lookupLatency, generationLatency, totalLatency }
  console.log(latency)

  const generationHash = input.generationHash || hash({ actionHash, timestamp: Date.now() })

  // Save the results asynchronously
  payload.jobs.queue({
    task: 'saveExecutionResults',
    input: {
      prompt,
      object,
      functionName,
      args,
      settings,
      argsDoc,
      functionDoc,
      reasoning,
      generation,
      generationLatency,
      headers,
      seeds,
      callback,
      isTextFunction,
      latency,
      generationHash, // Pass the generation hash to saveExecutionResults
    },
  })

  if (input.functionName === 'research' && input.slackChannel && input.slackResponseTs && object) {
    console.log(`Sending research results back to Slack channel ${input.slackChannel}`)
    payload.jobs.queue({
      task: 'sendResearchResultsToSlack',
      input: {
        channel: input.slackChannel,
        threadTs: input.slackThreadTs || null,
        responseTs: input.slackResponseTs,
        results: object,
        query: input.args?.topic || 'research query',
      },
    })
  }

  return { output: object, reasoning, generationHash }
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
    { name: 'generationHash', type: 'text' },
  ],
  handler: executeFunction as any,
} as TaskConfig<'executeFunction'>
