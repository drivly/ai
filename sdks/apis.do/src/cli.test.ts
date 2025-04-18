import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CLI } from './cli.js'
import { API } from './client.js'

vi.mock('./auth', () => ({
  storeApiKey: vi.fn().mockResolvedValue(undefined),
  removeApiKey: vi.fn().mockResolvedValue(true),
  generateState: vi.fn().mockReturnValue('test-state'),
  startLocalServer: vi.fn().mockResolvedValue({ port: 8000, apiKey: 'server-api-key' }),
  openBrowser: vi.fn(),
  loadApiKey: vi.fn().mockResolvedValue('stored-api-key'),
}))

vi.mock('./client.js', () => {
  return {
    API: vi.fn().mockImplementation(() => ({
      post: vi.fn().mockResolvedValue({ success: true }),
      list: vi.fn().mockResolvedValue({ data: [] }),
      getById: vi.fn().mockResolvedValue({ id: '123', name: 'Test' }),
      create: vi.fn().mockResolvedValue({ id: '123', name: 'New Resource' }),
      update: vi.fn().mockResolvedValue({ id: '123', name: 'Updated Resource' }),
      remove: vi.fn().mockResolvedValue({ success: true }),
    })),
  }
})

import * as auth from './auth'

describe('CLI', () => {
  let cli: CLI
  let mockConsoleLog: any

  beforeEach(() => {
    vi.clearAllMocks()

    mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})

    cli = new CLI({
      apiKey: 'test-api-key',
      baseUrl: 'https://test-api.com',
    })
  })

  describe('init', () => {
    it('should initialize a new project', async () => {
      await cli.init()
      expect(mockConsoleLog).toHaveBeenCalledWith('Initializing .ai project...')
    })
  })

  describe('login', () => {
    it('should log in with token', async () => {
      await cli.login({ token: 'test-token' })

      expect(mockConsoleLog).toHaveBeenCalledWith('Logging in to apis.do...')
      expect(auth.storeApiKey).toHaveBeenCalledWith('test-token')
    })
  })

  describe('logout', () => {
    it('should log out', async () => {
      await cli.logout()

      expect(mockConsoleLog).toHaveBeenCalledWith('Logging out from apis.do...')
      expect(auth.removeApiKey).toHaveBeenCalled()
    })
  })

  describe('pull', () => {
    it('should pull resources', async () => {
      await cli.pull({ resources: ['functions'] })
      expect(mockConsoleLog).toHaveBeenCalledWith('Pulling resources from apis.do...')
    })
  })

  describe('push', () => {
    it('should push resources', async () => {
      await cli.push({ resources: ['functions'] })
      expect(mockConsoleLog).toHaveBeenCalledWith('Pushing resources to apis.do...')
    })
  })

  describe('sync', () => {
    it('should sync resources', async () => {
      await cli.sync()
      expect(mockConsoleLog).toHaveBeenCalledWith('Syncing resources with apis.do...')
    })
  })

  describe('executeFunction', () => {
    it('should execute a function and use the API client', async () => {
      const inputs = { arg1: 'value1' }
      await cli.executeFunction('testFunction', inputs)

      expect(mockConsoleLog).toHaveBeenCalledWith('Executing function testFunction...')
      expect(cli['api'].post).toHaveBeenCalledWith('/v1/functions/testFunction/execute', inputs)
    })
  })

  describe('list', () => {
    it('should list resources and use the API client', async () => {
      const query = { limit: 10 }
      await cli.list('functions', query)

      expect(mockConsoleLog).toHaveBeenCalledWith('Listing functions...')
      expect(cli['api'].list).toHaveBeenCalledWith('functions', query)
    })
  })

  describe('get', () => {
    it('should get a resource by ID and use the API client', async () => {
      await cli.get('functions', '123')

      expect(mockConsoleLog).toHaveBeenCalledWith('Getting functions 123...')
      expect(cli['api'].getById).toHaveBeenCalledWith('functions', '123')
    })
  })

  describe('create', () => {
    it('should create a resource and use the API client', async () => {
      const data = { name: 'New Function' }
      await cli.create('functions', data)

      expect(mockConsoleLog).toHaveBeenCalledWith('Creating new functions...')
      expect(cli['api'].create).toHaveBeenCalledWith('functions', data)
    })
  })

  describe('update', () => {
    it('should update a resource and use the API client', async () => {
      const data = { name: 'Updated Function' }
      await cli.update('functions', '123', data)

      expect(mockConsoleLog).toHaveBeenCalledWith('Updating functions 123...')
      expect(cli['api'].update).toHaveBeenCalledWith('functions', '123', data)
    })
  })

  describe('delete', () => {
    it('should delete a resource and use the API client', async () => {
      await cli.delete('functions', '123')

      expect(mockConsoleLog).toHaveBeenCalledWith('Deleting functions 123...')
      expect(cli['api'].remove).toHaveBeenCalledWith('functions', '123')
    })
  })
})
