import { describe, it, expect, vi, beforeEach } from 'vitest'
import { tasks, Tasks, Task, Queue } from '../src'

vi.mock('apis.do/src/client', () => {
  return {
    API: vi.fn().mockImplementation(() => ({
      post: vi.fn().mockImplementation((path) => {
        if (path.includes('/tasks')) {
          return {
            id: 'task-123',
            title: 'Test Task',
            status: 'todo',
            description: 'This is a test task',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        } else if (path.includes('/queues')) {
          return {
            id: 'queue-123',
            name: 'Test Queue',
            role: 'editor',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        } else if (path.includes('/webhooks')) {
          return {
            id: 'webhook-123',
            url: 'https://example.com/webhook',
            events: ['task.created', 'task.updated'],
          }
        }
      }),
      get: vi.fn().mockImplementation((path) => {
        if (path.includes('/tasks')) {
          if (path.includes('?populate=subtasks')) {
            return {
              id: 'task-123',
              title: 'Test Task',
              status: 'todo',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              subtasks: [
                {
                  id: 'subtask-1',
                  title: 'Subtask 1',
                  status: 'todo',
                  parent: 'task-123',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              ],
            }
          } else if (path.includes('?populate=dependentOn')) {
            return {
              id: 'task-123',
              title: 'Test Task',
              status: 'todo',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              dependentOn: [
                {
                  id: 'dependency-1',
                  title: 'Dependency 1',
                  status: 'completed',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              ],
            }
          } else if (path.includes('?')) {
            return {
              data: [
                {
                  id: 'task-123',
                  title: 'Test Task',
                  status: 'todo',
                  queue: 'queue-123',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              ],
            }
          } else {
            return {
              id: 'task-123',
              title: 'Test Task',
              status: 'todo',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          }
        } else if (path.includes('/queues')) {
          if (path.includes('?populate=tasks')) {
            return {
              id: 'queue-123',
              name: 'Test Queue',
              role: 'editor',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              tasks: [
                {
                  id: 'task-123',
                  title: 'Test Task',
                  status: 'todo',
                  queue: 'queue-123',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              ],
            }
          } else {
            return {
              id: 'queue-123',
              name: 'Test Queue',
              role: 'editor',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          }
        }
      }),
      patch: vi.fn().mockImplementation((path, params) => {
        if (path.includes('/tasks')) {
          return {
            id: 'task-123',
            title: 'Test Task',
            ...params,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        }
      }),
      delete: vi.fn(),
    })),
  }
})

describe('tasks.do SDK', () => {
  describe('tasks client', () => {
    it('should create a task', async () => {
      const task = await tasks.create({
        title: 'Test Task',
        status: 'todo',
        description: 'This is a test task',
      })

      expect(task).toBeDefined()
      expect(task.id).toBe('task-123')
      expect(task.title).toBe('Test Task')
      expect(task.status).toBe('todo')
      expect(task.description).toBe('This is a test task')
    })

    it('should get a task by ID', async () => {
      const task = await tasks.get('task-123')

      expect(task).toBeDefined()
      expect(task.id).toBe('task-123')
      expect(task.title).toBe('Test Task')
    })

    it('should update a task', async () => {
      const task = await tasks.update('task-123', {
        status: 'in_progress',
        description: 'Updated description',
      })

      expect(task).toBeDefined()
      expect(task.id).toBe('task-123')
      expect(task.status).toBe('in_progress')
      expect(task.description).toBe('Updated description')
    })

    it('should update task status', async () => {
      const task = await tasks.updateStatus('task-123', 'completed')

      expect(task).toBeDefined()
      expect(task.id).toBe('task-123')
      expect(task.status).toBe('completed')
    })

    it('should assign a task', async () => {
      const task = await tasks.assign('task-123', {
        users: ['user-123'],
        roles: ['editor'],
      })

      expect(task).toBeDefined()
      expect(task.id).toBe('task-123')
      expect(task.assigned).toEqual(['user-123', 'editor'])
    })

    it('should complete a task', async () => {
      const task = await tasks.complete('task-123', {
        notes: 'Task completed successfully',
      })

      expect(task).toBeDefined()
      expect(task.id).toBe('task-123')
      expect(task.status).toBe('completed')
      expect(task.notes).toBe('Task completed successfully')
    })

    it('should get subtasks', async () => {
      const subtasks = await tasks.getSubtasks('task-123')

      expect(subtasks).toBeDefined()
      expect(subtasks.length).toBe(1)
      expect(subtasks[0].id).toBe('subtask-1')
      expect(subtasks[0].parent).toBe('task-123')
    })

    it('should get dependencies', async () => {
      const dependencies = await tasks.getDependencies('task-123')

      expect(dependencies).toBeDefined()
      expect(dependencies.length).toBe(1)
      expect(dependencies[0].id).toBe('dependency-1')
      expect(dependencies[0].status).toBe('completed')
    })
  })

  describe('queues client', () => {
    it('should create a queue', async () => {
      const queue = await tasks.queues.create({
        name: 'Test Queue',
        role: 'editor',
      })

      expect(queue).toBeDefined()
      expect(queue.id).toBe('queue-123')
      expect(queue.name).toBe('Test Queue')
      expect(queue.role).toBe('editor')
    })

    it('should get a queue by ID', async () => {
      const queue = await tasks.queues.get('queue-123')

      expect(queue).toBeDefined()
      expect(queue.id).toBe('queue-123')
      expect(queue.name).toBe('Test Queue')
    })

    it('should get tasks in a queue', async () => {
      const queueTasks = await tasks.queues.getTasks('queue-123')

      expect(queueTasks).toBeDefined()
      expect(queueTasks.length).toBe(1)
      expect(queueTasks[0].id).toBe('task-123')
      expect(queueTasks[0].queue).toBe('queue-123')
    })

    it('should claim the next task in a queue', async () => {
      const task = await tasks.queues.claimNext('queue-123', 'user-123')

      expect(task).toBeDefined()
      expect(task?.id).toBe('task-123')
      expect(task?.assigned).toContain('user-123')
    })
  })

  describe('webhooks client', () => {
    it('should register a webhook', async () => {
      const webhook = await tasks.webhooks.register({
        url: 'https://example.com/webhook',
        events: ['task.created', 'task.updated'],
      })

      expect(webhook).toBeDefined()
      expect(webhook.id).toBe('webhook-123')
      expect(webhook.url).toBe('https://example.com/webhook')
      expect(webhook.events).toContain('task.created')
    })

    it('should unregister a webhook', async () => {
      await expect(tasks.webhooks.unregister('webhook-123')).resolves.not.toThrow()
    })
  })

  describe('Tasks function', () => {
    it('should return a configured tasks client', () => {
      const customTasks = Tasks({
        customTaskType: {
          title: 'string',
          priority: 'number',
          tags: 'string[]',
        },
      })

      expect(customTasks).toBeDefined()
      expect(typeof customTasks.create).toBe('function')
      expect(typeof customTasks.queues.create).toBe('function')
    })
  })
})
