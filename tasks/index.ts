import { TaskConfig } from 'payload'

import { executeFunctionTask } from './ai/executeFunction'
import { generateCodeTask } from './ai/generateCode'
import { generateFunctionExamplesTask } from './ai/generateFunctionExamples'
import { requestHumanFeedbackTask } from './ai/requestHumanFeedback'
import { executeTextFunction } from './ai/executeTextFunction'
import { generateMarkdown } from './ai/generateMarkdown'
import { generateObject } from './ai/generateObject'
import { generateObjectArray } from './ai/generateObjectArray'
import { generateText } from './ai/generateText'
import { processBatchOpenAITask } from './ai/batchOpenAI'
import { processBatchAnthropicTask } from './ai/batchAnthropic'
import { processBatchGoogleVertexAITask } from './ai/batchGoogleVertexAI'
import { processBatchParasailTask } from './ai/batchParasail'
import { createGenerationBatchTask } from './ai/createGenerationBatch'

import { executeCodeFunctionTask } from './code/executeCodeFunction'
import { processCodeFunctionWrapperTask } from './code/processCodeFunctionWrapper'
import { processCodeFunctionTask } from './code/processCodeFunction'
import { deployWorkerTask } from './code/deployWorker'

import { generateResourceEmbedding } from './data/generateResourceEmbedding'
import { generateThingEmbedding } from './data/generateThingEmbedding'
import { hybridSearchResources, searchResources } from './data/searchResources'
import { hybridSearchThings, searchThings } from './data/searchThings'
import { generateEmbeddingTask } from './data/generateEmbeddingTask'

import { inflectNounsTask } from './language/inflectNouns'
import { conjugateVerbsTask } from './language/conjugateVerbs'
import { parseSchemaToZod, schemaToJsonSchema, validateWithSchema } from './language/schemaUtils'

import { handleGithubEvent } from './integrations/handleGithubEvent'
import { deliverWebhookTask } from './integrations/deliverWebhook'
import { initiateComposioConnectionTask } from './integrations/initiateComposioConnection'
import { processDomain } from './integrations/processDomain'
import { saveExecutionResultsTask } from './saveExecutionResults'
import { researchTask } from './ai/researchTask'
import { syncTaskToLinearTask } from './integrations/syncTaskToLinear'
import { deleteLinearIssueTask } from './integrations/deleteLinearIssue'


const generateResourceEmbeddingTask = {
  slug: 'generateResourceEmbedding',
  label: 'Generate Resource Embedding',
  inputSchema: [{ name: 'id', type: 'text', required: true }],
  outputSchema: [{ name: 'resource', type: 'json' }],
  handler: generateResourceEmbedding,
} as unknown as TaskConfig

const generateThingEmbeddingTask = {
  slug: 'generateThingEmbedding',
  label: 'Generate Thing Embedding (Deprecated)',
  inputSchema: [{ name: 'id', type: 'text', required: true }],
  outputSchema: [{ name: 'thing', type: 'json' }],
  handler: generateThingEmbedding,
} as unknown as TaskConfig

const searchThingsTask = {
  slug: 'searchThings',
  label: 'Search Things',
  inputSchema: [
    { name: 'query', type: 'text', required: true },
    { name: 'limit', type: 'number' },
  ],
  outputSchema: [{ name: 'results', type: 'json' }],
  handler: searchThings,
} as unknown as TaskConfig

const hybridSearchThingsTask = {
  slug: 'hybridSearchThings',
  label: 'Hybrid Search Things',
  inputSchema: [
    { name: 'query', type: 'text', required: true },
    { name: 'limit', type: 'number' },
  ],
  outputSchema: [{ name: 'results', type: 'json' }],
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
    { name: 'cloudflareId', type: 'text' },
  ],
  outputSchema: [{ name: 'success', type: 'boolean' }],
  handler: processDomain,
} as unknown as TaskConfig

export const tasks = [
  executeFunctionTask,
  generateCodeTask,
  requestHumanFeedbackTask,
  processBatchOpenAITask,
  processBatchAnthropicTask,
  processBatchGoogleVertexAITask,
  processBatchParasailTask,
  createGenerationBatchTask,
  generateFunctionExamplesTask,

  executeCodeFunctionTask,
  processCodeFunctionWrapperTask,
  processCodeFunctionTask,
  deployWorkerTask,

  generateResourceEmbeddingTask,
  generateThingEmbeddingTask,
  searchThingsTask,
  hybridSearchThingsTask,
  generateEmbeddingTask,

  inflectNounsTask,
  conjugateVerbsTask,

  deliverWebhookTask,
  initiateComposioConnectionTask,
  processDomainTask,
  saveExecutionResultsTask,
  researchTask,
  syncTaskToLinearTask,
  deleteLinearIssueTask

]

export const workflows = [handleGithubEvent]

export {
  parseSchemaToZod,
  schemaToJsonSchema,
  validateWithSchema,
  inflectNounsTask,
  conjugateVerbsTask,
  executeTextFunction,
  generateMarkdown,
  generateObject,
  generateObjectArray,
  generateText,
  searchResources,
  hybridSearchResources,
}
