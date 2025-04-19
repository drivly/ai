import { describe, it, expect } from 'vitest'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGFM from 'remark-gfm'
import type { Root } from 'mdast'
import { transformMarkdownToJson } from './transform.js'

describe('transformMarkdownToJson', () => {
  const parseMarkdown = (markdown: string): Root => {
    return unified().use(remarkParse).use(remarkGFM).parse(markdown) as Root
  }

  it('should transform headers into object keys', () => {
    const markdown = `# Section 1\nContent\n\n# Section 2\nMore content`
    const ast = parseMarkdown(markdown)
    const result = transformMarkdownToJson(ast)

    expect(result).toHaveProperty('Section 1')
    expect(result).toHaveProperty('Section 2')
  })

  it('should transform lists into string arrays', () => {
    const markdown = `# List Section\n\n- Item 1\n- Item 2\n- Item 3`
    const ast = parseMarkdown(markdown)
    const result = transformMarkdownToJson(ast)

    expect(result['List Section']).toBeDefined()
    expect((result['List Section'] as Record<string, unknown>).lists).toBeInstanceOf(Array)
    expect(((result['List Section'] as Record<string, unknown>).lists as unknown[])[0]).toEqual(['Item 1', 'Item 2', 'Item 3'])
  })

  it('should handle ordered lists', () => {
    const markdown = `# Ordered List\n\n1. First\n2. Second\n3. Third`
    const ast = parseMarkdown(markdown)
    const result = transformMarkdownToJson(ast)

    expect(((result['Ordered List'] as Record<string, unknown>).lists as unknown[])[0]).toEqual(['First', 'Second', 'Third'])
  })

  it('should collect links and store them in sections', () => {
    const markdown = `# Links Section\n\nCheck out [Example](https://example.com) and [Another](https://another.com)`
    const ast = parseMarkdown(markdown)
    const result = transformMarkdownToJson(ast)

    expect((result['Links Section'] as Record<string, unknown>).links).toBeDefined()
    expect(((result['Links Section'] as Record<string, unknown>).links as Record<string, string>)['Example']).toBe('https://example.com')
    expect(((result['Links Section'] as Record<string, unknown>).links as Record<string, string>)['Another']).toBe('https://another.com')
  })

  it('should handle duplicate headers', () => {
    const markdown = `# Section\nContent 1\n\n# Section\nContent 2`
    const ast = parseMarkdown(markdown)
    const result = transformMarkdownToJson(ast)

    expect(result).toHaveProperty('Section')
    expect(result).toHaveProperty('Section (2)')
  })

  it('should create nested structures when nestedHeaders option is true', () => {
    const markdown = `# Main\n\n## Sub 1\nContent 1\n\n## Sub 2\nContent 2`
    const ast = parseMarkdown(markdown)
    const result = transformMarkdownToJson(ast, { nestedHeaders: true })

    expect(result).toHaveProperty('Main')
    expect(result.Main as Record<string, unknown>).toHaveProperty('Sub 1')
    expect(result.Main as Record<string, unknown>).toHaveProperty('Sub 2')
  })
})
