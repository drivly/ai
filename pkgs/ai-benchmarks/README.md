# AI Benchmarks

A package for fetching, processing, and accessing AI model benchmark data.

## Features

- Fetch benchmark data from epoch.ai
- Convert CSV files to JSON5 format
- Export benchmark data as constants
- Integrate with the current model system
- Compare benchmark results between models
- Filter models by benchmark criteria
- Rank models by benchmark performance

## Installation

```bash
pnpm add ai-benchmarks
```

## Usage

```typescript
import { 
  getBenchmarkForModel, 
  compareBenchmarks, 
  getTopModelsForBenchmark 
} from 'ai-benchmarks'
import benchmarks from 'ai-benchmarks/benchmarks'

// Get benchmark data for a specific model
const gpt4Benchmarks = getBenchmarkForModel('openai/gpt-4.1', benchmarks.models)

// Compare models on specific benchmarks
const comparison = compareBenchmarks([
  'openai/gpt-4.1',
  'anthropic/claude-3.5-sonnet',
  'google/gemini-2.5-pro-preview'
], 'mmlu', benchmarks.models)

// Get top models by a specific benchmark
const topModels = getTopModelsForBenchmark('mmlu', benchmarks.models, 5)
```

## Integration with AI Models

```typescript
import { getModelBySlug } from 'ai-models'
import { getBenchmarkForModel } from 'ai-benchmarks'
import benchmarks from 'ai-benchmarks/benchmarks'

function getModelWithBenchmarks(modelSlug) {
  const model = getModelBySlug(modelSlug)
  const benchmarkData = getBenchmarkForModel(modelSlug, benchmarks.models)
  
  return {
    ...model,
    benchmarks: benchmarkData
  }
}

// Usage
const gpt4WithBenchmarks = getModelWithBenchmarks('openai/gpt-4.1')
```

## API

### `getBenchmarkForModel(modelSlug: string, benchmarks: Record<string, ModelBenchmark>)`

Get benchmark data for a specific model.

### `getBenchmarksByCategory(category: string, benchmarks: Record<string, ModelBenchmark>)`

Get all benchmark results for a specific category.

### `compareBenchmarks(modelSlugs: string[], benchmarkName: string, benchmarks: Record<string, ModelBenchmark>)`

Compare benchmark results between models for a specific benchmark.

### `filterModelsByMinScore(benchmarkName: string, minScore: number, benchmarks: Record<string, ModelBenchmark>)`

Filter models by minimum benchmark score.

### `getTopModelsForBenchmark(benchmarkName: string, benchmarks: Record<string, ModelBenchmark>, limit?: number)`

Get top performing models for a specific benchmark.

### `getTopPerformingModels(benchmarks: Record<string, ModelBenchmark>, limit?: number)`

Get overall top performing models based on average benchmark scores.

## Updating Benchmark Data

Benchmark data is automatically updated weekly via a GitHub Action. To manually update the data, run:

```bash
pnpm --filter ai-benchmarks generate:benchmarks
```

This will:
1. Download the latest benchmark data from epoch.ai
2. Process the CSV files into JSON5 format
3. Generate TypeScript files with the benchmark data
4. Update the benchmark constants in the package
