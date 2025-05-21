import type { ToolRedirectError } from '@/sdks/llm.do/src'
import { motion } from 'motion/react'
import { useComposioQuery } from '../../hooks/use-composio-query'
import { AuthCard } from './auth-card'
import { DefaultErrorCard } from './default-error-card'

// Parse error message string to ToolRedirectError
function parseToolRedirectError(error?: Error): ToolRedirectError | null {
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
      parsed.type === 'TOOLS_REDIRECT' &&
      'error' in parsed &&
      typeof parsed.error === 'string' &&
      'connectionRequests' in parsed &&
      Array.isArray(parsed.connectionRequests)
    ) {
      return parsed as ToolRedirectError
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
  const redirectError = parseToolRedirectError(error)

  const appNames = redirectError?.connectionRequests?.map((req) => req.app) || []
  const app = appNames[0]

  const { data: integrations } = useComposioQuery()

  const integration = integrations?.find((integration) => integration.value === app)
  const integrationName = integration?.value
  const integrationLogo: string = integration?.logoUrl || ''

  // Handle ToolRedirectError if present
  if (redirectError?.connectionRequests?.length) {
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

  // Default error handling
  return <DefaultErrorCard error={error} integrationLogo={integrationLogo} onReload={onReload} />
}
