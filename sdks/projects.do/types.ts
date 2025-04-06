/**
 * Type definitions for projects.do SDK
 *
 * These types are compatible with the Payload CMS collection types
 * but defined here to avoid module resolution issues.
 */

/**
 * Project definition
 */
export interface Project {
  id: string
  name?: string
  description?: string
  status?: 'planning' | 'active' | 'on_hold' | 'completed' | 'canceled'
  startDate?: string
  endDate?: string
  owner?: string
  team?: string[]
  tasks?: string[] | Task[]
  budget?: number
  actualCost?: number
  tags?: string[]
  priority?: 'low' | 'medium' | 'high' | 'critical'
  updatedAt: string
  createdAt: string
}

/**
 * Task definition
 */
export interface Task {
  id: string
  project?: string | Project
  name?: string
  description?: string
  status?: 'todo' | 'in_progress' | 'review' | 'done' | 'blocked'
  assignee?: string
  startDate?: string
  dueDate?: string
  completedDate?: string
  estimatedHours?: number
  actualHours?: number
  dependencies?: string[] | Task[]
  priority?: 'low' | 'medium' | 'high' | 'critical'
  updatedAt: string
  createdAt: string
}

/**
 * Resource definition
 */
export interface Resource {
  id: string
  name?: string
  type?: 'human' | 'material' | 'financial' | 'other'
  availability?: 'available' | 'partially_available' | 'unavailable'
  projects?: string[] | Project[]
  tasks?: string[] | Task[]
  updatedAt: string
  createdAt: string
}
