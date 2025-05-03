import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockList = vi.hoisted(() => vi.fn())
const mockGetById = vi.hoisted(() => vi.fn())
const mockCreate = vi.hoisted(() => vi.fn())
const mockUpdate = vi.hoisted(() => vi.fn())
const mockRemove = vi.hoisted(() => vi.fn())
const mockGet = vi.hoisted(() => vi.fn())

vi.mock('apis.do', () => {
  return {
    API: vi.fn().mockImplementation(() => ({
      list: mockList,
      getById: mockGetById,
      create: mockCreate,
      update: mockUpdate,
      remove: mockRemove,
      get: mockGet,
    })),
  }
})

import { API } from 'apis.do'
import { searches } from './index'

describe('searches.do SDK', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('searches', () => {
    it('should list all searches', async () => {
      const mockSearches = { data: [{ id: '123', name: 'test-search' }] }
      mockList.mockResolvedValue(mockSearches)

      const result = await searches.list()

      expect(mockList).toHaveBeenCalledWith('searches', undefined)
      expect(result).toEqual(mockSearches.data)
    })

    it('should get a specific search', async () => {
      const mockSearch = { id: '123', name: 'test-search' }
      mockGetById.mockResolvedValue(mockSearch)

      const result = await searches.get('123')

      expect(mockGetById).toHaveBeenCalledWith('searches', '123')
      expect(result).toEqual(mockSearch)
    })

    it('should create a new search', async () => {
      const mockSearch = { id: '123', name: 'test-search' }
      mockCreate.mockResolvedValue(mockSearch)

      const result = await searches.create({ name: 'test-search', query: 'test query' })

      expect(mockCreate).toHaveBeenCalledWith('searches', { name: 'test-search', query: 'test query' })
      expect(result).toEqual(mockSearch)
    })

    it('should update a search', async () => {
      const mockSearch = { id: '123', name: 'updated-search' }
      mockUpdate.mockResolvedValue(mockSearch)

      const result = await searches.update('123', { name: 'updated-search' })

      expect(mockUpdate).toHaveBeenCalledWith('searches', '123', { name: 'updated-search' })
      expect(result).toEqual(mockSearch)
    })

    it('should delete a search', async () => {
      const mockSearch = { id: '123', name: 'test-search' }
      mockRemove.mockResolvedValue(mockSearch)

      const result = await searches.delete('123')

      expect(mockRemove).toHaveBeenCalledWith('searches', '123')
      expect(result).toEqual(mockSearch)
    })

    it('should execute a search', async () => {
      const mockResults = { results: [{ id: '456', name: 'result-item' }] }
      mockGet.mockResolvedValue(mockResults)

      const result = await searches.execute('123')

      expect(mockGet).toHaveBeenCalledWith('/v1/searches/123/execute', undefined)
      expect(result).toEqual(mockResults)
    })
  })
})
