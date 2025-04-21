import { API } from '@/lib/api'
import { model } from '@/lib/ai'
import { embed, embedMany } from 'ai'

export const POST = API(async (request, { user }) => {
  if (!user?.id) {
    return { error: 'Unauthorized', status: 401 }
  }

  const body = await request.json()
  
  if (!body.text && !body.texts) {
    return { error: 'Missing required parameter: text or texts', status: 400 }
  }

  if (!body.model) {
    return { error: 'Missing required parameter: model', status: 400 }
  }

  try {
    const embeddingModel = model.textEmbeddingModel(body.model)
    
    let result

    if (body.text) {
      result = await embed({
        model: embeddingModel,
        value: body.text,
      })

      return {
        data: {
          embeddings: [result.embedding],
          model: body.model,
        },
        usage: result.usage,
      }
    } else {
      result = await embedMany({
        model: embeddingModel,
        values: body.texts,
      })

      return {
        data: {
          embeddings: result.embeddings,
          model: body.model,
        },
        usage: result.usage,
      }
    }
  } catch (error) {
    console.error('Error generating embeddings:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to generate embeddings',
      status: 500,
    }
  }
})

export const GET = API(async (request, { origin }) => {
  return {
    description: 'API to generate embeddings from text using multiple providers',
    documentation: `${origin}/docs/embed`,
    endpoints: {
      post: {
        description: 'Generate embeddings from text',
        parameters: {
          text: 'String: Single text input to embed (alternative to texts)',
          texts: 'Array: Multiple text inputs to embed (alternative to text)',
          model: 'String: Embedding model to use (e.g., "text-embedding-3-small")',
        },
        examples: {
          singleText: {
            text: 'Embed this text for semantic search',
            model: 'text-embedding-3-small',
          },
          multipleTexts: {
            texts: ['Embed this text for semantic search', 'And this one too'],
            model: 'text-embedding-3-small',
          },
        },
      },
    },
  }
})
