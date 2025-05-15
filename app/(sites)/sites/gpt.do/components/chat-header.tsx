import { setGptdoCookieAction } from '@/app/(sites)/sites/gpt.do/actions/gpt.action'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSidebar } from '@/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { PlusIcon } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useWindowSize } from 'usehooks-ts'
import { formUrlQuery } from '../../models.do/utils'
import { SearchOption } from '../lib/types'
import { formatModelIdentifier, parseModelIdentifier, resolvePathname } from '../lib/utils'
import { SidebarToggle } from './sidebar-toggle'
import { VisibilitySelector, VisibilityType } from './visibility-selector'

interface ChatHeaderProps {
  chatId: string
  selectedModelId: SearchOption
  setSelectedModelId: (value: SearchOption) => void
  selectedVisibilityType: VisibilityType
  isReadonly: boolean
  modelOptions: SearchOption[]
}

export function ChatHeader({ chatId, selectedModelId, setSelectedModelId, selectedVisibilityType, isReadonly, modelOptions }: ChatHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { width: windowWidth } = useWindowSize()
  const { open } = useSidebar()

  // Get params from URL
  const outputFormat = searchParams.get('output') || ''
  const toolParam = searchParams.get('tool') || ''

  // Get tools from URL (convert to format needed by model identifier)
  const tools = useMemo(() => {
    if (!toolParam) return {}
    return { [toolParam]: true }
  }, [toolParam])

  // Create a complete model identifier from URL params and selected model
  const completeModelIdentifier = useMemo(() => {
    if (!selectedModelId.value) return ''

    return formatModelIdentifier({
      model: selectedModelId.value,
      outputFormat,
      tools,
    })
  }, [selectedModelId.value, outputFormat, tools])

  const [inputValue, setInputValue] = useState(completeModelIdentifier || selectedModelId.value || '')

  const shouldDisable = useMemo(() => {
    // Basic validation - at minimum the core model should exist in options
    const baseModelValue = inputValue.split('(')[0] // Get just the model part before any parameters
    return !modelOptions.some((model) => baseModelValue.includes(model.value))
  }, [inputValue, modelOptions])

  // Update input when model ID or URL params change
  useEffect(() => {
    setInputValue(completeModelIdentifier || selectedModelId.value || '')
  }, [completeModelIdentifier, selectedModelId.value])

  const handleModelChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const newText = e.target.value
      setInputValue(newText)

      try {
        const parsed = parseModelIdentifier(newText)

        const baseModel = parsed.model
        const selectedModel = modelOptions.find((model) => model.value === baseModel)

        if (selectedModel) {
          setSelectedModelId(selectedModel)

          await setGptdoCookieAction({ type: 'model', option: selectedModel, pathname })

          let params = searchParams.toString()

          if (parsed.outputFormat) {
            params = formUrlQuery({ params, key: 'output', value: parsed.outputFormat })
          }

          const toolKeys = parsed.tools ? Object.keys(parsed.tools) : []
          if (toolKeys.length > 0) {
            params = formUrlQuery({ params, key: 'tool', value: toolKeys[0] })
          }

          router.push(`${pathname}?${params}`, { scroll: false })
        }
      } catch (error) {
        console.error('Error parsing model identifier:', error)

        const baseModelValue = newText.split('(')[0].trim()
        const selectedModel = modelOptions.find((model) => model.value === baseModelValue)

        if (selectedModel) {
          setSelectedModelId(selectedModel)
          await setGptdoCookieAction({ type: 'model', option: selectedModel, pathname })
        }
      }
    },
    [modelOptions, pathname, router, searchParams, setSelectedModelId],
  )

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    }
  }, [])

  const basePath = resolvePathname(pathname)

  return (
    <header className='bg-background sticky top-0 flex items-center gap-2 px-2 py-1.5 md:px-2'>
      <SidebarToggle />
      {(!open || windowWidth < 768) && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              className='order-2 ml-auto cursor-pointer px-2 md:order-1 md:ml-0 md:h-fit md:px-2'
              onClick={() => {
                router.push(basePath + '/new')
                router.refresh()
              }}>
              <PlusIcon />
              <span className='md:sr-only'>New Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
      )}

      <Input
        type='text'
        value={inputValue}
        onChange={handleModelChange}
        onKeyDown={handleKeyDown}
        placeholder='Enter model with options (e.g. gpt-4o(output:markdown))'
        className={cn(
          'order-1 w-full min-w-[100px] transition-all duration-300 md:order-2',
          shouldDisable && '!border-destructive/50 text-destructive !bg-destructive/10 !ring-destructive/50',
        )}
        style={{ width: `${Math.max(300, (inputValue?.length || 0) * 8)}px`, maxWidth: 'calc(100vw - 200px)' }}
        spellCheck={false}
      />

      {!isReadonly && <VisibilitySelector chatId={chatId} selectedVisibilityType={selectedVisibilityType} className='order-1 md:order-3' />}
    </header>
  )
}
