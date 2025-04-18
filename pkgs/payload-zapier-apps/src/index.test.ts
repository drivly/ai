import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as exports from './index'
import { ZapierCollectionConfig, ZapierField } from './types/collection'

vi.mock('./generate.js', () => ({
  main: vi.fn().mockResolvedValue(undefined),
}))

describe('payload-zapier-apps', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should export the expected API', () => {
    expect(exports.generateZapierApps).toBeDefined()
    expect(typeof exports.generateZapierApps).toBe('function')
  })

  it('should call the generate function with default options', async () => {
    const { generateZapierApps } = exports
    const { main } = await import('./generate.js')

    await generateZapierApps()

    expect(main).toHaveBeenCalledWith({})
  })

  it('should call the generate function with provided options', async () => {
    const { generateZapierApps } = exports
    const { main } = await import('./generate.js')

    const options = {
      collectionsPath: '/custom/path/to/collections.js',
      outputDir: '/custom/output/dir',
    }

    await generateZapierApps(options)

    expect(main).toHaveBeenCalledWith(options)
  })
})
