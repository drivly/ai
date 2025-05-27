import { Button } from '@/components/ui/button'
import { FilePreview } from '@/components/ui/file-preview'
import { PromptInput, PromptInputAction, PromptInputActions, PromptInputTextarea } from '@/components/ui/prompt-input'
import { ScrollButton } from '@/components/ui/scroll-button'
import { cn } from '@/lib/utils'
import type { ChatRequestOptions, CreateMessage, Message, UIMessage } from 'ai'
import { ArrowUp, CircleStop, Paperclip } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useCallback, type ChangeEvent, type RefObject } from 'react'
import { useChatInputMethods } from '../hooks/use-chat-input-methods'
import type { SearchOption } from '../lib/types'
import { useIsHydrated } from '../hooks/use-is-hydrated'

const PromptSuggestions = dynamic(() => import('./prompt-suggestions').then((mod) => mod.PromptSuggestions), {
  ssr: false,
})

type MultimodalInputProps = {
  bottomRef: RefObject<HTMLElement | null>
  containerRef: RefObject<HTMLElement | null>
  error: Error | undefined
  input: string
  messages: UIMessage[]
  status: 'error' | 'submitted' | 'streaming' | 'ready'
  selectedModelOption: SearchOption | null
  append: (message: Message | CreateMessage, chatRequestOptions?: ChatRequestOptions) => Promise<string | null | undefined>
  handleInputChange: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (
    event?: {
      preventDefault?: () => void
    },
    chatRequestOptions?: ChatRequestOptions,
  ) => void
  setMessages: (messages: Message[] | ((messages: Message[]) => Message[])) => void
  stop: () => void
}

export function MultimodalInput({
  bottomRef,
  containerRef,
  error,
  input,
  messages,
  status,
  selectedModelOption,
  append,
  handleInputChange,
  handleSubmit,
  setMessages,
  stop,
}: MultimodalInputProps) {
  const isHydrated = useIsHydrated()
  const isLoading = status === 'streaming' || status === 'submitted'

  const { attachments, disabled, fileInputRef, textareaRef, handleKeyDown, handleFileChange, removeAttachment, submitForm } = useChatInputMethods({
    error,
    isDisabled: status !== 'ready' && status !== 'error',
    isLoading,
    input,
    messages,
    handleSubmit,
    setMessages,
  })

  const handleInputChangeWrapper = useCallback(
    (value: string) => {
      const syntheticEvent = {
        target: { value },
      } as ChangeEvent<HTMLTextAreaElement>

      handleInputChange(syntheticEvent)
    },
    [handleInputChange],
  )

  return (
    <section className='px-4'>
      {isHydrated && messages.length === 0 && attachments.length === 0 && <PromptSuggestions append={append} selectedModel={selectedModelOption} />}
      <form
        className={cn(
          'relative mx-auto mb-2 flex w-full max-w-6xl flex-col gap-2 rounded-xl border border-gray-200 bg-gray-50 backdrop-blur-sm transition-all duration-200 sm:mb-4 md:mb-6 dark:border-zinc-700/60 dark:bg-zinc-800/40',
          {
            'max-w-4xl': isHydrated && messages.length > 0,
          },
        )}>
        <input type='file' ref={fileInputRef} className='sr-only' onChange={handleFileChange} multiple accept='.png, .jpg, .jpeg, .pdf' tabIndex={-1} />
        <FilePreview attachments={attachments} onRemove={removeAttachment} className='border-border rounded-t-xl border' />
        <PromptInput
          value={input}
          onValueChange={handleInputChangeWrapper}
          isLoading={isLoading}
          className='relative w-full rounded-t-none rounded-b-xl border-0 bg-transparent p-0'>
          <ScrollButton
            containerRef={containerRef}
            scrollRef={bottomRef}
            className='border-input/90 text-primary absolute top-[14px] right-[14px] mx-auto h-[28px] w-[28px] cursor-pointer rounded-lg border bg-[#f4f4f5] px-0 py-0 transition-colors has-[>svg]:px-0 dark:bg-[#1f1f22]'
          />
          <PromptInputTextarea
            ref={textareaRef}
            placeholder='Enter Prompt...'
            className='max-h-[200px] min-h-[64px] flex-1 resize-none overflow-y-auto bg-transparent px-4 py-3 font-sans text-[13px] text-zinc-700 placeholder:text-gray-400 focus:outline-none dark:bg-transparent dark:text-zinc-200 dark:placeholder:text-zinc-500'
            onKeyDown={handleKeyDown}
            disabled={isLoading || disabled}
            autoFocus
            disableAutosize
          />
          <PromptInputActions className='flex w-full flex-row items-center justify-between bg-transparent px-3 py-2'>
            <PromptInputAction delayDuration={0} className='duration-0 data-[state=closed]:duration-0' tooltip='Attach files'>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='h-8 w-8 cursor-pointer rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 has-[>svg]:px-0 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'
                aria-label='Attach files'
                onClick={(event) => {
                  event.preventDefault()
                  fileInputRef.current?.click()
                }}
                disabled={isLoading || disabled}>
                <Paperclip className='h-4 w-4' />
              </Button>
            </PromptInputAction>
            <PromptInputAction tooltip={isLoading ? 'Stop message' : 'Send message'}>
              {isLoading ? (
                <Button
                  aria-label='Stop message'
                  className={cn('border-input/90 text-primary flex h-8 w-8 cursor-pointer rounded-lg border bg-[#f4f4f5] transition-colors dark:bg-[#1f1f22]', {
                    'text-primary-foreground bg-[#18181b] dark:bg-white': isLoading,
                  })}
                  onClick={(event) => {
                    event.preventDefault()
                    stop()
                  }}>
                  <CircleStop absoluteStrokeWidth strokeWidth={2.5} className='h-4 w-4' />
                </Button>
              ) : (
                <Button
                  type='submit'
                  aria-label='Send message'
                  className={cn(
                    'flex h-8 w-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-200',
                    {
                      'bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 dark:hover:text-black':
                        input.trim() || attachments.length > 0,
                    },
                  )}
                  disabled={input.trim() === '' && attachments.length === 0}
                  onClick={(event) => {
                    event.preventDefault()
                    submitForm()
                  }}>
                  <ArrowUp absoluteStrokeWidth strokeWidth={2.5} className='h-4 w-4' />
                </Button>
              )}
            </PromptInputAction>
          </PromptInputActions>
        </PromptInput>
      </form>
    </section>
  )
}
