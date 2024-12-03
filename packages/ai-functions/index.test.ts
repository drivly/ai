import { expect, test } from 'vitest'
import { ai } from './index.js'

test('function with prompt no config', async () => {
  const result = await ai('Hello, how are you?')
  expect(result).toBe('Hello, how are you?')
})

test('function with prompt and config', async () => {
  const result = await ai('Hello, how are you?', { model: 'gpt-4o' })
  expect(result).toBe('Hello, how are you?')
})

test('tagged template literal', async () => {
  const result = await ai`Hello, how are you?`
  expect(result).toBe('Hello, how are you?')
})

test('tagged template literal with values', async () => {
  const result = await ai`Hello, ${'world'}!`
  expect(result).toBe('Hello, world!')
})

test('tagged template literal with config', async () => {
  const result = await ai`Hello, ${'world'}!`({ model: 'gpt-4o' })
  expect(result).toBe('Hello, world!')
})
