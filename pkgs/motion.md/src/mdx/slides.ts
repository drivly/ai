'use client'

/**
 * Separate markdown content into individual slides based on the "---" delimiter
 */
export function separateSlides(markdown: string): string[] {
  const slideDelimiter = /^---$/gm
  const slides = markdown.split(slideDelimiter)

  return slides
    .map((slide) => slide.trim())
    .filter((slide) => slide.length > 0)
    .map((slide) => {
      if (!slide.startsWith('---')) {
        return `---\n---\n${slide}`
      }
      return slide
    })
}
