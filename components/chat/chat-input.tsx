'use client'

import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowUp, CircleStop, Paperclip } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useChatInput, useChatStatus } from './chat-context'
import type { Attachment } from 'ai'

export function ChatInput() {
  const { input, handleInputChange, handleSubmit } = useChatInput()
  const { isLoading, stop } = useChatStatus()

  const [attachments, setAttachments] = useState<Attachment[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChangeWrapper = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e)
    adjustTextareaHeight()
  }

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      submitForm()
    }
  }

  const submitForm = () => {
    if (input.trim() === '' && attachments.length === 0) return

    handleSubmit(undefined, {
      experimental_attachments: attachments,
    })

    setAttachments([])

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    const newAttachments = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      contentType: file.type,
    }))

    setAttachments((prev) => [...prev, ...newAttachments])
  }

  return (
    <div className='relative w-full border-t p-4'>
      <input type='file' className='sr-only' ref={fileInputRef} multiple onChange={handleFileChange} accept='image/*,.pdf' />

      {attachments.length > 0 && (
        <div className='mb-2 flex flex-wrap gap-2'>
          {attachments.map((attachment) => (
            <div key={attachment.url} className='bg-muted flex items-center gap-1 rounded-md p-1 text-xs'>
              <span className='max-w-[100px] truncate'>{attachment.name}</span>
              <Button variant='ghost' size='sm' className='h-4 w-4 p-0' onClick={() => setAttachments((prev) => prev.filter((a) => a.url !== attachment.url))}>
                &times;
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className='relative flex items-center'>
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChangeWrapper}
          onKeyDown={handleKeyDown}
          placeholder='Send a message...'
          className='max-h-[200px] min-h-[40px] resize-none rounded-md py-3 pr-12'
          disabled={isLoading}
        />

        <div className='absolute right-2 bottom-2 flex gap-2'>
          <Button type='button' size='icon' variant='ghost' className='h-8 w-8' onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
            <Paperclip className='h-4 w-4' />
            <span className='sr-only'>Attach files</span>
          </Button>

          {isLoading ? (
            <Button type='button' size='icon' className='h-8 w-8 rounded-full' onClick={stop}>
              <CircleStop className='h-4 w-4' />
              <span className='sr-only'>Stop generating</span>
            </Button>
          ) : (
            <Button
              type='button'
              size='icon'
              className={cn('h-8 w-8 rounded-full', {
                'opacity-50': input.trim() === '' && attachments.length === 0,
              })}
              disabled={input.trim() === '' && attachments.length === 0}
              onClick={submitForm}
            >
              <ArrowUp className='h-4 w-4' />
              <span className='sr-only'>Send message</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
