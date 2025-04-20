import { api, createAPI } from '../src'
import { describe, expect, it, vi } from 'vitest'

describe('API Integration Support', () => {
  it('should create a proxy for integrations', async () => {
    const fetchMock = vi.fn()
    
    global.fetch = fetchMock
    
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        integrations: {
          slack: 'https://apis.do/integrations/slack',
          salesforce: 'https://apis.do/integrations/salesforce'
        }
      })
    })
    
    const testApi = createAPI()
    
    const slack = await testApi.slack
    
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/integrations$/),
      expect.any(Object)
    )
    
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Message sent' })
    })
    
    const result = await slack.postMessage({ channel: '#general', text: 'Hello' })
    
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/integrations\/slack\/actions\/postMessage$/),
      expect.objectContaining({
        method: 'POST',
        body: expect.stringMatching(/channel/)
      })
    )
    
    expect(result).toEqual({ success: true, message: 'Message sent' })
  })
})
