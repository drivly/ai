import { transition } from '@/components/sites/navbar/animations'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import type { ChatRequestOptions, CreateMessage, Message } from 'ai'
import { motion } from 'motion/react'
import { useSearchParams } from 'next/navigation'
import { type ComponentProps, useCallback } from 'react'
import { getPromptSuggestions } from '../actions/gpt.action'
import type { SearchOption } from '../lib/types'

interface PromptSuggestionsProps {
  className?: string
  append: (message: Message | CreateMessage, chatRequestOptions?: ChatRequestOptions) => Promise<string | null | undefined>
  selectedModel?: SearchOption | null
}

export interface Suggestion {
  label: string
  action: string
}

// Fallback suggestions in case the AI-generated ones fail
const fallbackSuggestions: Suggestion[] = [
  {
    label: 'Story',
    action: 'AI discovering emotions story',
  },
  {
    label: 'Explain',
    action: 'Explain blockchain simply',
  },
  {
    label: 'Ideas',
    action: 'SaaS ideas for education',
  },
  {
    label: 'Interview',
    action: 'Software interview questions',
  },
  {
    label: 'Copy',
    action: 'Smart water bottle pitch',
  },
  {
    label: 'Travel',
    action: 'Tokyo 3-day itinerary',
  },
  {
    label: 'Code',
    action: 'Express.js API example',
  },
  {
    label: 'Email',
    action: 'Client meeting request',
  },
]

export const PromptSuggestions = ({ className, append, selectedModel }: PromptSuggestionsProps) => {
  const searchParams = useSearchParams()
  const toolValue = searchParams.get('tool') || ''
  const outputValue = searchParams.get('output') || ''

  // Parse the tool value to extract action if present
  const hasDotNotation = toolValue.includes('.')
  const baseToolValue = hasDotNotation ? toolValue.split('.')[0] : toolValue
  const actionValue = hasDotNotation ? toolValue.split('.')[1] : ''

  const {
    data: suggestions,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['suggestions', baseToolValue, outputValue, actionValue],
    queryFn: async () => getPromptSuggestions({ toolValue: baseToolValue, outputValue, actionValue }),
    enabled: !!(baseToolValue && actionValue),
    placeholderData: fallbackSuggestions,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const handleSuggestion = useCallback(
    (suggestion: Suggestion) => {
      return append(
        { role: 'user', content: suggestion.action },
        {
          body: {
            model: selectedModel?.value,
            tool: toolValue,
            output: outputValue,
          },
        },
      )
    },
    [append, selectedModel, toolValue, outputValue],
  )

  // Array of different widths for skeleton buttons
  const skeletonWidths = ['w-64', 'w-56', 'w-60', 'w-52', 'w-48', 'w-44', 'w-40', 'w-36']

  return (
    <div className={cn('relative mx-auto w-full max-w-6xl', className)}>
      <ScrollArea className='w-full pb-2' type='scroll'>
        <div className='flex space-x-2 py-2'>
          {isFetching
            ? // Show skeletons while fetching
              Array.from({ length: 8 }).map((_, index) => (
                <motion.div
                  key={`skeleton-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...transition, delay: 0.8 + index * 0.1 }}
                  className={cn('h-8 shrink-0 animate-pulse rounded-full bg-gray-200/70 px-4 py-1.5 dark:bg-zinc-800/40', skeletonWidths[index % skeletonWidths.length])}
                />
              ))
            : // Show actual suggestions when not fetching
              suggestions?.map((suggestion, index) => (
                <motion.button
                  key={`${suggestion.label}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...transition, delay: 0.8 + index * 0.1 }}
                  className={cn(
                    'focus-visible:border-ring focus-visible:ring-ring/50 shrink-0 cursor-pointer rounded-full border-gray-200 bg-gray-50/80 px-4 py-1.5 transition-colors outline-none hover:bg-gray-100 focus-visible:ring-[3px] dark:border-zinc-800/60 dark:bg-zinc-900/40 dark:hover:bg-zinc-800/50',
                    isLoading && 'cursor-not-allowed opacity-60',
                  )}
                  disabled={isLoading}
                  onClick={async () => handleSuggestion(suggestion)}>
                  <span className='text-sm whitespace-nowrap text-zinc-600 dark:text-zinc-400'>{suggestion.action}</span>
                </motion.button>
              ))}
        </div>
        {/* Hidden scrollbar */}
        <ScrollBar orientation='horizontal' className='h-0 opacity-0' />
      </ScrollArea>
      <GradientOverlay side='left' />
      <GradientOverlay side='right' />
    </div>
  )
}

function GradientOverlay({ className, side, ...props }: ComponentProps<'div'> & { side: 'left' | 'right' }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute top-0 bottom-0 z-10 w-6 from-white to-transparent sm:w-10 dark:from-black dark:to-transparent',
        side === 'left' ? 'left-0 bg-gradient-to-r' : 'right-0 bg-gradient-to-l',
        className,
      )}
      {...props}
    />
  )
}
