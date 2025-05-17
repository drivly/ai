import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import { use, useCallback, useMemo } from 'react'
import { getComposioData, type IntegrationActions, type IntegrationPromise } from '../actions/composio.action'
import { setGptdoCookieAction } from '../actions/gpt.action'
import { type ChatConfigChangeType, type ConfigOption, SELECTION_STEP_ALIASES } from '../components/chat-options-selector'
import { OUTPUT_FORMATS } from '../lib/constants'
import type { SearchOption } from '../lib/types'
import { getSelectedModel } from '../lib/utils'
import { useCustomQuery } from './use-custom-query'

interface UseSelectionOptionsProps {
  modelOptions: SearchOption[]
  toolsPromise: IntegrationPromise
  selectedModelId: SearchOption
}

export const useSelectionOptions = ({ modelOptions, toolsPromise, selectedModelId }: UseSelectionOptionsProps) => {
  const { model, tool, output, setQueryState } = useCustomQuery()
  const integrations = use(toolsPromise)
  const pathname = usePathname()

  const activeIntegrationNameFromUrl = useMemo(() => {
    if (!tool) return undefined
    return tool.includes('.') ? tool.split('.')[0] : tool
  }, [tool])

  // isLoading: isLoadingActions
  const { data: actionsForIntegration, isLoading: isLoadingActions } = useQuery({
    queryKey: ['actions', activeIntegrationNameFromUrl],
    queryFn: async () => getComposioData(activeIntegrationNameFromUrl),
    placeholderData: integrations,
    enabled: !!activeIntegrationNameFromUrl || !!(tool === ''),
  })

  const selectedModel = useMemo(() => getSelectedModel(model, modelOptions, selectedModelId), [model, modelOptions, selectedModelId])

  const selectedTool = useMemo(() => {
    if (!tool) return undefined
    if (tool.includes('.') && Array.isArray(actionsForIntegration)) {
      return actionsForIntegration.find((item) => item.value === tool)
    } else {
      const relatedAction = (actionsForIntegration || integrations).find((item) => 'createdBy' in item && item.createdBy === tool) as IntegrationActions | undefined
      if (relatedAction)
        return {
          value: relatedAction.createdBy,
          label: relatedAction.createdBy.charAt(0).toUpperCase() + relatedAction.createdBy.slice(1),
        }
    }
  }, [tool, actionsForIntegration, integrations])

  const selectedOutput = useMemo(() => (output ? OUTPUT_FORMATS.find((format) => format.value === output) || OUTPUT_FORMATS[0] : OUTPUT_FORMATS[0]), [output])

  const handleConfigChange = useCallback(
    async (type: ChatConfigChangeType, option: ConfigOption | null) => {
      const key = SELECTION_STEP_ALIASES[type]
      await setGptdoCookieAction({ type: SELECTION_STEP_ALIASES[type], option, pathname })
      setQueryState({ [key]: option?.value || null })
    },
    [pathname, setQueryState],
  )

  return {
    actionsForIntegration,
    activeIntegrationNameFromUrl,
    selectedModel,
    selectedTool,
    selectedOutput,
    integrations,
    isLoadingActions,
    handleConfigChange,
  }
}
