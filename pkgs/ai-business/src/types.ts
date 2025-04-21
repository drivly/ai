/**
 * Core interfaces for business primitives with AI operation capabilities
 */

export interface Objective {
  id: string
  name: string
  description: string
  keyResults: KeyResult[]
  aiOperations?: AiOperationConfig
}

export interface KeyResult {
  id: string
  description: string
  targetValue: number
  currentValue: number
  unit?: string
  aiOperations?: AiOperationConfig
}

export interface AiOperationConfig {
  autoMonitor?: boolean
  adaptStrategy?: boolean
  analysisFrequency?: 'daily' | 'weekly' | 'monthly'
}

export interface AnalysisResult {
  objectiveId: string
  timestamp: string
  status: 'on_track' | 'at_risk' | 'off_track'
  insights: string[]
  recommendations: string[]
}

export interface StrategyRecommendation {
  objectiveId: string
  keyResultId?: string
  recommendation: string
  impact: 'low' | 'medium' | 'high'
  effort: 'low' | 'medium' | 'high'
  reasoning: string
}

export interface AiBusinessOperatorConfig {
  defaultAnalysisFrequency?: 'daily' | 'weekly' | 'monthly'
  modelPreferences?: {
    analysisModel?: string
    recommendationModel?: string
  }
}
