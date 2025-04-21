'use client'

import matter from 'gray-matter'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { separateSlides } from './slides'
import { parseFrontmatter } from './frontmatter'
import { VideoConfig, Slide } from '../types'

/**
 * Parse Markdown with frontmatter into slides and configuration
 */
export function parseMarkdownWithFrontmatter(markdown: string): {
  globalConfig: VideoConfig
  slides: Slide[]
} {
  const { data: globalFrontmatter, content: remainingContent } = matter(markdown)

  const globalConfig = parseFrontmatter(globalFrontmatter) as VideoConfig

  const slideContents = separateSlides(remainingContent)

  const slides = slideContents.map((slideContent) => {
    const { data: slideFrontmatter, content: slideMarkdown } = matter(slideContent)

    const slide: Slide = {
      content: slideMarkdown.trim(),
      ...slideFrontmatter,
      mdast: fromMarkdown(slideMarkdown.trim()),
    }

    return slide
  })

  return {
    globalConfig,
    slides,
  }
}
