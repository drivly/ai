/**
 * Type definitions for services.do SDK
 */

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
