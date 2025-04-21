'use client'

import { describe, it, expect } from 'vitest'
import { parseMarkdownWithFrontmatter } from '../mdx/parser'

describe('parseMarkdownWithFrontmatter', () => {
  it('should parse markdown with global frontmatter', () => {
    const markdown = `---
title: Test Presentation
output: test.mp4
fps: 30
resolution:
  width: 1920
  height: 1080
transition: fade
---

# Test Content

This is a test.`

    const result = parseMarkdownWithFrontmatter(markdown)

    expect(result.globalConfig).toEqual({
      title: 'Test Presentation',
      output: 'test.mp4',
      fps: 30,
      resolution: {
        width: 1920,
        height: 1080,
      },
      transition: 'fade',
      duration: 5, // Default value from parseFrontmatter
    })

    expect(result.slides.length).toBe(1)
    expect(result.slides[0].content).toContain('# Test Content')
  })

  it('should parse markdown with multiple slides', () => {
    const markdown = `---
title: Test Presentation
---

# Slide 1

---
layout: intro
---

# Slide 2

---
layout: cover
---

# Slide 3`

    const result = parseMarkdownWithFrontmatter(markdown)

    expect(result.slides.length).toBeGreaterThan(0)

    const slideContents = result.slides.map((s) => s.content)

    expect(slideContents).toContain('# Slide 1')
    expect(slideContents).toContain('# Slide 2')
    expect(slideContents).toContain('# Slide 3')

    const layoutSlides = result.slides.filter((s) => s.content.includes('layout:'))
    expect(layoutSlides.length).toBeGreaterThan(0)

    const allContent = slideContents.join('\n')
    expect(allContent).toContain('layout: intro')
    expect(allContent).toContain('layout: cover')
  })
})
