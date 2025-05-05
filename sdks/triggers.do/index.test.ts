import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockList = vi.hoisted(() => vi.fn())
const mockGetById = vi.hoisted(() => vi.fn())
const mockCreate = vi.hoisted(() => vi.fn())
const mockUpdate = vi.hoisted(() => vi.fn())
const mockRemove = vi.hoisted(() => vi.fn())

vi.mock('apis.do', () => {
  return {
    API: vi.fn().mockImplementation(() => ({
      list: mockList,
      getById: mockGetById,
      create: mockCreate,
      update: mockUpdate,
      remove: mockRemove,
    })),
  }
})

import { API } from 'apis.do'
import { triggers } from './index.js'

describe('triggers.do SDK', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('triggers', () => {
    it('should list all triggers', async () => {
      const mockTriggers = { data: [{ id: '123', name: 'test-trigger' }] }
      mockList.mockResolvedValue(mockTriggers)

      const result = await triggers.list()

      expect(mockList).toHaveBeenCalledWith('triggers', undefined)
      expect(result).toEqual(mockTriggers.data)
    })

    it('should get a specific trigger', async () => {
      const mockTrigger = { id: '123', name: 'test-trigger' }
      mockGetById.mockResolvedValue(mockTrigger)

      const result = await triggers.get('123')

      expect(mockGetById).toHaveBeenCalledWith('triggers', '123')
      expect(result).toEqual(mockTrigger)
    })

    it('should create a new trigger', async () => {
      const mockTrigger = { id: '123', name: 'test-trigger' }
      mockCreate.mockResolvedValue(mockTrigger)

      const result = await triggers.create({ name: 'test-trigger' })

      expect(mockCreate).toHaveBeenCalledWith('triggers', { name: 'test-trigger' })
      expect(result).toEqual(mockTrigger)
    })

    it('should update a trigger', async () => {
      const mockTrigger = { id: '123', name: 'updated-trigger' }
      mockUpdate.mockResolvedValue(mockTrigger)

      const result = await triggers.update('123', { name: 'updated-trigger' })

      expect(mockUpdate).toHaveBeenCalledWith('triggers', '123', { name: 'updated-trigger' })
      expect(result).toEqual(mockTrigger)
    })

    it('should delete a trigger', async () => {
      const mockTrigger = { id: '123', name: 'test-trigger' }
      mockRemove.mockResolvedValue(mockTrigger)

      const result = await triggers.delete('123')

      expect(mockRemove).toHaveBeenCalledWith('triggers', '123')
      expect(result).toEqual(mockTrigger)
    })
  })
})
