import { describe, it, expect } from 'vitest'
import { db } from './file'

describe('file-based db', () => {

  it('should return an empty array if no files are found', async () => {
    expect(db.invalid).resolves.toEqual([])
  })

  it('should load and parse existing MDX files', async () => {
    expect(db.examples.blog).resolves.toHaveLength(2)
  })

  it('should write multiple MDX files when setting the db', async () => {

  })

  it('should remove extra files if fewer docs are set', async () => {

  })
})