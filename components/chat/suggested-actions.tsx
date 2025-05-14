import { motion } from 'framer-motion'

const defaultSuggestions: Suggestion[] = [
  {
    title: 'Create an API',
    label: 'Build a REST API endpoint',
    action: 'Help me build a basic REST API that returns data for a given input.',
  },
  {
    title: 'Build an AI Assistant',
    label: 'Create a conversational assistant',
    action: 'Guide me through creating a simple AI chatbot that can answer basic questions.',
  },
  {
    title: 'Database Operations',
    label: 'Set up and query a database',
    action: 'Show me how to set up a database connection and create basic CRUD operations.',
  },
  {
    title: 'Generate UI Components',
    label: 'Build modern UI components',
    action: 'Generate a responsive card component that displays information with a clean design.',
  },
]

export type Suggestion = {
  title: string
  label: string
  action: string
}

interface SuggestedActionsProps {
  append: ({ role, content }: { role: 'user'; content: string }) => void
  suggestions?: Suggestion[]
}

export function SuggestedActions({ append, suggestions = defaultSuggestions }: SuggestedActionsProps) {
  if (!suggestions) return null

  return (
    <section className='@container'>
      <div className='mx-auto mb-3 grid w-full gap-4 px-4 md:max-w-4xl @md:grid-cols-2'>
        {suggestions.map((suggestedAction: Suggestion, index: number) => (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + index * 0.1, ease: 'easeInOut' }} key={index}>
            <button
              onClick={async () => {
                append({
                  role: 'user',
                  content: suggestedAction.action,
                })
              }}
              className='bg-muted/50 flex w-full cursor-pointer flex-col rounded-lg border border-none border-zinc-200 p-3 text-left text-sm text-zinc-800 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800'>
              <span className='font-medium'>{suggestedAction.title}</span>
              <span className='text-zinc-500 dark:text-zinc-400'>{suggestedAction.label}</span>
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
