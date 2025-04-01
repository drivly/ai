import { describe, it, expect, vi } from 'vitest'
import { API } from '../client.js'
import { CLI } from '../cli.js'

describe('sdks.do SDK - Unit Tests', () => {
  describe('API', () => {
    it('should create an API instance', () => {
      const api = new API()
      expect(api).toBeInstanceOf(API)
    })

    it('should accept custom options', () => {
      const api = new API({
        baseUrl: 'https://custom-api.example.com',
        apiKey: 'test-api-key'
      })
      expect(api).toBeInstanceOf(API)
    })
  })

  describe('CLI', () => {
    it('should create a CLI instance', () => {
      const cli = new CLI()
      expect(cli).toBeInstanceOf(CLI)
    })

    it('should accept custom options', () => {
      const cli = new CLI({
        apiKey: 'test-api-key',
        baseUrl: 'https://custom-api.example.com',
        configPath: './custom-config.json'
      })
      expect(cli).toBeInstanceOf(CLI)
    })
  })
})
