import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DB, db, DatabaseClient } from '../index'

const mockList = vi.fn()
const mockGetById = vi.fn()
const mockCreate = vi.fn()
const mockUpdate = vi.fn()
const mockRemove = vi.fn()
const mockSearch = vi.fn()

vi.mock('apis.do', () => {
  return {
    default: {
      API: vi.fn(() => ({
        list: mockList,
        getById: mockGetById,
        create: mockCreate,
        update: mockUpdate,
        remove: mockRemove,
        search: mockSearch
      })),
      api: {
        list: vi.fn(),
        getById: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        remove: vi.fn(),
        search: vi.fn()
      }
    },
    API: vi.fn(() => ({
      list: mockList,
      getById: mockGetById,
      create: mockCreate,
      update: mockUpdate,
      remove: mockRemove,
      search: mockSearch
    }))
  }
})

describe('database.do SDK', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  describe('DB function', () => {
    it('should create a database client with default options', () => {
      const client = DB()
      expect(client).toBeDefined()
    })
    
    it('should map resources collection to things collection', async () => {
      const client = DB()
      await client.resources.find()
      expect(mockList).toHaveBeenCalledWith('things', {})
    })
    
    it('should pass through other collection names', async () => {
      const client = DB()
      await client.users.find()
      expect(mockList).toHaveBeenCalledWith('users', {})
    })
  })
  
  describe('DatabaseClient class', () => {
    it('should initialize with resources collection', () => {
      const client = new DatabaseClient()
      expect(client.resources).toBeDefined()
    })
    
    it('should map resources to things collection in method calls', async () => {
      const client = new DatabaseClient()
      await client.find('resources', {})
      expect(mockList).toHaveBeenCalledWith('things', {})
    })
    
    it('should pass through other collection names in method calls', async () => {
      const client = new DatabaseClient()
      await client.find('users', {})
      expect(mockList).toHaveBeenCalledWith('users', {})
    })
  })
  
  describe('Default db instance', () => {
    it('should be an instance of the DB function', () => {
      expect(db).toBeDefined()
    })
  })
})
