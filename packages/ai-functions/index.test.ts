import { expect, test } from 'vitest'
import { AI } from './index.js'

const { ai } = AI({
  listBlogPostTitles: {
    _model: 'gpt-4o',
    title: 'SEO-friendly title for a blog post',
    summary: 'SEO-optimized description of a blog post',
    tags: 'blog | seo | marketing',
  }
})

test('listBlogPostTitles', async () => {
  const result = await ai.listBlogPostTitles({})
  expect(result).toBe('Hello, how are you?')
})

// test('function with prompt no config', async () => {
//   const result = await ai('Hello, how are you?')
//   expect(result).toBe('Hello, how are you?')
// })

// test('function with prompt and config', async () => {
//   const result = await ai('Hello, how are you?', { model: 'gpt-4o' })
//   expect(result).toBe('Hello, how are you?')
// })

// test('tagged template literal', async () => {
//   const result = await ai`Hello, how are you?`
//   expect(result).toBe('Hello, how are you?')
// })

// test('tagged template literal with values', async () => {
//   const result = await ai`Hello, ${'world'}!`
//   expect(result).toBe('Hello, world!')
// })

// test('tagged template literal with config', async () => {
//   const result = await ai`Hello, ${'world'}!`({ model: 'gpt-4o' })
//   expect(result).toBe('Hello, world!')
// })
