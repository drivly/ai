/**
 * Types for durable-objects-cron package
 */

/**
 * Type of schedule for recurring execution based on cron expression
 */
export type ScheduleType = 'cron'

/**
 * Schedule definition for recurring execution based on cron expression
 */
export interface CronSchedule {
  /** Type of schedule for recurring execution based on cron expression */
  type: 'cron'
  /** Timestamp for the next execution */
  time: number
  /** Cron expression defining the schedule */
  cron: string
}

/**
 * Options for scheduling a task
 */
export interface ScheduleOptions {
  /**
   * Unique identifier for the scheduled task
   * If not provided, a random UUID will be generated
   */
  id?: string

  /**
   * Data to be passed to the task when it executes
   */
  data?: any
}

/**
 * Result of scheduling a task
 */
export interface ScheduleResult {
  /**
   * Unique identifier for the scheduled task
   */
  id: string

  /**
   * Timestamp when the task will next execute
   */
  nextExecutionTime: number
}

/**
 * Information about a scheduled task
 */
export interface ScheduledTask {
  /**
   * Unique identifier for the scheduled task
   */
  id: string

  /**
   * Schedule definition
   */
  schedule: CronSchedule

  /**
   * Data to be passed to the task when it executes
   */
  data: any

  /**
   * Timestamp when the task was created
   */
  createdAt: number

  /**
   * Timestamp when the task was last updated
   */
  updatedAt: number

  /**
   * Timestamp when the task was last executed
   */
  lastExecutedAt?: number
}

/**
 * Handler function for scheduled tasks
 */
export type TaskHandler = (task: ScheduledTask) => Promise<void> | void

/**
 * Options for the CronDurableObject
 */
export interface CronDurableObjectOptions {
  /**
   * Default handler for scheduled tasks
   * If provided, this handler will be called for all tasks that don't have a specific handler
   */
  defaultHandler?: TaskHandler

  /**
   * Map of task handlers by task ID prefix
   * Tasks with IDs that start with a key in this map will be handled by the corresponding handler
   */
  handlers?: Record<string, TaskHandler>
}
