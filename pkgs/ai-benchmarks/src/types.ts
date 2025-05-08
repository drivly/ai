export type ModelSlug = string // e.g., 'openai/gpt-4.1'

export type BenchmarkCategory = 
  | 'reasoning'
  | 'coding'
  | 'knowledge'
  | 'math'
  | 'vision'
  | 'safety'
  | 'instructionFollowing'
  | 'generalization'
  | 'toolUse'
  | string // Allow for future categories

export interface BenchmarkResult {
  score: number
  timestamp: string
  version?: string
}

export interface ModelBenchmark {
  modelSlug: ModelSlug
  benchmarks: Record<string, BenchmarkResult>
  categories: Record<BenchmarkCategory, BenchmarkResult[]>
  overallScore?: number
  metadata?: Record<string, any>
}

export interface BenchmarkDataset {
  models: Record<ModelSlug, ModelBenchmark>
  lastUpdated: string
  version: string
}

export interface BenchmarkCSVRow {
  model: string
  benchmark: string
  category?: string
  score: string
  timestamp: string
  version?: string
  [key: string]: string | undefined
}
