/**
 * Type definitions for plans.do SDK
 *
 * These types are compatible with the Payload CMS collection types
 * but defined here to avoid module resolution issues.
 */

/**
 * Plan definition
 */
export interface Plan {
  id: string
  name?: string
  description?: string
  status?: 'draft' | 'active' | 'completed' | 'archived'
  startDate?: string
  endDate?: string
  owner?: string
  steps?: Array<PlanStep>
  tags?: string[]
  priority?: 'low' | 'medium' | 'high' | 'critical'
  updatedAt: string
  createdAt: string
}

/**
 * Plan Step definition
 */
export interface PlanStep {
  id: string
  plan?: string | Plan
  name?: string
  description?: string
  order?: number
  duration?: number
  dependencies?: string[] | PlanStep[]
  assignee?: string
  status?: 'not_started' | 'in_progress' | 'completed' | 'blocked'
  updatedAt: string
  createdAt: string
}
