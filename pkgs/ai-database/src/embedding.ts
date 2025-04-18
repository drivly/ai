/**
 * Embedding functionality for ai-database
 * Uses the Vercel AI SDK for generating embeddings
 */

import { EmbeddingOptions, EmbeddingResult } from './types'

/**
 * Generate embeddings for text using the AI SDK
 * @param text Text to generate embeddings for
 * @param options Embedding options
 * @returns Promise resolving to embedding result
 */
export async function generateEmbedding(
  text: string | string[],
  options: EmbeddingOptions = {}
): Promise<EmbeddingResult> {
  try {
    const { embed } = await import('ai')
    
    const modelName = options.model || 'openai:text-embedding-3-small'
    
    // Generate embeddings using the AI SDK
    const result = await embed({
      model: modelName as any, // Type assertion needed due to AI SDK typing constraints
      value: Array.isArray(text) ? text : [text]
    })
    
    const embeddings: number[][] = []
    
    // Handle different possible return types from the AI SDK
    if (Array.isArray(result)) {
      for (const item of result) {
        if (item && typeof item === 'object' && 'embedding' in item) {
          const embedding = item.embedding as Float32Array | number[];
          embeddings.push(Array.from(embedding));
        }
      }
    } else if (result && typeof result === 'object') {
      if ('embedding' in result) {
        const embedding = result.embedding;
        if (Array.isArray(embedding)) {
          embeddings.push(Array.from(embedding as Float32Array | number[]));
        }
      }
    }
    
    return {
      embedding: embeddings.length > 0 ? embeddings : null,
      model: modelName,
      success: embeddings.length > 0
    }
  } catch (error) {
    console.error('Error generating embedding:', error)
    return {
      embedding: null,
      model: options.model || 'openai:text-embedding-3-small',
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

/**
 * Calculate cosine similarity between two embeddings
 * @param embedding1 First embedding vector
 * @param embedding2 Second embedding vector
 * @returns Cosine similarity score (0-1)
 */
export function calculateSimilarity(embedding1: number[], embedding2: number[]): number {
  if (embedding1.length !== embedding2.length) {
    throw new Error('Embeddings must have the same dimensions')
  }
  
  let dotProduct = 0
  let magnitude1 = 0
  let magnitude2 = 0
  
  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i]
    magnitude1 += embedding1[i] * embedding1[i]
    magnitude2 += embedding2[i] * embedding2[i]
  }
  
  magnitude1 = Math.sqrt(magnitude1)
  magnitude2 = Math.sqrt(magnitude2)
  
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0
  }
  
  return dotProduct / (magnitude1 * magnitude2)
}
