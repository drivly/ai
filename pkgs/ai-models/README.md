# ai-models

Capability and priority-based model selection for AI SDKs.

## Features

- Parse model identifiers in the format `provider/author/model:capabilities`
- Select models based on required capabilities
- Prioritize preferred models in selection
- Support for composite model routing
- System configuration via parameters

## Installation

```bash
npm install ai-models
# or
pnpm add ai-models
# or
yarn add ai-models
```

## Usage

```ts
import { getModel, parse } from 'ai-models'

// Select a model by name
const model = getModel('gpt-4o')

// Select a model by capabilities
const model = getModel('any', { 
  requiredCapabilities: ['code', 'reasoning', 'online'],
  preferredModels: ['gpt-4o', 'claude-3-opus']
})

// Parse a model identifier
const parsed = parse('@openai/openai/gpt-4o:code,online')
console.log(parsed)
// {
//   provider: 'openai',
//   author: 'openai',
//   model: 'gpt-4o',
//   capabilities: ['code', 'online']
// }

// Use with fallback options
const model = getModel([
  // Fallback support if a certain model is down / doesn't have the full capabilities
  req.args.model, // Attempt to use the model from the request, otherwise fallback to the next one
  '@openai/openai/gpt-4o:code,online,reasoning',
  '@anthropic/anthropic/claude-3-opus:reasoning,code,online',
])
```

## Model Identifier Format

The package supports the following model identifier formats:

- `@{provider}/{author}/{model}:{capabilities}`
- `{author}/{model}:{capabilities}`
- `{model}:{capabilities}`
- `{model}:{capabilities}(seed:123,temperature:0.5)`

Examples:
- `@openai/openai/gpt-4o:code,online`
- `anthropic/claude-3-opus:reasoning`
- `gpt-4o:code,online,reasoning(temperature:0.7)`

## Capabilities

Models can declare various capabilities:

- `code`: Code generation and understanding
- `online`: Internet access for up-to-date information
- `reasoning`: Step-by-step reasoning (with levels: low, medium, high)
- `tools`: Support for function calling and tool use
- `structuredOutput`: Guaranteed schema-compliant output
- `responseFormat`: JSON response formatting

## Advanced Usage

```ts
// With system configuration
const model = getModel('gpt-4o:reasoning(seed:123,temperature:0.7)')

// With specific reasoning level
const model = getModel('@anthropic/anthropic/claude-3-opus:reasoning-high')

// With composite model routing
const model = getModel('composite-model:code,reasoning')
```
