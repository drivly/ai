import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { promises as fs } from 'fs'
import path from 'path'
import { DB } from './index.js'

vi.mock('fs', async () => {
  const actual = (await vi.importActual('fs')) as any
  return {
    ...actual,
    promises: {
      mkdir: vi.fn(),
      readdir: vi.fn(),
      readFile: vi.fn(),
      writeFile: vi.fn(),
      unlink: vi.fn(),
    },
  }
})

describe('mdxdb', () => {
  const testBasePath = './test-content'
  const testCollection = 'posts'
  const testId = '123-test-post'
  const testPost = {
    id: testId,
    title: 'Test Post',
    content: 'This is a test post',
    status: 'Published',
    tags: ['test', 'mdx'],
  }

  beforeEach(() => {
    vi.resetAllMocks()

    vi.mocked(fs.readdir).mockResolvedValue([`${testId}.mdx`] as any)

    vi.mocked(fs.readFile).mockResolvedValue(`---
title: Test Post
status: Published
tags:
  - test
  - mdx
---
This is a test post`)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('DB', () => {
    it('should create a database client with default options', () => {
      const db = DB()
      expect(db).toBeDefined()
      expect(typeof db.posts).toBe('object')
      expect(typeof db.posts.find).toBe('function')
      expect(typeof db.posts.findOne).toBe('function')
      expect(typeof db.posts.create).toBe('function')
      expect(typeof db.posts.update).toBe('function')
      expect(typeof db.posts.delete).toBe('function')
      expect(typeof db.posts.search).toBe('function')
    })

    it('should create a database client with custom options', () => {
      const db = DB({
        basePath: testBasePath,
        fileExtension: '.md',
        createDirectories: false,
      })
      expect(db).toBeDefined()
    })
  })

  describe('Collection methods', () => {
    let db: ReturnType<typeof DB>

    beforeEach(() => {
      db = DB({
        basePath: testBasePath,
      })
    })

    describe('find', () => {
      it('should find all documents in a collection', async () => {
        const result = await db.posts.find()

        expect(fs.readdir).toHaveBeenCalledWith(path.join(testBasePath, 'posts'))
        expect(fs.readFile).toHaveBeenCalledWith(path.join(testBasePath, 'posts', `${testId}.mdx`), 'utf-8')

        expect(result.data).toHaveLength(1)
        expect(result.data[0].id).toBe(testId)
        expect(result.data[0].title).toBe('Test Post')
        expect(result.meta.total).toBe(1)
      })

      it('should find documents with filtering', async () => {
        const result = await db.posts.find({
          where: {
            status: 'Published',
          },
        })

        expect(result.data).toHaveLength(1)
        expect(result.data[0].status).toBe('Published')
      })
    })

    describe('findOne', () => {
      it('should find a document by ID', async () => {
        const result = await db.posts.findOne(testId)

        expect(fs.readFile).toHaveBeenCalledWith(path.join(testBasePath, 'posts', `${testId}.mdx`), 'utf-8')

        expect(result.id).toBe(testId)
        expect(result.title).toBe('Test Post')
      })
    })

    describe('create', () => {
      it('should create a new document', async () => {
        vi.mocked(fs.writeFile).mockResolvedValue(undefined)

        const result = await db.posts.create(testPost)

        expect(fs.mkdir).toHaveBeenCalledWith(path.join(testBasePath, 'posts'), { recursive: true })

        expect(fs.writeFile).toHaveBeenCalled()
        expect(result.id).toBe(testId)
        expect(result.title).toBe('Test Post')
      })
    })

    describe('update', () => {
      it('should update an existing document', async () => {
        vi.mocked(fs.writeFile).mockResolvedValue(undefined)

        const result = await db.posts.update(testId, {
          title: 'Updated Title',
        })

        expect(fs.readFile).toHaveBeenCalledWith(path.join(testBasePath, 'posts', `${testId}.mdx`), 'utf-8')

        expect(fs.writeFile).toHaveBeenCalled()
        expect(result.id).toBe(testId)
        expect(result.title).toBe('Updated Title')
      })
    })

    describe('delete', () => {
      it('should delete a document', async () => {
        vi.mocked(fs.unlink).mockResolvedValue(undefined)

        const result = await db.posts.delete(testId)

        expect(fs.readFile).toHaveBeenCalledWith(path.join(testBasePath, 'posts', `${testId}.mdx`), 'utf-8')

        expect(fs.unlink).toHaveBeenCalledWith(path.join(testBasePath, 'posts', `${testId}.mdx`))

        expect(result.id).toBe(testId)
      })
    })

    describe('search', () => {
      it('should search documents', async () => {
        const result = await db.posts.search('test')

        expect(fs.readdir).toHaveBeenCalledWith(path.join(testBasePath, 'posts'))
        expect(fs.readFile).toHaveBeenCalledWith(path.join(testBasePath, 'posts', `${testId}.mdx`), 'utf-8')

        expect(result.data).toHaveLength(1)
        expect(result.data[0].id).toBe(testId)
      })
    })
  })
})
