import { useQuery } from '@tanstack/react-query'
import { getComposioData } from '../actions/composio.action'
import type { ComposioDataPromise } from '../lib/types'

export const useIntegrationQuery = ({
  activeIntegrationNameFromUrl,
  tool,
  integrations,
}: {
  activeIntegrationNameFromUrl: string | undefined
  tool: string
  integrations?: Awaited<ComposioDataPromise>
}) =>
  useQuery({
    queryKey: ['actions', activeIntegrationNameFromUrl],
    queryFn: async () => getComposioData(activeIntegrationNameFromUrl),
    placeholderData: integrations,
    enabled: !!activeIntegrationNameFromUrl || !!(tool === ''),
  })
