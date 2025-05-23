import fetch from 'node-fetch'
import { describe, expect, it } from 'vitest'

const baseUrl = 'http://localhost:3000'

describe('Functions List API', () => {
  it('should return a numbered, markdown ordered list for non-streaming response', async () => {
    const response = await fetch(`${baseUrl}/functions/list?prompt=List%20the%20top%205%20programming%20languages&stream=false`)

    expect(response.status).toBe(200)

    const data = await response.json()

    expect(data).toHaveProperty('items')
    expect(Array.isArray(data.items)).toBe(true)
    expect(data.items.length).toBeGreaterThan(0)

    const firstItem = data.items[0]
    expect(firstItem).toMatch(/^1\./)
  })

  it('should return a streaming response when stream=true', async () => {
    const response = await fetch(`${baseUrl}/functions/list?prompt=List%20the%20top%205%20programming%20languages&stream=true`)

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('text/plain')
    expect(response.headers.get('Transfer-Encoding')).toBe('chunked')

    const text = await response.text()

    expect(text.length).toBeGreaterThan(0)
    const lines = text.split('\n').filter((line) => line.trim())
    expect(lines.some((line) => /^\d+\./.test(line))).toBe(true)
  })

  it('should use the provided system prompt when specified', async () => {
    const customSystem = 'You are an assistant that lists programming languages in order of popularity'

    const response = await fetch(`${baseUrl}/functions/list?prompt=List%20the%20top%205%20programming%20languages&system=${encodeURIComponent(customSystem)}&stream=false`)

    expect(response.status).toBe(200)

    const data = await response.json()

    expect(data.settings.system).toBe(customSystem)
  })

  it('should use the specified model when provided', async () => {
    const model = 'gpt-4o'

    const response = await fetch(`${baseUrl}/functions/list?prompt=List%20the%20top%205%20programming%20languages&model=${model}&stream=false`)

    expect(response.status).toBe(200)

    const data = await response.json()

    expect(data.settings.model).toBe(model)
  })

  it('should include links in the response', async () => {
    const response = await fetch(`${baseUrl}/functions/list?prompt=List%20the%20top%205%20programming%20languages&stream=false`)

    expect(response.status).toBe(200)

    const data = await response.json()

    expect(data).toHaveProperty('links')
    expect(data.links).toHaveProperty('self')
    expect(data.links).toHaveProperty('home')
  })
})
