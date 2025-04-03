import type { CollectionConfig } from 'payload'

export const GenerationBatches: CollectionConfig = {
  slug: 'generation-batches',
  admin: {
    group: 'Observability',
    useAsTitle: 'name',
    description: 'Batches of AI generation jobs'
  },
  access: { 
    update: () => true,
    delete: () => true 
  },
  fields: [
    { 
      name: 'name', 
      type: 'text', 
      required: true 
    },
    { 
      name: 'provider', 
      type: 'select', 
      required: true,
      options: ['openai', 'anthropic', 'google', 'parasail'] 
    },
    { 
      name: 'status', 
      type: 'select', 
      defaultValue: 'queued',
      options: ['queued', 'processing', 'completed', 'failed'] 
    },
    { 
      name: 'batchConfig', 
      type: 'json',
      admin: { description: 'Provider-specific batch configuration' }
    },
    { 
      name: 'providerBatchId', 
      type: 'text',
      admin: { description: 'ID of the batch job in the provider system' }
    },
    { 
      name: 'generations', 
      type: 'relationship', 
      relationTo: 'generations', 
      hasMany: true 
    },
    { name: 'startedAt', type: 'date' },
    { name: 'completedAt', type: 'date' }
  ]
}
