import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockList = vi.hoisted(() => vi.fn())
const mockGetById = vi.hoisted(() => vi.fn())
const mockCreate = vi.hoisted(() => vi.fn())
const mockUpdate = vi.hoisted(() => vi.fn())
const mockRemove = vi.hoisted(() => vi.fn())
const mockPost = vi.hoisted(() => vi.fn())

vi.mock('apis.do', () => {
  return {
    API: vi.fn().mockImplementation(() => ({
      list: mockList,
      getById: mockGetById,
      create: mockCreate,
      update: mockUpdate,
      remove: mockRemove,
      post: mockPost,
    })),
  }
})

import { API } from 'apis.do'
import { actions } from './index.js'

describe('actions.do SDK', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('actions', () => {
    it('should list all actions', async () => {
      const mockActions = { data: [{ id: '123', name: 'test-action' }] }
      mockList.mockResolvedValue(mockActions)

      const result = await actions.list()

      expect(mockList).toHaveBeenCalledWith('actions', undefined)
      expect(result).toEqual(mockActions.data)
    })

    it('should get a specific action', async () => {
      const mockAction = { id: '123', name: 'test-action' }
      mockGetById.mockResolvedValue(mockAction)

      const result = await actions.get('123')

      expect(mockGetById).toHaveBeenCalledWith('actions', '123')
      expect(result).toEqual(mockAction)
    })

    it('should create a new action', async () => {
      const mockAction = { id: '123', name: 'test-action' }
      mockCreate.mockResolvedValue(mockAction)

      const result = await actions.create({ name: 'test-action', description: 'Test action description' })

      expect(mockCreate).toHaveBeenCalledWith('actions', { name: 'test-action', description: 'Test action description' })
      expect(result).toEqual(mockAction)
    })

    it('should update an action', async () => {
      const mockAction = { id: '123', name: 'updated-action' }
      mockUpdate.mockResolvedValue(mockAction)

      const result = await actions.update('123', { name: 'updated-action' })

      expect(mockUpdate).toHaveBeenCalledWith('actions', '123', { name: 'updated-action' })
      expect(result).toEqual(mockAction)
    })

    it('should delete an action', async () => {
      const mockAction = { id: '123', name: 'test-action' }
      mockRemove.mockResolvedValue(mockAction)

      const result = await actions.delete('123')

      expect(mockRemove).toHaveBeenCalledWith('actions', '123')
      expect(result).toEqual(mockAction)
    })

    it('should execute an action', async () => {
      const mockResult = { success: true, data: { id: '456' } }
      mockPost.mockResolvedValue(mockResult)

      const result = await actions.execute('123', { param1: 'value1' })

      expect(mockPost).toHaveBeenCalledWith('/v1/actions/123/execute', { param1: 'value1' })
      expect(result).toEqual(mockResult)
    })
  })
})
