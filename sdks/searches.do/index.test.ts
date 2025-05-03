import { describe, it, expect, vi, beforeEach } from 'vitest'
import { searches } from './index'
import { client } from 'apis.do'

vi.mock('apis.do', () => ({
  client: {
    list: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    get: vi.fn(),
  },
  API: vi.fn(),
}))

describe('searches.do SDK', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('searches', () => {
    it('should list all searches', async () => {
      const mockSearches = { data: [{ id: '123', name: 'test-search' }] }
      vi.mocked(client.list).mockResolvedValue(mockSearches)

      const result = await searches.list()

      expect(client.list).toHaveBeenCalledWith('searches', undefined)
      expect(result).toEqual(mockSearches.data)
    })

    it('should get a specific search', async () => {
      const mockSearch = { id: '123', name: 'test-search' }
      vi.mocked(client.getById).mockResolvedValue(mockSearch)

      const result = await searches.get('123')

      expect(client.getById).toHaveBeenCalledWith('searches', '123')
      expect(result).toEqual(mockSearch)
    })

    it('should create a new search', async () => {
      const mockSearch = { id: '123', name: 'test-search' }
      vi.mocked(client.create).mockResolvedValue(mockSearch)

      const result = await searches.create({ name: 'test-search', query: 'test query' })

      expect(client.create).toHaveBeenCalledWith('searches', { name: 'test-search', query: 'test query' })
      expect(result).toEqual(mockSearch)
    })

    it('should update a search', async () => {
      const mockSearch = { id: '123', name: 'updated-search' }
      vi.mocked(client.update).mockResolvedValue(mockSearch)

      const result = await searches.update('123', { name: 'updated-search' })

      expect(client.update).toHaveBeenCalledWith('searches', '123', { name: 'updated-search' })
      expect(result).toEqual(mockSearch)
    })

    it('should delete a search', async () => {
      const mockSearch = { id: '123', name: 'test-search' }
      vi.mocked(client.remove).mockResolvedValue(mockSearch)

      const result = await searches.delete('123')

      expect(client.remove).toHaveBeenCalledWith('searches', '123')
      expect(result).toEqual(mockSearch)
    })

    it('should execute a search', async () => {
      const mockResults = { results: [{ id: '456', name: 'result-item' }] }
      vi.mocked(client.get).mockResolvedValue(mockResults)

      const result = await searches.execute('123')

      expect(client.get).toHaveBeenCalledWith('/v1/searches/123/execute', undefined)
      expect(result).toEqual(mockResults)
    })
  })
})
