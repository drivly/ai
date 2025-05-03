import { describe, it, expect, beforeAll } from 'vitest'
import { DB, DatabaseClient } from '../../src/index'
import { setupApiStyles, isPayloadRunning } from './utils/test-setup'

describe('database.do SDK Initialization', () => {
  describe('Basic Initialization', () => {
    it('should initialize DB with default options', () => {
      const db = DB()
      expect(db).toBeDefined()
      expect(typeof db).toBe('object')
    })

    it('should initialize DB with custom baseUrl', () => {
      const db = DB({ baseUrl: 'https://custom-database.do' })
      expect(db).toBeDefined()
    })

    it('should initialize DB with apiKey', () => {
      const db = DB({ apiKey: 'test-api-key' })
      expect(db).toBeDefined()
    })

    it('should initialize DatabaseClient with default options', () => {
      const dbClient = new DatabaseClient()
      expect(dbClient).toBeDefined()
      expect(dbClient.resources).toBeDefined()
    })

    it('should initialize DatabaseClient with custom baseUrl', () => {
      const dbClient = new DatabaseClient({ baseUrl: 'https://custom-database.do' })
      expect(dbClient).toBeDefined()
      expect(dbClient.resources).toBeDefined()
    })

    it('should initialize DatabaseClient with apiKey', () => {
      const dbClient = new DatabaseClient({ apiKey: 'test-api-key' })
      expect(dbClient).toBeDefined()
      expect(dbClient.resources).toBeDefined()
    })
  })

  describe('SDK Proxy Structure', () => {
    let payloadRunning = false

    beforeAll(async () => {
      payloadRunning = await isPayloadRunning()
    })

    it('should provide collection access via proxy properties', async () => {
      if (!payloadRunning) {
        console.warn('Skipping test: Payload CMS is not running at localhost:3000')
        return
      }

      const { db } = setupApiStyles()

      expect(db.resources).toBeDefined()
      expect(db.posts).toBeDefined()
      expect(db.users).toBeDefined()

      expect(typeof db.resources.find).toBe('function')
      expect(typeof db.resources.findOne).toBe('function')
      expect(typeof db.resources.create).toBe('function')
      expect(typeof db.resources.update).toBe('function')
      expect(typeof db.resources.delete).toBe('function')
      expect(typeof db.resources.search).toBe('function')
    })
  })
})
