import type { ClientOptions, ErrorResponse, ListResponse, QueryParams } from 'apis.do/src/types'

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

// Export types from apis.do
export type { ClientOptions, ErrorResponse, ListResponse, QueryParams }
