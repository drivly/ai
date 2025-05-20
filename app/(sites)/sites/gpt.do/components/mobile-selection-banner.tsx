import { Separator } from '@/components/ui/separator'
import { useIsMobile } from '@/hooks/use-mobile'
import { useSelectionOptions } from '../hooks/use-selection-options'
import { OUTPUT_FORMATS } from '../lib/constants'
import type { ComposioDataPromise, SearchOption } from '../lib/types'
import { MobileSelectionDrawer } from './mobile-selection-drawer'

export interface MobileSelectionBannerProps {
  modelOptions: SearchOption[]
  toolsPromise: ComposioDataPromise
  selectedModelOption: SearchOption | null
}

export const MobileSelectionBanner = ({ modelOptions, toolsPromise, selectedModelOption }: MobileSelectionBannerProps) => {
  const { actionsForIntegration, integrations, handleConfigChange, selectedModel, selectedOutput, selectedTool } = useSelectionOptions({
    modelOptions,
    toolsPromise,
    selectedModelOption,
  })

  const isMobile = useIsMobile()

  if (!isMobile) return null

  return (
    <div className='border-input flex flex-row items-center justify-evenly gap-2 border-b px-2 py-1.5 shadow-sm'>
      <MobileSelectionDrawer placeholder='Model' title='model' options={modelOptions} selectedItem={selectedModel} updateOption={handleConfigChange} className='w-1/3' />
      <Separator orientation='vertical' />
      <MobileSelectionDrawer title='integration' options={actionsForIntegration ?? integrations} selectedItem={selectedTool} updateOption={handleConfigChange} className='w-1/3' />
      <Separator orientation='vertical' />
      <MobileSelectionDrawer title='output' options={OUTPUT_FORMATS} selectedItem={selectedOutput} updateOption={handleConfigChange} className='w-1/3' />
    </div>
  )
}
