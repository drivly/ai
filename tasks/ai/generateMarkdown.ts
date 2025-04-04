// Import necessary dependencies
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import { generateText } from './generateText'

// Define the input and output types for the generateMarkdown utility function
type GenerateMarkdownInput = {
  functionName: string
  args: any
  settings?: any
}

type GenerateMarkdownOutput = {
  markdown: string
  mdast: any
  reasoning?: string
  generation: any
  generationLatency: number
  request: any
}

/**
 * Utility function to generate markdown using AI and parse it into MDAST
 * This extends the generateText function to also provide a parsed MDAST representation
 */
export const generateMarkdown = async ({ input, req }: { input: GenerateMarkdownInput; req: any }): Promise<GenerateMarkdownOutput> => {
  // First, generate the text using the existing generateText function
  const textResult = await generateText({ input, req })

  // Parse the markdown text into MDAST (Markdown Abstract Syntax Tree)
  const processor = unified().use(remarkParse).use(remarkStringify)

  // Process the markdown to get the MDAST
  const mdast = processor.parse(textResult.text)

  // Return both the markdown text and its MDAST representation
  return {
    markdown: textResult.text,
    mdast,
    reasoning: textResult.reasoning,
    generation: textResult.generation,
    generationLatency: textResult.generationLatency,
    request: textResult.request,
  }
}
