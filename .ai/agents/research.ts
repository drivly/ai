import { model } from '@/lib/ai'
import { generateText } from 'ai'

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
    const citations = ((result.response.body as any)?.citations || []) as string[]
    const markdown = result.text
    
    // let enhancedMarkdown = markdown
    // if (citations && citations.length > 0) {
    //   enhancedMarkdown += '\n\n## References\n\n'
      
    //   citations.forEach((citation: string, index: number) => {
    //     enhancedMarkdown += `${index + 1}. ${citation}\n`
    //   })
    // }
    
    return {
      citations, // Keep the original citations array
      markdown,
      // markdown: enhancedMarkdown, // Return enhanced markdown with citations
    }
  })
