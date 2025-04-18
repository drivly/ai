import { parseCronExpression } from 'cron-schedule'
import type { DurableObjectState, DurableObjectStorage } from '@cloudflare/workers-types'
import { CronSchedule, ScheduleOptions, ScheduleResult, ScheduledTask, TaskHandler, CronDurableObjectOptions } from './types'

export * from './types'

/**
 * Get the next execution time for a cron expression
 */
function getNextCronTime(cron: string): number {
  const interval = parseCronExpression(cron)
  return interval.getNextDate().getTime()
}

/**
 * CronDurableObject class for scheduling and executing tasks using Durable Objects alarms
 */
export class CronDurableObject {
  private storage: DurableObjectStorage
  private defaultHandler?: TaskHandler
  private handlers: Record<string, TaskHandler> = {}

  constructor(state: DurableObjectState, options: CronDurableObjectOptions = {}) {
    this.storage = state.storage
    this.defaultHandler = options.defaultHandler
    this.handlers = options.handlers || {}

    state.blockConcurrencyWhile(async () => {
      await state.storage.setAlarm(await this.getNextAlarmTime())
    })
  }

  /**
   * Handle HTTP requests to the Durable Object
   */
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const path = url.pathname.split('/').filter(Boolean)

    if (request.method === 'POST') {
      if (path[0] === 'schedule') {
        const body = (await request.json()) as { cron: string; options?: ScheduleOptions }
        const result = await this.schedule(body.cron, body.options || {})
        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json' },
        })
      } else if (path[0] === 'cancel') {
        const body = (await request.json()) as { id: string }
        await this.cancel(body.id)
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' },
        })
      }
    } else if (request.method === 'GET') {
      if (path[0] === 'tasks') {
        if (path.length > 1) {
          const task = await this.getTask(path[1])
          if (!task) {
            return new Response(JSON.stringify({ error: 'Task not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' },
            })
          }
          return new Response(JSON.stringify(task), {
            headers: { 'Content-Type': 'application/json' },
          })
        } else {
          const tasks = await this.listTasks()
          return new Response(JSON.stringify(tasks), {
            headers: { 'Content-Type': 'application/json' },
          })
        }
      }
    }

    return new Response('Not found', { status: 404 })
  }

  /**
   * Handle alarms
   */
  async alarm(): Promise<void> {
    const now = Date.now()
    const tasks = await this.getTasksDueBy(now)

    if (tasks.length === 0) {
      await this.storage.setAlarm(await this.getNextAlarmTime())
      return
    }

    await Promise.all(
      tasks.map(async (task) => {
        try {
          let handler = this.defaultHandler
          for (const [prefix, prefixHandler] of Object.entries(this.handlers)) {
            if (task.id.startsWith(prefix)) {
              handler = prefixHandler
              break
            }
          }

          if (handler) {
            await handler(task)
          }

          task.lastExecutedAt = now

          const nextTime = getNextCronTime(task.schedule.cron)
          task.schedule.time = nextTime

          await this.storage.put(`task:${task.id}`, task)
        } catch (error) {
          console.error(`Error executing task ${task.id}:`, error)

          const errorInfo = {
            error: String(error),
            task,
            timestamp: Date.now(),
            stack: error instanceof Error ? error.stack : undefined,
          }

          await this.storage.put(`error:${task.id}:${Date.now()}`, errorInfo)

          try {
            const currentTask = (await this.storage.get(`task:${task.id}`)) as ScheduledTask | null
            if (currentTask) {
              currentTask.data = currentTask.data || {}
              currentTask.data._errors = (currentTask.data._errors || 0) + 1
              currentTask.data._lastErrorAt = Date.now()
              currentTask.data._lastError = String(error)

              const nextTime = getNextCronTime(currentTask.schedule.cron)
              currentTask.schedule.time = nextTime

              await this.storage.put(`task:${task.id}`, currentTask)
            }
          } catch (updateError) {
            console.error(`Error updating task ${task.id} after failure:`, updateError)
          }
        }
      }),
    )

    await this.storage.setAlarm(await this.getNextAlarmTime())
  }

  /**
   * Schedule a task to be executed according to a cron expression
   */
  async schedule(cron: string, options: ScheduleOptions = {}): Promise<ScheduleResult> {
    const id = options.id || crypto.randomUUID()
    const now = Date.now()
    const nextTime = getNextCronTime(cron)

    const task: ScheduledTask = {
      id,
      schedule: {
        type: 'cron',
        time: nextTime,
        cron,
      },
      data: options.data || {},
      createdAt: now,
      updatedAt: now,
    }

    await this.storage.put(`task:${id}`, task)

    const currentAlarm = await this.storage.getAlarm()
    if (!currentAlarm || nextTime < currentAlarm) {
      await this.storage.setAlarm(nextTime)
    }

    return {
      id,
      nextExecutionTime: nextTime,
    }
  }

  /**
   * Cancel a scheduled task
   */
  async cancel(id: string): Promise<boolean> {
    const exists = await this.storage.delete(`task:${id}`)

    if (exists) {
      await this.storage.setAlarm(await this.getNextAlarmTime())
    }

    return exists
  }

  /**
   * Get a scheduled task by ID
   */
  async getTask(id: string): Promise<ScheduledTask | null> {
    const task = await this.storage.get(`task:${id}`)
    return (task as ScheduledTask | null) || null
  }

  /**
   * List all scheduled tasks
   */
  async listTasks(): Promise<ScheduledTask[]> {
    const tasks: ScheduledTask[] = []
    const taskEntries = await this.storage.list({ prefix: 'task:' })

    for (const [, task] of taskEntries) {
      tasks.push(task as ScheduledTask)
    }

    return tasks
  }

  /**
   * Get tasks that are due by a specific time
   */
  private async getTasksDueBy(time: number): Promise<ScheduledTask[]> {
    const tasks = await this.listTasks()
    return tasks.filter((task) => task.schedule.time <= time)
  }

  /**
   * Get the next alarm time based on scheduled tasks
   */
  private async getNextAlarmTime(): Promise<number> {
    const tasks = await this.listTasks()

    if (tasks.length === 0) {
      return Date.now() + 24 * 60 * 60 * 1000
    }

    return Math.min(...tasks.map((task) => task.schedule.time))
  }
}

/**
 * Create a new CronDurableObject class with the provided options
 */
export function createCronDurableObject(options: CronDurableObjectOptions = {}): typeof CronDurableObject {
  return class extends CronDurableObject {
    constructor(state: DurableObjectState) {
      super(state, options)
    }
  }
}

export default createCronDurableObject
