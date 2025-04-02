import { TaskConfig } from 'payload'
import { executeFunction } from './executeFunction'

export const conjugateVerbsTask = {
  retries: 3,
  slug: 'conjugateVerbs',
  label: 'Conjugate Verbs',
  inputSchema: [{ name: 'verb', type: 'text', required: true }],
  outputSchema: [
    { name: 'act', type: 'text' },
    { name: 'activity', type: 'text' },
    { name: 'event', type: 'text' },
    { name: 'subject', type: 'text' },
    { name: 'object', type: 'text' },
    { name: 'inverse', type: 'text' },
    { name: 'inverseAct', type: 'text' },
    { name: 'inverseActivity', type: 'text' },
    { name: 'inverseEvent', type: 'text' },
    { name: 'inverseSubject', type: 'text' },
    { name: 'inverseObject', type: 'text' },
  ],
  handler: async ({ input, req }: { input: { verb: string }; req: any }) => {
    const result = await executeFunction({
      input: {
        functionName: 'conjugateVerbs',
        args: { verb: input.verb },
      },
      req,
      payload: req.payload,
    })

    return result.output
  },
} as unknown as TaskConfig
