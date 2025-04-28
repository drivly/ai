import { TaskConfig } from 'payload'
import { analyzeFunctionDefinition } from '../../utils/functionAnalyzer'

export const analyzeFunctionTask = {
  retries: 3,
  slug: 'analyzeFunction',
  label: 'Analyze Function',
  inputSchema: [
    { name: 'name', type: 'text', required: true },
    { name: 'schema', type: 'json' },
  ],
  outputSchema: [
    { name: 'type', type: 'text' },
    { name: 'format', type: 'text' },
    { name: 'verb', type: 'text' },
    { name: 'subject', type: 'text' },
    { name: 'object', type: 'text' },
    { name: 'examples', type: 'json' },
    { name: 'verbForms', type: 'json' },
    { name: 'nounForms', type: 'json' },
    { name: 'confidence', type: 'number' },
  ],
  handler: async ({ input, req }: { input: { name: string; schema?: any }; req: any }) => {
    const { name, schema } = input;
    const result = await analyzeFunctionDefinition(name, schema, req.payload);
    return result;
  },
} as unknown as TaskConfig
