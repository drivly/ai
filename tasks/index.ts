import { TaskConfig } from 'payload'

import { processBatchAnthropicTask } from './ai/batchAnthropic'
import { processBatchCloudflareTask } from './ai/batchCloudflare'
import { processBatchGoogleVertexAITask } from './ai/batchGoogleVertexAI'
import { processBatchGroqTask } from './ai/batchGroq'
import { processBatchOpenAITask } from './ai/batchOpenAI'
import { processBatchParasailTask } from './ai/batchParasail'
import { createGenerationBatchTask } from './ai/createGenerationBatch'
import { executeAgentFunctionConfig } from './ai/executeAgentFunction'
import { executeFunctionTask } from './ai/executeFunction'
import { executeTextFunction } from './ai/executeTextFunction'
import { generateCodeTask } from './ai/generateCode'
import { generateFunctionExamplesTask } from './ai/generateFunctionExamples'
import { generateMarkdown } from './ai/generateMarkdown'
import { generateObject } from './ai/generateObject'
import { generateObjectArray } from './ai/generateObjectArray'
import { generateText } from './ai/generateText'
import { monitorHumanFeedbackTaskConfig } from './ai/monitorHumanFeedbackTask'
import { requestHumanFeedbackTask } from './ai/requestHumanFeedback'
import { researchTask } from './ai/researchTask'
import { sendResearchResultsToSlackTask } from './ai/sendResearchResultsToSlack'
import { updateSlackMessageTask } from './ai/updateSlackMessage'
import { generateVideoTask } from './ai/generateVideo'

import { deployWorkerTask } from './code/deployWorker'
import { executeCodeFunctionTask } from './code/executeCodeFunction'
import { processCodeFunctionTask } from './code/processCodeFunction'
import { processCodeFunctionWrapperTask } from './code/processCodeFunctionWrapper'

import { generateEmbeddingTask } from './data/generateEmbeddingTask'
import { generateResourceEmbedding } from './data/generateResourceEmbedding'
import { generateThingEmbedding } from './data/generateThingEmbedding'
import { hybridSearchResources, searchResources } from './data/searchResources'
import { hybridSearchThings, searchThings } from './data/searchThings'

import { deleteLinearIssueTask } from './integrations/deleteLinearIssue'
import { deliverWebhookTask } from './integrations/deliverWebhook'
import { githubFileOperations } from './integrations/githubFileOperations'
import { handleGithubEvent } from './integrations/handleGithubEvent'
import { handleLinearWebhookTask } from './integrations/handleLinearWebhook'
import { handleStripeEvent } from './integrations/handleStripeEvent'
import { initiateComposioConnectionTask } from './integrations/initiateComposioConnection'
import { postGithubComment } from './integrations/postGithubComment'
import { processDomain } from './integrations/processDomain'
import { syncTaskToLinearTask } from './integrations/syncTaskToLinear'

import { analyzeFunctionTask } from './language/analyzeFunction'
import { conjugateVerbsTask } from './language/conjugateVerbs'
import { inflectNounsTask } from './language/inflectNouns'
import { parseSchemaToZod, schemaToJsonSchema, validateWithSchema } from './language/schemaUtils'

import { saveExecutionResultsTask } from './saveExecutionResults'
import { checkServiceHealthTask, discoverServicesTask } from './services/index'

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
  monitorHumanFeedbackTaskConfig,
  executeAgentFunctionConfig,
  updateSlackMessageTask,
  processBatchOpenAITask,
  processBatchAnthropicTask,
  processBatchGoogleVertexAITask,
  processBatchParasailTask,
  processBatchCloudflareTask,
  processBatchGroqTask,
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
  analyzeFunctionTask,

  deliverWebhookTask,
  initiateComposioConnectionTask,
  processDomainTask,
  postGithubComment,
  githubFileOperations,
  saveExecutionResultsTask,
  researchTask,
  sendResearchResultsToSlackTask,
  handleLinearWebhookTask,
  generateVideoTask,
  syncTaskToLinearTask,
  deleteLinearIssueTask,
  checkServiceHealthTask,
  discoverServicesTask,
]

export const workflows = [handleGithubEvent, handleStripeEvent]

export {
  conjugateVerbsTask,
  executeTextFunction,
  generateMarkdown,
  generateObject,
  generateObjectArray,
  generateText,
  hybridSearchResources,
  inflectNounsTask,
  parseSchemaToZod,
  schemaToJsonSchema,
  searchResources,
  validateWithSchema,
}
