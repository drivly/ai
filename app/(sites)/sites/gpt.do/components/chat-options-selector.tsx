'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronRight } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Fragment, use, useCallback, useMemo } from 'react'
import { type IntegrationActions, type IntegrationPromise, getComposioData } from '../actions/composio.action'
import { setGptdoCookieAction } from '../actions/gpt.action'
import { useCustomQuery } from '../hooks/use-custom-query'
import { OUTPUT_FORMATS } from '../lib/constants'
import type { SearchOption } from '../lib/types'
import { OptionListPanel } from './option-list-panel'
import { OptionUrlCreator } from './option-url-creator'

export const SELECTION_STEP_MAP = {
  model: 1,
  integration: 2,
  output: 3,
} as const

export const SELECTION_STEP_ALIASES = {
  model: 'model',
  integration: 'tool',
  output: 'output',
} as const

type SelectionStep = (typeof SELECTION_STEP_ALIASES)[keyof typeof SELECTION_STEP_ALIASES]

export type ChatConfigChangeType = keyof typeof SELECTION_STEP_MAP
export type ConfigOption = SearchOption | IntegrationActions
export type ConfigState = Record<SelectionStep, ConfigOption | undefined>

interface ChatOptionsSelectorProps {
  toolsPromise: IntegrationPromise
  availableModels: SearchOption[]
  initialChatModel?: SearchOption
}

export const ChatOptionsSelector = ({ toolsPromise, availableModels, initialChatModel }: ChatOptionsSelectorProps) => {
  const { model, tool, output, setQueryState } = useCustomQuery({ availableModels, initialChatModel })
  const integrations = use(toolsPromise)
  const pathname = usePathname()

  // --- Derived State from URL and Props ---
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

  // --- Determine Selected Items from useQueryStateStore ---
  const selectedModel = useMemo(
    () => (model ? availableModels.find((item) => item.value === model) || initialChatModel : initialChatModel),
    [model, availableModels, initialChatModel],
  )

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

  // --- UI Derived Values for Tool Card Header ---
  const toolCardHeaderSuffix = useMemo<React.ReactNode>(() => {
    if (activeIntegrationNameFromUrl && Array.isArray(actionsForIntegration)) {
      const integrationDisplayName = 'action'
      return (
        <span className='flex items-center gap-1'>
          <ChevronRight className='text-muted-foreground/50 h-3.5 w-3.5' />
          {integrationDisplayName}
        </span>
      )
    }
    return ''
  }, [activeIntegrationNameFromUrl, actionsForIntegration])

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

  return (
    <Fragment>
      <OptionListPanel
        title='model'
        data={availableModels}
        groupingStrategy='groupByKey'
        groupKeyForFlatList='createdAt'
        selectedItem={selectedModel}
        updateOption={(type, option) => handleConfigChange(type as ChatConfigChangeType, option)}
      />
      <OptionListPanel
        title='integration'
        data={actionsForIntegration ?? integrations}
        groupingStrategy='none'
        selectedItem={selectedTool}
        updateOption={(type, option) => handleConfigChange(type as ChatConfigChangeType, option)}
        headerSuffix={toolCardHeaderSuffix}
        isLoading={!!activeIntegrationNameFromUrl && isLoadingActions}
      />
      <OptionListPanel
        title='output'
        data={OUTPUT_FORMATS}
        groupingStrategy='none'
        selectedItem={selectedOutput}
        updateOption={(type, option) => handleConfigChange(type as ChatConfigChangeType, option)}
      />
      <OptionUrlCreator className='col-span-1 pb-10 md:col-span-3' selectedModel={selectedModel} selectedTool={selectedTool} selectedOutput={selectedOutput} />
    </Fragment>
  )
}
