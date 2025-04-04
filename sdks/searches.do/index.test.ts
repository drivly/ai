import { describe, it, expect, vi, beforeEach } from 'vitest'
import { searches } from './index.js'
import { api } from 'apis.do'

vi.mock('apis.do', () => ({
  api: {
    list: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    get: vi.fn()
  }
}))

describe('searches.do SDK', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('searches', () => {
    it('should list all searches', async () => {
      const mockSearches = { data: [{ id: '123', name: 'test-search' }] }
      vi.mocked(api.list).mockResolvedValue(mockSearches)

      const result = await searches.list()
      
      expect(api.list).toHaveBeenCalledWith('searches', undefined)
      expect(result).toEqual(mockSearches.data)
    })

    it('should get a specific search', async () => {
      const mockSearch = { id: '123', name: 'test-search' }
      vi.mocked(api.getById).mockResolvedValue(mockSearch)

      const result = await searches.get('123')
      
      expect(api.getById).toHaveBeenCalledWith('searches', '123')
      expect(result).toEqual(mockSearch)
    })

    it('should create a new search', async () => {
      const mockSearch = { id: '123', name: 'test-search' }
      vi.mocked(api.create).mockResolvedValue(mockSearch)

      const result = await searches.create({ name: 'test-search', query: 'test query' })
      
      expect(api.create).toHaveBeenCalledWith('searches', { name: 'test-search', query: 'test query' })
      expect(result).toEqual(mockSearch)
    })

    it('should update a search', async () => {
      const mockSearch = { id: '123', name: 'updated-search' }
      vi.mocked(api.update).mockResolvedValue(mockSearch)

      const result = await searches.update('123', { name: 'updated-search' })
      
      expect(api.update).toHaveBeenCalledWith('searches', '123', { name: 'updated-search' })
      expect(result).toEqual(mockSearch)
    })

    it('should delete a search', async () => {
      const mockSearch = { id: '123', name: 'test-search' }
      vi.mocked(api.remove).mockResolvedValue(mockSearch)

      const result = await searches.delete('123')
      
      expect(api.remove).toHaveBeenCalledWith('searches', '123')
      expect(result).toEqual(mockSearch)
    })

    it('should execute a search', async () => {
      const mockResults = { results: [{ id: '456', name: 'result-item' }] }
      vi.mocked(api.get).mockResolvedValue(mockResults)

      const result = await searches.execute('123')
      
      expect(api.get).toHaveBeenCalledWith('/api/searches/123/execute', undefined)
      expect(result).toEqual(mockResults)
    })
  })
})
