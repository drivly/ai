import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DB } from './index.js'

const mockPayload = {
  collections: {
    resources: {},
    types: {},
    relationships: {},
    users: {},
  },
  find: vi.fn(),
  findByID: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}

describe('Payload backend', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  it('should create a database client with Payload backend', () => {
    const db = DB({
      backend: 'payload',
      payload: mockPayload,
    })
    
    expect(db).toBeDefined()
    expect(db.resources).toBeDefined()
    expect(db.types).toBeDefined()
    expect(db.relationships).toBeDefined()
    expect(db.users).toBeDefined()
  })
  
  it('should find documents in a collection', async () => {
    mockPayload.find.mockResolvedValue({
      docs: [
        { id: '1', name: 'Test 1' },
        { id: '2', name: 'Test 2' },
      ],
    })
    
    mockPayload.findByID.mockImplementation(({ id }) => {
      if (id === '1') {
        return Promise.resolve({ id: '1', name: 'Test 1', content: 'Content 1' })
      } else if (id === '2') {
        return Promise.resolve({ id: '2', name: 'Test 2', content: 'Content 2' })
      }
      return Promise.reject(new Error('Document not found'))
    })
    
    const db = DB({
      backend: 'payload',
      payload: mockPayload,
    })
    
    const result = await db.resources.find()
    
    expect(result).toEqual({
      data: [
        { id: '1', name: 'Test 1', content: 'Content 1' },
        { id: '2', name: 'Test 2', content: 'Content 2' },
      ],
      meta: {
        total: 2,
        page: 1,
        pageSize: 10,
        hasNextPage: false,
      },
    })
    
    expect(mockPayload.find).toHaveBeenCalledWith({
      collection: 'resources',
      limit: 1000,
    })
  })
  
  it('should find a document by ID', async () => {
    mockPayload.findByID.mockResolvedValue({
      id: '1',
      name: 'Test',
      content: 'Test content',
    })
    
    const db = DB({
      backend: 'payload',
      payload: mockPayload,
    })
    
    const result = await db.resources.findOne('1')
    
    expect(result).toEqual({
      id: '1',
      name: 'Test',
      content: 'Test content',
    })
    
    expect(mockPayload.findByID).toHaveBeenCalledWith({
      collection: 'resources',
      id: '1',
    })
  })
  
  it('should create a document', async () => {
    mockPayload.create.mockResolvedValue({
      id: '1',
      name: 'Test',
      content: 'Test content',
    })
    
    const db = DB({
      backend: 'payload',
      payload: mockPayload,
    })
    
    const data = {
      name: 'Test',
      content: 'Test content',
    }
    
    const result = await db.resources.create(data)
    
    expect(result).toEqual({
      id: expect.any(String),
      name: 'Test',
      content: 'Test content',
    })
  })
  
  it('should update a document', async () => {
    mockPayload.findByID.mockResolvedValue({
      id: '1',
      name: 'Test',
      content: 'Test content',
    })
    
    mockPayload.update.mockResolvedValue({
      id: '1',
      name: 'Updated Test',
      content: 'Test content',
    })
    
    const db = DB({
      backend: 'payload',
      payload: mockPayload,
    })
    
    const result = await db.resources.update('1', { name: 'Updated Test' })
    
    expect(result).toEqual({
      id: '1',
      name: 'Updated Test',
      content: 'Test content',
    })
    
    expect(mockPayload.update).toHaveBeenCalled()
  })
  
  it('should delete a document', async () => {
    mockPayload.findByID.mockResolvedValue({
      id: '1',
      name: 'Test',
      content: 'Test content',
    })
    
    mockPayload.delete.mockResolvedValue({
      id: '1',
      name: 'Test',
      content: 'Test content',
    })
    
    const db = DB({
      backend: 'payload',
      payload: mockPayload,
    })
    
    const result = await db.resources.delete('1')
    
    expect(result).toEqual({
      id: '1',
      name: 'Test',
      content: 'Test content',
    })
    
    expect(mockPayload.delete).toHaveBeenCalledWith({
      collection: 'resources',
      id: '1',
    })
  })
})
