import { describe, it, expect } from 'vitest'
import { parseFrontmatter } from '../mdx/frontmatter'

describe('parseFrontmatter', () => {
  it('should parse frontmatter with default values', () => {
    const frontmatter = {
      title: 'Test Presentation',
    }

    const result = parseFrontmatter(frontmatter)

    expect(result).toEqual({
      title: 'Test Presentation',
      output: 'output.mp4',
      fps: 30,
      resolution: {
        width: 1920,
        height: 1080,
      },
      transition: 'fade',
      duration: 5,
    })
  })

  it('should override default values with provided frontmatter', () => {
    const frontmatter = {
      title: 'Custom Title',
      fps: 60,
      transition: 'slide',
    }

    const result = parseFrontmatter(frontmatter)

    expect(result.title).toBe('Custom Title')
    expect(result.fps).toBe(60)
    expect(result.transition).toBe('slide')
    expect(result.output).toBe('output.mp4') // Default value
  })
})
