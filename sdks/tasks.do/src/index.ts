/**
 * tasks.do - Human-in-the-loop workflows enabling powerful task management
 * with the Tasks & Queue collections.
 */

import { API } from 'apis.do'

/**
 * Task status options
 */
export type TaskStatus = 'todo' | 'in-progress' | 'ready-for-review' | 'completed'

/**
 * Task interface based on the Tasks collection
 */
export interface Task {
  id: string
  title: string
  status: TaskStatus
  queue?: string
  assigned?: Array<string>
  parent?: string
  description?: string
  subtasks?: Array<Task>
  dependentOn?: Array<string>
  dependents?: Array<Task>
  createdAt: string
  updatedAt: string
}

/**
 * Queue interface based on the Queues collection
 */
export interface Queue {
  id: string
  name: string
  role: string
  tasks?: Array<Task>
  createdAt: string
  updatedAt: string
}

/**
 * Task creation parameters
 */
export interface CreateTaskParams {
  title: string
  status?: TaskStatus
  queue?: string
  assigned?: Array<string>
  parent?: string
  description?: string
  dependentOn?: Array<string>
  data?: Record<string, any>
}

/**
 * Queue creation parameters
 */
export interface CreateQueueParams {
  name: string
  role: string
}

/**
 * Task assignment parameters
 */
export interface AssignTaskParams {
  users?: Array<string>
  roles?: Array<string>
  agents?: Array<string>
}

/**
 * Task completion parameters
 */
export interface CompleteTaskParams {
  notes?: string
  data?: Record<string, any>
}

/**
 * Webhook registration parameters
 */
export interface WebhookParams {
  url: string
  events: Array<string>
}

/**
 * Tasks client for interacting with tasks and queues
 */
class TasksClient {
  private api: API
  
  /**
   * Create a new TasksClient
   * @param options API options
   */
  constructor(options: { apiKey?: string, baseUrl?: string } = {}) {
    this.api = new API(options)
  }
  
  /**
   * Create a new task
   * @param params Task creation parameters
   * @returns The created task
   */
  async create(params: CreateTaskParams): Promise<Task> {
    return this.api.tasks.create(params)
  }
  
  /**
   * Get a task by ID
   * @param id Task ID
   * @returns The task
   */
  async get(id: string): Promise<Task> {
    return this.api.tasks.get(id)
  }
  
  /**
   * Update a task
   * @param id Task ID
   * @param params Task update parameters
   * @returns The updated task
   */
  async update(id: string, params: Partial<CreateTaskParams>): Promise<Task> {
    return this.api.tasks.update(id, params)
  }
  
  /**
   * Update task status
   * @param id Task ID
   * @param status New status
   * @returns The updated task
   */
  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    return this.api.tasks.update(id, { status })
  }
  
  /**
   * Assign a task to users, roles, or agents
   * @param id Task ID
   * @param params Assignment parameters
   * @returns The updated task
   */
  async assign(id: string, params: AssignTaskParams): Promise<Task> {
    return this.api.tasks.update(id, { assigned: [...(params.users || []), ...(params.roles || []), ...(params.agents || [])] })
  }
  
  /**
   * Complete a task
   * @param id Task ID
   * @param params Completion parameters
   * @returns The completed task
   */
  async complete(id: string, params: CompleteTaskParams = {}): Promise<Task> {
    return this.api.tasks.update(id, { 
      status: 'completed',
      ...params
    })
  }
  
  /**
   * Get subtasks for a task
   * @param id Parent task ID
   * @returns Array of subtasks
   */
  async getSubtasks(id: string): Promise<Array<Task>> {
    const task = await this.api.tasks.get(id, { populate: 'subtasks' })
    return task.subtasks || []
  }
  
  /**
   * Get dependencies for a task
   * @param id Task ID
   * @returns Array of dependent tasks
   */
  async getDependencies(id: string): Promise<Array<Task>> {
    const task = await this.api.tasks.get(id, { populate: 'dependentOn' })
    return task.dependentOn || []
  }
  
  /**
   * Wait for a task to be completed
   * @param id Task ID
   * @param options Polling options
   * @returns The completed task
   */
  async waitForCompletion(id: string, options: { interval?: number, timeout?: number } = {}): Promise<Task> {
    const interval = options.interval || 5000
    const timeout = options.timeout || 3600000
    const startTime = Date.now()
    
    while (Date.now() - startTime < timeout) {
      const task = await this.get(id)
      if (task.status === 'completed') {
        return task
      }
      
      await new Promise(resolve => setTimeout(resolve, interval))
    }
    
    throw new Error(`Task ${id} did not complete within the timeout period`)
  }
  
  /**
   * Queues client for interacting with queues
   */
  queues = {
    /**
     * Create a new queue
     * @param params Queue creation parameters
     * @returns The created queue
     */
    create: async (params: CreateQueueParams): Promise<Queue> => {
      return this.api.queues.create(params)
    },
    
    /**
     * Get a queue by ID
     * @param id Queue ID
     * @returns The queue
     */
    get: async (id: string): Promise<Queue> => {
      return this.api.queues.get(id)
    },
    
    /**
     * Get tasks in a queue
     * @param id Queue ID
     * @returns Array of tasks
     */
    getTasks: async (id: string): Promise<Array<Task>> => {
      const queue = await this.api.queues.get(id, { populate: 'tasks' })
      return queue.tasks || []
    },
    
    /**
     * Claim the next available task in a queue
     * @param id Queue ID
     * @param userId User ID
     * @returns The claimed task or null if no tasks are available
     */
    claimNext: async (id: string, userId: string): Promise<Task | null> => {
      const tasks = await this.api.tasks.find({ 
        queue: id,
        status: 'todo',
        assigned: { $exists: false }
      }, { 
        limit: 1,
        sort: 'createdAt'
      })
      
      if (tasks.length === 0) {
        return null
      }
      
      const task = tasks[0]
      return this.assign(task.id, { users: [userId] })
    }
  }
  
  /**
   * Webhooks client for managing task webhooks
   */
  webhooks = {
    /**
     * Register a webhook for task events
     * @param params Webhook parameters
     * @returns The registered webhook
     */
    register: async (params: WebhookParams): Promise<any> => {
      return this.api.post('/api/webhooks', params)
    },
    
    /**
     * Unregister a webhook
     * @param id Webhook ID
     */
    unregister: async (id: string): Promise<void> => {
      await this.api.delete(`/api/webhooks/${id}`)
    }
  }
}

/**
 * Default tasks client instance
 */
export const tasks = new TasksClient()

/**
 * Tasks function for defining custom task types and schemas
 * @param config Task type configuration
 * @returns Configured tasks client
 */
export function Tasks(config: Record<string, any> = {}) {
  return tasks
}

export default {
  tasks,
  Tasks
}
