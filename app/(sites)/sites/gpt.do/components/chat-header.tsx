import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSidebar } from '@/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { PlusIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { type ChangeEvent, type KeyboardEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { setGptdoCookieAction } from '../actions/gpt.action'
import type { OutputFormatKey } from '../lib/constants'
import type { SearchOption } from '../lib/types'
import { createModelIdentifierFromParams, parse, resolvePathname } from '../lib/utils'
import { SidebarToggle } from './sidebar-toggle'
import { VisibilitySelector, type VisibilityType } from './visibility-selector'

interface ChatHeaderProps {
  chatId: string
  selectedModelOption: SearchOption | null
  setSelectedModelOption: (value: SearchOption) => void
  selectedVisibilityType: VisibilityType
  isReadonly: boolean
  modelOptions: SearchOption[]
  tool: string
  output: OutputFormatKey
  setQueryState: (values: Record<string, any>) => void
}

export function ChatHeader({
  chatId,
  selectedModelOption,
  setSelectedModelOption,
  selectedVisibilityType,
  isReadonly,
  modelOptions,
  tool,
  output,
  setQueryState,
}: ChatHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useIsMobile()
  const { open } = useSidebar()

  // Create a complete model identifier from URL params and selected model
  const completeModelIdentifier = useMemo(() => {
    if (!selectedModelOption?.value) return ''

    return createModelIdentifierFromParams({
      modelId: selectedModelOption.value,
      output,
      tools: tool ? [tool] : [],
    })
  }, [selectedModelOption?.value, output, tool])

  const [inputValue, setInputValue] = useState(completeModelIdentifier || selectedModelOption?.value || '')

  const shouldDisable = useMemo(() => {
    // Basic validation - at minimum the core model should exist in options
    const baseModelValue = inputValue.split('(')[0] // Get just the model part before any parameters
    return !modelOptions.some((model) => baseModelValue.includes(model.value))
  }, [inputValue, modelOptions])

  // Update input when model ID, URL params, or model/tool/output changes
  useEffect(() => {
    setInputValue(completeModelIdentifier || selectedModelOption?.value || '')
  }, [completeModelIdentifier, selectedModelOption?.value])

  const handleModelChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const newText = e.target.value
      setInputValue(newText)

      try {
        const parsed = parse(newText)
        const selectedModel = modelOptions.find((model) => model.value === `${parsed.author}/${parsed.model}`)

        if (selectedModel) {
          setSelectedModelOption(selectedModel)
          await setGptdoCookieAction({ type: 'model', option: selectedModel, pathname })

          if (parsed.outputFormat) {
            setQueryState({ output: parsed.outputFormat as OutputFormatKey })
          }

          const toolKeys = parsed.tools ? Object.keys(parsed.tools) : []
          if (toolKeys.length > 0) {
            setQueryState({ tool: toolKeys[0] })
          } else {
            setQueryState({ tool: '' })
          }
        }
      } catch (error) {
        console.error('Error parsing model identifier:', error)

        const baseModelValue = newText.split('(')[0].trim()
        const selectedModel = modelOptions.find((model) => model.value === baseModelValue)

        if (selectedModel) {
          setSelectedModelOption(selectedModel)
          await setGptdoCookieAction({ type: 'model', option: selectedModel, pathname })
        }
      }
    },
    [modelOptions, pathname, setQueryState, setSelectedModelOption],
  )

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    }
  }, [])

  const basePath = resolvePathname(pathname)

  return (
    <header className='bg-background sticky top-0 flex items-center gap-2 px-2 py-1.5 md:px-2'>
      <SidebarToggle />
      {(!open || isMobile) && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              className='order-2 ml-auto cursor-pointer px-2 md:order-1 md:ml-0 md:h-fit md:px-2'
              onClick={() => {
                router.push(basePath + '/new')
                router.refresh()
              }}
            >
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
