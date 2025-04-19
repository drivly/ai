import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createDynamicPayloadConfig } from '../createDynamicPayloadConfig'
import { getNounsForProject } from '../getNounsForProject'
import { modifyDatabaseUri } from '../modifyDatabaseUri'

vi.mock('../getNounsForProject', () => ({
  getNounsForProject: vi.fn(),
}))

vi.mock('../modifyDatabaseUri', () => ({
  modifyDatabaseUri: vi.fn(),
}))

vi.mock('payload', () => ({
  buildConfig: vi.fn((config) => ({
    ...config,
    collections: config.collections || [],
    admin: config.admin || {},
    db: config.db || {},
  })),
}))

vi.mock('@payloadcms/db-mongodb', () => ({
  mongooseAdapter: vi.fn((config) => config),
}))

vi.mock('@payloadcms/richtext-lexical', () => ({
  lexicalEditor: vi.fn(() => ({})),
}))

vi.mock('process', () => ({
  env: {
    DATABASE_URI: 'mongodb://localhost:27017/test',
    PAYLOAD_SECRET: 'test-secret',
  },
}))

vi.mock('path', () => ({
  default: {
    dirname: vi.fn(() => '/mock/path'),
    resolve: vi.fn(() => '/mock/path/payload.types.ts'),
  },
}))

vi.mock('url', () => ({
  fileURLToPath: vi.fn(() => '/mock/path/file.js'),
}))

describe('createDynamicPayloadConfig', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should throw error if project is not provided', async () => {
    await expect(createDynamicPayloadConfig(null)).rejects.toThrow('Project is required')
  })

  it('should create config with empty collections if no nouns are found', async () => {
    ;(getNounsForProject as any).mockResolvedValue([])
    ;(modifyDatabaseUri as any).mockReturnValue('mongodb://localhost:27017/project-123')

    const project = { id: 'project-123', name: 'Test Project' }
    const config = await createDynamicPayloadConfig(project)

    expect(getNounsForProject).toHaveBeenCalledWith('project-123')
    expect(modifyDatabaseUri).toHaveBeenCalledWith(expect.any(String), 'project-123')

    expect(config).toHaveProperty('admin')
    expect(config.admin).toHaveProperty('meta')
    expect(config.admin.meta).toHaveProperty('titleSuffix', '| Test Project Admin')
    expect(config).toHaveProperty('collections')
    expect(config.collections).toEqual([])
    expect(config).toHaveProperty('db')
    expect(config.db).toHaveProperty('url', 'mongodb://localhost:27017/project-123')
  })

  it('should create collections from nouns with schema', async () => {
    const nouns = [
      {
        name: 'Product',
        singular: 'Product',
        schema: [
          { name: 'name', type: 'text', required: true },
          { name: 'price', type: 'number' },
        ],
        group: 'Products',
      },
    ]

    ;(getNounsForProject as any).mockResolvedValue(nouns)
    ;(modifyDatabaseUri as any).mockReturnValue('mongodb://localhost:27017/project-123')

    const project = { id: 'project-123', name: 'Test Project' }
    const config = await createDynamicPayloadConfig(project)

    expect(config).toHaveProperty('collections')
    expect(config.collections).toHaveLength(1)
    expect(config.collections[0]).toHaveProperty('slug', 'product')
    expect(config.collections[0]).toHaveProperty('admin')
    expect(config.collections[0].admin).toHaveProperty('group', 'Products')
    expect(config.collections[0]).toHaveProperty('fields')
    expect(config.collections[0].fields).toEqual([
      { name: 'name', type: 'text', required: true },
      { name: 'price', type: 'number' },
    ])
  })

  it('should apply default schema when noun has no schema', async () => {
    const nouns = [
      {
        name: 'Category',
        singular: 'Category',
        schema: [],
        group: 'Products',
      },
    ]

    ;(getNounsForProject as any).mockResolvedValue(nouns)
    ;(modifyDatabaseUri as any).mockReturnValue('mongodb://localhost:27017/project-123')

    const project = { id: 'project-123', name: 'Test Project' }
    const config = await createDynamicPayloadConfig(project)

    expect(config).toHaveProperty('collections')
    expect(config.collections).toHaveLength(1)
    expect(config.collections[0]).toHaveProperty('slug', 'category')
    expect(config.collections[0]).toHaveProperty('fields')
    expect(config.collections[0].fields).toEqual([
      { name: 'uid', type: 'text', required: true },
      { name: 'data', type: 'json' },
    ])
  })

  it('should respect noun ordering and grouping', async () => {
    const nouns = [
      {
        name: 'Product',
        singular: 'Product',
        schema: [{ name: 'name', type: 'text' }],
        group: 'Products',
        order: 1,
      },
      {
        name: 'Category',
        singular: 'Category',
        schema: [{ name: 'name', type: 'text' }],
        group: 'Products',
        order: 0,
      },
      {
        name: 'Order',
        singular: 'Order',
        schema: [{ name: 'total', type: 'number' }],
        group: 'Commerce',
        order: 0,
      },
    ]

    ;(getNounsForProject as any).mockResolvedValue(nouns)
    ;(modifyDatabaseUri as any).mockReturnValue('mongodb://localhost:27017/project-123')

    const project = { id: 'project-123', name: 'Test Project' }
    const config = await createDynamicPayloadConfig(project)

    expect(config).toHaveProperty('collections')
    expect(config.collections).toHaveLength(3)

    const productGroups = config.collections.map((c) => c.admin.group)
    expect(productGroups).toContain('Products')
    expect(productGroups).toContain('Commerce')

    const productsGroupCollections = config.collections.filter((c) => c.admin.group === 'Products').map((c) => c.slug)

    expect(productsGroupCollections).toContain('category')
    expect(productsGroupCollections).toContain('product')
  })
})
