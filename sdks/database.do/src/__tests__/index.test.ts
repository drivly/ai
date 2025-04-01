import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DB, db, DatabaseClient } from '../index'

vi.mock('apis.do', () => {
  const mockAPI = {
    list: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    search: vi.fn(),
  }
  
  return {
    API: vi.fn(() => mockAPI),
    api: {
      list: vi.fn(),
      getById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
      search: vi.fn(),
    }
  }
})

describe('database.do SDK', () => {
  let mockAPI: any
  
  beforeEach(() => {
    vi.clearAllMocks()
    mockAPI = new (require('apis.do').API)()
  })
  
  describe('DB function', () => {
    it('should create a database client with default options', () => {
      const client = DB()
      expect(client).toBeDefined()
    })
    
    it('should map resources collection to things collection', async () => {
      const client = DB()
      await client.resources.find()
      expect(mockAPI.list).toHaveBeenCalledWith('things', {})
    })
    
    it('should pass through other collection names', async () => {
      const client = DB()
      await client.users.find()
      expect(mockAPI.list).toHaveBeenCalledWith('users', {})
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
      expect(mockAPI.list).toHaveBeenCalledWith('things', {})
    })
    
    it('should pass through other collection names in method calls', async () => {
      const client = new DatabaseClient()
      await client.find('users', {})
      expect(mockAPI.list).toHaveBeenCalledWith('users', {})
    })
  })
  
  describe('Default db instance', () => {
    it('should be an instance of the DB function', () => {
      expect(db).toBeDefined()
    })
  })
})
