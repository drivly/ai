/**
 * Embedding functionality for ai-database
 * Uses OpenAI API directly for generating embeddings
 */

import { EmbeddingOptions, EmbeddingResult } from './types'

/**
 * Generate embeddings for text using OpenAI API
 * @param text Text to generate embeddings for
 * @param options Embedding options
 * @returns Promise resolving to embedding result
 */
export async function generateEmbedding(text: string | string[], options: EmbeddingOptions = {}): Promise<EmbeddingResult> {
  try {
    const modelName = options.model || 'text-embedding-3-small'
    const apiKey = options.apiKey || (typeof globalThis !== 'undefined' && globalThis.process?.env?.OPENAI_API_KEY)

    if (!apiKey) {
      throw new Error('apiKey option or OPENAI_API_KEY environment variable is required for embedding generation')
    }

    // Prepare the input for the OpenAI API
    const input = Array.isArray(text) ? text : [text]

    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        input,
        model: modelName,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const embeddings: number[][] = []

    if (data && data.data && Array.isArray(data.data)) {
      for (const item of data.data) {
        if (item && item.embedding && Array.isArray(item.embedding)) {
          embeddings.push(item.embedding)
        }
      }
    }

    return {
      embedding: embeddings.length > 0 ? embeddings : null,
      model: modelName,
      success: embeddings.length > 0,
    }
  } catch (error) {
    console.error('Error generating embedding:', error)
    return {
      embedding: null,
      model: options.model || 'text-embedding-3-small',
      success: false,
      error: error instanceof Error ? error.message : String(error),
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
