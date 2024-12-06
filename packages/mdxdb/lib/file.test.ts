import { describe, it, expect } from 'vitest'
import { db } from './file'

describe('file-based db', () => {
  it('should return an empty array if no files are found', async () => {
    const docs = await db.invalid.list()
    expect(docs).toEqual([])
  })

  it('should load and parse existing MDX files', async () => {
    const docs = await db.examples.blog.list()
    expect(docs).toHaveLength(1)
  })

  it('should write an MDX file when setting the db', async () => {
    const input = {
      content: '# This is a test',
      data: { testing: 123 },
    }
    await db.examples.set('test', input)
    const output = await db.examples.get('test')
    expect(output.data).toEqual(input.data)
  })

  it('should remove extra files if fewer docs are set', async () => {})
})
