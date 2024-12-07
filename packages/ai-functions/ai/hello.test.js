import { test, expect } from 'vitest'
import Hello, { meta } from './hello.mdx' // Import your MDX file
import { render } from '../utils/render'

test('imports frontmatter as meta', async () => {
  expect(meta).toBeDefined()
})

test('renders MDX content', async () => {
  const markdown = await render(Hello({ type: 'customer table', context: 'SaaS application', format: 'clickhouse SQL' }))
  console.log(markdown)
  expect(markdown).toMatchInlineSnapshot(`
    "hello type: customer table context: SaaS application format: clickhouse SQL !
    "
  `)
})
