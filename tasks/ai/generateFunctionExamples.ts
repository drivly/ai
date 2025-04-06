import { TaskConfig } from 'payload'
import { waitUntil } from '@vercel/functions'
import yaml from 'yaml'

/**
 * Task that generates example arguments for a function based on its name and schema
 */
export const generateFunctionExamples = async ({ input, payload }: any) => {
  const { functionId, count = 3 } = input

  if (!functionId) {
    throw new Error('Function ID is required')
  }

  try {
    const func = await payload.findByID({
      collection: 'functions',
      id: functionId,
      depth: 2,
    })

    if (!func) {
      throw new Error(`Function with ID ${functionId} not found`)
    }

    if (func.examples && func.examples.length > 0 && !input.force) {
      return {
        success: true,
        message: `Function ${func.name} already has examples`,
        examples: func.examples,
      }
    }

    const functionShape = func.shape || {}
    const functionType = func.type || 'Generation'

    let prompt = `Generate ${count} realistic example argument objects for a function named "${func.name}".`

    if (Object.keys(functionShape).length > 0) {
      prompt += ` The function expects arguments with this schema: ${JSON.stringify(functionShape)}`
    }

    prompt += ` Return a JSON array of example argument objects.`

    const job = await payload.jobs.queue({
      task: 'executeFunction',
      input: {
        functionName: 'generateExamples',
        args: {
          functionName: func.name,
          functionType,
          schema: functionShape,
          count,
        },
      },
    })

    const exampleResult = await payload.jobs.runByID({ id: job.id })

    if (!exampleResult?.output) {
      throw new Error('Failed to generate examples')
    }

    const exampleArgs = Array.isArray(exampleResult.output) ? exampleResult.output : [exampleResult.output]

    const exampleResources: string[] = []

    for (let i = 0; i < exampleArgs.length; i++) {
      const exampleData = exampleArgs[i]

      const resource = await payload.create({
        collection: 'resources',
        data: {
          name: `Example ${i + 1} for ${func.name}`,
          type: 'function-example', // This assumes a Noun with this slug exists
          data: exampleData,
        },
      })

      exampleResources.push(resource.id)
    }

    await payload.update({
      collection: 'functions',
      id: functionId,
      data: {
        examples: exampleResources,
      },
    })

    return {
      success: true,
      message: `Generated ${exampleResources.length} examples for function ${func.name}`,
      examples: exampleResources,
    }
  } catch (error) {
    console.error('Error generating function examples:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export const generateFunctionExamplesTask = {
  retries: 3,
  slug: 'generateFunctionExamples',
  label: 'Generate Function Examples',
  inputSchema: [
    { name: 'functionId', type: 'text', required: true },
    { name: 'count', type: 'number' },
    { name: 'force', type: 'checkbox' },
  ],
  outputSchema: [
    { name: 'success', type: 'checkbox' },
    { name: 'message', type: 'text' },
    { name: 'examples', type: 'json' },
    { name: 'error', type: 'text' },
  ],
  handler: generateFunctionExamples,
} as unknown as TaskConfig
