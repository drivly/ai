import { OUTPUT_FORMATS } from '../lib/constants'
import { useIsMobile } from '@/hooks/use-mobile'
import type { SearchOption } from '../lib/types'
import { SearchableOptionSelector } from './searchable-option-selector'
import { useSelectionOptions } from '../hooks/use-selection-options'
import type { IntegrationPromise } from '../actions/composio.action'

export interface SearchableOptionContainerProps {
  toolsPromise: IntegrationPromise
  modelOptions: SearchOption[]
  selectedModelId: SearchOption
}

export const SearchableOptionContainer = ({ toolsPromise, modelOptions, selectedModelId }: SearchableOptionContainerProps) => {
  const { actionsForIntegration, integrations, handleConfigChange, selectedModel, selectedOutput, selectedTool } = useSelectionOptions({
    modelOptions,
    toolsPromise,
    selectedModelId,
  })
  const isMobile = useIsMobile()

  if (isMobile) return null

  return (
    <div className='mt-2 flex w-full flex-1 flex-col sm:mt-0 sm:flex-row sm:items-center sm:justify-center'>
      <div className='mx-auto flex w-full flex-col space-y-2 sm:w-auto sm:flex-row sm:items-center sm:space-y-0 sm:space-x-1'>
        <SearchableOptionSelector
          align='end'
          placeholder='Model'
          title='model'
          options={modelOptions}
          selectedItem={selectedModel}
          updateOption={handleConfigChange}
          className='h-10 w-full border-0 bg-transparent text-gray-600 hover:bg-gray-100/80 sm:h-6 sm:w-auto sm:min-w-[80px] dark:border-0 dark:bg-transparent dark:text-zinc-400 dark:hover:bg-zinc-800/50'
        />
        <span className='hidden text-gray-300 sm:inline dark:text-zinc-600'>|</span>
        <SearchableOptionSelector
          align='center'
          placeholder='Tool'
          title='integration'
          options={actionsForIntegration ?? integrations}
          selectedItem={selectedTool}
          updateOption={handleConfigChange}
          className='h-10 w-full border-0 bg-transparent text-gray-600 hover:bg-gray-100/80 sm:h-6 sm:w-auto sm:min-w-[70px] dark:border-0 dark:bg-transparent dark:text-zinc-400 dark:hover:bg-zinc-800/50'
        />
        <span className='hidden text-gray-300 sm:inline dark:text-zinc-600'>|</span>
        <SearchableOptionSelector
          align='start'
          placeholder='Format'
          title='output'
          options={OUTPUT_FORMATS}
          selectedItem={selectedOutput}
          updateOption={handleConfigChange}
          className='h-10 w-full border-0 bg-transparent text-gray-600 hover:bg-gray-100/80 sm:h-6 sm:w-auto sm:min-w-[80px] dark:border-0 dark:bg-transparent dark:text-zinc-400 dark:hover:bg-zinc-800/50'
        />
      </div>
    </div>
  )
}
