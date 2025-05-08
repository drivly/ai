import type { ModelSlug, BenchmarkResult, ModelBenchmark, BenchmarkCategory } from './types'

/**
 * Get benchmark data for a specific model by its slug
 * @param modelSlug The model slug to get benchmark data for
 * @param benchmarks The benchmark dataset to search in
 * @returns The model benchmark data or undefined if not found
 */
export function getBenchmarkForModel(
  modelSlug: ModelSlug,
  benchmarks: Record<ModelSlug, ModelBenchmark>
): ModelBenchmark | undefined {
  return benchmarks[modelSlug]
}

/**
 * Get all benchmark results for a specific category
 * @param category The benchmark category to filter by
 * @param benchmarks The benchmark dataset to search in
 * @returns Record of model slugs to their benchmark results for the category
 */
export function getBenchmarksByCategory(
  category: BenchmarkCategory,
  benchmarks: Record<ModelSlug, ModelBenchmark>
): Record<ModelSlug, BenchmarkResult[]> {
  const result: Record<ModelSlug, BenchmarkResult[]> = {}
  
  for (const [modelSlug, modelBenchmark] of Object.entries(benchmarks)) {
    if (modelBenchmark.categories[category]) {
      result[modelSlug] = modelBenchmark.categories[category]
    }
  }
  
  return result
}

/**
 * Compare benchmark results between models
 * @param modelSlugs Array of model slugs to compare
 * @param benchmarkName Specific benchmark name to compare
 * @param benchmarks The benchmark dataset to search in
 * @returns Record of model slugs to their benchmark result for the specific benchmark
 */
export function compareBenchmarks(
  modelSlugs: ModelSlug[],
  benchmarkName: string,
  benchmarks: Record<ModelSlug, ModelBenchmark>
): Record<ModelSlug, BenchmarkResult | undefined> {
  const result: Record<ModelSlug, BenchmarkResult | undefined> = {}
  
  for (const modelSlug of modelSlugs) {
    const modelBenchmark = benchmarks[modelSlug]
    if (modelBenchmark) {
      result[modelSlug] = modelBenchmark.benchmarks[benchmarkName]
    } else {
      result[modelSlug] = undefined
    }
  }
  
  return result
}

/**
 * Get top performing models for a specific benchmark
 * @param benchmarkName The benchmark name to filter by
 * @param benchmarks The benchmark dataset to search in
 * @param limit Maximum number of models to return
 * @returns Array of model slugs sorted by benchmark score (highest first)
 */
export function getTopModelsForBenchmark(
  benchmarkName: string,
  benchmarks: Record<ModelSlug, ModelBenchmark>,
  limit = 10
): ModelSlug[] {
  const modelsWithBenchmark = Object.entries(benchmarks)
    .filter(([_, modelBenchmark]) => modelBenchmark.benchmarks[benchmarkName])
    .map(([modelSlug, modelBenchmark]) => ({
      modelSlug,
      score: modelBenchmark.benchmarks[benchmarkName].score
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.modelSlug)
  
  return modelsWithBenchmark
}

/**
 * Filter models by minimum benchmark score
 * @param benchmarkName The benchmark name to filter by
 * @param minScore Minimum score threshold
 * @param benchmarks The benchmark dataset to search in
 * @returns Array of model slugs that meet or exceed the minimum score
 */
export function filterModelsByMinScore(
  benchmarkName: string,
  minScore: number,
  benchmarks: Record<ModelSlug, ModelBenchmark>
): ModelSlug[] {
  return Object.entries(benchmarks)
    .filter(([_, modelBenchmark]) => {
      const benchmark = modelBenchmark.benchmarks[benchmarkName]
      return benchmark && benchmark.score >= minScore
    })
    .map(([modelSlug]) => modelSlug)
}

/**
 * Get overall top performing models based on average benchmark scores
 * @param benchmarks The benchmark dataset to search in
 * @param limit Maximum number of models to return
 * @returns Array of model slugs sorted by overall score (highest first)
 */
export function getTopPerformingModels(
  benchmarks: Record<ModelSlug, ModelBenchmark>,
  limit = 10
): ModelSlug[] {
  return Object.entries(benchmarks)
    .filter(([_, modelBenchmark]) => modelBenchmark.overallScore !== undefined)
    .sort((a, b) => (b[1].overallScore || 0) - (a[1].overallScore || 0))
    .slice(0, limit)
    .map(([modelSlug]) => modelSlug)
}
