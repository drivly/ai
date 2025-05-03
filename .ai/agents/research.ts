import { model } from '@/lib/ai'
import { generateText } from 'ai'

type Citation = {
  end_index: number
  start_index: number
  title: string
  url: string
}

/**
 * Research a topic and return the results with citations
 * @param topic The topic to research
 * @returns Object containing markdown text with appended citations and the original citations array
 */
export const research = (topic: string) =>
  generateText({
    model: model('perplexity/sonar-deep-research'),
    prompt: `Research ${topic}`,
  }).then((result) => {
    const citations = ((result.response.body as any)?.citations || []) as Citation[]
    const markdown = result.text
    
    let enhancedMarkdown = markdown
    if (citations && citations.length > 0) {
      enhancedMarkdown += '\n\n## References\n\n'
      
      citations.forEach((citation: Citation, index: number) => {
        enhancedMarkdown += `${index + 1}. [${citation.title}](${citation.url})\n`
      })
    }
    
    return {
      citations, // Keep the original citations array
      markdown: enhancedMarkdown, // Return enhanced markdown with citations
    }
  })
