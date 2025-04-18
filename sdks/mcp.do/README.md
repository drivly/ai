# [mcp.do](https://mcp.do)

[![npm version](https://img.shields.io/npm/v/mcp.do.svg)](https://www.npmjs.com/package/mcp.do)
[![npm downloads](https://img.shields.io/npm/dm/mcp.do.svg)](https://www.npmjs.com/package/mcp.do)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![GitHub Issues](https://img.shields.io/github/issues/drivly/ai.svg)](https://github.com/drivly/ai/issues)

## Standardized AI Model Interactions

MCP.do implements the Model Context Protocol, a standardized approach for interacting with AI language models. It provides a consistent interface for managing context windows, optimizing prompts, and ensuring interoperability between different AI models and providers.

## Features

- **Standardized Context Management**: Unified approach to handling context windows across models
- **Prompt Optimization**: Tools for creating effective prompts within context limits
- **Cross-Model Compatibility**: Consistent interface across different AI models and providers
- **Context Window Utilization**: Maximize the effective use of available context space
- **Token Optimization**: Tools for efficient token usage and management
- **Streaming Support**: Real-time streaming of model responses with context tracking
- **Type Safety**: Full TypeScript support for reliable development

## Installation

```bash
npm install mcp.do
# or
yarn add mcp.do
# or
pnpm add mcp.do
```

## Quick Start

```typescript
import { MCP } from 'mcp.do'

// Initialize with default settings
const mcp = MCP({
  defaultProvider: 'openai',
  defaultModel: 'gpt-4',
})

// Create a context with system prompt
const context = mcp.createContext({
  system: 'You are a helpful assistant that provides concise answers.',
  maxTokens: 16000,
})

// Add user message to context
context.addMessage({
  role: 'user',
  content: 'Explain the concept of quantum computing in simple terms.',
})

// Get response within context constraints
const response = await context.getResponse()
console.log(response)

// Continue the conversation with context management
context.addMessage({
  role: 'user',
  content: 'How does that compare to classical computing?',
})

// Get follow-up response
const followUpResponse = await context.getResponse()
console.log(followUpResponse)
```

## Core Concepts

### Context Management

MCP.do provides tools for efficient context window management:

```typescript
// Create a context with specific constraints
const context = mcp.createContext({
  system: 'You are a technical expert in machine learning.',
  maxTokens: 8000,
  reserveTokens: 1000, // Reserve tokens for response
  provider: 'anthropic',
  model: 'claude-3-opus',
})

// Add multiple messages
context.addMessages([
  { role: 'user', content: 'What are the key differences between CNN and RNN?' },
  { role: 'assistant', content: 'CNNs are designed for spatial data like images...' },
  { role: 'user', content: 'How would you choose between them for a specific task?' },
])

// Check context utilization
const stats = context.getStats()
console.log(`Using ${stats.currentTokens} of ${stats.maxTokens} tokens (${stats.utilizationPercentage}%)`)

// Optimize context if needed
if (stats.utilizationPercentage > 80) {
  context.optimize({
    strategy: 'summarize_history',
    keepMessages: 3, // Keep the most recent messages
  })
}
```

### Prompt Engineering

Create and optimize prompts for different models:

```typescript
// Create a standardized prompt template
const promptTemplate = mcp.createPromptTemplate({
  template: `
    {{system}}
    
    Context information:
    {{context}}
    
    User query: {{query}}
  `,
  defaultValues: {
    system: 'You are a helpful assistant.',
  },
})

// Generate a prompt with specific values
const prompt = promptTemplate.generate({
  context: 'This conversation is about machine learning algorithms.',
  query: 'Explain backpropagation.',
})

// Optimize the prompt for a specific model
const optimizedPrompt = mcp.optimizePrompt(prompt, {
  model: 'gpt-3.5-turbo',
  maxTokens: 4000,
})

// Get response using the optimized prompt
const response = await mcp.complete(optimizedPrompt)
```

### Cross-Model Compatibility

Ensure consistent behavior across different models:

```typescript
// Define a standardized request
const request = mcp.createRequest({
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Summarize the key points of reinforcement learning.' },
  ],
  parameters: {
    temperature: 0.7,
    maxOutputTokens: 500,
  },
})

// Send to different models with consistent interface
const openaiResponse = await request.send({
  provider: 'openai',
  model: 'gpt-4',
})

const anthropicResponse = await request.send({
  provider: 'anthropic',
  model: 'claude-3-sonnet',
})

const mistralResponse = await request.send({
  provider: 'mistral',
  model: 'mistral-large',
})

// Compare responses
const comparison = mcp.compareResponses([openaiResponse, anthropicResponse, mistralResponse], {
  criteria: ['accuracy', 'conciseness', 'completeness'],
})
```

## API Reference

### Core Functions

- `MCP(config)`: Initialize the MCP client
- `mcp.createContext(options)`: Create a new context manager
- `mcp.createPromptTemplate(options)`: Create a prompt template
- `mcp.optimizePrompt(prompt, options)`: Optimize a prompt for a specific model
- `mcp.createRequest(options)`: Create a standardized request
- `mcp.complete(prompt, options)`: Generate a completion
- `mcp.compareResponses(responses, options)`: Compare responses from different models

### Context Methods

- `context.addMessage(message)`: Add a message to the context
- `context.addMessages(messages)`: Add multiple messages to the context
- `context.getResponse(options)`: Get a response within context constraints
- `context.getStats()`: Get context utilization statistics
- `context.optimize(options)`: Optimize the context based on strategy
- `context.export(format)`: Export the context in a specific format

## Examples

Check out the [examples directory](https://github.com/drivly/ai/tree/main/examples) for more usage examples.

## Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/drivly/ai/blob/main/CONTRIBUTING.md) for more details.

## License

[MIT](https://opensource.org/licenses/MIT)

## Dependencies

- [apis.do](https://www.npmjs.com/package/apis.do) - Unified API Gateway for all domains and services in the `.do` ecosystem
