import { describe, it, expect, vi, beforeEach } from 'vitest'
import { actions } from './index.js'
import { client } from 'apis.do'

vi.mock('apis.do', () => ({
  client: {
    list: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    post: vi.fn(),
  },
}))

describe('actions.do SDK', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('actions', () => {
    it('should list all actions', async () => {
      const mockActions = { data: [{ id: '123', name: 'test-action' }] }
      vi.mocked(client.list).mockResolvedValue(mockActions)

      const result = await actions.list()

      expect(client.list).toHaveBeenCalledWith('actions', undefined)
      expect(result).toEqual(mockActions.data)
    })

    it('should get a specific action', async () => {
      const mockAction = { id: '123', name: 'test-action' }
      vi.mocked(client.getById).mockResolvedValue(mockAction)

      const result = await actions.get('123')

      expect(client.getById).toHaveBeenCalledWith('actions', '123')
      expect(result).toEqual(mockAction)
    })

    it('should create a new action', async () => {
      const mockAction = { id: '123', name: 'test-action' }
      vi.mocked(client.create).mockResolvedValue(mockAction)

      const result = await actions.create({ name: 'test-action', description: 'Test action description' })

      expect(client.create).toHaveBeenCalledWith('actions', { name: 'test-action', description: 'Test action description' })
      expect(result).toEqual(mockAction)
    })

    it('should update an action', async () => {
      const mockAction = { id: '123', name: 'updated-action' }
      vi.mocked(client.update).mockResolvedValue(mockAction)

      const result = await actions.update('123', { name: 'updated-action' })

      expect(client.update).toHaveBeenCalledWith('actions', '123', { name: 'updated-action' })
      expect(result).toEqual(mockAction)
    })

    it('should delete an action', async () => {
      const mockAction = { id: '123', name: 'test-action' }
      vi.mocked(client.remove).mockResolvedValue(mockAction)

      const result = await actions.delete('123')

      expect(client.remove).toHaveBeenCalledWith('actions', '123')
      expect(result).toEqual(mockAction)
    })

    it('should execute an action', async () => {
      const mockResult = { success: true, data: { id: '456' } }
      vi.mocked(client.post).mockResolvedValue(mockResult)

      const result = await actions.execute('123', { param1: 'value1' })

      expect(client.post).toHaveBeenCalledWith('/v1/actions/123/execute', { param1: 'value1' })
      expect(result).toEqual(mockResult)
    })
  })
})
