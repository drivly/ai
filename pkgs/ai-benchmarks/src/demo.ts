import { 
  getBenchmarkForModel, 
  compareBenchmarks, 
  getTopModelsForBenchmark,
  getTopPerformingModels,
  getBenchmarksByCategory,
  filterModelsByMinScore
} from './benchmark-utils'
import benchmarks from './benchmarks'

console.log('Benchmark data for GPT-4.1:')
console.log(getBenchmarkForModel('openai/gpt-4.1', benchmarks.models))

console.log('\nComparing top models:')
console.log(compareBenchmarks([
  'openai/gpt-4.1',
  'anthropic/claude-3.5-sonnet',
  'google/gemini-2.5-pro-preview'
], 'mmlu', benchmarks.models))

console.log('\nTop models by MMLU benchmark:')
console.log(getTopModelsForBenchmark('mmlu', benchmarks.models, 5))

console.log('\nTop models by overall score:')
console.log(getTopPerformingModels(benchmarks.models, 5))

console.log('\nTop models for reasoning tasks:')
console.log(getBenchmarksByCategory('reasoning', benchmarks.models))

console.log('\nModels with minimum HumanEval score of 80:')
console.log(filterModelsByMinScore('humaneval', 80, benchmarks.models))

console.log('\nExample integration with ai-models:')
console.log(`
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

const gpt4WithBenchmarks = getModelWithBenchmarks('openai/gpt-4.1')
console.log(gpt4WithBenchmarks)
`)
