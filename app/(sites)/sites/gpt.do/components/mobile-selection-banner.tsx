import { Separator } from '@/components/ui/separator'
import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import { use, useCallback, useMemo } from 'react'
import { getComposioData, type IntegrationActions, type IntegrationPromise } from '../actions/composio.action'
import { setGptdoCookieAction } from '../actions/gpt.action'
import { useCustomQuery } from '../hooks/use-custom-query'
import { OUTPUT_FORMATS } from '../lib/constants'
import type { SearchOption } from '../lib/types'
import { type ChatConfigChangeType, type ConfigOption, SELECTION_STEP_ALIASES } from './chat-options-selector'
import { MobileSelectionDrawer } from './mobile-selection-drawer'

export interface MobileSelectionBannerProps {
  isMobile: boolean
  modelOptions: SearchOption[]
  toolsPromise: IntegrationPromise
  selectedModelId?: SearchOption
}

export const MobileSelectionBanner = ({ isMobile, modelOptions, toolsPromise, selectedModelId }: MobileSelectionBannerProps) => {
  const { model, tool, output, setQueryState } = useCustomQuery({ availableModels: modelOptions, initialChatModel: selectedModelId })
  const integrations = use(toolsPromise)
  const pathname = usePathname()

  const activeIntegrationNameFromUrl = useMemo(() => {
    if (!tool) return undefined
    return tool.includes('.') ? tool.split('.')[0] : tool
  }, [tool])

  const { data: actionsForIntegration, isLoading: isLoadingActions } = useQuery({
    queryKey: ['actions', activeIntegrationNameFromUrl],
    queryFn: async () => getComposioData(activeIntegrationNameFromUrl),
    placeholderData: integrations,
    enabled: !!activeIntegrationNameFromUrl || !!(tool === ''),
  })

  // Memoized selected values that reflect URL params with fallbacks to props
  const selectedModel = useMemo(() => (model ? modelOptions.find((item) => item.value === model) || selectedModelId : selectedModelId), [model, modelOptions, selectedModelId])

  const selectedTool = useMemo(() => {
    if (!tool) return undefined

    // For specific actions (with dot notation)
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

      await setGptdoCookieAction({
        type: SELECTION_STEP_ALIASES[type],
        option,
        pathname,
      })

      setQueryState({ [key]: option?.value || null })
    },
    [pathname, setQueryState],
  )

  if (!isMobile) return null

  return (
    <div className='border-input flex flex-row items-center justify-evenly gap-2 border-b px-2 py-1.5 shadow-sm sm:hidden'>
      <MobileSelectionDrawer placeholder='Model' title='model' options={modelOptions} selectedItem={selectedModel} updateOption={handleConfigChange} className='w-1/3' />
      <Separator orientation='vertical' />
      <MobileSelectionDrawer title='integration' options={actionsForIntegration ?? integrations} selectedItem={selectedTool} updateOption={handleConfigChange} className='w-1/3' />
      <Separator orientation='vertical' />
      <MobileSelectionDrawer title='output' options={OUTPUT_FORMATS} selectedItem={selectedOutput} updateOption={handleConfigChange} className='w-1/3' />
    </div>
  )
}
