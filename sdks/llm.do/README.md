# [llm.do](https://llm.do)

[![npm version](https://img.shields.io/npm/v/llm.do.svg)](https://www.npmjs.com/package/llm.do)
[![npm downloads](https://img.shields.io/npm/dm/llm.do.svg)](https://www.npmjs.com/package/llm.do)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![Discord](https://img.shields.io/badge/Discord-Join%20Chat-7289da?logo=discord&logoColor=white)](https://discord.gg/tafnNeUQdm)
[![GitHub Issues](https://img.shields.io/github/issues/drivly/ai.svg)](https://github.com/drivly/ai/issues)
[![GitHub Stars](https://img.shields.io/github/stars/drivly/ai.svg)](https://github.com/drivly/ai)

## Intelligent AI Gateway for Language Models

LLM.do is an intelligent gateway for routing requests to the optimal language models based on task requirements, cost considerations, and performance needs. It provides a unified interface to interact with multiple language models while abstracting away the complexity of model selection and optimization.

## Features

- **Intelligent Model Routing**: Automatically selects the best model for each task
- **Multi-Provider Support**: Works with OpenAI, Anthropic, Mistral, and more
- **Cost Optimization**: Balances performance needs with budget constraints
- **Performance Monitoring**: Tracks model performance across different tasks
- **Fallback Mechanisms**: Gracefully handles model unavailability
- **Streaming Support**: Real-time streaming of model responses
- **Type Safety**: Full TypeScript support for reliable development

## Installation

```bash
npm install llm.do
# or
yarn add llm.do
# or
pnpm add llm.do
```

## Quick Start

```typescript
import { LLM } from 'llm.do'

// Initialize with default settings
const llm = LLM({
  providers: ['openai', 'anthropic', 'mistral'],
  defaultProvider: 'openai',
})

// Simple completion with automatic model selection
const completion = await llm.complete({
  prompt: 'Explain quantum computing in simple terms',
  maxTokens: 200,
})
console.log(completion)

// Chat interaction with specific model
const chatResponse = await llm.chat({
  messages: [
    { role: 'system', content: 'You are a helpful assistant specialized in physics.' },
    { role: 'user', content: 'How does quantum entanglement work?' },
  ],
  model: 'anthropic/claude-3.7-sonnet',
})
console.log(chatResponse)

// Streaming response
const stream = await llm.streamChat({
  messages: [
    { role: 'system', content: 'You are a storyteller.' },
    { role: 'user', content: 'Tell me a short story about a robot learning to paint.' },
  ],
  model: 'openai/o4-mini-high',
})

for await (const chunk of stream) {
  process.stdout.write(chunk)
}
```

## Vercel AI SDK Integration

LLM.do provides a Vercel AI SDK provider for seamless integration with the Vercel AI SDK:

```typescript
import { llm } from 'llm.do'
import { generateText, generateObject, generateEmbeddings } from 'ai'
import { z } from 'zod'

// Generate text using the llm.do provider
const text = await generateText({
  model: llm('google/gemini-2.5-pro-preview-03-25'),
  prompt: 'Explain the theory of relativity in simple terms',
})

// Generate structured JSON output with Zod schema
const bookSchema = z.object({
  books: z.array(
    z.object({
      title: z.string(),
      author: z.string(),
      genre: z.string(),
      description: z.string(),
    }),
  ),
})

const jsonOutput = await generateObject({
  model: llm('x-ai/grok-3-beta'),
  prompt: 'Generate a list of 5 book recommendations',
  schema: bookSchema,
})

// Generate embeddings
const embeddings = await generateEmbeddings({
  model: llm.embed('text-embedding-3-small'),
  input: ['Embed this text for semantic search', 'And this one too'],
})
```

### Custom Provider Configuration

You can customize the llm.do provider with your own configuration:

```typescript
import { createLLMDoProvider } from 'llm.do'

const customProvider = createLLMDoProvider({
  apiKey: 'your-api-key',
  baseUrl: 'https://your-custom-endpoint.com',
  defaultModel: 'custom-model-name',
})
```

## Core Concepts

### Model Selection

LLM.do provides intelligent model selection based on task requirements:

```typescript
// Automatic model selection based on task complexity
const response = await llm.complete({
  prompt: 'Analyze this research paper in detail',
  selectionCriteria: {
    priority: 'quality', // 'quality', 'speed', or 'cost'
    minModelCapability: 'high', // 'basic', 'medium', 'high', or 'specialized'
    maxCostPerToken: 0.01,
  },
})

// Specific model selection
const specificResponse = await llm.complete({
  prompt: 'Summarize this article',
  model: 'gpt-4-turbo',
})
```

### Provider Management

Configure and manage multiple LLM providers:

```typescript
// Initialize with multiple providers
const multiProviderLLM = LLM({
  providers: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      models: ['gpt-4', 'gpt-3.5-turbo'],
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      models: ['claude-3-opus', 'claude-3-sonnet'],
    },
    mistral: {
      apiKey: process.env.MISTRAL_API_KEY,
      models: ['mistral-large', 'mistral-medium'],
    },
  },
  defaultProvider: 'openai',
})

// Use a specific provider
const claudeResponse = await multiProviderLLM.complete({
  prompt: 'Explain the theory of relativity',
  provider: 'anthropic',
})
```

### Cost Management

Control and monitor usage costs:

```typescript
// Set budget constraints
const budgetLLM = LLM({
  budgetLimits: {
    dailyMaxCost: 10.0, // USD
    monthlyMaxCost: 100.0,
    costAlertThreshold: 0.8, // Alert at 80% of budget
  },
})

// Get cost estimates before running
const estimate = await budgetLLM.estimateCost({
  prompt: 'Write a detailed analysis of climate change impacts',
  maxTokens: 1000,
})
console.log(`Estimated cost: $${estimate.cost}`)

// Get usage statistics
const usage = await budgetLLM.getUsageStats()
console.log(`Current daily usage: $${usage.daily.cost}`)
```

## API Reference

### Core Functions

- `LLM(config)`: Initialize the LLM client
- `llm.complete(options)`: Generate a completion
- `llm.chat(options)`: Generate a chat response
- `llm.streamComplete(options)`: Stream a completion
- `llm.streamChat(options)`: Stream a chat response
- `llm.estimateCost(options)`: Estimate the cost of a request
- `llm.getUsageStats()`: Get usage statistics

### Vercel AI SDK Provider Functions

- `llm(modelId)`: Get a language model instance
- `createLLMDoProvider(options)`: Create a custom provider instance

### Configuration Options

- `providers`: LLM providers to use
- `defaultProvider`: Default provider to use
- `defaultModel`: Default model to use
- `budgetLimits`: Budget constraints
- `selectionDefaults`: Default selection criteria
- `timeout`: Request timeout in ms

## Examples

Check out the [examples directory](https://github.com/drivly/ai/tree/main/examples) for more usage examples.

## Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/drivly/ai/blob/main/CONTRIBUTING.md) for more details.

## License

[MIT](https://opensource.org/licenses/MIT)

## Dependencies

- [apis.do](https://www.npmjs.com/package/apis.do) - Unified API Gateway for all domains and services in the `.do` ecosystem
