import { describe, it, expect } from 'vitest'
import { parse, stringify } from './parser.js'
import type { MDXLD } from './types.js'

describe('mdxld', () => {
  describe('parse', () => {
    it('should parse MDX with YAML-LD frontmatter', () => {
      const input = `---
$type: https://mdx.org.ai/Document
$context: https://schema.org
title: My Document
description: A sample document
author: John Doe
---

# Hello World`

      const result = parse(input)
      expect(result).toEqual({
        type: 'https://mdx.org.ai/Document',
        context: 'https://schema.org',
        data: {
          title: 'My Document',
          description: 'A sample document',
          author: 'John Doe',
        },
        content: '\n# Hello World',
      })
    })

    it('should support @ prefix when allowAtPrefix is true', () => {
      const input = `---
'@type': https://mdx.org.ai/Document
'@context': https://schema.org
title: My Document
---

# Hello World`

      const result = parse(input, { allowAtPrefix: true })
      expect(result).toEqual({
        type: 'https://mdx.org.ai/Document',
        context: 'https://schema.org',
        data: {
          title: 'My Document',
        },
        content: '\n# Hello World',
      })
    })

    it('should handle Set and List special properties', () => {
      const input = `---
$set: [1, 2, 3]
$list: single value
---

content`

      const result = parse(input)
      expect(result.set).toBeInstanceOf(Set)
      expect(Array.from(result.set as Set<number>)).toEqual([1, 2, 3])
      expect(result.list).toEqual(['single value'])
    })

    it('should handle missing or invalid frontmatter', () => {
      expect(parse('# No frontmatter')).toEqual({
        data: {},
        content: '# No frontmatter',
      })

      expect(() =>
        parse(`---
invalid: [
---`),
      ).toThrow('Failed to parse YAML frontmatter')
    })
  })

  describe('stringify', () => {
    it('should stringify MDXLD object back to MDX', () => {
      const input: MDXLD = {
        type: 'https://mdx.org.ai/Document',
        context: 'https://schema.org',
        data: {
          title: 'My Document',
        },
        content: '# Hello World',
      }

      const result = stringify(input)
      expect(result).toEqual(`---
$type: https://mdx.org.ai/Document
$context: https://schema.org
title: My Document
---
# Hello World`)
    })

    it('should use @ prefix when useAtPrefix is true', () => {
      const input: MDXLD = {
        type: 'https://mdx.org.ai/Document',
        data: {},
        content: 'content',
      }

      const result = stringify(input, { useAtPrefix: true })
      expect(result).toEqual(`---
@type: https://mdx.org.ai/Document
---
content`)
    })
  })
})
