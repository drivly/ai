import { describe, it, expect, vi } from 'vitest'

const mockGetById = vi.hoisted(() => vi.fn())
const mockList = vi.hoisted(() => vi.fn())
const mockPost = vi.hoisted(() => vi.fn())

vi.mock('apis.do', () => {
  return {
    API: vi.fn().mockImplementation(() => ({
      getById: mockGetById,
      list: mockList,
      post: mockPost,
    })),
  }
})

import { createStudioClient } from './index'
import { API } from 'apis.do'

vi.mock('./utils/getFunctionsForProject', () => ({
  getFunctionsForProject: vi.fn(),
}))

vi.mock('./utils/getWorkflowsForProject', () => ({
  getWorkflowsForProject: vi.fn(),
}))

describe('createStudioClient', () => {
  it('should be defined', () => {
    expect(createStudioClient).toBeDefined()
  })

  it('should throw an error if project is not found', async () => {
    mockGetById.mockResolvedValueOnce(null)

    await expect(createStudioClient({ projectId: 'non-existent-id' })).rejects.toThrow("Project with ID 'non-existent-id' not found")
  })

  it('should create a studio client successfully', async () => {
    const mockProject = { id: 'test-id', name: 'Test Project' }
    const mockNouns = { data: [{ name: 'User', singular: 'user' }] }
    const mockFunctions = [{ name: 'createUser' }]
    const mockWorkflows = [{ name: 'onboarding' }]
    const mockPayloadClient = { users: { find: vi.fn() } }

    mockGetById.mockResolvedValueOnce(mockProject)
    mockList.mockResolvedValueOnce(mockNouns)
    mockPost.mockResolvedValueOnce(mockPayloadClient)

    const { getFunctionsForProject } = await import('./utils/getFunctionsForProject')
    const { getWorkflowsForProject } = await import('./utils/getWorkflowsForProject')

    vi.mocked(getFunctionsForProject).mockResolvedValueOnce(mockFunctions)
    vi.mocked(getWorkflowsForProject).mockResolvedValueOnce(mockWorkflows)

    const result = await createStudioClient({
      projectId: 'test-id',
      theme: { colors: { primary: '#000' } },
      agentOptions: { type: 'modal' },
    })

    expect(result).toEqual(mockPayloadClient)

    expect(mockGetById).toHaveBeenCalledWith('projects', 'test-id')
    expect(mockList).toHaveBeenCalledWith('nouns', {
      where: { project: { equals: 'test-id' } },
      sort: 'order',
    })
    expect(mockPost).toHaveBeenCalled()
  })
})
