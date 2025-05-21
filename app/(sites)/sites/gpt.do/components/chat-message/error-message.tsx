import { motion } from 'motion/react'
import { useComposioQuery } from '../../hooks/use-composio-query'
import { AuthCard } from './auth-card'
import { DefaultErrorCard } from './default-error-card'
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

interface ErrorMessageProps {
  error?: Error
  onCancel: () => void
  onReload: () => void
}

function ErrorMessage({ onReload, error, onCancel }: ErrorMessageProps) {
  const parsedError = parseError(error)
  const appNames =
    parsedError?.type === 'TOOLS_REDIRECT' && Array.isArray((parsedError as any).connectionRequests)
      ? (parsedError as ToolRedirectError).connectionRequests.map((req: any) => req.app as string)
      : []

  const app = appNames[0]

  const { data: integrations } = useComposioQuery()

  const integration = integrations?.find((integration) => integration.value === app)
  const integrationName = integration?.value
  const integrationLogo: string = integration?.logoUrl || ''

  // If we have a parseable error with a type, use that to determine the UI
  if (parsedError) {
    switch (parsedError.type) {
      case 'TOOLS_REDIRECT': {
        const redirectError = parsedError as ToolRedirectError
        if (!redirectError.connectionRequests?.length) {
          break // Fall through to default error if no valid connection requests
        }

        return (
          <motion.div className='mx-auto my-4 w-full' initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
            <AuthCard
              error={redirectError}
              onSubmit={(app, values) => {
                onReload()
              }}
              onRedirect={(app, url) => {
                window.open(url, '_blank')
              }}
              onCancel={onCancel}
              integrationLogo={integrationLogo}
              integrationName={integrationName}
            />
          </motion.div>
        )
      }
    }
  }

  return <DefaultErrorCard error={error} integrationLogo={integrationLogo} onReload={onReload} />
}

export { ErrorMessage }
