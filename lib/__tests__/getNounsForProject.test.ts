import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getNounsForProject } from '../getNounsForProject'
import { getPayload } from 'payload'

vi.mock('payload', () => ({
  getPayload: vi.fn(),
}))

vi.mock('@payload-config', () => ({
  default: {
    collections: [],
    admin: {},
    db: {},
  },
}))

describe('getNounsForProject', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    const mockPayload = {
      find: vi.fn().mockResolvedValue({ docs: [] }),
    }
    ;(getPayload as any).mockResolvedValue(mockPayload)
  })

  it('should throw error if projectId is not provided', async () => {
    await expect(getNounsForProject('')).rejects.toThrow('Project ID is required')
  })

  it('should fetch nouns for a project and return them sorted by order', async () => {
    const mockNouns = {
      docs: [
        { name: 'Product', order: 1 },
        { name: 'Category', order: 0 },
        { name: 'Order', order: 2 },
      ],
    }

    const mockPayload = {
      find: vi.fn().mockResolvedValue(mockNouns),
    }

    ;(getPayload as any).mockResolvedValue(mockPayload)

    const result = await getNounsForProject('test-project')

    expect(getPayload).toHaveBeenCalledWith({ config: expect.anything() })
    expect(mockPayload.find).toHaveBeenCalledWith({
      collection: 'nouns',
      where: {
        project: { equals: 'test-project' },
      },
      sort: 'order',
    })

    expect(result).toEqual(mockNouns.docs)
  })

  it('should return empty array if no nouns are found', async () => {
    const mockNouns = {
      docs: [],
    }

    const mockPayload = {
      find: vi.fn().mockResolvedValue(mockNouns),
    }

    ;(getPayload as any).mockResolvedValue(mockPayload)

    const result = await getNounsForProject('test-project')

    expect(result).toEqual([])
  })

  it('should handle errors and throw a meaningful error message', async () => {
    const mockError = new Error('Database connection failed')

    const mockPayload = {
      find: vi.fn().mockRejectedValue(mockError),
    }

    ;(getPayload as any).mockResolvedValue(mockPayload)

    await expect(getNounsForProject('test-project')).rejects.toThrow('Failed to fetch nouns for project')
  })
})
