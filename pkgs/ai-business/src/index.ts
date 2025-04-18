export type { Objective, KeyResult, AiOperationConfig, AnalysisResult, StrategyRecommendation, AiBusinessOperatorConfig } from './types'

export { AiBusinessOperator } from './operations'
export { BusinessIntegrations } from './integrations'

import { AiBusinessOperator } from './operations'
import { BusinessIntegrations } from './integrations'
import { AiBusinessOperatorConfig } from './types'

/**
 * Create an AI Business Operator instance with the provided configuration
 */
export function createAiBusinessOperator(config?: AiBusinessOperatorConfig): AiBusinessOperator {
  return new AiBusinessOperator(config)
}

/**
 * Create a Business Integrations instance
 */
export function createBusinessIntegrations(): BusinessIntegrations {
  return new BusinessIntegrations()
}
