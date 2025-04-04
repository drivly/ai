import { describe, it, expect, vi, beforeEach } from 'vitest'
import { triggers } from './index.js'
import { api } from 'apis.do'

vi.mock('apis.do', () => ({
  api: {
    list: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn()
  }
}))

describe('triggers.do SDK', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('triggers', () => {
    it('should list all triggers', async () => {
      const mockTriggers = { data: [{ id: '123', name: 'test-trigger' }] }
      vi.mocked(api.list).mockResolvedValue(mockTriggers)

      const result = await triggers.list()
      
      expect(api.list).toHaveBeenCalledWith('triggers', undefined)
      expect(result).toEqual(mockTriggers.data)
    })

    it('should get a specific trigger', async () => {
      const mockTrigger = { id: '123', name: 'test-trigger' }
      vi.mocked(api.getById).mockResolvedValue(mockTrigger)

      const result = await triggers.get('123')
      
      expect(api.getById).toHaveBeenCalledWith('triggers', '123')
      expect(result).toEqual(mockTrigger)
    })

    it('should create a new trigger', async () => {
      const mockTrigger = { id: '123', name: 'test-trigger' }
      vi.mocked(api.create).mockResolvedValue(mockTrigger)

      const result = await triggers.create({ name: 'test-trigger' })
      
      expect(api.create).toHaveBeenCalledWith('triggers', { name: 'test-trigger' })
      expect(result).toEqual(mockTrigger)
    })

    it('should update a trigger', async () => {
      const mockTrigger = { id: '123', name: 'updated-trigger' }
      vi.mocked(api.update).mockResolvedValue(mockTrigger)

      const result = await triggers.update('123', { name: 'updated-trigger' })
      
      expect(api.update).toHaveBeenCalledWith('triggers', '123', { name: 'updated-trigger' })
      expect(result).toEqual(mockTrigger)
    })

    it('should delete a trigger', async () => {
      const mockTrigger = { id: '123', name: 'test-trigger' }
      vi.mocked(api.remove).mockResolvedValue(mockTrigger)

      const result = await triggers.delete('123')
      
      expect(api.remove).toHaveBeenCalledWith('triggers', '123')
      expect(result).toEqual(mockTrigger)
    })
  })
})
