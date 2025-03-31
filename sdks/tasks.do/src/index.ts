import { API } from 'apis.do'

export interface SlackBlockSchema {
  title: string
  description: string
  options?: string[]
  freeText?: boolean
  platform?: 'slack' | 'teams' | 'discord'
  timeout?: number
  channel?: string
  mentions?: string[]
}

export interface TaskDefinition {
  type?: 'Human' | 'Agent' | 'Workflow'
  name?: string
  description?: string
  blocks?: SlackBlockSchema
  [key: string]: any
}

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
  options?: Array<{ value: string; label: string }>
  freeText?: boolean
  platform?: 'slack' | 'teams' | 'discord'
  userId?: string
  roleId?: string
  timeout?: number
}

export class Tasks extends API {
  constructor(options = {}) {
    super({ ...options, baseUrl: 'https://tasks.do' })
  }

  async createTask(task: TaskDefinition) {
    return this.post('/api/tasks', task)
  }

  async runTask(taskId: string, input: any) {
    return this.post(`/api/tasks/${taskId}/run`, input)
  }

  async listTasks(params = {}) {
    return this.list('tasks', params)
  }

  async getTask(taskId: string) {
    return this.getById('tasks', taskId)
  }

  async updateTask(taskId: string, task: Partial<TaskDefinition>) {
    return this.update('tasks', taskId, task)
  }

  async deleteTask(taskId: string) {
    return this.remove('tasks', taskId)
  }

  async requestHumanFeedback(options: HumanFeedbackOptions) {
    return this.post('/api/tasks/human-feedback', options)
  }
}

export const tasks = new Tasks()
