/**
 * Type definitions for services.do SDK
 */

/**
 * Pricing scheme types for services
 */
export type PricingScheme =
  | { type: 'input'; ratePerInputUnit: number; unitName: string }
  | { type: 'output'; ratePerOutputUnit: number; unitName: string }
  | { type: 'usage'; metric: 'time' | 'calls' | 'compute'; rate: number; unitName: string }
  | { type: 'action'; actions: Record<string, number> }
  | { type: 'outcome'; outcomes: Record<string, number> }
  | { type: 'costPlus'; markupPercent: number }
  | { type: 'margin'; percentOfValue: number }
  | { type: 'hybrid'; baseFee: number; variableScheme: PricingScheme }

/**
 * Usage data type for price calculations
 */
export interface UsageData {
  inputs?: number
  outputs?: number
  actions?: Record<string, number>
  outcomes?: Record<string, boolean | number>
  directCost?: number
  outcomeValue?: number
  usageTimeHours?: number
  apiCalls?: number
  computeUnits?: number
}

/**
 * Service definition for registration
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
   * Service endpoint URL
   */
  endpoint: string

  /**
   * Service version
   */
  version?: string

  /**
   * Service pricing model
   */
  pricing?: PricingScheme

  /**
   * Additional metadata for the service
   */
  metadata?: Record<string, any>
}

/**
 * Service status
 */
export type ServiceStatus = 'active' | 'inactive' | 'degraded'

/**
 * Service representation
 */
export interface Service extends ServiceDefinition {
  /**
   * Unique service identifier
   */
  id: string

  /**
   * Current service status
   */
  status: ServiceStatus

  /**
   * Creation timestamp
   */
  createdAt: string

  /**
   * Last update timestamp
   */
  updatedAt: string
}

/**
 * Service query parameters
 */
export interface ServiceQuery {
  /**
   * Filter by service name
   */
  name?: string

  /**
   * Filter by service status
   */
  status?: ServiceStatus

  /**
   * Additional query parameters
   */
  [key: string]: any
}
