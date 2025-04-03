# [Models.do](https://models.do) - Search, Filter, and Compare AI Models

[![npm version](https://img.shields.io/npm/v/models.do.svg)](https://www.npmjs.com/package/models.do)
[![npm downloads](https://img.shields.io/npm/dm/models.do.svg)](https://www.npmjs.com/package/models.do)
[![License](https://img.shields.io/npm/l/models.do.svg)](https://github.com/drivly/ai/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-blue)](https://www.typescriptlang.org/)
[![Discord](https://img.shields.io/badge/Discord-Join%20Chat-7289da?logo=discord&logoColor=white)](https://discord.gg/tafnNeUQdm)
[![GitHub Issues](https://img.shields.io/github/issues/drivly/ai.svg)](https://github.com/drivly/ai/issues)
[![GitHub Stars](https://img.shields.io/github/stars/drivly/ai.svg)](https://github.com/drivly/ai)

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
import { ModelsSDK } from 'models.do'

// Create the SDK client
const models = new ModelsSDK({
  apiKey: 'your-api-key'
})

// Resolve a specific model
await models.get('gemini') // -> { model: ModelDetails, parsed: { model: 'gemini' } }
await models.get('gemini(seed:1)') // -> { model: ModelDetails, parsed: { model: 'gemini', systemConfig: { seed: 1 } } }
await models.get('claude-3.7:reasoning') // -> { model: ModelDetails, parsed: { model: 'claude', capabilities: ['reasoning'] } }

// Find models by filters and sorting
// For most use cases, you'll most likely use the find method as its more flexible
await models.find({
  author: 'google',
  capabilities: ['reasoning', 'structuredOutput'],
  sortBy: 'pricingLowToHigh'
})

// Returns both model's details, as well as a diff of the capabilities and attributes
await models.compare(['gemini', 'gpt-4o'])

// Retrieve a group of pre-parsed models
const frontierModels: Model[] = await models.group('frontier')
const wideRange: Model[] = await models.group('wideRange')
```

## API Reference

### `ModelsSDK`

The main client for interacting with Models.do. Fetches data using the models API provided by Drivly.ai, making the SDK both slim and fast.

#### Constructor

```typescript
new ModelsSDK(options?: { apiKey?: string, baseUrl?: 'https://models.do' | string })
```

#### Methods

- `get(modelIdentifier: string): Promise<{ model: ModelDetails }>`  
  Get details about a specific model
- `find(filters?: ModelFilters): Promise<Record<string, ModelDetails>>`  
  Find models that match the filters
- `compare(modelIdentifiers: string[]): Promise<Record<string, ModelDetails>>`  
  Compare models based on their capabilities
- `group(groupName: string): Promise<Model[]>`  
  Retrieve a group of models pre-parsed

### Types

```typescript
type Capability = 'code' | 'online' | 'reasoning' | 'tools' | 'structuredOutput' | 'responseFormat'

type Model = {
  isComposite?: boolean
  name: string
  author: string
  modelIdentifier?: string
  openRouterSlug?: string
  provider: Provider
  capabilities?: Capability[]
  alias?: string
  sorting: {
    topWeekly: number
    newest: number
    throughputHighToLow: number
    latencyLowToHigh: number
    pricingLowToHigh: number
    pricingHighToLow: number
  }
}

type ModelFilters = {
  provider?: string
  author?: string
  sortBy?: 'topWeekly' | 'newest' | 'throughputHighToLow' | 'latencyLowToHigh' | 'pricingLowToHigh' | 'pricingHighToLow'
  capabilities?: Capability | Capability[]
  // Shortcuts for different capabilities
  // For example, instead of writing `capabilities: ['structuredOutput', 'tools']`
  // you can write `outputType: 'Object'`
  outputType?: 'Object' | 'ObjectArray' | 'Text' | 'TextArray' | 'Markdown' | 'Code'
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
