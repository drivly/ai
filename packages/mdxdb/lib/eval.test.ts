import { describe, it, expect } from 'vitest'
import { mdx } from '..'

describe('evalMDX', () => {
  it('should load all MDX files in the current directory', async () => {
    console.log(mdx.examples.blog)
    expect(mdx.examples).toHaveProperty('aiWorkflow')
    expect(mdx.examples.blog).toHaveProperty('helloMdxdb')
  })

  it('should have exported consts in the module', async () => {
    expect(mdx.examples.aiDatabase.module).toHaveProperty('default')
    expect(mdx.examples.cloudflareWorker.module).toHaveProperty('fetch')
  })
})
