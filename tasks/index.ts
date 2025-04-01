import { TaskConfig } from 'payload'
import { executeFunctionTask } from './executeFunction'
import { generateCodeTask } from './generateCode'
import { executeCodeFunctionTask } from './executeCodeFunction'
import { generateThingEmbedding } from './generateThingEmbedding'
import { handleGithubEvent } from './handleGithubEvent'
import { hybridSearchThings, searchThings } from './searchThings'
import { parseSchemaToZod, schemaToJsonSchema, validateWithSchema } from './schemaUtils'
import { processCodeFunctionWrapperTask } from './processCodeFunctionWrapper'
import { processCodeFunctionTask } from './processCodeFunction'
import { inflectNounsTask } from './inflectNouns'
import { conjugateVerbsTask } from './conjugateVerbs'
import { deployWorkerTask } from './deployWorker'
import { deliverWebhookTask } from './deliverWebhook'
import { initiateComposioConnectionTask } from './initiateComposioConnection'
import { requestHumanFeedbackTask } from './requestHumanFeedback'
import { processDomain } from './processDomain'
import { processBatchOpenAITask } from './batchOpenAI'
import { processBatchAnthropicTask } from './batchAnthropic'
import { processBatchGoogleVertexAITask } from './batchGoogleVertexAI'
import { processBatchParasailTask } from './batchParasail'
import { createGenerationBatchTask } from './createGenerationBatch'

const generateThingEmbeddingTask = {
  slug: 'generateThingEmbedding',
  label: 'Generate Thing Embedding',
  inputSchema: [
    { name: 'id', type: 'text', required: true }
  ],
  outputSchema: [
    { name: 'thing', type: 'json' }
  ],
  handler: generateThingEmbedding,
} as unknown as TaskConfig

const searchThingsTask = {
  slug: 'searchThings',
  label: 'Search Things',
  inputSchema: [
    { name: 'query', type: 'text', required: true },
    { name: 'limit', type: 'number' }
  ],
  outputSchema: [
    { name: 'results', type: 'json' }
  ],
  handler: searchThings,
} as unknown as TaskConfig

const hybridSearchThingsTask = {
  slug: 'hybridSearchThings',
  label: 'Hybrid Search Things',
  inputSchema: [
    { name: 'query', type: 'text', required: true },
    { name: 'limit', type: 'number' }
  ],
  outputSchema: [
    { name: 'results', type: 'json' }
  ],
  handler: hybridSearchThings,
} as unknown as TaskConfig

const processDomainTask = {
  slug: 'processDomain',
  label: 'Process Domain',
  inputSchema: [
    { name: 'domainId', type: 'text', required: true },
    { name: 'operation', type: 'text', required: true },
    { name: 'domain', type: 'text' },
    { name: 'vercelId', type: 'text' },
    { name: 'cloudflareId', type: 'text' }
  ],
  outputSchema: [
    { name: 'success', type: 'boolean' }
  ],
  handler: processDomain,
} as unknown as TaskConfig

export const tasks = [
  executeFunctionTask, 
  generateCodeTask,
  executeCodeFunctionTask,
  generateThingEmbeddingTask, 
  searchThingsTask, 
  hybridSearchThingsTask,
  processCodeFunctionWrapperTask,
  processCodeFunctionTask,
  inflectNounsTask,
  conjugateVerbsTask,
  deployWorkerTask,
  deliverWebhookTask,
  initiateComposioConnectionTask,
  requestHumanFeedbackTask,
  processDomainTask,
  processBatchOpenAITask,
  processBatchAnthropicTask,
  processBatchGoogleVertexAITask,
  processBatchParasailTask,
  createGenerationBatchTask
]
export const workflows = [handleGithubEvent]
export { parseSchemaToZod, schemaToJsonSchema, validateWithSchema, inflectNounsTask, conjugateVerbsTask }
