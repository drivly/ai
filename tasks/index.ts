import { TaskConfig } from 'payload'
import { executeFunctionTask } from './executeFunction'
import { generateCodeTask } from './generateCode'
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
import { syncClickhouseAnalyticsTask } from './syncClickhouseAnalytics'

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

export const tasks = [
  executeFunctionTask, 
  generateCodeTask, 
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
  syncClickhouseAnalyticsTask
]
export const workflows = [handleGithubEvent]
export { parseSchemaToZod, schemaToJsonSchema, validateWithSchema, inflectNounsTask, conjugateVerbsTask }
