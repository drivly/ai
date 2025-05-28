# Tasks

This directory contains task implementations for the AI Primitives platform. Tasks are organized by functionality into the following categories:

## AI

Tasks related to AI model interactions, text generation, and function execution:

- **batchAnthropic.ts**: Process batches of requests using Anthropic models
- **batchGoogleVertexAI.ts**: Process batches of requests using Google Vertex AI models
- **batchOpenAI.ts**: Process batches of requests using OpenAI models
- **batchParasail.ts**: Process batches of requests using Parasail models
- **createGenerationBatch.ts**: Create a batch of generation requests
- **executeFunction.ts**: Execute an AI function with provided inputs
- **executeTextFunction.ts**: Execute a text-based AI function
- **generateCode.ts**: Generate code using AI models
- **generateFunctionExamples.ts**: Generate examples for AI functions
- **generateMarkdown.ts**: Generate markdown content
- **generateObject.ts**: Generate structured objects using AI
- **generateObjectArray.ts**: Generate arrays of structured objects
- **generateText.ts**: Generate text content using AI models
- **generateVideo.ts**: Generate videos from markdown
- **requestHumanFeedback.ts**: Request and process human feedback on AI outputs

## Code

Tasks related to code execution and deployment:

- **executeCodeFunction.ts**: Execute code-based functions
- **processCodeFunction.ts**: Process and prepare code functions
- **processCodeFunctionWrapper.ts**: Wrapper for processing code functions
- **deployWorker.ts**: Deploy code to Cloudflare Workers

## Data

Tasks related to embeddings, search, and data processing:

- **generateEmbedding.ts**: Generate embeddings for text content
- **generateEmbeddingTask.ts**: Task wrapper for embedding generation
- **generateResourceEmbedding.ts**: Generate embeddings for resources
- **generateThingEmbedding.ts**: Generate embeddings for things (deprecated)
- **searchResources.ts**: Search for resources using embeddings
- **searchThings.ts**: Search for things using embeddings

## Language

Tasks related to natural language processing:

- **conjugateVerbs.ts**: Conjugate verbs into different forms
- **inflectNouns.ts**: Inflect nouns into different forms
- **schemaUtils.ts**: Utilities for schema validation and transformation

## Integrations

Tasks related to external integrations and services:

- **deliverWebhook.ts**: Deliver webhook payloads to external services
- **handleGithubEvent.ts**: Handle events from GitHub
- **initiateComposioConnection.ts**: Initiate connections with Composio
- **processDomain.ts**: Process domain-related operations
- **syncClickhouseAnalytics.ts**: Synchronize analytics data with Clickhouse

## Tests

Test files for task implementations:

- **executeFunction.test.ts**: Tests for executeFunction
- **generateCode.test.ts**: Tests for generateCode
- **generateMarkdown.test.ts**: Tests for generateMarkdown
- **generateObjectArray.test.ts**: Tests for generateObjectArray
- **vitest.config.ts**: Vitest configuration for task tests

## Usage

Tasks are configured in `payload.config.ts` and should be invoked using the payload.jobs.queue pattern:

```typescript
// Queue a task
const createdJob = await payload.jobs.queue({
  task: 'taskName',
  input: {
    /* params */
  },
})

// Execute the task (in serverless environments)
waitUntil(req.payload.jobs.runByID({ id: createdJob.id }))
```

This ensures durable execution with automatic retry capabilities if errors occur.
