import { describe, it, expect, vi, beforeEach } from 'vitest'
import { integrations, createIntegration, triggers, actions } from './index'
import { api } from 'apis.do'

vi.mock('apis.do', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('integrations.do SDK', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('integrations', () => {
    it('should connect to a service', async () => {
      const mockConnection = { id: '123', service: 'test-service', status: 'active' }
      vi.mocked(api.post).mockResolvedValue(mockConnection)

      const result = await integrations.connect('test-service', { authType: 'apiKey' })

      expect(api.post).toHaveBeenCalledWith('/integrations/test-service/connect', { authType: 'apiKey' })
      expect(result).toEqual(mockConnection)
    })

    it('should create a trigger', async () => {
      const mockTrigger = { id: '123', type: 'webhook', source: 'test-service' }
      vi.mocked(api.post).mockResolvedValue(mockTrigger)

      const result = await integrations.createTrigger({ type: 'webhook', source: 'test-service' })

      expect(api.post).toHaveBeenCalledWith('/integrations/triggers', { type: 'webhook', source: 'test-service' })
      expect(result).toEqual(mockTrigger)
    })

    it('should create an action', async () => {
      const mockAction = { id: '123', name: 'test-action', source: 'test-service' }
      vi.mocked(api.post).mockResolvedValue(mockAction)

      const result = await integrations.createAction({ name: 'test-action', source: 'test-service' })

      expect(api.post).toHaveBeenCalledWith('/integrations/actions', { name: 'test-action', source: 'test-service' })
      expect(result).toEqual(mockAction)
    })

    it('should list available integrations', async () => {
      const mockIntegrations = [{ id: '123', name: 'test-integration' }]
      vi.mocked(api.get).mockResolvedValue(mockIntegrations)

      const result = await integrations.list()

      expect(api.get).toHaveBeenCalledWith('/integrations')
      expect(result).toEqual(mockIntegrations)
    })

    it('should get details about a specific integration', async () => {
      const mockIntegration = { id: '123', name: 'test-integration' }
      vi.mocked(api.get).mockResolvedValue(mockIntegration)

      const result = await integrations.get('test-integration')

      expect(api.get).toHaveBeenCalledWith('/integrations/test-integration')
      expect(result).toEqual(mockIntegration)
    })
  })

  describe('createIntegration', () => {
    it('should return the integration configuration', () => {
      const config = {
        name: 'test-integration',
        description: 'Test integration',
      }

      const result = createIntegration(config)

      expect(result).toEqual(config)
    })
  })

  describe('triggers', () => {
    it('should list all triggers', async () => {
      const mockTriggers = [{ id: '123', type: 'webhook' }]
      vi.mocked(api.get).mockResolvedValue(mockTriggers)

      const result = await triggers.list()

      expect(api.get).toHaveBeenCalledWith('/integrations/triggers')
      expect(result).toEqual(mockTriggers)
    })

    it('should get a specific trigger', async () => {
      const mockTrigger = { id: '123', type: 'webhook' }
      vi.mocked(api.get).mockResolvedValue(mockTrigger)

      const result = await triggers.get('123')

      expect(api.get).toHaveBeenCalledWith('/integrations/triggers/123')
      expect(result).toEqual(mockTrigger)
    })
  })

  describe('actions', () => {
    it('should list all actions', async () => {
      const mockActions = [{ id: '123', name: 'test-action' }]
      vi.mocked(api.get).mockResolvedValue(mockActions)

      const result = await actions.list()

      expect(api.get).toHaveBeenCalledWith('/integrations/actions')
      expect(result).toEqual(mockActions)
    })

    it('should get a specific action', async () => {
      const mockAction = { id: '123', name: 'test-action' }
      vi.mocked(api.get).mockResolvedValue(mockAction)

      const result = await actions.get('123')

      expect(api.get).toHaveBeenCalledWith('/integrations/actions/123')
      expect(result).toEqual(mockAction)
    })
  })
})
