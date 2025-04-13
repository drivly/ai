export interface ClientOptions {
  baseUrl?: string
  apiKey?: string
  headers?: Record<string, string>
}

export interface ErrorResponse {
  errors?: Array<{
    message: string
    code?: string
    path?: string
  }>
}

export interface ListResponse<T> {
  data: T[]
  meta?: {
    total?: number
    page?: number
    pageSize?: number
    hasNextPage?: boolean
  }
}

export interface QueryParams {
  limit?: number
  page?: number
  sort?: string | string[]
  where?: Record<string, any>
  select?: string | string[]
  populate?: string | string[]
}

export interface ExperimentVariant {
  id: string
  description?: string
  config: Record<string, any>
  isControl?: boolean
}

export interface ExperimentMetric {
  name: string
  description?: string
  higherIsBetter: boolean
}

export interface ExperimentDataset {
  id: string
  size: number
}

export interface ExperimentTrafficAllocation {
  type: 'percentage' | 'user' | 'session'
  values: Record<string, number>
}

export interface ExperimentDuration {
  startDate: string
  endDate: string
}

export interface Experiment {
  name: string
  description?: string
  variants: ExperimentVariant[]
  metrics: ExperimentMetric[]
  dataset?: ExperimentDataset
  trafficAllocation: ExperimentTrafficAllocation
  duration?: ExperimentDuration
}

export interface VariantContext {
  userId?: string
  sessionId?: string
  [key: string]: any
}

export interface VariantResult {
  id: string
  config: Record<string, any>
}

export interface ExperimentResults {
  name: string
  variants: Record<
    string,
    {
      metrics: Record<
        string,
        {
          mean: number
          count: number
          sum: number
        }
      >
    }
  >
}

export interface ExperimentComparison {
  name: string
  variants: string[]
  metrics: Record<
    string,
    {
      differences: Record<string, number>
      significances: Record<string, number>
    }
  >
}

export interface ExperimentRecommendation {
  name: string
  recommendedVariant: string
  confidence: number
  metrics: Record<
    string,
    {
      improvement: number
      significance: number
    }
  >
}
