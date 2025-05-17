'use client'

import { ChevronRight } from 'lucide-react'
import { Fragment, useMemo } from 'react'
import { type IntegrationActions, type IntegrationPromise } from '../actions/composio.action'
import { useSelectionOptions } from '../hooks/use-selection-options'
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
  initialChatModel: SearchOption
}

export const ChatOptionsSelector = ({ toolsPromise, availableModels, initialChatModel }: ChatOptionsSelectorProps) => {
  const { actionsForIntegration, activeIntegrationNameFromUrl, integrations, isLoadingActions, handleConfigChange, selectedModel, selectedOutput, selectedTool } =
    useSelectionOptions({
      modelOptions: availableModels,
      toolsPromise,
      selectedModelId: initialChatModel,
    })

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
