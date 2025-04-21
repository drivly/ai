'use client'

import { describe, it, expect } from 'vitest'
import { separateSlides } from '../mdx/slides'

describe('separateSlides', () => {
  it('should separate markdown content into slides', () => {
    const markdown = `# Slide 1

---

# Slide 2

---

# Slide 3`

    const slides = separateSlides(markdown)

    expect(slides.length).toBe(3)
    expect(slides[0]).toContain('# Slide 1')
    expect(slides[1]).toContain('# Slide 2')
    expect(slides[2]).toContain('# Slide 3')
  })

  it('should handle slides with frontmatter', () => {
    const markdown = `# Slide 1

---
layout: intro
---

# Slide 2`

    const slides = separateSlides(markdown)

    expect(slides.length).toBe(3)
    expect(slides[0]).toContain('# Slide 1')
    expect(slides[1]).toContain('layout: intro')
    expect(slides[2]).toContain('# Slide 2')
  })
})
