import { describe, it, expect, vi, beforeEach } from 'vitest'
import { deployWorker } from '../index'
import * as typescript from '../utils/typescript'
import * as eslint from '../utils/eslint'
import * as vitest from '../utils/vitest'
import * as esbuild from '../utils/esbuild'
import * as cloudflare from '../utils/cloudflare'

// Mock the utility functions
vi.mock('../utils/typescript', () => ({
  validateTypeScript: vi.fn(),
}))

vi.mock('../utils/eslint', () => ({
  validateESLint: vi.fn(),
}))

vi.mock('../utils/vitest', () => ({
  runTests: vi.fn(),
}))

vi.mock('../utils/esbuild', () => ({
  bundleCode: vi.fn(),
}))

vi.mock('../utils/cloudflare', () => ({
  deployToCloudflare: vi.fn(),
}))

describe('deployWorker', () => {
  const mockWorker = {
    code: 'export default { fetch() { return new Response("Hello") } }',
    tests: 'test("example", () => { expect(true).toBe(true) })',
    metadata: {
      main_module: 'worker.js',
      compatibility_date: '2023-05-18',
    },
  }

  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(typescript.validateTypeScript).mockResolvedValue([])
    vi.mocked(eslint.validateESLint).mockResolvedValue([])
    vi.mocked(vitest.runTests).mockResolvedValue([])
    vi.mocked(esbuild.bundleCode).mockResolvedValue('bundled code')
    vi.mocked(cloudflare.deployToCloudflare).mockResolvedValue('https://example.workers.dev')
  })

  it('should successfully deploy a worker', async () => {
    const result = await deployWorker(mockWorker)

    expect(result).toEqual({
      success: true,
      deploymentUrl: 'https://example.workers.dev',
      stage: 'deployed',
    })

    expect(typescript.validateTypeScript).toHaveBeenCalledWith(mockWorker.code, undefined)
    expect(eslint.validateESLint).toHaveBeenCalledWith(mockWorker.code, undefined)
    expect(vitest.runTests).toHaveBeenCalledWith(mockWorker.code, mockWorker.tests, undefined)
    expect(esbuild.bundleCode).toHaveBeenCalledWith(mockWorker.code, undefined)
    expect(cloudflare.deployToCloudflare).toHaveBeenCalledWith('bundled code', mockWorker.metadata, undefined)
  })

  it('should return TypeScript errors', async () => {
    vi.mocked(typescript.validateTypeScript).mockResolvedValue(['TypeScript error'])

    const result = await deployWorker(mockWorker)

    expect(result).toEqual({
      success: false,
      errors: ['TypeScript error'],
      stage: 'typescript-validation',
    })

    expect(eslint.validateESLint).not.toHaveBeenCalled()
    expect(vitest.runTests).not.toHaveBeenCalled()
    expect(esbuild.bundleCode).not.toHaveBeenCalled()
    expect(cloudflare.deployToCloudflare).not.toHaveBeenCalled()
  })

  it('should return ESLint errors', async () => {
    vi.mocked(eslint.validateESLint).mockResolvedValue(['ESLint error'])

    const result = await deployWorker(mockWorker)

    expect(result).toEqual({
      success: false,
      errors: ['ESLint error'],
      stage: 'eslint-validation',
    })

    expect(vitest.runTests).not.toHaveBeenCalled()
    expect(esbuild.bundleCode).not.toHaveBeenCalled()
    expect(cloudflare.deployToCloudflare).not.toHaveBeenCalled()
  })

  it('should return test errors', async () => {
    vi.mocked(vitest.runTests).mockResolvedValue(['Test error'])

    const result = await deployWorker(mockWorker)

    expect(result).toEqual({
      success: false,
      errors: ['Test error'],
      stage: 'test-execution',
    })

    expect(esbuild.bundleCode).not.toHaveBeenCalled()
    expect(cloudflare.deployToCloudflare).not.toHaveBeenCalled()
  })

  it('should handle bundling errors', async () => {
    vi.mocked(esbuild.bundleCode).mockRejectedValue(new Error('Bundling error'))

    const result = await deployWorker(mockWorker)

    expect(result).toEqual({
      success: false,
      errors: ['Bundling error'],
      stage: 'bundling',
    })

    expect(cloudflare.deployToCloudflare).not.toHaveBeenCalled()
  })

  it('should handle deployment errors', async () => {
    vi.mocked(cloudflare.deployToCloudflare).mockRejectedValue(new Error('Deployment error'))

    const result = await deployWorker(mockWorker)

    expect(result).toEqual({
      success: false,
      errors: ['Deployment error'],
      stage: 'bundling',
    })
  })
})
