import { motion } from 'motion/react'
import React from 'react'
import { useModalConfig, Suggestion } from '../store/modal-store'

interface ChatSuggestionsProps {
  append: ({ role, content }: { role: 'user'; content: string }) => void
}

export function ChatSuggestions({ append }: ChatSuggestionsProps) {
  const { config } = useModalConfig()

  if (!config.suggestions) return null

  return (
    <section className='@container'>
      <div className='mx-auto mb-3 grid w-full gap-4 px-4 @md:grid-cols-2'>
        {config.suggestions.map((suggestedAction: Suggestion, index) => (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ delay: 0.05 * index }} key={index}>
            <button
              onClick={async () => {
                append({
                  role: 'user',
                  content: suggestedAction.action,
                })
              }}
              className='bg-muted/50 flex w-full cursor-pointer flex-col rounded-lg border border-none border-zinc-200 p-3 text-left text-sm text-zinc-800 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800'
            >
              <span className='font-medium'>{suggestedAction.title}</span>
              <span className='text-zinc-500 dark:text-zinc-400'>{suggestedAction.label}</span>
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
