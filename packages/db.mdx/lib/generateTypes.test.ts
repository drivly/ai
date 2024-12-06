import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { generateTypes } from './generateTypes'


describe('generateTypes', () => {

  it('should generate type definitions file', async () => {
    await generateTypes()
    
    const types = await fs.readFile('mdx.d.ts', 'utf-8')
    expect(types).toContain(`declare module 'mdxdb'`)
    expect(types).toContain('export const mdx: {')
  })
})
