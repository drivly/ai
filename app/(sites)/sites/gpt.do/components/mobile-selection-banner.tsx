import { Separator } from '@/components/ui/separator'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { use, useCallback, useMemo } from 'react'
import { formUrlQuery, removeKeysFromQuery } from '../../models.do/utils'
import type { IntegrationPromise } from '../actions/composio.action'
import { setGptdoCookieAction } from '../actions/gpt.action'
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
  const integrations = use(toolsPromise)
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  // --- URL Parameter Extraction ---
  const modelFromUrl = searchParams.get('model')
  const toolFromUrl = searchParams.get('tool')
  const outputFromUrl = searchParams.get('output')

  // Memoized selected values that reflect URL params with fallbacks to props
  const selectedModel = useMemo(() => {
    if (modelFromUrl) {
      return modelOptions.find((model) => model.value === modelFromUrl) || selectedModelId
    }
    return selectedModelId
  }, [modelOptions, modelFromUrl, selectedModelId])

  const selectedTool = useMemo(() => {
    if (toolFromUrl) {
      return integrations.find((tool) => tool.value === toolFromUrl) || null
    }
    return null
  }, [integrations, toolFromUrl])

  const selectedOutput = useMemo(() => {
    if (outputFromUrl) {
      return OUTPUT_FORMATS.find((output) => output.value === outputFromUrl) || null
    }
    return null
  }, [outputFromUrl])

  const handleOptionChange = useCallback(
    async (type: ChatConfigChangeType, option: ConfigOption | null) => {
      // Update URL
      let newUrl
      const key = SELECTION_STEP_ALIASES[type]
      const params = searchParams.toString()
      const value = option?.value || ''

      if (value) {
        newUrl = formUrlQuery({ params, key, value })
      } else {
        newUrl = removeKeysFromQuery({ params, keys: [key] })
      }

      // Save to cookie
      await setGptdoCookieAction({
        type: SELECTION_STEP_ALIASES[type],
        option,
        pathname,
      })

      // Update URL
      router.replace(decodeURIComponent(newUrl), { scroll: false })
    },
    [router, searchParams, pathname],
  )
  return (
    <div className='border-input flex flex-row items-center justify-evenly gap-2 border-b px-2 py-1.5 shadow-sm sm:hidden'>
      <MobileSelectionDrawer placeholder='Model' title='model' options={modelOptions} selectedItem={selectedModel} updateOption={handleOptionChange} className='w-1/3' />
      <Separator orientation='vertical' />
      <MobileSelectionDrawer title='integration' options={integrations} selectedItem={selectedTool} updateOption={handleOptionChange} className='w-1/3' />
      <Separator orientation='vertical' />
      <MobileSelectionDrawer title='output' options={OUTPUT_FORMATS} selectedItem={selectedOutput} updateOption={handleOptionChange} className='w-1/3' />
    </div>
  )
}
