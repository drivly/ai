import { motion } from 'motion/react'

const defaultSuggestions: Suggestion[] = [
  {
    title: 'Build a Serverless API',
    label: 'Create a REST API endpoint with Functions.do',
    action: 'Help me build a basic serverless API with Functions.do that returns weather data for a given location.',
  },
  {
    title: 'Create an AI Agent',
    label: 'Set up an autonomous agent with custom tools',
    action: 'Guide me through creating an AI agent on Agents.do that can search the web and summarize content.',
  },
  {
    title: 'Connect to a Database',
    label: 'Query and manage data with DB.do',
    action: 'Show me how to connect to a Postgres database with DB.do and create a simple CRUD operation.',
  },
  {
    title: 'Generate UI Components',
    label: 'Build React components with AI assistance',
    action: 'Generate a responsive React card component that displays user profile information with a modern design.',
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
