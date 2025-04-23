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
  progress?: number
  updatedAt: string
  createdAt: string
}

/**
 * Key Result definition - can be either a string or an object
 */
export type KeyResult =
  | string
  | {
      description: string
      target?: number
      currentValue?: number
      unit?: string
      kpiRelationship?: string
      progress?: number
    }

/**
 * Objective definition with key results
 */
export interface Objective {
  description: string
  keyResults: KeyResult[]
}

/**
 * Input for creating goals with objectives and key results
 */
export interface GoalsInput {
  [key: string]: Objective
}

/**
 * Goals instance returned by the Goals function
 */
export interface GoalsInstance {
  save(): Promise<Record<string, Goal>>
  updateProgress(objectiveKey: string, keyResult: string | number, progress: number): Promise<void>
  getProgress(): Promise<Record<string, { progress: number; keyResults: Record<string, number> }>>
  toJSON(): GoalsInput
}
