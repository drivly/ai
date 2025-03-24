import { TaskConfig } from 'payload'
import { executeFunction } from './executeFunction'

/**
 * Execute a text function that returns markdown-formatted text
 * This is a wrapper around executeFunction that sets the type to 'Text'
 */
export const executeTextFunction = async ({ input, req, payload }: any) => {
  // Set the type to 'Text' to use the generateText utility
  const textInput = {
    ...input,
    type: 'Text'
  }
  
  // Call the executeFunction with the modified input
  return executeFunction({ input: textInput, req, payload })
}

export const executeTextFunctionTask = {
  retries: 3,
  slug: 'executeTextFunction',
  label: 'Execute Text Function',
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
  handler: executeTextFunction,
} as TaskConfig<'executeTextFunction'>