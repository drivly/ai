'use client'

import { useState } from 'react'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  code: string
  language?: string
  className?: string
}

export function CodeBlock({ code, language = 'typescript', className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('group relative', className)}>
      <pre className='overflow-x-auto rounded-lg border border-[#44475a] bg-[#282a36] p-4 font-mono text-sm text-[#f8f8f2]'>
        <code className={`language-${language}`}>
          {/* Apply Dracula theme colors to different code elements */}
          {code.split(/\b/).map((part, index) => {
            // This is a simplified version - a real syntax highlighter would be more complex
            if (/^(const|let|var|function|return|await|async|import|export|from|class|interface|type|extends|implements)$/.test(part)) {
              return (
                <span key={index} className='text-[#ff79c6]'>
                  {part}
                </span>
              ) // Keywords in pink
            } else if (/^(true|false|null|undefined|this|super)$/.test(part)) {
              return (
                <span key={index} className='text-[#bd93f9]'>
                  {part}
                </span>
              ) // Constants in purple
            } else if (/^[A-Z][A-Za-z0-9_]*$/.test(part)) {
              return (
                <span key={index} className='text-[#8be9fd]'>
                  {part}
                </span>
              ) // Classes in cyan
            } else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(part)) {
              return (
                <span key={index} className='text-[#f8f8f2]'>
                  {part}
                </span>
              ) // Identifiers in white
            } else if (/^[0-9]+$/.test(part)) {
              return (
                <span key={index} className='text-[#bd93f9]'>
                  {part}
                </span>
              ) // Numbers in purple
            } else if (part.startsWith('"') || part.startsWith("'") || part.startsWith('`')) {
              return (
                <span key={index} className='text-[#f1fa8c]'>
                  {part}
                </span>
              ) // Strings in yellow
            }
            return <span key={index}>{part}</span>
          })}
        </code>
      </pre>

      {/* Right-aligned container for language type and copy button */}
      <div className='absolute top-2 right-2 flex items-center gap-2'>
        {language && <div className='flex items-center rounded bg-[#44475a] px-2 py-1 text-xs text-[#f8f8f2] opacity-80'>{language}</div>}
        <button
          onClick={copyToClipboard}
          className='flex items-center justify-center rounded-md p-1.5 text-[#44475a] transition-colors hover:bg-[#44475a]/30 hover:text-[#f8f8f2]'
          aria-label='Copy code'
        >
          {copied ? <CheckIcon className='h-4 w-4 text-[#50fa7b]' /> : <CopyIcon className='h-4 w-4' />}
        </button>
      </div>
    </div>
  )
}
