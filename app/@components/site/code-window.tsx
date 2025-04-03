"use client"

import { cn } from '@drivly/ui/lib'
import { Pre, RawCode, highlight } from 'codehike/code'
import React, { useEffect, useState } from 'react'

interface CodeWindowProps {
  className?: string
  code: string
  language?: string
  title?: string
}

interface AnnotationHandlerProps {
  annotation: string | unknown
  children: React.ReactNode
}

const autoLinkHandler = {
  name: 'link',
  Inline: ({ annotation, children }: AnnotationHandlerProps) => {
    const url = typeof annotation === 'string' ? annotation : String(annotation)
    
    if (url.startsWith('https://')) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="underline text-blue-400 hover:text-blue-300">
          {children}
        </a>
      )
    }
    
    return <>{children}</>
  }
}

export function CodeWindow({ className, code, language = 'json', title = 'llm.do' }: CodeWindowProps) {
  const rawCode: RawCode = {
    lang: language,
    value: code,
    meta: ''
  }

  const [highlighted, setHighlighted] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [processedCode, setProcessedCode] = useState(code)

  useEffect(() => {
    const processLinks = () => {
      const urlRegex = /(https:\/\/[^\s"']+)/g
      const processed = code.replace(urlRegex, (url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="underline text-blue-400 hover:text-blue-300">${url}</a>`
      })
      setProcessedCode(processed)
    }

    processLinks()
  }, [code])

  useEffect(() => {
    const highlightCode = async () => {
      try {
        const result = await highlight(rawCode, 'github-dark')
        setHighlighted(result)
      } catch (error) {
        console.error('Error highlighting code:', error)
      } finally {
        setIsLoading(false)
      }
    }

    highlightCode()
  }, [code, language])

  return (
    <div className={cn('bg-opacity-[0.01] rounded-2xl border-[10px] border-white/10', className)}>
      <div className='relative w-full overflow-hidden rounded-md border'>
        {/* Code window header */}
        <div className='flex items-center justify-between bg-black/80 px-4 py-2 backdrop-blur-md'>
          <div className='flex items-center gap-2'>
            <div className='flex gap-1.5'>
              <div className='size-3 rounded-full bg-white/20'></div>
              <div className='size-3 rounded-full bg-white/20'></div>
              <div className='size-3 rounded-full bg-white/20'></div>
            </div>
            <p className='text-xs text-gray-400 mx-auto'>{title}</p>
          </div>
        </div>

        {/* Code content with CodeHike */}
        <div className='max-h-[500px] overflow-auto bg-black/90 p-4 px-8 text-left font-mono text-sm text-white'>
          {isLoading ? (
            <div className="text-gray-400">Loading...</div>
          ) : highlighted ? (
            <Pre 
              code={highlighted}
              handlers={[autoLinkHandler]}
              className="text-xs sm:text-sm"
            />
          ) : (
            <div 
              className="text-xs sm:text-sm" 
              dangerouslySetInnerHTML={{ __html: processedCode }}
            />
          )}
        </div>
      </div>
    </div>
  )
}


// browser bar with                                                                                                                                                                                                                                                                                                
