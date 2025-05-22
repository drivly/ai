import type { ToolAuthorizationError } from '@/sdks/llm.do/src'
import { motion } from 'motion/react'
import { Fragment } from 'react'
import { useComposioQuery } from '../../hooks/use-composio-query'
import { AuthCard } from './auth-card'
import { DefaultErrorCard } from './default-error-card'

// Parse error message string to ToolAuthorizationError
function parseToolAuthorizationError(error?: Error): ToolAuthorizationError | null {
  if (!error?.message) return null

  try {
    const parsed = JSON.parse(error.message) as unknown

    // Validate error structure
    if (
      parsed &&
      typeof parsed === 'object' &&
      'success' in parsed &&
      parsed.success === false &&
      'type' in parsed &&
      typeof parsed.type === 'string' &&
      parsed.type === 'TOOL_AUTHORIZATION' &&
      'error' in parsed &&
      typeof parsed.error === 'string' &&
      'connectionRequests' in parsed &&
      Array.isArray(parsed.connectionRequests) &&
      'apps' in parsed &&
      Array.isArray(parsed.apps)
    ) {
      return parsed as ToolAuthorizationError
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

export function ErrorMessage({ onReload, error, onCancel }: ErrorMessageProps) {
  const redirectError = parseToolAuthorizationError(error)

  // Use apps array directly from the new error structure
  const appNames = redirectError?.apps || []
  const app = appNames[0]

  // Find the app info in connectionRequests
  const appRequest = redirectError?.connectionRequests?.find((req) => req.app === app)
  const appIcon = appRequest?.icon || ''

  // Fallback to integrations query if icon is not available
  const { data: integrations } = useComposioQuery()
  const integration = integrations?.find((integration) => integration.value === app)

  const integrationLogo = appIcon || integration?.logoUrl || ''

  // Handle ToolAuthorizationError if present
  if (redirectError?.connectionRequests?.length) {
    return (
      <Fragment>
        {redirectError.connectionRequests.map((connection) => (
          <motion.div
            key={connection.app}
            className='mx-auto my-4 w-full'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <AuthCard
              connection={connection}
              onSubmit={(app, values) => {
                onReload()
              }}
              onRedirect={(app, url) => {
                window.open(url, '_blank')
              }}
              onCancel={onCancel}
              integrationLogo={connection.icon}
              integrationName={connection.app}
            />
          </motion.div>
        ))}
      </Fragment>
    )
  }

  // Default error handling
  return <DefaultErrorCard error={error} integrationLogo={integrationLogo} onReload={onReload} />
}
