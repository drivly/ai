import { Button } from '../ui/button'
import { cn } from '../../lib/utils'
import { PromptInput, PromptInputAction, PromptInputActions, PromptInputTextarea } from '../ui/prompt-input'
import { ArrowUp, CircleStop, Paperclip } from 'lucide-react'
import React, { Fragment, useCallback } from 'react'
import { useChatInputMethods } from '../../hooks'
import { useChatInput, useChatMessages, useChatStatus } from '../store/context'
import { FilePreview } from '../ui'
import { ChatSuggestions } from './chat-suggestions'

export function ChatInput() {
  const { input, handleInputChange, append } = useChatInput()
  const { isLoading, stop } = useChatStatus()
  const { messages } = useChatMessages()

  const { attachments, disabled, fileInputRef, textareaRef, handleKeyDown, handleFileChange, removeAttachment, submitForm } = useChatInputMethods()

  const handleInputChangeWrapper = useCallback(
    (value: string) => {
      const syntheticEvent = {
        target: { value },
      } as React.ChangeEvent<HTMLTextAreaElement>

      handleInputChange(syntheticEvent)
    },
    [handleInputChange],
  )

  return (
    <Fragment>
      {messages.length === 0 && attachments.length === 0 && <ChatSuggestions append={append} />}
      <form className='font-geist border-border bg-background border-t dark:bg-black'>
        <input type='file' ref={fileInputRef} className='sr-only' onChange={handleFileChange} multiple accept='.png, .jpg, .jpeg, .pdf' tabIndex={-1} />
        <FilePreview attachments={attachments} onRemove={removeAttachment} />
        <PromptInput
          value={input}
          onValueChange={handleInputChangeWrapper}
          isLoading={isLoading}
          className='bg-background text-primary w-full rounded-t-none rounded-b-lg border-0 dark:bg-[#141415]'
          maxHeight={384}
        >
          <PromptInputTextarea
            ref={textareaRef}
            placeholder='Send a message...'
            className='placeholder:text-muted-foreground font-geist !focus-visible:outline-none px-4 py-3 text-[14px] leading-[24px] placeholder:text-[14px] focus:outline-none md:text-[14px] dark:bg-transparent'
            onKeyDown={handleKeyDown}
            disabled={isLoading || disabled}
            autoFocus
          />
          <PromptInputActions className='items-center justify-between gap-[4px] px-2 py-1.5'>
            <PromptInputAction delayDuration={0} className='duration-0 data-[state=closed]:duration-0' tooltip='Attach files'>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='h-[28px] w-[28px] border-none bg-transparent px-0 py-0 shadow-none hover:bg-transparent has-[>svg]:px-0'
                aria-label='Attach files'
                onClick={(event) => {
                  event.preventDefault()
                  fileInputRef.current?.click()
                }}
                disabled={isLoading || disabled}
              >
                <Paperclip className='!h-[16px] !w-[16px]' />
              </Button>
            </PromptInputAction>
            <PromptInputAction tooltip={isLoading ? 'Stop message' : 'Send message'}>
              {isLoading ? (
                <Button
                  aria-label='Stop message'
                  className={cn(
                    'border-input/90 text-primary h-[28px] w-[28px] cursor-pointer rounded-md border bg-[#f4f4f5] px-0 py-0 transition-colors has-[>svg]:px-0 dark:bg-[#1f1f22]',
                    {
                      'text-primary-foreground bg-[#18181b] dark:bg-white': isLoading,
                    },
                  )}
                  onClick={(event) => {
                    event.preventDefault()
                    stop()
                  }}
                >
                  <CircleStop absoluteStrokeWidth strokeWidth={2.5} className='!h-[16px] !w-[16px]' />
                </Button>
              ) : (
                <Button
                  type='submit'
                  aria-label='Send message'
                  className={cn(
                    'border-input/90 text-primary h-[28px] w-[28px] cursor-pointer rounded-md border bg-[#f4f4f5] px-0 py-0 transition-colors has-[>svg]:px-0 dark:bg-[#1f1f22]',
                    {
                      'text-primary-foreground bg-[#18181b] dark:bg-white': input.trim() || attachments.length > 0,
                    },
                  )}
                  disabled={input.trim() === '' && attachments.length === 0}
                  onClick={(event) => {
                    event.preventDefault()
                    submitForm()
                  }}
                >
                  <ArrowUp absoluteStrokeWidth strokeWidth={2.5} className='!h-[16px] !w-[16px]' />
                </Button>
              )}
            </PromptInputAction>
          </PromptInputActions>
        </PromptInput>
      </form>
    </Fragment>
  )
}
