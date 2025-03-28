# [Models.do](https://models.do) - Search, Filter, and Compare AI Models

[![npm version](https://img.shields.io/npm/v/models.do.svg)](https://www.npmjs.com/package/models.do)
[![npm downloads](https://img.shields.io/npm/dm/models.do.svg)](https://www.npmjs.com/package/models.do)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/npm/l/models.do.svg)](https://github.com/drivly/ai/blob/main/LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/drivly/ai.svg)](https://github.com/drivly/ai)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/drivly/ai/blob/main/CONTRIBUTING.md)
[![Minified Size](https://img.shields.io/bundlephobia/min/models.do)](https://bundlephobia.com/package/models.do)

Models.do enables developers to search, filter, and compare Large Language Models based on their capabilities and attributes.

## Installation

```bash
npm install models.do
# or
yarn add models.do
# or
pnpm add models.do
```

## Usage

```typescript
import { ModelsClient } from 'models.do'

// Initialize the client
const models = new ModelsClient()

// List all available models
const allModels = await models.listModels()
console.log(allModels)

// Filter models by provider
const openAIModels = await models.listModels({ provider: 'openai' })
console.log(openAIModels)

// Filter models by author
const anthropicModels = await models.listModels({ author: 'anthropic' })
console.log(anthropicModels)

// Filter models by capability
const codingModels = await models.findModelsWithCapabilities(['code'])
console.log(codingModels)

// Get details about a specific model
const gpt4 = await models.getModel('openai/gpt-4o')
console.log(gpt4)

// Compare multiple models
const comparison = await models.compareModels(['openai/gpt-4o', 'anthropic/claude-3-opus'])
console.log(comparison)

// Get all available providers
const providers = await models.getProviders()
console.log(providers)

// Get all available authors
const authors = await models.getAuthors()
console.log(authors)
```

## API Reference

### `ModelsClient`

The main client for interacting with Models.do.

#### Constructor

```typescript
new ModelsClient(options?: { apiKey?: string, baseUrl?: string })
```

#### Methods

- `listModels(filters?: ModelFilters): Promise<Record<string, ModelDetails>>`

  - List available models with optional filtering

- `getModel(modelIdentifier: string): Promise<{ model: ModelDetails }>`

  - Get details about a specific model

- `compareModels(modelIdentifiers: string[]): Promise<Record<string, ModelDetails>>`

  - Compare models based on their capabilities

- `findModelsWithCapabilities(capabilities: ModelCapability[]): Promise<Record<string, ModelDetails>>`

  - Find models that have all the specified capabilities

- `getProviders(): Promise<string[]>`

  - Get all available providers

- `getAuthors(): Promise<string[]>`
  - Get all available authors

### Types

```typescript
type ModelCapability = 'code' | 'online' | 'reasoning' | 'reasoning-low' | 'reasoning-medium' | 'reasoning-high' | 'tools' | 'structuredOutput' | 'responseFormat'

interface ModelDetails {
  name: string
  url?: string
  author?: string
  provider?: string
  capabilities?: ModelCapability[]
  defaults?: ModelCapability[]
  [key: string]: any
}

interface ModelFilters {
  provider?: string
  author?: string
  capabilities?: ModelCapability | ModelCapability[]
  [key: string]: any
}
```

## Related packages

- [functions.do](https://functions.do) - Typesafe AI Functions
- [workflows.do](https://workflows.do) - Business Process Automation
- [agents.do](https://agents.do) - Autonomous Digital Workers
- [apis.do](https://apis.do) - Clickable Developer Experiences
- [llm.do](https://llm.do) - Intelligent AI Gateway

## License

MIT
