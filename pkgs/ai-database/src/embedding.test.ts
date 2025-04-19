import { describe, it, expect, vi } from 'vitest'
import { generateEmbedding, calculateSimilarity } from './embedding'

global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: vi.fn().mockResolvedValue({
    data: [
      {
        embedding: [0.1, 0.2, 0.3],
        index: 0,
      },
    ],
  }),
})

vi.stubGlobal('process', {
  env: {
    OPENAI_API_KEY: 'test-api-key',
  },
})

describe('embedding', () => {
  it('exports generateEmbedding function', () => {
    expect(generateEmbedding).toBeDefined()
    expect(typeof generateEmbedding).toBe('function')
  })

  it('exports calculateSimilarity function', () => {
    expect(calculateSimilarity).toBeDefined()
    expect(typeof calculateSimilarity).toBe('function')
  })

  it('generates embeddings for text', async () => {
    const result = await generateEmbedding('test text', { apiKey: 'test-api-key' })

    expect(result).toBeDefined()
    expect(result.success).toBe(true)
    expect(result.model).toBe('text-embedding-3-small')
    expect(result.embedding).toBeInstanceOf(Array)
    expect(result.embedding?.[0]).toBeInstanceOf(Array)
  })

  it('calculates similarity between two embeddings', () => {
    const embedding1 = [0.1, 0.2, 0.3]
    const embedding2 = [0.2, 0.3, 0.4]

    const similarity = calculateSimilarity(embedding1, embedding2)

    expect(similarity).toBeGreaterThan(0)
    expect(similarity).toBeLessThanOrEqual(1)
  })

  it('throws error when embeddings have different dimensions', () => {
    const embedding1 = [0.1, 0.2, 0.3]
    const embedding2 = [0.2, 0.3]

    expect(() => calculateSimilarity(embedding1, embedding2)).toThrow('Embeddings must have the same dimensions')
  })
})
