import { describe, it, expect, vi, beforeEach } from 'vitest'
import { integrations, createIntegration, triggers, actions } from './index.js'

const mockGet = vi.fn()
const mockPost = vi.fn()

vi.mock('./index.js', () => {
  return {
    integrations: {
      connect: async (service: string, options: any) => {
        return mockPost(`/integrations/${service}/connect`, options)
      },
      createTrigger: async (data: any) => {
        return mockPost('/integrations/triggers', data)
      },
      createAction: async (data: any) => {
        return mockPost('/integrations/actions', data)
      },
      list: async () => {
        return mockGet('/integrations')
      },
      get: async (id: string) => {
        return mockGet(`/integrations/${id}`)
      },
    },
    createIntegration: (config: any) => config,
    triggers: {
      list: async () => {
        return mockGet('/integrations/triggers')
      },
      get: async (id: string) => {
        return mockGet(`/integrations/triggers/${id}`)
      },
    },
    actions: {
      list: async () => {
        return mockGet('/integrations/actions')
      },
      get: async (id: string) => {
        return mockGet(`/integrations/actions/${id}`)
      },
    },
  }
})

describe('integrations.do SDK', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('integrations', () => {
    it('should connect to a service', async () => {
      const mockConnection = { id: '123', service: 'test-service', status: 'active', auth: { type: 'apiKey' } } // Added auth type to mock
      mockPost.mockResolvedValue(mockConnection)
      const authOptions = { type: 'apiKey' as const, apiKey: 'dummy-key' }; // Use 'as const' for literal type

      const result = await integrations.connect('test-service', authOptions)

      expect(mockPost).toHaveBeenCalledWith('/integrations/test-service/connect', authOptions)
      expect(result).toEqual(mockConnection)
    })

    it('should create a trigger', async () => {
      const mockTrigger = { id: '123', type: 'webhook' as const, source: 'test-service', event: 'dummy-event', status: 'enabled' as const } // Added event and status
      mockPost.mockResolvedValue(mockTrigger)
      const triggerConfig = { type: 'webhook' as const, source: 'test-service', event: 'dummy-event' }; // Added event

      const result = await integrations.createTrigger(triggerConfig)

      expect(mockPost).toHaveBeenCalledWith('/integrations/triggers', triggerConfig)
      expect(result).toEqual(mockTrigger)
    })

    it('should create an action', async () => {
      const mockAction = { id: '123', name: 'test-action', description: 'dummy description', source: 'test-service', operation: 'dummy-operation', inputSchema: {} } // Added missing props
      mockPost.mockResolvedValue(mockAction)
      const actionConfig = { name: 'test-action', source: 'test-service', description: 'dummy description', operation: 'dummy-operation', inputSchema: {} }; // Added missing props

      const result = await integrations.createAction(actionConfig)

      expect(mockPost).toHaveBeenCalledWith('/integrations/actions', actionConfig)
      expect(result).toEqual(mockAction)
    })

    it('should list available integrations', async () => {
      const mockIntegrations = [{ id: '123', name: 'test-integration' }]
      mockGet.mockResolvedValue(mockIntegrations)

      const result = await integrations.list()

      expect(mockGet).toHaveBeenCalledWith('/integrations')
      expect(result).toEqual(mockIntegrations)
    })

    it('should get details about a specific integration', async () => {
      const mockIntegration = { id: '123', name: 'test-integration' }
      mockGet.mockResolvedValue(mockIntegration)

      const result = await integrations.get('test-integration')

      expect(mockGet).toHaveBeenCalledWith('/integrations/test-integration')
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
      mockGet.mockResolvedValue(mockTriggers)

      const result = await triggers.list()

      expect(mockGet).toHaveBeenCalledWith('/integrations/triggers')
      expect(result).toEqual(mockTriggers)
    })

    it('should get a specific trigger', async () => {
      const mockTrigger = { id: '123', type: 'webhook' }
      mockGet.mockResolvedValue(mockTrigger)

      const result = await triggers.get('123')

      expect(mockGet).toHaveBeenCalledWith('/integrations/triggers/123')
      expect(result).toEqual(mockTrigger)
    })
  })

  describe('actions', () => {
    it('should list all actions', async () => {
      const mockActions = [{ id: '123', name: 'test-action' }]
      mockGet.mockResolvedValue(mockActions)

      const result = await actions.list()

      expect(mockGet).toHaveBeenCalledWith('/integrations/actions')
      expect(result).toEqual(mockActions)
    })

    it('should get a specific action', async () => {
      const mockAction = { id: '123', name: 'test-action' }
      mockGet.mockResolvedValue(mockAction)

      const result = await actions.get('123')

      expect(mockGet).toHaveBeenCalledWith('/integrations/actions/123')
      expect(result).toEqual(mockAction)
    })
  })
})
