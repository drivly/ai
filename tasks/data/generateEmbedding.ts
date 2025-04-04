import { openai } from '@ai-sdk/openai'

const MODEL = 'text-embedding-3-large'
const DIMENSIONS = 256

/**
 * Generates an embedding for the provided text using OpenAI
 * @param text Text to generate embedding for
 * @returns Promise with the embedding array
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const embeddingModel = openai.textEmbeddingModel(MODEL)
    
    const result = await embeddingModel.doEmbed({ values: [text] })
    
    return result.embeddings[0] as unknown as number[]
  } catch (error) {
    console.error('Error generating embedding:', error)
    throw error
  }
}

/**
 * Prepares text from a Thing document for embedding
 * @param doc Thing document to prepare text from
 * @returns String of text to embed
 */
export function prepareTextForEmbedding(doc: any): string {
  const parts = [
    doc.name || '',
    typeof doc.data === 'object' ? JSON.stringify(doc.data) : (doc.data || ''),
  ]
  
  return parts.filter(Boolean).join(' ').trim()
}
