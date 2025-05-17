'use client'

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { cn } from '@/lib/utils'
import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createCleanURLParams } from '../lib/utils'
import type { ConfigOption } from './chat-options-selector'

interface OptionUrlCreatorProps {
  className?: string
  selectedModel?: ConfigOption | null
  selectedTool?: ConfigOption | null
  selectedOutput?: ConfigOption | null
}

export function OptionUrlCreator({ className, selectedModel, selectedTool, selectedOutput }: OptionUrlCreatorProps) {
  const [copiedText, copy] = useCopyToClipboard()
  const [currentUrl, setCurrentUrl] = useState<string | null>(null)
  const [origin, setOrigin] = useState<string | null>(null)

  // Get parameter values for display and URL creation
  const modelValue = selectedModel?.value || null
  const toolValue = selectedTool?.value || null
  const outputValue = selectedOutput?.value || null

  useEffect(() => {
    try {
      const chatUrl = new URL('/chat/new', window.location.origin)

      const params = {
        model: modelValue,
        tool: toolValue,
        output: outputValue,
      }

      const searchParams = createCleanURLParams(params)
      chatUrl.search = searchParams.toString()

      setOrigin(chatUrl.origin)
      setCurrentUrl(chatUrl.toString())
    } catch (error) {
      console.error('Error creating URL:', error)
    }
  }, [modelValue, toolValue, outputValue])

  return (
    <div className={cn('flex flex-wrap items-center gap-px font-mono text-xs text-zinc-500 dark:text-zinc-500', className)}>
      <span className='opacity-70'>{origin || 'https://gpt.do'}</span>
      <span className='opacity-70'>/chat/new</span>
      {modelValue && (
        <>
          <span className='opacity-70'>?model=</span>
          <span>{modelValue}</span>
        </>
      )}
      {toolValue && (
        <>
          <span className='opacity-70'>&tool=</span>
          <span>{toolValue}</span>
        </>
      )}
      {outputValue && (
        <>
          <span className='opacity-70'>&output=</span>
          <span>{outputValue}</span>
        </>
      )}
      <button
        onClick={() => currentUrl && copy(decodeURIComponent(currentUrl))}
        disabled={!modelValue || !currentUrl}
        className='focus-visible:border-ring focus-visible:ring-ring/50 ml-1 flex h-4 w-4 cursor-pointer items-center justify-center rounded-sm text-zinc-500 transition-colors outline-none hover:text-zinc-700 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-500 dark:hover:text-zinc-300'>
        {copiedText ? <Check className='h-3 w-3 text-emerald-600 dark:text-emerald-400' /> : <Copy className='h-3 w-3' />}
        <span className='sr-only'>{copiedText ? 'Copied' : 'Copy URL'}</span>
      </button>
    </div>
  )
}
