import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createCronDurableObject, CronDurableObject } from './index'

const mockStorage = {
  setAlarm: vi.fn().mockResolvedValue(undefined),
  getAlarm: vi.fn().mockResolvedValue(null),
  deleteAlarm: vi.fn().mockResolvedValue(undefined),
  put: vi.fn().mockResolvedValue(undefined),
  get: vi.fn().mockResolvedValue(null),
  delete: vi.fn().mockResolvedValue(false),
  list: vi.fn().mockResolvedValue(new Map()),
  blockConcurrencyWhile: vi.fn().mockImplementation(async (callback) => {
    await callback()
  }),
}

const mockState = {
  storage: mockStorage,
  blockConcurrencyWhile: vi.fn().mockImplementation(async (callback) => {
    await callback()
  }),
}

describe('durable-objects-cron', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('exports createCronDurableObject function', () => {
    expect(createCronDurableObject).toBeDefined()
    expect(typeof createCronDurableObject).toBe('function')
  })

  it('exports CronDurableObject class', () => {
    expect(CronDurableObject).toBeDefined()
    expect(typeof CronDurableObject).toBe('function')
  })

  it('creates a CronDurableObject instance', () => {
    const cronDO = new CronDurableObject(mockState as any, {})
    expect(cronDO).toBeDefined()
    expect(cronDO).toBeInstanceOf(CronDurableObject)
  })

  it('sets an alarm on initialization', async () => {
    const nextAlarmTime = Date.now() + 60000

    vi.clearAllMocks()

    mockStorage.getAlarm.mockResolvedValue(null)
    mockStorage.list.mockResolvedValue(new Map())

    const setAlarmSpy = vi.spyOn(mockStorage, 'setAlarm')

    mockState.blockConcurrencyWhile.mockImplementation(async (callback) => {
      await callback()
    })

    const cronDO = new CronDurableObject(mockState as any, {})

    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(mockState.blockConcurrencyWhile).toHaveBeenCalled()
    expect(setAlarmSpy).toHaveBeenCalled()
  })

  it('schedules a task with a cron expression', async () => {
    const taskId = 'test-task'
    const mockTask = {
      id: taskId,
      schedule: {
        type: 'cron',
        time: Date.now() + 60000, // 1 minute from now
        cron: '*/5 * * * *',
      },
      data: { test: 'data' },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    mockStorage.get.mockImplementation(async (key) => {
      if (key === `task:${taskId}`) {
        return mockTask
      }
      return null
    })

    const cronDO = new CronDurableObject(mockState as any, {})

    const result = await cronDO.schedule('*/5 * * * *', {
      id: taskId,
      data: { test: 'data' },
    })

    expect(result).toBeDefined()
    expect(result.id).toBe(taskId)
    expect(result.nextExecutionTime).toBeDefined()
    expect(mockStorage.put).toHaveBeenCalled()

    const putCalls = mockStorage.put.mock.calls
    const taskPutCall = putCalls.find((call) => call[0] === `task:${taskId}`)
    expect(taskPutCall).toBeDefined()

    if (taskPutCall) {
      const storedTask = taskPutCall[1]
      expect(storedTask.id).toBe(taskId)
      expect(storedTask.schedule.cron).toBe('*/5 * * * *')
      expect(storedTask.data).toEqual({ test: 'data' })
    }
  })

  it('executes tasks when alarm fires', async () => {
    const now = Date.now()
    const mockTasks = [
      {
        id: 'task-1',
        schedule: {
          type: 'cron' as const,
          time: now - 1000, // Due 1 second ago
          cron: '*/5 * * * *',
        },
        data: { foo: 'bar' },
        createdAt: now - 60000,
        updatedAt: now - 60000,
      },
      {
        id: 'task-2',
        schedule: {
          type: 'cron' as const,
          time: now - 500, // Due 0.5 seconds ago
          cron: '*/10 * * * *',
        },
        data: { baz: 'qux' },
        createdAt: now - 30000,
        updatedAt: now - 30000,
      },
    ]

    mockStorage.list.mockResolvedValue(new Map(mockTasks.map((task) => [`task:${task.id}`, task])))

    const mockHandler = vi.fn()
    const cronDO = new CronDurableObject(mockState as any, {
      defaultHandler: mockHandler,
    })

    await cronDO.alarm()

    expect(mockHandler).toHaveBeenCalledTimes(2)
    expect(mockHandler).toHaveBeenCalledWith(mockTasks[0])
    expect(mockHandler).toHaveBeenCalledWith(mockTasks[1])

    const putCalls = mockStorage.put.mock.calls
    expect(putCalls.some((call) => call[0] === `task:${mockTasks[0].id}`)).toBe(true)
    expect(putCalls.some((call) => call[0] === `task:${mockTasks[1].id}`)).toBe(true)

    expect(mockStorage.setAlarm).toHaveBeenCalled()
  })

  it('handles errors during task execution', async () => {
    const now = Date.now()
    const mockTask = {
      id: 'error-task',
      schedule: {
        type: 'cron' as const,
        time: now - 1000,
        cron: '*/5 * * * *',
      },
      data: { shouldFail: true },
      createdAt: now - 60000,
      updatedAt: now - 60000,
    }

    mockStorage.list.mockResolvedValue(new Map([['task:error-task', mockTask]]))

    mockStorage.get.mockImplementation(async (key) => {
      if (key === `task:${mockTask.id}`) {
        return { ...mockTask }
      }
      return null
    })

    const errorHandler = vi.fn().mockImplementation(() => {
      throw new Error('Test error')
    })

    const cronDO = new CronDurableObject(mockState as any, {
      defaultHandler: errorHandler,
    })

    await cronDO.alarm()

    expect(errorHandler).toHaveBeenCalledWith(mockTask)

    const putCalls = mockStorage.put.mock.calls
    const errorStorageCalls = putCalls.filter((call) => typeof call[0] === 'string' && call[0].startsWith(`error:${mockTask.id}:`))

    expect(errorStorageCalls.length).toBeGreaterThan(0)
    expect(errorStorageCalls[0][1].error).toBe('Error: Test error')
    expect(errorStorageCalls[0][1].task).toEqual(mockTask)

    const taskUpdateCalls = putCalls.filter((call) => call[0] === `task:${mockTask.id}`)
    expect(taskUpdateCalls.length).toBeGreaterThan(0)
  })

  it('cancels a scheduled task', async () => {
    mockStorage.delete.mockResolvedValueOnce(true)

    const cronDO = new CronDurableObject(mockState as any, {})

    const result = await cronDO.cancel('task-to-cancel')

    expect(result).toBe(true)
    expect(mockStorage.delete).toHaveBeenCalledWith('task:task-to-cancel')

    expect(mockStorage.setAlarm).toHaveBeenCalled()
  })
})
