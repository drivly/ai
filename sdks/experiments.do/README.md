# experiments.do

[![npm version](https://img.shields.io/npm/v/experiments.do.svg)](https://www.npmjs.com/package/experiments.do)
[![npm downloads](https://img.shields.io/npm/dm/experiments.do.svg)](https://www.npmjs.com/package/experiments.do)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![Discord](https://img.shields.io/badge/Discord-Join%20Chat-7289da?logo=discord&logoColor=white)](https://discord.gg/tafnNeUQdm)
[![GitHub Issues](https://img.shields.io/github/issues/drivly/ai.svg)](https://github.com/drivly/ai/issues)
[![GitHub Stars](https://img.shields.io/github/stars/drivly/ai.svg)](https://github.com/drivly/ai)

Experiments.do provides a powerful framework for testing hypotheses, measuring outcomes, and iteratively improving your AI applications. It enables you to run controlled experiments to validate ideas, optimize performance, and make data-driven decisions.

## Key Features

- **A/B Testing**: Compare different configurations side by side
- **Metrics Tracking**: Measure and analyze performance metrics
- **Versioning**: Track changes and iterations
- **Reproducibility**: Ensure experiments can be reproduced
- **Feature Flags**: Integrate with Vercel Feature Flags
- **Real-World User Feedback**: Collect and analyze user interactions

## Feature Flags Integration

Experiments.do integrates with Vercel Feature Flags through the OpenFeature specification, providing a standardized way to evaluate feature flags and collect real-world user feedback metrics.

### Real-World User Feedback

Track user interactions with different variants of your experiments:

```typescript
// Track a click event for a specific experiment and variant
await experiments.trackEvent(
  'ButtonExperiment',
  variant.id,
  'button_click',
  {
    buttonType: 'cta',
    position: 'header',
  },
  {
    userId: 'user-123',
    sessionId: 'session-456',
  },
)

// Record a conversion metric
await experiments.track(
  'ButtonExperiment',
  variant.id,
  {
    click_through_rate: 1,
    time_on_page: 120, // seconds
  },
  {
    userId: 'user-123',
    sessionId: 'session-456',
  },
)
```

### Vercel Analytics Integration

When running in the browser, experiments.do automatically integrates with Vercel Analytics to track experiment events:

```typescript
// Configure the client with analytics enabled
const experiments = new ExperimentsClient({
  apiKey: 'your-api-key',
  analyticsEnabled: true, // default is true
})
```

## Installation

```bash
npm install experiments.do
# or
yarn add experiments.do
# or
pnpm add experiments.do
```

## Usage

### Defining Experiments

```typescript
import { ExperimentsClient } from 'experiments.do'

const experiments = new ExperimentsClient({
  apiKey: 'your-api-key',
})

// Define an experiment
const experiment = {
  name: 'SummarizationExperiment',
  description: 'Compare different models and prompts for text summarization',
  variants: [
    {
      id: 'baseline',
      description: 'Current production configuration',
      config: {
        model: 'gpt-3.5-turbo',
        prompt: 'summarize-v1',
        temperature: 0.7,
        maxTokens: 150,
      },
    },
    {
      id: 'new-model',
      description: 'Testing newer model',
      config: {
        model: 'gpt-4',
        prompt: 'summarize-v1',
        temperature: 0.7,
        maxTokens: 150,
      },
    },
  ],
  metrics: [
    {
      name: 'rouge-1',
      description: 'ROUGE-1 score against reference summaries',
      higherIsBetter: true,
    },
    {
      name: 'latency',
      description: 'Response time in milliseconds',
      higherIsBetter: false,
    },
  ],
  trafficAllocation: {
    type: 'percentage',
    values: {
      baseline: 50,
      'new-model': 50,
    },
  },
}

// Create the experiment
await experiments.create(experiment)
```

### Running Experiments

```typescript
// Start an experiment
await experiments.start('SummarizationExperiment')

// Get a variant for a specific request
const variant = await experiments.getVariant('SummarizationExperiment', {
  userId: 'user-123',
  sessionId: 'session-456',
})

// Use the variant in your application
const summary = await llm.generate({
  model: variant.config.model,
  prompt: prompts.get(variant.config.prompt),
  temperature: variant.config.temperature,
  maxTokens: variant.config.maxTokens,
  input: {
    text: articleText,
  },
})

// Record metrics for the variant
await experiments.recordMetrics('SummarizationExperiment', variant.id, {
  'rouge-1': 0.78,
  latency: 450,
})
```

### Analyzing Results

```typescript
// Get experiment results
const results = await experiments.getResults('SummarizationExperiment')

// Compare variants
const comparison = await experiments.compareVariants('SummarizationExperiment', ['baseline', 'new-model'])

// Get recommendations
const recommendations = await experiments.getRecommendations('SummarizationExperiment')
```

## API Reference

### `ExperimentsClient`

The main client for interacting with the Experiments.do API.

#### Constructor

```typescript
new ExperimentsClient({
  apiKey?: string,
  baseUrl?: string,
  flagsApiKey?: string,
  flagsBaseUrl?: string,
})
```

#### Methods

- `create(experiment: Experiment): Promise<Experiment>` - Create a new experiment
- `start(experimentName: string): Promise<any>` - Start an experiment
- `getVariant(experimentName: string, context: VariantContext): Promise<VariantResult>` - Get a variant for a specific context
- `track(experimentName: string, variantId: string, metrics: Record<string, number>, context?: VariantContext): Promise<any>` - Record metrics for a variant
- `trackEvent(experimentName: string, variantId: string, eventName: string, properties?: Record<string, any>, context?: VariantContext): Promise<any>` - Track a user interaction event
- `getResults(experimentName: string): Promise<ExperimentResults>` - Get experiment results
- `compareVariants(experimentName: string, variantIds: string[]): Promise<ExperimentComparison>` - Compare variants
- `getRecommendations(experimentName: string): Promise<ExperimentRecommendation>` - Get recommendations
- `list(params?: QueryParams): Promise<ListResponse<Experiment>>` - List experiments
- `get(experimentId: string): Promise<Experiment>` - Get an experiment by ID
- `update(experimentId: string, data: Partial<Experiment>): Promise<Experiment>` - Update an experiment
- `delete(experimentId: string): Promise<any>` - Delete an experiment

### Utility Functions

#### `cartesian`

Generates all possible combinations (cartesian product) of values from arrays in an object.

```typescript
import { cartesian } from 'experiments.do'

// Generate all combinations of colors and sizes
const combinations = cartesian({
  color: ['red', 'blue', 'green'],
  size: ['S', 'M', 'L'],
})

// Result:
// [
//   { color: 'red', size: 'S' },
//   { color: 'red', size: 'M' },
//   { color: 'red', size: 'L' },
//   { color: 'blue', size: 'S' },
//   { color: 'blue', size: 'M' },
//   { color: 'blue', size: 'L' },
//   { color: 'green', size: 'S' },
//   { color: 'green', size: 'M' },
//   { color: 'green', size: 'L' }
// ]
```

#### `orthogonal`

Generates an experimental design using Taguchi's orthogonal array method, creating a balanced subset of parameter combinations that preserves the ability to analyze each parameter's effect independently.

```typescript
import { orthogonal } from 'experiments.do'

// Generate a balanced subset of combinations using Taguchi method
const combinations = orthogonal({
  color: ['red', 'blue', 'green'],
  size: ['S', 'M', 'L'],
  material: ['cotton', 'polyester', 'wool'],
})

// Result (example):
// [
//   { color: 'red', size: 'S', material: 'cotton' },
//   { color: 'red', size: 'M', material: 'polyester' },
//   { color: 'red', size: 'L', material: 'wool' },
//   { color: 'blue', size: 'S', material: 'polyester' },
//   { color: 'blue', size: 'M', material: 'wool' },
//   { color: 'blue', size: 'L', material: 'cotton' },
//   { color: 'green', size: 'S', material: 'wool' },
//   { color: 'green', size: 'M', material: 'cotton' },
//   { color: 'green', size: 'L', material: 'polyester' }
// ]
```

##### Taguchi Method and Orthogonal Arrays

The Taguchi method is a statistical approach to experimental design that uses orthogonal arrays to create a balanced subset of parameter combinations. This approach significantly reduces the number of experiments needed while maintaining the ability to analyze each parameter's effect independently.

**Advantages of the Taguchi Method:**

1. **Efficiency**: Requires far fewer experiments than full factorial designs
2. **Balance**: Each factor level appears an equal number of times
3. **Independence**: Effects of different factors can be separated
4. **Statistical validity**: Maintains statistical power with fewer experiments

**When to use `orthogonal` vs. `cartesian`:**

- Use `orthogonal` when:

  - You have many factors or levels that would make a full factorial design impractical
  - You need a statistically balanced design with fewer experiments
  - You want to analyze main effects of factors efficiently

- Use `cartesian` when:
  - You need to test every possible combination
  - You have few factors and levels, making a full factorial design manageable
  - You need to analyze complex interactions between all factors

**Limitations:**

- The implementation supports standard orthogonal arrays (L4, L8, L9, L16, L18)
- Some combinations of factors and levels may not have a perfect orthogonal array
- Complex interactions between factors may not be fully captured
- For factors with different numbers of levels, some adaptation may be required

## Dependencies

- [apis.do](https://www.npmjs.com/package/apis.do) - Unified API Gateway for all domains and services in the .do ecosystem
