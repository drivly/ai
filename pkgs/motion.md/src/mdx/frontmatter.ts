'use client'

/**
 * Parse frontmatter data into a structured configuration object
 */
export function parseFrontmatter(frontmatter: Record<string, any>): Record<string, any> {
  const defaultConfig = {
    title: 'Untitled Presentation',
    output: 'output.mp4',
    fps: 30,
    resolution: {
      width: 1920,
      height: 1080,
    },
    transition: 'fade',
    duration: 5, // Default slide duration in seconds
  }
  
  if (frontmatter.layout === 'slideshow') {
    if (frontmatter.code && !frontmatter.steps) {
      frontmatter.steps = [frontmatter.code];
    }
    
    if (!frontmatter.language) {
      frontmatter.language = 'typescript';
    }
  }
  
  return {
    ...defaultConfig,
    ...frontmatter,
  }
}
