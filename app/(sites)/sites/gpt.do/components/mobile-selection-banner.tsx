import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useSelectionOptions } from '../hooks/use-selection-options'
import { OUTPUT_FORMATS } from '../lib/constants'
import type { ComposioDataPromise, SearchOption } from '../lib/types'
import { MobileSelectionDrawer } from './mobile-selection-drawer'

export interface MobileSelectionBannerProps {
  className?: string
  modelOptions: SearchOption[]
  toolsPromise: ComposioDataPromise
  selectedModelOption: SearchOption | null
}

export const MobileSelectionBanner = ({ className, modelOptions, toolsPromise, selectedModelOption }: MobileSelectionBannerProps) => {
  const { actionsForIntegration, integrations, handleConfigChange, selectedModel, selectedOutput, selectedTool } = useSelectionOptions({
    modelOptions,
    toolsPromise,
    selectedModelOption,
  })

  return (
    <div className={cn('border-input flex flex-row items-center justify-evenly gap-2 border-b px-2 pt-0.5 pb-1.5 shadow-sm md:hidden', className)}>
      <MobileSelectionDrawer
        placeholder='Model'
        title='model'
        options={modelOptions}
        selectedItem={selectedModel}
        updateOption={handleConfigChange}
        className='w-1/3 bg-transparent text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 dark:bg-transparent dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-300'
      />
      <Separator orientation='vertical' />
      <MobileSelectionDrawer
        title='integration'
        options={actionsForIntegration ?? integrations}
        selectedItem={selectedTool}
        updateOption={handleConfigChange}
        className='w-1/3 bg-transparent text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 dark:bg-transparent dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-300'
      />
      <Separator orientation='vertical' />
      <MobileSelectionDrawer
        title='output'
        options={OUTPUT_FORMATS}
        selectedItem={selectedOutput}
        updateOption={handleConfigChange}
        className='w-1/3 bg-transparent text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 dark:bg-transparent dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-300'
      />
    </div>
  )
}
