'use client'

import { ChevronRight } from 'lucide-react'
import { Fragment, useMemo } from 'react'
import { useSelectionOptions } from '../hooks/use-selection-options'
import { OUTPUT_FORMATS } from '../lib/constants'
import type { ComposioDataPromise, SearchOption } from '../lib/types'
import { OptionListPanel } from './option-list-panel'
import { OptionUrlCreator } from './option-url-creator'

interface ChatOptionsSelectorProps {
  toolsPromise: ComposioDataPromise
  availableModels: SearchOption[]
  selectedModelOption: SearchOption | null
}

export const ChatOptionsSelector = ({ toolsPromise, availableModels, selectedModelOption }: ChatOptionsSelectorProps) => {
  const { actionsForIntegration, activeIntegrationNameFromUrl, integrations, isLoadingActions, handleConfigChange, selectedModel, selectedOutput, selectedTool } =
    useSelectionOptions({
      modelOptions: availableModels,
      toolsPromise,
      selectedModelOption,
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
        updateOption={(type, option) => handleConfigChange(type, option)}
      />
      <OptionListPanel
        title='integration'
        data={actionsForIntegration ?? integrations}
        groupingStrategy='none'
        selectedItem={selectedTool}
        updateOption={(type, option) => handleConfigChange(type, option)}
        headerSuffix={toolCardHeaderSuffix}
        isLoading={!!activeIntegrationNameFromUrl && isLoadingActions}
      />
      <OptionListPanel
        title='output'
        data={OUTPUT_FORMATS}
        groupingStrategy='none'
        selectedItem={selectedOutput}
        updateOption={(type, option) => handleConfigChange(type, option)}
      />
      <OptionUrlCreator className='col-span-1 pb-10 md:col-span-3' selectedModel={selectedModel} selectedTool={selectedTool} selectedOutput={selectedOutput} />
    </Fragment>
  )
}
