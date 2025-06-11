/**
 * tasks.do - Human-in-the-loop workflows enabling powerful task management
 * with the Tasks & Queue collections.
 */

import { API } from 'apis.do/src/client'
import { URLSearchParams } from 'node:url'

/**
 * Slack Blocks schema for rich interactive messages
 */
export interface SlackBlockSchema {
  title: string
  description: string
  options?: string[]
  freeText?: boolean
  platform?: 'slack' | 'teams' | 'discord'
  timeout?: number
  channel?: string
  mentions?: string[]
  blocks?: SlackBlock[] // Direct BlockKit components
  modal?: boolean // Support for modal dialogs
  components?: {
    datePicker?: boolean
    timePicker?: boolean
    multiSelect?: boolean
    overflow?: boolean
    image?: boolean
    context?: boolean
    divider?: boolean
    header?: boolean
    section?: boolean
  }
}

/**
 * Slack Block type for advanced UI components
 */
export interface SlackBlock {
  type: string
  block_id?: string
  [key: string]: any
}

/**
 * Task status options
 */
export type TaskStatus = 'todo' | 'in_progress' | 'ready_for_review' | 'completed'

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
  notes?: string
  data?: Record<string, any>
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
 * Task definition for creating tasks
 */
export interface TaskDefinition {
  type?: 'Human' | 'Agent' | 'Workflow'
  name?: string
  description?: string
  blocks?: SlackBlockSchema
  [key: string]: any
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
 * Human feedback options
 */
export interface HumanFeedbackOptions {
  title: string
  description: string
  blocks?: {
    productType?: string
    customer?: string
    solution?: string
    description?: string
    [key: string]: any
  }
  options?: string[] | Array<{ value: string; label: string }>
  freeText?: boolean
  platform?: 'slack' | 'teams' | 'discord'
  userId?: string
  roleId?: string
  timeout?: number
  channel?: string
  mentions?: string[]
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
  private tasksCollection = 'tasks'
  private queuesCollection = 'queues'

  /**
   * Create a new TasksClient
   * @param options API options
   */
  constructor(options: { apiKey?: string; baseUrl?: string } = {}) {
    this.api = new API({ ...options, baseUrl: options.baseUrl || 'https://tasks.do' })
  }

  /**
   * Create a new task
   * @param params Task creation parameters
   * @returns The created task
   */
  async create(params: CreateTaskParams): Promise<Task> {
    return this.api.post<Task>(`/v1/${this.tasksCollection}`, params)
  }

  /**
   * Create a task with the TaskDefinition interface
   * @param task Task definition
   * @returns The created task
   */
  async createTask(task: TaskDefinition) {
    return this.api.post('/v1/tasks', task)
  }

  /**
   * Run a task with input
   * @param taskId Task ID
   * @param input Task input
   * @returns The task result
   */
  async runTask(taskId: string, input: any) {
    return this.api.post(`/api/tasks/${taskId}/run`, input)
  }

  /**
   * List tasks with optional parameters
   * @param params Query parameters
   * @returns List of tasks
   */
  async listTasks(params = {}) {
    return this.api.get(`/api/${this.tasksCollection}`, { params })
  }

  /**
   * Get a task by ID
   * @param id Task ID
   * @returns The task
   */
  async get(id: string): Promise<Task> {
    return this.api.get<Task>(`/api/${this.tasksCollection}/${id}`)
  }

  /**
   * Get a task by ID (alias for get)
   * @param taskId Task ID
   * @returns The task
   */
  async getTask(taskId: string) {
    return this.get(taskId)
  }

  /**
   * Update a task
   * @param id Task ID
   * @param params Task update parameters
   * @returns The updated task
   */
  async update(id: string, params: Partial<CreateTaskParams>): Promise<Task> {
    return this.api.patch<Task>(`/api/${this.tasksCollection}/${id}`, params)
  }

  /**
   * Update a task (alias for update)
   * @param taskId Task ID
   * @param task Task update parameters
   * @returns The updated task
   */
  async updateTask(taskId: string, task: Partial<TaskDefinition>) {
    return this.update(taskId, task as any)
  }

  /**
   * Delete a task
   * @param taskId Task ID
   * @returns The deletion result
   */
  async deleteTask(taskId: string) {
    return this.api.delete(`/api/${this.tasksCollection}/${taskId}`)
  }

  /**
   * Request human feedback
   * @param options Human feedback options
   * @returns The feedback result
   */
  async requestHumanFeedback(options: HumanFeedbackOptions) {
    return this.api.post('/api/tasks/human-feedback', options)
  }

  /**
   * Update task status
   * @param id Task ID
   * @param status New status
   * @returns The updated task
   */
  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    return this.api.patch<Task>(`/api/${this.tasksCollection}/${id}`, { status })
  }

  /**
   * Assign a task to users, roles, or agents
   * @param id Task ID
   * @param params Assignment parameters
   * @returns The updated task
   */
  async assign(id: string, params: AssignTaskParams): Promise<Task> {
    return this.api.patch<Task>(`/api/${this.tasksCollection}/${id}`, {
      assigned: [...(params.users || []), ...(params.roles || []), ...(params.agents || [])],
    })
  }

  /**
   * Complete a task
   * @param id Task ID
   * @param params Completion parameters
   * @returns The completed task
   */
  async complete(id: string, params: CompleteTaskParams = {}): Promise<Task> {
    return this.api.patch<Task>(`/api/${this.tasksCollection}/${id}`, {
      status: 'completed',
      ...params,
    })
  }

  /**
   * Get subtasks for a task
   * @param id Parent task ID
   * @returns Array of subtasks
   */
  async getSubtasks(id: string): Promise<Array<Task>> {
    const task = await this.api.get<Task>(`/api/${this.tasksCollection}/${id}?populate=subtasks`)
    return task.subtasks || []
  }

  /**
   * Get dependencies for a task
   * @param id Task ID
   * @returns Array of dependent tasks
   */
  async getDependencies(id: string): Promise<Array<Task>> {
    const task = await this.api.get<Task>(`/api/${this.tasksCollection}/${id}?populate=dependentOn`)
    return (task.dependentOn || []) as unknown as Task[]
  }

  /**
   * Wait for a task to be completed
   * @param id Task ID
   * @param options Polling options
   * @returns The completed task
   */
  async waitForCompletion(id: string, options: { interval?: number; timeout?: number } = {}): Promise<Task> {
    const interval = options.interval || 5000
    const timeout = options.timeout || 3600000
    const startTime = Date.now()

    while (Date.now() - startTime < timeout) {
      const task = await this.get(id)
      if (task.status === 'completed') {
        return task
      }

      await new Promise((resolve) => setTimeout(resolve, interval))
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
      return this.api.post<Queue>(`/api/${this.queuesCollection}`, params)
    },

    /**
     * Get a queue by ID
     * @param id Queue ID
     * @returns The queue
     */
    get: async (id: string): Promise<Queue> => {
      return this.api.get<Queue>(`/api/${this.queuesCollection}/${id}`)
    },

    /**
     * Get tasks in a queue
     * @param id Queue ID
     * @returns Array of tasks
     */
    getTasks: async (id: string): Promise<Array<Task>> => {
      const queue = await this.api.get<Queue>(`/api/${this.queuesCollection}/${id}?populate=tasks`)
      return (queue.tasks || []) as Task[]
    },

    /**
     * Claim the next available task in a queue
     * @param id Queue ID
     * @param userId User ID
     * @returns The claimed task or null if no tasks are available
     */
    claimNext: async (id: string, userId: string): Promise<Task | null> => {
      const queryString = new URLSearchParams({
        where: JSON.stringify({
          queue: id,
          status: 'todo',
          assigned: { $exists: false },
        }),
        limit: '1',
        sort: 'createdAt',
      }).toString()

      const response = await this.api.get<{ data: Task[] }>(`/api/${this.tasksCollection}?${queryString}`)
      const tasks = response.data || []

      if (tasks.length === 0) {
        return null
      }

      const task = tasks[0]
      return this.assign(task.id, { users: [userId] })
    },
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
    },
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
  Tasks,
}
