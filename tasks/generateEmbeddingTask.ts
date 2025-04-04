import { TaskConfig } from 'payload'
import { generateEmbedding } from './generateEmbedding'

/**
 * Task to generate an embedding for text
 */
export const generateEmbeddingTask = {
  slug: 'generateEmbedding',
  label: 'Generate Embedding',
  inputSchema: [
    { name: 'text', type: 'text', required: true }
  ],
  outputSchema: [
    { name: 'embedding', type: 'json' }
  ],
  handler: async ({ input, req }: { input: { text: string }, req: any }) => {
    try {
      const text = input.text
      const embedding = await generateEmbedding(text)
      return { embedding }
    } catch (error) {
      console.error('Error in generateEmbedding task:', error)
      throw error
    }
  },
} as unknown as TaskConfig
