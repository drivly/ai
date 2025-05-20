import { Button } from '@/components/ui/button'
import { motion } from 'motion/react'
import { AuthCard } from './auth-card'

// Base error type
type ErrorResponse = {
  success: false
  type: string
  error: string
}

type GenericChatCompletionError = {
  success: false
  type: string
  error: string
} & Error

// Tools based errors
export type ToolRedirectError = {
  type: 'TOOL_REDIRECT'
  connectionRequests: {
    app: string
    type: 'API_KEY' | 'OAUTH' | 'OAUTH2'
    redirectUrl?: string
    fields?: Record<
      string,
      {
        type: 'string' | 'number' | 'boolean'
        required: boolean
        name: string
        [key: string]: any
      }
    >
  }[]
} & GenericChatCompletionError

// Parse error message string to typed error object
function parseError(error?: Error): ErrorResponse | null {
  if (!error?.message) return null

  try {
    const parsed = JSON.parse(error.message) as unknown

    // Validate basic error structure
    if (
      parsed &&
      typeof parsed === 'object' &&
      'success' in parsed &&
      parsed.success === false &&
      'type' in parsed &&
      typeof parsed.type === 'string' &&
      'error' in parsed &&
      typeof parsed.error === 'string'
    ) {
      return parsed as ErrorResponse
    }
  } catch (e) {
    // Not a JSON error or invalid format
  }

  return null
}

function ErrorMessage({ onReload, error, integrationLogo, integrationName }: { onReload: () => void; error?: Error; integrationLogo?: string; integrationName?: string }) {
  const parsedError = parseError(error)

  // If we have a parseable error with a type, use that to determine the UI
  if (parsedError) {
    switch (parsedError.type) {
      case 'TOOLS_REDIRECT': {
        const redirectError = parsedError as ToolRedirectError
        if (!redirectError.connectionRequests?.length) {
          break // Fall through to default error if no valid connection requests
        }

        return (
          <motion.div
            className='mx-auto my-8 w-full max-w-sm'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}>
            <AuthCard
              error={redirectError}
              onSubmit={(app, values) => {
                onReload()
              }}
              onRedirect={(app, url) => {
                window.open(url, '_blank')
              }}
              onCancel={onReload}
              integrationLogo={integrationLogo}
              integrationName={integrationName}
            />
          </motion.div>
        )
      }
    }
  }

  // Default error UI for non-specific errors or unhandled types
  return (
    <div className='mx-auto my-5 max-w-md overflow-hidden rounded-lg border border-red-200 bg-white shadow-sm dark:border-red-900/30 dark:bg-zinc-900'>
      <div className='flex flex-col items-center justify-center px-6 py-6'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className='mb-4 flex items-center justify-center'>
          <span className='flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20'>
            <motion.div initial={{ rotate: 0 }} animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.5, delay: 0.2 }} className='text-2xl'>
              ⚠️
            </motion.div>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='text-center text-xl font-semibold text-zinc-900 dark:text-white'>
          Something went wrong
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className='mt-2 text-center text-[14px] leading-[24px] text-zinc-500 dark:text-zinc-400'>
          {error?.message && !parsedError ? error.message : 'Please try again or reload the conversation.'}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className='mt-5'>
          <Button onClick={onReload} className='bg-red-600 font-medium text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700' variant='default'>
            Reload
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

export { ErrorMessage }
