import { useSelectionOptions } from '../hooks/use-selection-options'
import { OUTPUT_FORMATS } from '../lib/constants'
import type { ComposioDataPromise, SearchOption } from '../lib/types'
import { SearchableOptionSelector } from './searchable-option-selector'

export interface SearchableOptionContainerProps {
  modelOptions: SearchOption[]
  selectedModelOption: SearchOption | null
  toolsPromise: ComposioDataPromise
}

export const SearchableOptionContainer = ({ modelOptions, selectedModelOption, toolsPromise }: SearchableOptionContainerProps) => {
  const { actionsForIntegration, integrations, selectedModel, selectedOutput, selectedTool, handleConfigChange } = useSelectionOptions({
    modelOptions,
    toolsPromise,
    selectedModelOption,
  })

  return (
    <div className='hidden w-full flex-1 flex-row items-center justify-center md:flex'>
      <div className='mx-auto flex w-auto flex-row items-center space-x-1'>
        <SearchableOptionSelector
          align='end'
          placeholder='Model'
          title='model'
          options={modelOptions}
          selectedItem={selectedModel}
          updateOption={handleConfigChange}
          className='h-6 w-auto min-w-[80px] border-0 bg-transparent text-gray-600 hover:bg-gray-100/80 dark:border-0 dark:bg-transparent dark:text-zinc-400 dark:hover:bg-zinc-800/50'
        />
        <span className='inline text-gray-300 dark:text-zinc-600'>|</span>
        <SearchableOptionSelector
          align='center'
          placeholder='Tool'
          title='integration'
          options={actionsForIntegration ?? integrations}
          selectedItem={selectedTool}
          updateOption={handleConfigChange}
          className='h-6 w-auto min-w-[80px] border-0 bg-transparent text-gray-600 hover:bg-gray-100/80 dark:border-0 dark:bg-transparent dark:text-zinc-400 dark:hover:bg-zinc-800/50'
        />
        <span className='inline text-gray-300 dark:text-zinc-600'>|</span>
        <SearchableOptionSelector
          align='start'
          placeholder='Format'
          title='output'
          options={OUTPUT_FORMATS}
          selectedItem={selectedOutput}
          updateOption={handleConfigChange}
          className='h-6 w-auto min-w-[80px] border-0 bg-transparent text-gray-600 hover:bg-gray-100/80 dark:border-0 dark:bg-transparent dark:text-zinc-400 dark:hover:bg-zinc-800/50'
        />
      </div>
    </div>
  )
}
