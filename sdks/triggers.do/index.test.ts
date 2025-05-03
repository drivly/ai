import { describe, it, expect, vi, beforeEach } from 'vitest'
import { triggers } from './index.js'
import { API } from 'apis.do'

vi.mock('apis.do', () => {
  return {
    API: vi.fn().mockImplementation(() => ({
      list: vi.fn(),
      getById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    })),
  }
})

const mockApiInstance = vi.mocked(new API())

describe('triggers.do SDK', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('triggers', () => {
    it('should list all triggers', async () => {
      const mockTriggers = { data: [{ id: '123', name: 'test-trigger' }] }
      vi.mocked(mockApiInstance.list).mockResolvedValue(mockTriggers)

      const result = await triggers.list()

      expect(mockApiInstance.list).toHaveBeenCalledWith('triggers', undefined)
      expect(result).toEqual(mockTriggers.data)
    })

    it('should get a specific trigger', async () => {
      const mockTrigger = { id: '123', name: 'test-trigger' }
      vi.mocked(mockApiInstance.getById).mockResolvedValue(mockTrigger)

      const result = await triggers.get('123')

      expect(mockApiInstance.getById).toHaveBeenCalledWith('triggers', '123')
      expect(result).toEqual(mockTrigger)
    })

    it('should create a new trigger', async () => {
      const mockTrigger = { id: '123', name: 'test-trigger' }
      vi.mocked(mockApiInstance.create).mockResolvedValue(mockTrigger)

      const result = await triggers.create({ name: 'test-trigger' })

      expect(mockApiInstance.create).toHaveBeenCalledWith('triggers', { name: 'test-trigger' })
      expect(result).toEqual(mockTrigger)
    })

    it('should update a trigger', async () => {
      const mockTrigger = { id: '123', name: 'updated-trigger' }
      vi.mocked(mockApiInstance.update).mockResolvedValue(mockTrigger)

      const result = await triggers.update('123', { name: 'updated-trigger' })

      expect(mockApiInstance.update).toHaveBeenCalledWith('triggers', '123', { name: 'updated-trigger' })
      expect(result).toEqual(mockTrigger)
    })

    it('should delete a trigger', async () => {
      const mockTrigger = { id: '123', name: 'test-trigger' }
      vi.mocked(mockApiInstance.remove).mockResolvedValue(mockTrigger)

      const result = await triggers.delete('123')

      expect(mockApiInstance.remove).toHaveBeenCalledWith('triggers', '123')
      expect(result).toEqual(mockTrigger)
    })
  })
})
