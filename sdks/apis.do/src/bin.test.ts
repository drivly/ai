import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const originalArgv = process.argv

vi.mock('node:fs', async () => {
  return {
    default: {
      readFileSync: vi.fn().mockImplementation((path) => {
        if (path.includes('package.json')) {
          return JSON.stringify({ version: '1.0.0' })
        }
        if (path.includes('config.json')) {
          return JSON.stringify({})
        }
        throw new Error(`Unexpected file read: ${path}`)
      }),
      existsSync: vi.fn().mockReturnValue(true),
    },
    readFileSync: vi.fn().mockImplementation((path) => {
      if (path.includes('package.json')) {
        return JSON.stringify({ version: '1.0.0' })
      }
      if (path.includes('config.json')) {
        return JSON.stringify({})
      }
      throw new Error(`Unexpected file read: ${path}`)
    }),
    existsSync: vi.fn().mockReturnValue(true),
  }
})

const mockInit = vi.fn().mockResolvedValue(undefined)
const mockLogin = vi.fn().mockResolvedValue(undefined)
const mockLogout = vi.fn().mockResolvedValue(undefined)
const mockPull = vi.fn().mockResolvedValue(undefined)
const mockPush = vi.fn().mockResolvedValue(undefined)
const mockSync = vi.fn().mockResolvedValue(undefined)
const mockList = vi.fn().mockResolvedValue({ data: [] })
const mockGet = vi.fn().mockResolvedValue({ id: '123' })
const mockCreate = vi.fn().mockResolvedValue({ id: '123' })
const mockUpdate = vi.fn().mockResolvedValue({ id: '123' })
const mockDelete = vi.fn().mockResolvedValue({ success: true })
const mockExecuteFunction = vi.fn().mockResolvedValue({ result: 'success' })

vi.mock('./cli.js', () => {
  return {
    CLI: vi.fn().mockImplementation(() => ({
      init: mockInit,
      login: mockLogin,
      logout: mockLogout,
      pull: mockPull,
      push: mockPush,
      sync: mockSync,
      list: mockList,
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      delete: mockDelete,
      executeFunction: mockExecuteFunction,
    })),
  }
})

const mockConsoleLog = vi.fn()
const mockConsoleError = vi.fn()
vi.stubGlobal('console', {
  log: mockConsoleLog,
  error: mockConsoleError,
})

const mockExit = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as any)

describe('CLI Binary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  afterEach(() => {
    process.argv = originalArgv
  })

  it('should show help when no command is provided', async () => {
    process.argv = ['node', 'bin.js']
    await import('./bin.js')
    expect(mockConsoleLog).toHaveBeenCalled()
  })

  it('should show version when --version flag is provided', async () => {
    process.argv = ['node', 'bin.js', '--version']
    await import('./bin.js')
    expect(mockConsoleLog).toHaveBeenCalled()
  })

  it('should call init command when specified', async () => {
    process.argv = ['node', 'bin.js', 'init']
    await import('./bin.js')
    expect(mockInit).toHaveBeenCalled()
  })

  it('should call login command with token when specified', async () => {
    process.argv = ['node', 'bin.js', 'login', 'test-token']
    await import('./bin.js')
    expect(mockLogin).toHaveBeenCalledWith({ token: 'test-token' })
  })

  it('should call logout command when specified', async () => {
    process.argv = ['node', 'bin.js', 'logout']
    await import('./bin.js')
    expect(mockLogout).toHaveBeenCalled()
  })

  it('should call list command with collection when specified', async () => {
    process.argv = ['node', 'bin.js', 'list', 'functions']
    await import('./bin.js')
    expect(mockList).toHaveBeenCalledWith('functions')
  })

  it('should show error when list command is called without collection', async () => {
    process.argv = ['node', 'bin.js', 'list']
    await import('./bin.js')
    expect(mockConsoleError).toHaveBeenCalledWith('Error: Collection name required')
    expect(mockExit).toHaveBeenCalledWith(1)
  })

  it('should call executeFunction when execute command is specified', async () => {
    process.argv = ['node', 'bin.js', 'execute', 'testFunc', '{"arg":"value"}']
    await import('./bin.js')
    expect(mockExecuteFunction).toHaveBeenCalledWith('testFunc', { arg: 'value' })
  })
})
