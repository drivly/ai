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
})
