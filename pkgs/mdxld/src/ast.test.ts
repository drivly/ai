import { describe, it, expect } from 'vitest'
import { parse } from './ast.js'
import type { Heading, Text } from 'mdast'

describe('mdxld/ast', () => {
  it('should parse MDX with AST', () => {
    const input = `---
$type: https://mdx.org.ai/Document
title: My Document
---

# Hello World`

    const result = parse(input)

    // Check core MDXLD properties
    expect(result.type).toBe('https://mdx.org.ai/Document')
    expect(result.data).toEqual({ title: 'My Document' })

    // Check AST structure
    expect(result.ast).toBeDefined()
    expect(result.ast.type).toBe('root')
    expect(result.ast.children).toHaveLength(1)

    const heading = result.ast.children[0] as Heading
    expect(heading.type).toBe('heading')
    expect(heading.depth).toBe(1)
    const textNode = heading.children[0] as Text
    expect(textNode.type).toBe('text')
    expect(textNode.value).toBe('Hello World')
  })

  it('should handle AST parsing errors', () => {
    // Invalid MDX that should cause AST parsing to fail
    const input = `---
$type: https://mdx.org.ai/Document
---

# Hello {invalid jsx`

    expect(() => parse(input)).toThrow('Failed to parse MDX AST')
  })

  it('should parse MDX with JSON transformation', () => {
    const input = `---
$type: https://mdx.org.ai/Document
title: My Document
---

# Hello World

- Item 1
- Item 2
- Item 3

Check out [Example](https://example.com)`

    const result = parse(input, { json: true }) as import('./types.js').MDXLDWithJSON

    // Check core MDXLD properties
    expect(result.type).toBe('https://mdx.org.ai/Document')
    expect(result.data).toEqual({ title: 'My Document' })

    // Check JSON structure
    expect(result.json).toBeDefined()
    expect(result.json).toHaveProperty('Hello World')
    expect(((result.json!['Hello World'] as Record<string, unknown>).lists as unknown[])[0]).toEqual(['Item 1', 'Item 2', 'Item 3'])
    expect(((result.json!['Hello World'] as Record<string, unknown>).links as Record<string, string>)['Example']).toBe('https://example.com')
  })
})
