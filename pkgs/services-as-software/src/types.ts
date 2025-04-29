import { Objective, KeyResult } from 'business-as-code'

/**
 * Pricing model types for services
 */
export type PricingModel = 'cost-based' | 'margin-based' | 'activity-based' | 'outcome-based'

/**
 * Cost-based pricing configuration
 */
export interface CostBasedPricing {
  model: 'cost-based'
  costBase: number
  fixedCosts?: number
  variableCosts?: number
}

/**
 * Margin-based pricing configuration
 */
export interface MarginBasedPricing {
  model: 'margin-based'
  costBase: number
  marginPercentage: number
}

/**
 * Activity-based pricing configuration
 */
export interface ActivityBasedPricing {
  model: 'activity-based'
  activities: {
    name: string
    description?: string
    rate: number
  }[]
}

/**
 * Outcome-based pricing configuration
 */
export interface OutcomeBasedPricing {
  model: 'outcome-based'
  outcomes: {
    metric: string
    description?: string
    targetValue: number
    price: number
    unit?: string
  }[]
}

/**
 * Union type for all pricing configurations
 */
export type ServicePricing = CostBasedPricing | MarginBasedPricing | ActivityBasedPricing | OutcomeBasedPricing

/**
 * Implementation types for services
 */
export type ImplementationType = 'function' | 'workflow' | 'agent'

/**
 * Implementation details for a service
 */
export interface ImplementationDetails {
  type: ImplementationType
  id: string
  version?: string
  configuration?: Record<string, any>
}

/**
 * Service definition with business model aspects
 */
export interface ServiceDefinition {
  /**
   * Service name
   */
  name: string

  /**
   * Service description
   */
  description?: string

  /**
   * Service objective
   */
  objective: Objective

  /**
   * Key results for measuring service success
   */
  keyResults: KeyResult[]

  /**
   * Service pricing model
   */
  pricing: ServicePricing

  /**
   * Implementation details
   */
  implementation: ImplementationDetails

  /**
   * Additional metadata
   */
  metadata?: Record<string, any>
}

/**
 * Registered service with additional properties
 */
export interface RegisteredService extends ServiceDefinition {
  /**
   * Unique service identifier
   */
  id: string

  /**
   * Service status
   */
  status: 'active' | 'inactive' | 'degraded'

  /**
   * Service endpoint URL
   */
  endpoint: string

  /**
   * Creation timestamp
   */
  createdAt: string

  /**
   * Last update timestamp
   */
  updatedAt: string
}
