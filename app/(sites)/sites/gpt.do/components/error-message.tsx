import { Button } from '@/components/ui/button'
import { motion } from 'motion/react'

// Base error type
type ErrorResponse = {
  success: false
  type: string
  error: string
}

// Type for authentication redirection errors
type ToolsRedirectError = ErrorResponse & {
  type: 'TOOLS_REDIRECT'
  connectionRequests: Array<{
    app: string
    redirectUrl: string
  }>
}

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

function ErrorMessage({ onReload, error }: { onReload: () => void; error?: Error }) {
  const parsedError = parseError(error)

  // If we have a parseable error with a type, use that to determine the UI
  if (parsedError) {
    switch (parsedError.type) {
      case 'TOOLS_REDIRECT': {
        const redirectError = parsedError as ToolsRedirectError
        if (!redirectError.connectionRequests?.length) {
          break // Fall through to default error if no valid connection requests
        }

        return (
          <div className='border-input mx-auto my-5 max-w-md overflow-hidden rounded-lg border bg-white shadow-sm dark:bg-zinc-900'>
            <div className='flex flex-col items-center justify-center px-6 py-6'>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='mb-4 flex items-center justify-center'>
                <span className='flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20'>
                  <motion.div initial={{ rotate: 0 }} animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.5, delay: 0.2 }} className='text-2xl'>
                    🔗
                  </motion.div>
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className='text-center text-xl font-semibold text-zinc-900 dark:text-white'>
                Authentication Required
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className='mx-8 mt-2 text-center text-[14px] leading-[22px] text-zinc-500 dark:text-zinc-400'>
                {redirectError.error}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className='mt-5 flex w-full space-x-3'>
                <Button onClick={onReload} className='flex-1 cursor-pointer bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700' variant='outline'>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Open the authentication redirect URL in a new tab
                    if (redirectError.connectionRequests[0]?.redirectUrl) {
                      window.open(redirectError.connectionRequests[0].redirectUrl, '_blank')
                    }
                  }}
                  className='flex-1 cursor-pointer'
                  variant='default'>
                  Authenticate {redirectError.connectionRequests[0]?.app}
                </Button>
              </motion.div>
            </div>
          </div>
        )
      }

      // Add more error types here as needed
      // case 'ANOTHER_ERROR_TYPE': { ... }
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
