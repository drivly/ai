import { TaskConfig } from 'payload'
import { executeFunction } from './executeFunction'

export const inflectNounsTask = {
  retries: 3,
  slug: 'inflectNouns',
  label: 'Inflect Nouns',
  inputSchema: [{ name: 'noun', type: 'text', required: true }],
  outputSchema: [
    { name: 'singular', type: 'text' },
    { name: 'plural', type: 'text' },
    { name: 'possessive', type: 'text' },
    { name: 'pluralPossessive', type: 'text' },
    { name: 'verb', type: 'text' },
    { name: 'act', type: 'text' },
    { name: 'activity', type: 'text' },
    { name: 'event', type: 'text' },
  ],
  handler: async ({ input, req }: { input: { noun: string }; req: any }) => {
    const result = await executeFunction({
      input: {
        functionName: 'inflectNouns',
        args: { noun: input.noun },
      },
      req,
      payload: req.payload,
    })

    return result.output
  },
} as unknown as TaskConfig
