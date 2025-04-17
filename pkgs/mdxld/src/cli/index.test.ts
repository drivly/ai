import { describe, it, expect, vi } from 'vitest'
import { parseArgs, showHelp, showVersion, cli } from './index.js'

describe('CLI', () => {
  it('should parse version flag correctly', () => {
    const options = parseArgs(['-v'])
    expect(options.version).toBe(true)

    const longOptions = parseArgs(['--version'])
    expect(longOptions.version).toBe(true)
  })

  it('should parse help flag correctly', () => {
    const options = parseArgs(['-h'])
    expect(options.help).toBe(true)

    const longOptions = parseArgs(['--help'])
    expect(longOptions.help).toBe(true)
  })

  it('should show version number', async () => {
    const consoleSpy = vi.spyOn(console, 'log')
    await showVersion()
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('should show help message', () => {
    const consoleSpy = vi.spyOn(console, 'log')
    showHelp()
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('should default to help when no arguments provided', async () => {
    const consoleSpy = vi.spyOn(console, 'log')
    await cli([])
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})
