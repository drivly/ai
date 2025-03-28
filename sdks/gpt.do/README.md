# [gpt.do](https://gpt.do)

[![npm version](https://img.shields.io/npm/v/gpt.do.svg)](https://www.npmjs.com/package/gpt.do)
[![npm downloads](https://img.shields.io/npm/dm/gpt.do.svg)](https://www.npmjs.com/package/gpt.do)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![GitHub Issues](https://img.shields.io/github/issues/drivly/ai.svg)](https://github.com/drivly/ai/issues)

## Simplified GPT Integration

GPT.do provides a streamlined interface for working with GPT models, offering enhanced capabilities, simplified prompting, and optimized performance. It abstracts away the complexity of interacting with GPT models, allowing developers to focus on building AI-powered features.

## Features

- **Simplified API**: Intuitive interface for GPT model interactions
- **Enhanced Prompting**: Tools for creating effective, consistent prompts
- **Streaming Support**: Real-time streaming of model responses
- **Context Management**: Efficient handling of conversation context
- **Type Safety**: Full TypeScript support for reliable development
- **Performance Optimization**: Smart caching and request management
- **Cost Control**: Tools for monitoring and limiting token usage

## Installation

```bash
npm install gpt.do
# or
yarn add gpt.do
# or
pnpm add gpt.do
```

## Quick Start

```typescript
import { GPT } from 'gpt.do'

// Initialize with default settings
const gpt = GPT({
  defaultModel: 'gpt-4',
})

// Simple completion
const completion = await gpt.complete('Explain quantum computing in simple terms')
console.log(completion)

// Chat interaction
const chatResponse = await gpt.chat([
  { role: 'system', content: 'You are a helpful assistant specialized in physics.' },
  { role: 'user', content: 'How does quantum entanglement work?' },
])
console.log(chatResponse)

// Streaming response
const stream = await gpt.streamChat([
  { role: 'system', content: 'You are a storyteller.' },
  { role: 'user', content: 'Tell me a short story about a robot learning to paint.' },
])

for await (const chunk of stream) {
  process.stdout.write(chunk)
}
```

## Core Concepts

### Models

GPT.do supports various GPT models with intelligent model selection:

```typescript
// Specify model explicitly
const response = await gpt.complete('Summarize this article', {
  model: 'gpt-4-turbo',
})

// Automatic model selection based on task
const complexResponse = await gpt.complete('Analyze this research paper in detail', {
  modelSelection: 'automatic',
})
```

### Context Management

Efficiently manage conversation context:

```typescript
// Create a conversation manager
const conversation = gpt.createConversation({
  system: 'You are a helpful coding assistant specializing in JavaScript.',
})

// Add messages and get responses
await conversation.addMessage('user', 'How do I use async/await in JavaScript?')
const response1 = await conversation.getLastResponse()

// Continue the conversation
await conversation.addMessage('user', 'Can you show an example with error handling?')
const response2 = await conversation.getLastResponse()

// Get the full conversation history
const history = conversation.getHistory()
```

### Prompt Templates

Create reusable prompt templates:

```typescript
const summaryTemplate = gpt.createTemplate(`
Please summarize the following {{documentType}}:

{{content}}

Summary length: {{length}}
`)

const summary = await summaryTemplate.complete({
  documentType: 'research paper',
  content: 'Long research paper text...',
  length: '3 paragraphs',
})
```

## API Reference

### Core Functions

- `GPT(config)`: Initialize the GPT client
- `gpt.complete(prompt, options)`: Generate a completion
- `gpt.chat(messages, options)`: Generate a chat response
- `gpt.streamComplete(prompt, options)`: Stream a completion
- `gpt.streamChat(messages, options)`: Stream a chat response
- `gpt.createConversation(config)`: Create a conversation manager
- `gpt.createTemplate(template)`: Create a prompt template

### Configuration Options

- `defaultModel`: Default model to use
- `apiKey`: OpenAI API key (if not using environment variable)
- `maxTokens`: Maximum tokens in responses
- `temperature`: Response randomness (0-2)
- `topP`: Nucleus sampling parameter
- `frequencyPenalty`: Penalize frequent tokens
- `presencePenalty`: Penalize repeated tokens
- `timeout`: Request timeout in ms

## Examples

Check out the [examples directory](https://github.com/drivly/ai/tree/main/examples) for more usage examples.

## Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/drivly/ai/blob/main/CONTRIBUTING.md) for more details.

## License

[MIT](https://opensource.org/licenses/MIT)
