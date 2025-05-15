'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronRight } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Fragment, use, useCallback, useMemo, useState } from 'react'
import { formUrlQuery, removeKeysFromQuery } from '../../models.do/utils'
import { IntegrationActions, IntegrationPromise, getComposioData } from '../actions/composio.action'
import { setGptdoCookieAction } from '../actions/gpt.action'
import { OUTPUT_FORMATS } from '../lib/constants'
import { SearchOption } from '../lib/types'
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
  const integrations = use(toolsPromise)
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  // Reintroduce the selections state for input functionality
  const [selections, setSelections] = useState<ConfigState>({
    model: initialChatModel,
    tool: undefined as ConfigOption | undefined,
    output: OUTPUT_FORMATS[0],
  })

  // --- URL Parameter Extraction ---
  const modelFromUrl = searchParams.get('model')
  const toolFromUrl = searchParams.get('tool')
  const outputFromUrl = searchParams.get('output')

  // --- Derived State from URL and Props ---
  const activeIntegrationNameFromUrl = useMemo(() => {
    if (!toolFromUrl) return null
    return toolFromUrl.includes('.') ? toolFromUrl.split('.')[0] : toolFromUrl
  }, [toolFromUrl])

  const { data: actionsForIntegration, isLoading: isLoadingActions } = useQuery({
    queryKey: ['actions', activeIntegrationNameFromUrl],
    queryFn: async () => getComposioData(activeIntegrationNameFromUrl),
    enabled: !!activeIntegrationNameFromUrl, // Only fetch if an integration is selected/active from URL
  })

  // --- View Logic for Tool Card ---
  // showActionsView determines a specific integration's actions
  const showActionsView = useMemo(() => !!activeIntegrationNameFromUrl && !toolFromUrl?.includes('.'), [activeIntegrationNameFromUrl, toolFromUrl])

  const dataForToolCard = useMemo(() => {
    if ((showActionsView || toolFromUrl?.includes('.')) && Array.isArray(actionsForIntegration)) {
      return actionsForIntegration
    }
    return integrations
  }, [showActionsView, actionsForIntegration, integrations, toolFromUrl])

  // --- Determine Selected Items (URL > Props > Local State > Default) ---
  const selectedModel = useMemo(() => {
    if (modelFromUrl) {
      return availableModels.find((model) => model.value === modelFromUrl)
    }

    return selections.model === undefined ? initialChatModel : selections.model
  }, [modelFromUrl, availableModels, initialChatModel, selections.model])

  const selectedTool = useMemo(() => {
    if (!toolFromUrl) return selections.tool

    // For specific actions (with dot notation)
    if (toolFromUrl.includes('.') && Array.isArray(actionsForIntegration)) {
      const action = actionsForIntegration.find((item) => item.value === toolFromUrl)
      if (action) return action
    }
    // For parent integrations (no dot)
    else if (Array.isArray(actionsForIntegration)) {
      const relatedAction = actionsForIntegration.find((item) => 'createdBy' in item && item.createdBy === toolFromUrl) as IntegrationActions | undefined

      if (relatedAction) {
        return {
          value: relatedAction.createdBy,
          label: relatedAction.createdBy.charAt(0).toUpperCase() + relatedAction.createdBy.slice(1),
        }
      }
    }

    return selections.tool
  }, [toolFromUrl, actionsForIntegration, selections.tool])

  const selectedOutput = useMemo(() => {
    if (outputFromUrl) {
      return OUTPUT_FORMATS.find((format) => format.value === outputFromUrl)
    }

    return selections.output === undefined ? OUTPUT_FORMATS[0] : selections.output
  }, [outputFromUrl, selections.output])

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
      setSelections((prev) => ({
        ...prev,
        [SELECTION_STEP_ALIASES[type]]: option,
      }))

      let newUrl
      const key = SELECTION_STEP_ALIASES[type]
      const params = searchParams.toString()
      const value = option?.value || ''

      if (value) {
        newUrl = formUrlQuery({ params, key, value })
      } else {
        newUrl = removeKeysFromQuery({ params, keys: [key] })
      }

      await setGptdoCookieAction({
        type: SELECTION_STEP_ALIASES[type],
        option,
        pathname,
      })
      router.replace(decodeURIComponent(newUrl), { scroll: false })
    },
    [pathname, searchParams, router],
  )

  const handleBackToIntegrations = useCallback(() => {
    let newUrl
    if (toolFromUrl?.includes('.')) {
      const integrationName = toolFromUrl.split('.')[0]
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'tool',
        value: integrationName,
      })
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keys: ['tool'],
      })
    }
    router.replace(decodeURIComponent(newUrl), { scroll: false })
  }, [router, searchParams, toolFromUrl])

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
        data={dataForToolCard}
        groupingStrategy='none'
        selectedItem={selectedTool}
        updateOption={(type, option) => handleConfigChange(type as ChatConfigChangeType, option)}
        headerSuffix={toolCardHeaderSuffix}
        isLoading={!!activeIntegrationNameFromUrl && isLoadingActions}
        onClearInputInActionsView={activeIntegrationNameFromUrl ? handleBackToIntegrations : undefined}
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
