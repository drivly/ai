import { useQuery } from '@tanstack/react-query'
import { getComposioActionsByIntegrationCached } from '../actions/composio.action'

export const useComposioQuery = () =>
  useQuery({
    queryKey: ['composio-integrations', undefined],
    queryFn: getComposioActionsByIntegrationCached,
  })
