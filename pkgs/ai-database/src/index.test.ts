import { describe, it, expect, vi } from 'vitest'
import { DB, db } from './index'

vi.mock('./utils', () => ({
  getPayloadInstance: vi.fn().mockReturnValue({
    find: vi.fn(),
    findByID: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  }),
}))

describe('ai-database', () => {
  it('exports DB function', () => {
    expect(DB).toBeDefined()
    expect(typeof DB).toBe('function')
  })

  it('exports default db instance', () => {
    expect(db).toBeDefined()
    expect(typeof db).toBe('object')
  })

  it('creates a proxy object for collection access', () => {
    const mockPayload = {
      find: vi.fn(),
      findByID: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    }

    const db = DB({ payload: mockPayload })

    expect(db).toBeDefined()
    expect(typeof db).toBe('object')

    expect(db.posts).toBeDefined()
    expect(typeof db.posts.find).toBe('function')
    expect(typeof db.posts.findOne).toBe('function')
    expect(typeof db.posts.create).toBe('function')
    expect(typeof db.posts.update).toBe('function')
    expect(typeof db.posts.delete).toBe('function')
    expect(typeof db.posts.search).toBe('function')
  })
})
