import { describe, it, expect, vi } from 'vitest'
import { createStudioClient } from './index'
import { api } from 'apis.do'

vi.mock('apis.do', () => ({
  api: {
    getById: vi.fn(),
    list: vi.fn(),
    post: vi.fn(),
  },
}))

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
    vi.mocked(api.getById).mockResolvedValueOnce(null)

    await expect(createStudioClient({ projectId: 'non-existent-id' })).rejects.toThrow("Project with ID 'non-existent-id' not found")
  })

  it('should create a studio client successfully', async () => {
    const mockProject = { id: 'test-id', name: 'Test Project' }
    const mockNouns = { data: [{ name: 'User', singular: 'user' }] }
    const mockFunctions = [{ name: 'createUser' }]
    const mockWorkflows = [{ name: 'onboarding' }]
    const mockPayloadClient = { users: { find: vi.fn() } }

    vi.mocked(api.getById).mockResolvedValueOnce(mockProject)
    vi.mocked(api.list).mockResolvedValueOnce(mockNouns)
    vi.mocked(api.post).mockResolvedValueOnce(mockPayloadClient)

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

    expect(api.getById).toHaveBeenCalledWith('projects', 'test-id')
    expect(api.list).toHaveBeenCalledWith('nouns', {
      where: { project: { equals: 'test-id' } },
      sort: 'order',
    })
    expect(api.post).toHaveBeenCalled()
  })
})
