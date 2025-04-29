import { describe, it, expect } from 'vitest'
import { orthogonal } from '../../src/experiment.js'

describe('orthogonal', () => {
  it('should generate a balanced subset of combinations for 2-level factors', () => {
    const result = orthogonal({
      model: ['gpt-4', 'claude-3'],
      temperature: [0, 0.5],
      seed: [1, 2],
    })

    expect(result.length).toBeLessThan(8) // Should be less than full factorial (2*2*2=8)

    expect(result.some((item) => item.model === 'gpt-4')).toBe(true)
    expect(result.some((item) => item.model === 'claude-3')).toBe(true)
    expect(result.some((item) => item.temperature === 0)).toBe(true)
    expect(result.some((item) => item.temperature === 0.5)).toBe(true)
    expect(result.some((item) => item.seed === 1)).toBe(true)
    expect(result.some((item) => item.seed === 2)).toBe(true)
  })

  it('should generate a balanced subset of combinations for 3-level factors', () => {
    const result = orthogonal({
      model: ['gpt-4', 'claude-3', 'llama-3'],
      temperature: [0, 0.5, 1.0],
      seed: [1, 2, 3],
    })

    expect(result.length).toBeLessThan(27) // Should be less than full factorial (3*3*3=27)

    expect(result.some((item) => item.model === 'gpt-4')).toBe(true)
    expect(result.some((item) => item.model === 'claude-3')).toBe(true)
    expect(result.some((item) => item.model === 'llama-3')).toBe(true)
    expect(result.some((item) => item.temperature === 0)).toBe(true)
    expect(result.some((item) => item.temperature === 0.5)).toBe(true)
    expect(result.some((item) => item.temperature === 1.0)).toBe(true)
    expect(result.some((item) => item.seed === 1)).toBe(true)
    expect(result.some((item) => item.seed === 2)).toBe(true)
    expect(result.some((item) => item.seed === 3)).toBe(true)
  })

  it('should handle empty parameters', () => {
    const result = orthogonal({})
    expect(result).toEqual([])
  })

  it('should handle single parameter', () => {
    const result = orthogonal({
      model: ['gpt-4', 'claude-3'],
    })
    expect(result).toHaveLength(2)
    expect(result).toContainEqual({ model: 'gpt-4' })
    expect(result).toContainEqual({ model: 'claude-3' })
  })

  it('should throw an error when no suitable orthogonal array exists', () => {
    const spec = {
      factor1: [1, 2, 3, 4, 5], // 5 levels
      factor2: [1, 2, 3, 4, 5], // 5 levels
      factor3: [1, 2, 3, 4, 5], // 5 levels
    }

    expect(() => orthogonal(spec)).toThrow(/No suitable orthogonal array found/)
  })

  it('should handle mixed-level factors', () => {
    const result = orthogonal({
      binary: [true, false], // 2 levels
      trinary: ['low', 'medium', 'high'], // 3 levels
      another: ['a', 'b', 'c'], // 3 levels
    })

    expect(result.length).toBeLessThan(18)

    expect(result.some((item) => item.binary === true)).toBe(true)
    expect(result.some((item) => item.binary === false)).toBe(true)
    expect(result.some((item) => item.trinary === 'low')).toBe(true)
    expect(result.some((item) => item.trinary === 'medium')).toBe(true)
    expect(result.some((item) => item.trinary === 'high')).toBe(true)
    expect(result.some((item) => item.another === 'a')).toBe(true)
    expect(result.some((item) => item.another === 'b')).toBe(true)
    expect(result.some((item) => item.another === 'c')).toBe(true)
  })
})
