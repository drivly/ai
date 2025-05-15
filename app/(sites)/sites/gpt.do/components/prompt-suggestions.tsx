import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { type ChatRequestOptions, type CreateMessage, type Message } from 'ai'
import { motion } from 'motion/react'
import { useMemo } from 'react'
import { SearchOption } from '../lib/types'
import { formatModelIdentifier, modelToIdentifier, type ParsedModelIdentifier } from '../lib/utils'

interface PromptSuggestionsProps {
  className?: string
  append: (message: Message | CreateMessage, chatRequestOptions?: ChatRequestOptions) => Promise<string | null | undefined>
  selectedModel?: SearchOption | null
  selectedTool: SearchOption | null
  selectedOutput: SearchOption | null
}

// Define available tools with their IDs
export const Tools = {
  GOOGLE_DOCS: 'Google Docs',
  NOTION: 'Notion',
  HUBSPOT: 'HubSpot',
  DUCKDUCKGO: 'DuckDuckGo',
  SALESFORCE: 'Salesforce',
  GITHUB: 'GitHub',
  MIRO: 'Miro',
  SLACK: 'Slack',
  FIGMA: 'Figma',
  JIRA: 'Jira',
  LINEAR: 'Linear',
} as const

// Type for the tools object
export type ToolKey = keyof typeof Tools
export type ToolValue = (typeof Tools)[ToolKey]

// Define available formats
export const Formats = {
  MARKDOWN: 'Markdown',
  HTML: 'HTML',
  PLAIN_TEXT: 'Plain Text',
  STRUCTURED_JSON: 'Structured JSON',
  SUMMARY: 'Summary',
  DETAILED_ANALYSIS: 'Detailed Analysis',
  TABLE: 'Table',
  BULLET_POINTS: 'Bullet Points',
  CODE_SNIPPET: 'Code Snippet',
} as const

export type FormatKey = keyof typeof Formats
export type FormatValue = (typeof Formats)[FormatKey]

export interface Suggestion {
  label: string
  action: string
  tools?: ToolValue[] // Tools this suggestion is relevant for
  formats?: FormatValue[] // Output formats this suggestion is relevant for
}

// Base suggestions with tool and format relevance
const baseSuggestions: Suggestion[] = [
  {
    label: 'Blog Content',
    action: 'Write a blog post about AI',
    tools: [Tools.GOOGLE_DOCS, Tools.NOTION],
    formats: [Formats.MARKDOWN, Formats.HTML, Formats.PLAIN_TEXT],
  },
  {
    label: 'Business Planning',
    action: 'Generate a business plan',
    tools: [Tools.GOOGLE_DOCS, Tools.NOTION],
    formats: [Formats.STRUCTURED_JSON, Formats.MARKDOWN, Formats.PLAIN_TEXT],
  },
  {
    label: 'Email Marketing',
    action: 'Create a marketing email',
    tools: [Tools.GOOGLE_DOCS, Tools.HUBSPOT],
    formats: [Formats.HTML, Formats.PLAIN_TEXT],
  },
  {
    label: 'Content Summary',
    action: 'Summarize this article',
    tools: [Tools.GOOGLE_DOCS, Tools.NOTION, Tools.DUCKDUCKGO],
    formats: [Formats.MARKDOWN, Formats.PLAIN_TEXT, Formats.SUMMARY],
  },
  {
    label: 'Product Copy',
    action: 'Draft a product description',
    tools: [Tools.GOOGLE_DOCS, Tools.NOTION, Tools.SALESFORCE],
    formats: [Formats.MARKDOWN, Formats.HTML, Formats.PLAIN_TEXT],
  },
  {
    label: 'Science Explainer',
    action: 'Explain quantum computing',
    tools: [Tools.GOOGLE_DOCS, Tools.NOTION, Tools.DUCKDUCKGO],
    formats: [Formats.MARKDOWN, Formats.PLAIN_TEXT, Formats.DETAILED_ANALYSIS],
  },
  {
    label: 'Tech Comparison',
    action: 'Compare React vs Angular',
    tools: [Tools.GOOGLE_DOCS, Tools.NOTION, Tools.DUCKDUCKGO, Tools.GITHUB],
    formats: [Formats.MARKDOWN, Formats.PLAIN_TEXT, Formats.DETAILED_ANALYSIS, Formats.TABLE],
  },
  {
    label: 'Idea Generation',
    action: 'Brainstorm startup ideas',
    tools: [Tools.MIRO, Tools.NOTION, Tools.GOOGLE_DOCS],
    formats: [Formats.BULLET_POINTS, Formats.MARKDOWN, Formats.PLAIN_TEXT],
  },
  // GitHub specific suggestions
  {
    label: 'PR Description',
    action: 'Write a PR description for this feature',
    tools: [Tools.GITHUB],
    formats: [Formats.MARKDOWN],
  },
  {
    label: 'Issue Template',
    action: 'Create an issue template for bug reports',
    tools: [Tools.GITHUB],
    formats: [Formats.MARKDOWN, Formats.STRUCTURED_JSON],
  },
  {
    label: 'Code Review',
    action: 'Review this code for improvements',
    tools: [Tools.GITHUB],
    formats: [Formats.MARKDOWN, Formats.CODE_SNIPPET],
  },
  // Slack specific suggestions
  {
    label: 'Meeting Summary',
    action: 'Summarize our meeting discussion',
    tools: [Tools.SLACK],
    formats: [Formats.MARKDOWN, Formats.PLAIN_TEXT, Formats.BULLET_POINTS],
  },
  {
    label: 'Announcement',
    action: 'Draft a team announcement',
    tools: [Tools.SLACK],
    formats: [Formats.MARKDOWN, Formats.PLAIN_TEXT],
  },
  // Figma specific suggestions
  {
    label: 'Design Feedback',
    action: 'Provide feedback on this design',
    tools: [Tools.FIGMA],
    formats: [Formats.MARKDOWN, Formats.BULLET_POINTS],
  },
  {
    label: 'Design Spec',
    action: 'Write a design specification',
    tools: [Tools.FIGMA],
    formats: [Formats.MARKDOWN, Formats.STRUCTURED_JSON],
  },
  // Jira specific suggestions
  {
    label: 'User Story',
    action: 'Create a user story for this feature',
    tools: [Tools.JIRA, Tools.LINEAR],
    formats: [Formats.MARKDOWN, Formats.PLAIN_TEXT],
  },
  {
    label: 'Bug Report',
    action: 'Write a detailed bug report',
    tools: [Tools.JIRA, Tools.LINEAR, Tools.GITHUB],
    formats: [Formats.MARKDOWN, Formats.STRUCTURED_JSON],
  },
]

// General suggestions that work with any tool/format combination
const generalSuggestions: Suggestion[] = [
  {
    label: 'General Help',
    action: 'Help me with this task',
  },
  {
    label: 'Explain Concept',
    action: 'Explain this concept simply',
  },
  {
    label: 'Improve Writing',
    action: 'Improve this writing',
  },
  {
    label: 'Generate Ideas',
    action: 'Generate ideas about this topic',
  },
  {
    label: 'Summarize Content',
    action: 'Summarize this content',
  },
  {
    label: 'Answer Question',
    action: 'Answer this question',
  },
  {
    label: 'Provide Examples',
    action: 'Give me examples of this',
  },
  {
    label: 'Create Outline',
    action: 'Create an outline for this',
  },
]

const MIN_SUGGESTIONS = 6

export const PromptSuggestions = ({ className, append, selectedModel, selectedTool, selectedOutput }: PromptSuggestionsProps) => {
  const filteredSuggestions = useMemo(() => {
    let relevantSuggestions: Suggestion[] = []

    if (!selectedTool && !selectedOutput) {
      relevantSuggestions = baseSuggestions.slice(0, 8)
    } else {
      relevantSuggestions = baseSuggestions.filter((suggestion) => {
        const toolMatch = !selectedTool || !suggestion.tools || suggestion.tools.includes(selectedTool.label as ToolValue)
        const formatMatch = !selectedOutput || !suggestion.formats || suggestion.formats.includes(selectedOutput.label as FormatValue)

        if (selectedTool && selectedOutput) {
          return toolMatch && formatMatch
        }

        return toolMatch || formatMatch
      })
    }

    if (relevantSuggestions.length < MIN_SUGGESTIONS) {
      const additionalNeeded = MIN_SUGGESTIONS - relevantSuggestions.length

      const generalToAdd = generalSuggestions.filter((gen) => !relevantSuggestions.some((rel) => rel.label === gen.label)).slice(0, additionalNeeded)

      relevantSuggestions = [...relevantSuggestions, ...generalToAdd]
    }

    return relevantSuggestions.slice(0, 12)
  }, [selectedTool, selectedOutput])

  const handleSuggestion = async (suggestion: Suggestion) => {
    console.log('suggestion', suggestion)

    const content = suggestion.action

    // Convert to objects for API
    const toolsObject = suggestion.tools?.reduce(
      (acc, tool) => {
        return { ...acc, [tool]: true }
      },
      {} as Record<string, boolean>,
    )

    const formatsString = suggestion.formats?.join(',')

    // We'll use the selected model information if available
    if (selectedModel && selectedModel.value) {
      const modelIdentifier = formatModelIdentifier({
        model: selectedModel.value,
        outputFormat: formatsString,
        tools: toolsObject,
      })

      console.log('Using model:', modelIdentifier)
    }

    await append(
      { role: 'user', content },
      {
        body: {
          model: selectedModel?.value,
          tool: suggestion.tools?.join(','),
          output: formatsString,
        },
      },
    )
  }

  return (
    <div className='space-y-1'>
      <div className='relative mx-auto w-full max-w-6xl'>
        {/* Left gradient overlay */}
        <div className='pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-6 bg-gradient-to-r from-white to-transparent sm:w-10 dark:from-black dark:to-transparent'></div>

        <ScrollArea className='w-full pb-2' type='scroll'>
          <div className='flex space-x-2 pb-2'>
            {filteredSuggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, ease: 'easeInOut' }}
                className='shrink-0 cursor-pointer rounded-full border-gray-200 bg-gray-50/80 px-4 py-1.5 transition-colors hover:bg-gray-100 dark:border-zinc-800/60 dark:bg-zinc-900/40 dark:hover:bg-zinc-800/50'
                onClick={async () => handleSuggestion(suggestion)}>
                <span className='text-sm whitespace-nowrap text-zinc-600 dark:text-zinc-400'>{suggestion.action}</span>
              </motion.button>
            ))}
          </div>
          {/* Hidden scrollbar */}
          <ScrollBar orientation='horizontal' className='h-0 opacity-0' />
        </ScrollArea>

        {/* Right gradient overlay */}
        <div className='pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-6 bg-gradient-to-l from-white to-transparent sm:w-10 dark:from-black dark:to-transparent'></div>
      </div>
    </div>
  )
}
