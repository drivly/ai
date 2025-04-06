import { API, api as apisDoClient } from '../../apis.do/index.js'
import { EvalsOptions, Test, Result, TestRun, TaskExecutor, EvaluationOptions } from './types.js'

/**
 * SQLite adapter for local storage
 * This is a minimal implementation that relies on evalite's core functionality
 */
class SQLiteAdapter {
  private dbPath: string
  private db: any

  constructor(dbPath: string = './.evalite.db') {
    this.dbPath = dbPath
    this.db = {
      tests: new Map<string, Test>(),
      results: new Map<string, Result>(),
      runs: new Map<string, TestRun>(),
    }
  }

  async saveTest(test: Test): Promise<Test> {
    this.db.tests.set(test.id, test)
    return test
  }

  async getTest(id: string): Promise<Test | null> {
    return this.db.tests.get(id) || null
  }

  async saveResult(result: Result): Promise<Result> {
    this.db.results.set(result.id, result)
    return result
  }

  async getResult(id: string): Promise<Result | null> {
    return this.db.results.get(id) || null
  }

  async saveRun(run: TestRun): Promise<TestRun> {
    this.db.runs.set(run.id, run)
    return run
  }

  async getRun(id: string): Promise<TestRun | null> {
    return this.db.runs.get(id) || null
  }
}

/**
 * Evals.do client for evaluating AI functions, workflows, and agents
 */
export class EvalsClient {
  private api: API
  private localStore: SQLiteAdapter | null
  private storeLocally: boolean
  private storeRemotely: boolean

  constructor(options: EvalsOptions = {}) {
    const { baseUrl = 'https://evals.do', apiKey, storeLocally = true, storeRemotely = true, dbPath = './node_modules/evalite/.evalite.db', ...rest } = options

    this.api = new API({
      baseUrl,
      apiKey,
      ...rest,
    })

    this.storeLocally = storeLocally
    this.storeRemotely = storeRemotely

    this.localStore = storeLocally ? new SQLiteAdapter(dbPath) : null
  }

  /**
   * Create a new test
   */
  async createTest(test: Partial<Test>): Promise<Test> {
    const now = new Date().toISOString()
    const newTest: Test = {
      id: crypto.randomUUID(),
      name: test.name || 'Unnamed Test',
      input: test.input || {},
      expected: test.expected || {},
      tags: test.tags || [],
      createdAt: now,
      updatedAt: now,
      ...test,
    }

    if (this.storeRemotely) {
      try {
        const remoteTest = await this.api.create<Test>('tests', newTest)
        newTest.id = remoteTest.id
      } catch (error) {
        console.error('Failed to store test remotely:', error)
      }
    }

    if (this.storeLocally && this.localStore) {
      await this.localStore.saveTest(newTest)
    }

    return newTest
  }

  /**
   * Get a test by ID
   */
  async getTest(id: string): Promise<Test | null> {
    if (this.storeRemotely) {
      try {
        return await this.api.getById<Test>('tests', id)
      } catch (error) {
        console.error('Failed to get test from remote:', error)
      }
    }

    if (this.storeLocally && this.localStore) {
      return await this.localStore.getTest(id)
    }

    return null
  }

  /**
   * Create a new test result
   */
  async createResult(result: Partial<Result>): Promise<Result> {
    const now = new Date().toISOString()
    const newResult: Result = {
      id: crypto.randomUUID(),
      testId: result.testId || '',
      output: result.output || {},
      metrics: result.metrics || {},
      createdAt: now,
      updatedAt: now,
      ...result,
    }

    if (this.storeRemotely) {
      try {
        const remoteResult = await this.api.create<Result>('results', newResult)
        newResult.id = remoteResult.id
      } catch (error) {
        console.error('Failed to store result remotely:', error)
      }
    }

    if (this.storeLocally && this.localStore) {
      await this.localStore.saveResult(newResult)
    }

    return newResult
  }

  /**
   * Get a result by ID
   */
  async getResult(id: string): Promise<Result | null> {
    if (this.storeRemotely) {
      try {
        return await this.api.getById<Result>('results', id)
      } catch (error) {
        console.error('Failed to get result from remote:', error)
      }
    }

    if (this.storeLocally && this.localStore) {
      return await this.localStore.getResult(id)
    }

    return null
  }

  /**
   * Create a new test run
   */
  async createRun(run: Partial<TestRun>): Promise<TestRun> {
    const now = new Date().toISOString()
    const newRun: TestRun = {
      id: crypto.randomUUID(),
      name: run.name || 'Unnamed Run',
      testIds: run.testIds || [],
      results: run.results || [],
      startedAt: run.startedAt || now,
      createdAt: now,
      updatedAt: now,
      ...run,
    }

    if (this.storeRemotely) {
      try {
        const remoteRun = await this.api.create<TestRun>('runs', newRun)
        newRun.id = remoteRun.id
      } catch (error) {
        console.error('Failed to store run remotely:', error)
      }
    }

    if (this.storeLocally && this.localStore) {
      await this.localStore.saveRun(newRun)
    }

    return newRun
  }

  /**
   * Get a run by ID
   */
  async getRun(id: string): Promise<TestRun | null> {
    if (this.storeRemotely) {
      try {
        return await this.api.getById<TestRun>('runs', id)
      } catch (error) {
        console.error('Failed to get run from remote:', error)
      }
    }

    if (this.storeLocally && this.localStore) {
      return await this.localStore.getRun(id)
    }

    return null
  }

  /**
   * Run an evaluation on a task executor with the given tests
   */
  async evaluate<T = any, R = any>(executor: TaskExecutor<T, R>, tests: Test[], options: EvaluationOptions = {}): Promise<TestRun> {
    const runId = crypto.randomUUID()
    const now = new Date().toISOString()

    const run: TestRun = {
      id: runId,
      name: `Run ${runId.split('-')[0]}`,
      testIds: tests.map((test) => test.id),
      results: [],
      startedAt: now,
      createdAt: now,
      updatedAt: now,
    }

    await this.createRun(run)

    const results: Result[] = []

    for (const test of tests) {
      const startTime = Date.now()
      let output: any = {}
      let error: string | undefined

      try {
        output = await executor.execute(test.input as T)
      } catch (err) {
        error = err instanceof Error ? err.message : String(err)
      }

      const duration = Date.now() - startTime

      let metrics: Record<string, number> = {}

      if (options.metrics && test.expected) {
        for (const [name, calculator] of Object.entries(options.metrics)) {
          try {
            const metricResult = calculator.calculate(output, test.expected)

            if (typeof metricResult === 'number') {
              metrics[name] = metricResult
            } else if (typeof metricResult === 'object') {
              metrics = { ...metrics, ...metricResult }
            }
          } catch (err) {
            console.error(`Error calculating metric ${name}:`, err)
          }
        }
      }

      const result = await this.createResult({
        testId: test.id,
        output,
        error,
        duration,
        metrics,
      })

      results.push(result)
    }

    run.results = results
    run.completedAt = new Date().toISOString()
    run.updatedAt = run.completedAt

    if (this.storeRemotely) {
      try {
        await this.api.update<TestRun>('runs', run.id, run)
      } catch (error) {
        console.error('Failed to update run remotely:', error)
      }
    }

    if (this.storeLocally && this.localStore) {
      await this.localStore.saveRun(run)
    }

    return run
  }
}
