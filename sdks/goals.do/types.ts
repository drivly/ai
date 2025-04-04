/**
 * Type definitions for goals.do SDK
 * 
 * These types are compatible with the Payload CMS collection types
 * but defined here to avoid module resolution issues.
 */

/**
 * Goal definition
 */
export interface Goal {
  id: string
  name?: string
  description?: string
  status?: 'not_started' | 'in_progress' | 'completed' | 'canceled'
  dueDate?: string
  completedDate?: string
  owner?: string
  metrics?: Record<string, any>
  progress?: number
  tags?: string[]
  priority?: 'low' | 'medium' | 'high' | 'critical'
  updatedAt: string
  createdAt: string
}

/**
 * Goal Milestone definition
 */
export interface Milestone {
  id: string
  goal?: string | Goal
  name?: string
  description?: string
  dueDate?: string
  completedDate?: string
  status?: 'not_started' | 'in_progress' | 'completed' | 'canceled'
  updatedAt: string
  createdAt: string
}
