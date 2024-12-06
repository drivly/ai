import { describe, it, expect } from 'vitest'
import { db } from './file'

describe('file-based db', () => {
  it('should return an empty array if no files are found', async () => {
    const docs = await db.invalid.list()
    expect(docs).toEqual([])
  })

  it('should load and parse existing MDX files', async () => {
    const docs = await db.examples.blog.list()
    expect(docs).toHaveLength(2)
  })

  it('should write multiple MDX files when setting the db', async () => {})

  it('should remove extra files if fewer docs are set', async () => {})
})
