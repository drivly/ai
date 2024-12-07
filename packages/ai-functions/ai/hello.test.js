import { test, expect } from 'vitest'
import Hello, { meta } from './hello.mdx' // Import your MDX file
import { render } from '../utils/render'

test('imports frontmatter as meta', async () => {
  expect(meta).toBeDefined()
})

test('renders MDX content', async () => {
  const markdown = await render(Hello({ name: 'MDX' }))
  console.log(markdown)
  expect(markdown).toMatchInlineSnapshot(`
    "Hello MDX! You are an expert at data modeling and schema design.

    Let's have some fun with MDX!
    "
  `)
})
