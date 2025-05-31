import { getGeneration } from '@/lib/openrouter'
import { waitUntil } from '@vercel/functions'
import type { CollectionConfig, Payload } from 'payload'
import { getApiKey } from '../admin/APIKeys'
import { Generation } from '@/payload.types'

export const Generations: CollectionConfig = {
  slug: 'generations',
  admin: {
    group: 'Observability',
    // useAsTitle: 'action',
    description: 'Records of AI model generation requests and responses',
  },
  access: { update: () => false, delete: () => false },
  fields: [
    // { name: 'action', type: 'relationship', relationTo: 'actions' },
    { name: 'settings', type: 'relationship', relationTo: 'resources' },
    { name: 'request', type: 'json', admin: { editorOptions: { padding: { top: 20, bottom: 20 } } } },
    { name: 'response', type: 'json', admin: { editorOptions: { padding: { top: 20, bottom: 20 } } } },
    { name: 'error', type: 'json', admin: { editorOptions: { padding: { top: 20, bottom: 20 } } } },
    { name: 'status', type: 'select', options: ['success', 'error'] },
    { name: 'duration', type: 'number' },
    { name: 'processingMode', type: 'select', options: ['realtime', 'batch'], defaultValue: 'realtime' },
    { name: 'batch', type: 'relationship', relationTo: 'generationBatches' },

    // { name: 'function', type: 'relationship', relationTo: 'functions' },
    // { name: 'input', type: 'relationship', relationTo: 'resources' },
    // { name: 'output', type: 'relationship', relationTo: 'resources' },
  ],
  endpoints: [
    {
      path: '/:id/details',
      method: 'get',
      handler: async ({ routeParams = {}, payload, headers }) => {
        const { id } = routeParams
        if (typeof id !== 'string' && typeof id !== 'number') {
          return Response.json({ error: 'Generation ID is required' }, { status: 400 })
        }
        const apiKey = await getApiKey(headers, payload)
        if (apiKey instanceof Response) {
          return apiKey
        }
        if (!apiKey) {
          return Response.json({ error: 'API key not found' }, { status: 401 })
        }
        const {
          docs: [generationDoc],
        } = await payload.find({
          collection: 'generations',
          where: {
            response: {
              contains: id,
            },
          },
          limit: 1,
        })
        if (typeof generationDoc?.response === 'string') {
          try {
            return Response.json(JSON.parse(generationDoc.response))
          } catch (error) {
            console.error('Error parsing generation response', error)
          }
        }
        const generation = await storeGeneration({ id, apiKey, payload })
        return Response.json(generation)
      },
    },
  ],
}

export async function storeGeneration({
  id,
  apiKey,
  payload,
  data = {},
}: {
  id: string | number
  apiKey: string
  payload: Payload
  data?: Omit<Generation, 'createdAt' | 'updatedAt' | 'sizes' | 'id'>
}) {
  const generation = await getGeneration(id, apiKey)
  waitUntil(
    payload.create({
      collection: 'generations',
      data: {
        response: JSON.stringify(generation),
        ...data,
      },
    }),
  )
  return generation
}
